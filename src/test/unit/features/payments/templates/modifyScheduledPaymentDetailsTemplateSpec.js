describe('modify scheduled payment details template', function () {
    'use strict';

    var scope, element, templateTestHelper;

    beforeEach(module('refresh.payment.future.controllers.modify.details'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.stubTemplate('common/flow/partials/flow.html', '');
        templateTestHelper.stubTemplate('common/recurringPayments/partials/recurringPayments.html', '');
        templateTestHelper.allowTemplate('common/datepicker/partials/datepicker.html', '');
        //templateTestHelper.allowTemplate('features/payment/partials/beneficiaryAccountValidationDisclaimer.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/payment/partials/modifyScheduledPaymentDetails.html'));
        element = templateTestHelper.compileTemplate(html);
    }));

    function spanContentFor(label) {
        return spanFor(label).text();
    }

    function inputContentFor(label) {
        return inputFor(label).val();
    }

    function spanFor(label) {
        return element.find('label:contains("' + label + '") + span');
    }

    function inputFor(label) {
        return element.find(label);
    }


    describe('beneficiary name', function () {
        it('should be based on scope value', function () {
            expect(spanContentFor('Beneficiary name')).toBe('');
            scope.beneficiary = {name: 'bob'};

            scope.$digest();

            expect(spanContentFor('Beneficiary name')).toBe('bob');
        });
    });

    describe('beneficiary reference', function () {
        it('should be based on scope value', function () {
            expect(spanContentFor('Beneficiary reference')).toBe('');
            scope.beneficiary = {recipientReference: 'their reference'};

            scope.$digest();

            expect(spanContentFor('Beneficiary reference')).toBe('their reference');

        });
    });

    describe('your reference', function () {
        it('should be based on scope value', function () {
            expect(spanContentFor('Your reference')).toBe('');
            scope.beneficiary = {customerReference: 'my reference'};

            scope.$digest();

            expect(spanContentFor('Your reference')).toBe('my reference');
        });
    });

    describe('payment date', function () {
        describe('for single payments', function () {
            beforeEach(function () {
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Single',
                    fromDate: moment('1 January 2014').format()
                });
                scope.latestTimestampFromServer = moment('1 January 2014');
                scope.$digest();
            });

            it('should contain label payment date and have date value in span', function () {
                expect(inputContentFor('#payment_date')).toBe('1 January 2014');
            });

            it('should not contain label first payment date', function () {
                expect(spanFor('First payment date').length).toBe(0);
            });
        });

        describe('for recurring payments', function () {
            beforeEach(function () {
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Daily',
                    fromDate: moment('1 January 2014').format()
                });
                scope.latestTimestampFromServer = moment('1 January 2014');
                scope.$digest();
            });

            it('should contain label first payment date and have date value in span', function () {
                expect(inputContentFor('#payment_date')).toBe('1 January 2014');
            });

            it('should not contain label payment date', function () {
                expect(spanFor('Payment date').length).toBe(0);
            });
        });
    });

    describe('frequency', function () {
        describe('for single payments', function () {
            it('should not be in the document', function () {
                scope.isRecurringPayment = false;
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Single',
                    fromDate: moment('1 January 2014').format()
                });
                scope.latestTimestampFromServer = moment('1 January 2014');
                scope.$digest();

                expect(spanFor('Frequency').length).toBe(0);
            });
        });

        describe('for recurring payments', function () {
            it('should be based on payment details for multiple', function () {
                scope.isRecurringPayment = true;
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Daily',
                    repeatNumber: 3,
                    fromDate: moment('1 January 2014').format()
                });
                scope.latestTimestampFromServer = moment('1 January 2014');
                scope.$digest();

                expect(inputContentFor('#repeatNumber')).toBe('3');
            });

            it('should be based on payment details for 1 repeat', function () {
                scope.isRecurringPayment = true;
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Daily',
                    repeatNumber: 1,
                    fromDate: moment('1 January 2014').format()
                });
                scope.$digest();

                expect(inputContentFor('#repeatNumber')).toBe('1');
            });
        });

    });

    describe('final payment date', function () {
        describe('for single payments', function () {
            it('should not be in the document', function () {
                scope.isRecurringPayment = false;
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Single',
                    fromDate: moment('1 January 2014').format()
                });
                scope.latestTimestampFromServer = moment('1 January 2014');
                scope.$digest();

                expect(spanFor('Payment date').length).toBe(0);
            });
        });

        describe('for recurring payments', function () {
            it('should be based on payment details', function () {
                scope.isRecurringPayment = true;
                scope.paymentDetail = new PaymentDetail({
                    repeatInterval: 'Daily',
                    repeatNumber: 3,
                    fromDate: moment('1 January 2014').format()
                });
                scope.$digest();

                expect(spanContentFor('Final payment date')).toBe('3 January 2014');
            });
        });
    });

    describe('error message', function () {
        it('should display error message when set on the scope', function () {
            expect(element.find('div[error]').text()).toBe('');
            expect(element.find('div[error]').hasClass('ng-hide')).toBeTruthy();

            scope.errorMessage = 'my error';

            scope.$digest();

            expect(element.find('div[error]').text()).toBe('my error');
            expect(element.find('div[error]').hasClass('ng-hide')).toBeFalsy();
        });
    });
});