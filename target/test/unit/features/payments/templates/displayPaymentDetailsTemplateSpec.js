describe('display payment detail', function () {
    'use strict';

    beforeEach(module('refresh.filters', 'refresh.beneficiaries'));


    describe('template tests', function () {
        var scope, document;
        var templateTest;

        beforeEach(inject(function (TemplateTest) {
            templateTest = TemplateTest;
            document = templateTest.compileTemplateInFile('features/payment/partials/displayPaymentDetails.html');
            scope = templateTest.scope;
        }));

        describe('when display payment detail which is recurring', function () {
            beforeEach(function () {
                scope.paymentDetail = {
                    isRecurringPayment: function () {
                        return true;
                    }
                };
            });

            it('should display last payment date', function () {
                scope.paymentDetail.getToDate = function () {
                    return moment('14 Mar 2015').format();
                };
                scope.$apply();
                expect(document.find('#lastPaymentDate').first().text()).toContain('14 March 2015');
            });

            it('should get the repeat description from the payment detail', function () {
                scope.paymentDetail.getPaymentDescription = function () {
                    return 'nice description';
                };
                scope.$apply();
                expect(document.find('#repeatPaymentDescription').first().text()).toContain('nice description');
            });

        });

        describe('when display payment detail which is not recurring', function () {
            beforeEach(function () {
                scope.paymentDetail = {
                    isRecurringPayment: function () {
                        return false;
                    }
                };
                scope.$apply();
            });

            it('should hide last payment date', function () {
                expect(document.find('#lastPaymentDate').first().hasClass('ng-hide')).toBeTruthy();
            });

            it('should hide the repeat description', function () {
                expect(document.find('#repeatPaymentDescription').first().hasClass('ng-hide')).toBeTruthy();
            });

        });

        describe('when display payment detail', function () {
            beforeEach(function () {
                scope.paymentDetail = {};
            });

            it('should display from payment date label', function () {
                scope.paymentDetail.getFromDateLabel = function () {
                    return 'this is a label';
                };
                scope.$apply();
                expect(document.find('#paymentDateLabelConfirmation').first().text()).toContain('this is a label');
            });

            it('should display from payment date', function () {
                scope.paymentDetail.fromDate = moment('15 mar 2015').format();
                scope.$apply();
                expect(document.find('#paymentDateLabelConfirmation').first().text()).toContain('15 March 2015');
            });

            it('should get the amount', function () {
                scope.amount = 100;
                scope.$apply();
                expect(document.find('#amount').first().text()).toContain('R 100.00');
            });
        });

        describe("when pay company account", function () {
            beforeEach(function () {
                scope.isListedBeneficiary = function () {
                    return true;
                };

                scope.beneficiary = {
                    accountNumber: 'number',
                    bank: {
                        name: 'bank',
                        branch: {
                            name: 'branch',
                            code: 'code'
                        }
                    }
                };

                scope.$apply();
            });

            it('should not display account number, bank, branch', function () {
                expect(document.find('.print-only span:contains("Bank")').length).toBe(0);
                expect(document.find('.print-only span:contains("Account number")').length).toBe(0);
                expect(document.find('.print-only span:contains("Branch")').length).toBe(0);
            });
        });

        describe("when pay private account", function () {
            beforeEach(function () {
                scope.isListedBeneficiary = function () {
                    return false;
                };

                scope.beneficiary = {
                    accountNumber: 'number',
                    bank: {
                        name: 'bank',
                        branch: {
                            name: 'branch',
                            code: 'code'
                        }
                    }
                };

                scope.$apply();
            });

            it('should display account number, bank, branch', function () {
                expect(document.find('.print-only span:contains("Bank")').length).toBe(1);
                expect(document.find('.print-only span:contains("Account number")').length).toBe(1);
                expect(document.find('.print-only span:contains("Branch")').length).toBe(1);
            });
        });


    });
});