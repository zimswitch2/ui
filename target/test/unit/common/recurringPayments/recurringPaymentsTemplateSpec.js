describe('recurring payments', function () {
    'use strict';

    beforeEach(module('refresh.filters', 'refresh.sbInteger', 'refresh.numberRange'));

    describe('template tests', function () {
        var scope, document;
        var templateTest;

        beforeEach(inject(function (TemplateTest) {
            templateTest = TemplateTest;
            document = templateTest.compileTemplateInFile('common/recurringPayments/partials/recurringPayments.html');
            scope = templateTest.scope;
        }));

        describe('repeat number error', function () {
            beforeEach(function () {
                scope.isRecurringPayment = true;
                scope.isNew = true;
            });

            it('should not show an error if repeatNumber is not present for a non repeat payment', function () {
                scope.isRecurringPayment = false;
                scope.repeatNumber = undefined;
                scope.$apply();
                expect(document.find('.repeat-number-error').length).toBe(0);
            });

            it('should not show an error if repeatNumber is in acceptable range', function () {
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: '8'});
                scope.$apply();
                expect(document.find('.repeat-number-error').length).toBe(0);
            });

            it('should show an error if repeatNumber is below 1', function () {
                scope.latestTimestampFromServer = moment();
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: '0', minimumRepeatNumber: 1});
                scope.$apply();
                expect(document.find('.repeat-number-error').first().text()).toBe('Please schedule one or more repeat payments');
            });

            it('should show an error if repeatNumber is below 2', function () {
                scope.latestTimestampFromServer = moment();
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: '1', minimumRepeatNumber: 2});
                scope.$apply();
                expect(document.find('.repeat-number-error').first().text()).toBe('Please schedule two or more repeat payments');
            });


            it('should show an error if repeatNumber is above the maximum repeat number for the current interval', function () {
                scope.latestTimestampFromServer = moment();
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Monthly', repeatNumber: '13', currentDate: '1 January 2015', fromDate: '2 January 2015'});
                scope.$apply();
                expect(document.find('.repeat-number-error').first().text()).toBe('Repeat payments cannot be scheduled more than a year in advance');
            });

            it('should show an error if repeatNumber is not present for a repeat payment', function () {
                scope.latestTimestampFromServer = moment();
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: undefined});
                scope.$apply();
                expect(document.find('.repeat-number-error').first().text()).toBe('Please enter the number of times you would like the payment to repeat');
            });

            it('should show an error if repeatNumber is not a number', function () {
                scope.latestTimestampFromServer = moment();
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: 'asd'});
                scope.$apply();
                expect(document.find('.repeat-number-error').first().text()).toBe('Please enter a valid number');
            });

            it('should show an error if repeatNumber is not a whole number', function () {
                scope.latestTimestampFromServer = moment();
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: '1.5'});
                scope.$apply();
                expect(document.find('.repeat-number-error').first().text()).toBe('Please enter a valid number');
            });
        });

        describe('is new', function () {
            beforeEach(function () {
                scope.isNew = true;
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily'});
                scope.$apply();
            });

            it('should show recurring payment checkbox', function () {
                expect(document.find('.checkbox-container').hasClass('ng-hide')).toBeFalsy();
            });

            it('should show repeat interval dropdown', function () {
                expect(document.find('select[name="repeatInterval"]').length).toBe(1);
                expect(document.find('.repeat-payment-option').text().trim()).not.toContain('Every day for');
            });
        });

        describe('is not new', function () {
            beforeEach(function () {
                scope.isNew = false;
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily'});
                scope.$apply();
            });

            it('should hide recurring payment checkbox', function () {
                expect(document.find('.checkbox-container').hasClass('ng-hide')).toBeTruthy();
            });

            it('should replace repeat interval dropdown with label', function () {
                expect(document.find('select[name="repeatInterval"]').length).toBe(0);
                expect(document.find('.repeat-payment-option').text().trim()).toContain('Every day for');
            });
        });

        describe('repeat interval name', function () {
            it('should have \'s\' after multiples', function () {
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: '2'});
                scope.$apply();

                expect(document.find('#intervalName span').text()).toBe('days');
            });

            it('should not have \'s\' after single', function () {
                scope.paymentDetail = new PaymentDetail({repeatInterval: 'Daily', repeatNumber: '1'});
                scope.$apply();

                expect(document.find('#intervalName span').text()).toBe('day');
            });
        });
    });
});