describe('Payment Detail', function () {
    'use strict';

    var paymentDetail;

    beforeEach(function () {
        paymentDetail = new PaymentDetail({});
    });

    describe('is recurring payment', function () {
        it('should be set to false for single payments', function () {
            paymentDetail = new PaymentDetail({
                repeatInterval: 'Single'
            });
            expect(paymentDetail.isRecurringPayment()).toBeFalsy();
        });

        it('should be set to true for daily payments', function () {
            paymentDetail = new PaymentDetail({
                repeatInterval: 'Daily'
            });
            expect(paymentDetail.isRecurringPayment()).toBeTruthy();
        });

        it('should be set to true for weekly payments', function () {
            paymentDetail = new PaymentDetail({
                repeatInterval: 'Weekly'
            });
            expect(paymentDetail.isRecurringPayment()).toBeTruthy();
        });

        it('should be set to true for monthly payments', function () {
            paymentDetail = new PaymentDetail({
                repeatInterval: 'Monthly'
            });
            expect(paymentDetail.isRecurringPayment()).toBeTruthy();
        });
    });

    describe('payment date label', function () {
        it('should say payment date when not recurring', function () {
            expect(paymentDetail.getFromDateLabel()).toBe('Payment date');
        });

        it('should say first payment date when recurring', function () {
            paymentDetail.isRecurringPayment = function () { return true; };
            expect(paymentDetail.getFromDateLabel()).toBe('First payment date');
        });
    });

    describe('interval name', function () {
        it('should be undefined when not recurring', function () {
            paymentDetail.repeatInterval = 'Single';
            expect(paymentDetail.getIntervalName()).toBeUndefined();
        });

        describe('for recurring payments', function () {
            it ('should calculate correctly in days', function () {
                paymentDetail.repeatInterval = 'Daily';
                expect(paymentDetail.getIntervalName()).toBe('day');
            });

            it ('should calculate correctly in weeks', function () {
                paymentDetail.repeatInterval = 'Weekly';
                expect(paymentDetail.getIntervalName()).toBe('week');
            });

            it ('should calculate correctly in months', function () {
                paymentDetail.repeatInterval = 'Monthly';
                expect(paymentDetail.getIntervalName()).toBe('month');
            });
        });
    });

    describe('get intervals', function () {
        it('should return the interval value for use in constructing the dropdown on the partial', function () {
            expect(paymentDetail.getIntervals()).toEqual(
                [
                    {repeatInterval: 'Monthly', intervalName: 'Month'},
                    {repeatInterval: 'Weekly', intervalName: 'Week'},
                    {repeatInterval: 'Daily', intervalName: 'Day'}
                ]
            );
        });
    });

    describe('get to date', function () {
        it ('should return undefined for non-recurring payments', function () {
            paymentDetail.isRecurringPayment = function () { return false; };
            expect(paymentDetail.getToDate()).toBeUndefined();
        });

        describe('for recurring payments', function () {
            beforeEach(function() {
                paymentDetail.isRecurringPayment = function () { return true; };
                paymentDetail.repeatNumber = 3;
                paymentDetail.fromDate = moment('1 January 2014').format();
            });

            it ('should calculate correctly in days', function () {
                paymentDetail.repeatInterval = 'Daily';
                expect(paymentDetail.getToDate()).toBe(moment('3 January 2014').format());
            });

            it ('should calculate correctly in weeks', function () {
                paymentDetail.repeatInterval = 'Weekly';
                expect(paymentDetail.getToDate()).toBe(moment('15 January 2014').format());
            });

            it ('should calculate correctly in months', function () {
                paymentDetail.repeatInterval = 'Monthly';
                expect(paymentDetail.getToDate()).toBe(moment('1 March 2014').format());
            });
        });
    });

    describe('get maximum repeats', function () {
        beforeEach(function()  {
            paymentDetail = new PaymentDetail({
                currentDate: moment('17 November 2015'),
                fromDate: moment('2015-11-18T11:15:03+02:00')
            });
        });

        it('should be 0 when no repeat interval specified', function () {
            expect(paymentDetail.getMaximumRepeats()).toBe(0);
        });

        it('should be 366 for daily', function () {
            paymentDetail.repeatInterval = 'Daily';
            expect(paymentDetail.getMaximumRepeats()).toBe(366);
        });

        it('should be 53 for weekly', function () {
            paymentDetail.repeatInterval = 'Weekly';
            expect(paymentDetail.getMaximumRepeats()).toBe(53);
        });

        it('should be 12 for monthly', function () {
            paymentDetail.repeatInterval = 'Monthly';
            expect(paymentDetail.getMaximumRepeats()).toBe(12);
        });
    });

    describe('earliest payment date', function () {
        it('should return today for non recurring payments', function () {
            expect(paymentDetail.getEarliestPaymentDate(moment('1 March 2014'))).toBe(moment('1 March 2014').format());
        });

        it('should return tomorrow for recurring payments', function () {
            paymentDetail.isRecurringPayment = function () { return true; };
            expect(paymentDetail.getEarliestPaymentDate(moment('1 March 2014'))).toBe(moment('2 March 2014').format());
        });

    });

    describe('latest payment date', function () {
        it ('should be one year from today', function () {
            expect(paymentDetail.getLatestPaymentDate(moment('1 March 2014'))).toBe(moment('1 March 2015').format());
        });
   });

    describe('state changed', function () {
        describe('to not recurring', function () {
            beforeEach(function () {
                paymentDetail = new PaymentDetail({ repeatInterval: 'Daily', repeatNumber: 3 });
                paymentDetail.stateChanged(false, moment('1 July 2015'));
            });

            it('should set repeat interval to single', function () {
                expect(paymentDetail.repeatInterval).toBe('Single');
            });

            it('should unset repeat number', function () {
                expect(paymentDetail.repeatNumber).toBeUndefined();
            });

            it('should set from date to provided date', function () {
                expect(paymentDetail.fromDate).toEqual(moment('1 July 2015').format());
            });
        });

        describe('to recurring payment', function () {
            beforeEach(function () {
                paymentDetail = new PaymentDetail({ repeatInterval: 'Single'});
                paymentDetail.stateChanged(true, moment('1 July 2015'));
            });

            it('should set repeat interval to default (Monthly)', function () {
                expect(paymentDetail.repeatInterval).toBe('Monthly');
            });

            it('should set repeat number to default (2)', function () {
                expect(paymentDetail.repeatNumber).toEqual(2);
            });

            describe('from date', function () {
                it('when set to today should change to tomorrow', function () {
                    paymentDetail.fromDate = moment('1 July 2015').format();
                    paymentDetail.stateChanged(true, moment('1 July 2015'));

                    expect(paymentDetail.fromDate).toEqual(moment('2 July 2015').format());
                });

                it('when set to future date should maintain that date', function () {
                    paymentDetail.fromDate = moment('4 July 2015').format();
                    paymentDetail.stateChanged(true, moment('1 July 2015'));

                    expect(paymentDetail.fromDate).toEqual(moment('4 July 2015').format());
                });
            });

        });

    });

    describe('minimum repeat number', function () {
        it('should take 2 as default', function () {
            expect(new PaymentDetail({repeatInterval: 'Monthly'}).getMinimumRepeats()).toBe(2);
        });

        it('should take number from constructor properties', function () {
            expect(new PaymentDetail({repeatInterval: 'Monthly', minimumRepeatNumber: 4}).getMinimumRepeats()).toBe(4);
        });
    });

    describe('minimum repeat words', function () {
        it('should return one for 1 as default', function () {
            expect(new PaymentDetail({repeatInterval: 'Monthly', minimumRepeatNumber: 1}).getMinimumRepeatsInWords()).toBe('one');
        });

        it('should return two for 2', function () {
            expect(new PaymentDetail({repeatInterval: 'Monthly', minimumRepeatNumber: 2}).getMinimumRepeatsInWords()).toBe('two');
        });

        it('should return empty for any other number', function () {
            expect(new PaymentDetail({repeatInterval: 'Monthly', minimumRepeatNumber: 3}).getMinimumRepeatsInWords()).toBe('');
        });
    });

    describe('default repeat number', function () {
        it('should set repeat number to default (2)', function () {
            paymentDetail.repeatNumber = 5;
            paymentDetail.defaultRepeatNumber();
            expect(paymentDetail.repeatNumber).toBe(2);
        });
    });

    describe('get payment description', function(){
        it('should generate message using repeat interval name and repeat number', function(){
            paymentDetail.repeatInterval = 'Daily';
            paymentDetail.repeatNumber = 3;
            expect(paymentDetail.getPaymentDescription()).toBe('Every day for 3 days');
        });
    });
});
