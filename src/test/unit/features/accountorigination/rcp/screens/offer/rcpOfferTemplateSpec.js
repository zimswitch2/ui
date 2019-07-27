describe('Rcp offer template', function () {
    'use strict';
    var scope, element, templateTest;

    beforeEach(module('refresh.filters'));
    beforeEach(module('refresh.amount'));
    beforeEach(module('refresh.directives.converttoint'));
    beforeEach(module('refresh.validators.limits'));

    beforeEach(inject(function (TemplateTest) {
        templateTest = TemplateTest;
        scope = TemplateTest.scope;
        templateTest.allowTemplate('common/amount/partials/amount.html');
        templateTest.allowTemplate('features/accountorigination/rcp/screens/products/partials/rcpDetails.html');
        templateTest.allowTemplate('common/print/partials/printFooter.html');

        scope.enforcer = function () {
            return [];
        };

        scope.requestedLimitEnforcer = function () {
            return [];
        };


        element = templateTest.compileTemplateInFile('features/accountorigination/rcp/screens/offer/partials/rcpOffer.html');

        scope.offerDetails = {
            maximumLoanAmount: 50000,
            repaymentFactor: 20,
            interestRate: 12,
            loanTermInMonths: 54
        };

        scope.minimumRepayment = 2500;

        scope.accept = function () {
        };

        scope.walkInBranches = [{}];

        scope.selectedOffer = {
            requestedLimit: 12400
        };

        scope.$digest();

    }));

    describe('Rcp Offer', function () {
        it('show offer details ', function () {
            expect(element.find('#minimumRepayment').text()).toMatch(/R 2 500/);
            expect(element.find('#interestRate').text()).toMatch(/12%/);
            expect(element.find('#repaymentTerm').text()).toMatch(/54/);
        });

        it('should update scope requested limit when user changes input', function () {
            templateTest.changeInputValueTo(element.find('div.rcp-properties .amount input'), '13000');
            expect(scope.selectedOffer.requestedLimit).toEqual('13000'); //TODO: Create directive to convert input string into a number that preserves decimal values (unlike convert-to-int)
        });

        it('should toggle the rcpDetails popup', function () {
            element.find('#rcpProductDetailsButton').click();
            expect(element.find('#rcpOfferDetails').hasClass('ng-hide')).toBeFalsy();

            element.find('#closeRcpOfferDetails').click();
            expect(element.find('#rcpOfferDetails').hasClass('ng-hide')).toBeTruthy();
        });

        it('should call the accept function when accept is clicked', function () {
            spyOn(scope, ['accept']);
            element.find('#acceptRcpOffer').click();
            expect(scope.accept).toHaveBeenCalled();
        });

        it('should track click when accept is clicked', function () {
            expect(element.find('#acceptRcpOffer').attr('track-click')).toEqual('Apply.RCP.Your Revolving Credit Plan.Accept quote');
        });

        it("should require preferred branch", function () {
            expect(element.find('#preferredBranch').attr('ng-required')).toBeTruthy();
        });

        describe('Debit Order Details', function () {

            describe('pay from Standard Bank', function () {
                beforeEach(function () {
                    scope.debitOrder = {
                        account: {isStandardBank: true}
                    };

                    scope.$digest();
                });

                it('should show Standard Bank details', function () {
                    expect(element.find('#StandardBankDebitOrderDetails')).not.toBeHidden();
                });

                it('should hide Other Bank details', function () {
                    expect(element.find('#OtherBankDebitOrderDetails')).toBeHidden();
                });

                it('should hide the electronic consent checkbox', function () {
                    expect(element.find('#electronicConsent')).toBeHidden();
                });
            });

            describe('pay from other bank', function () {
                beforeEach(function () {
                    scope.debitOrder = {
                        isStandardBankAccount: false,
                        electronicConsent: true
                    };

                    scope.$digest();
                });

                it('should hide Standard Bank details', function () {
                    expect(element.find('#StandardBankDebitOrderDetails')).toBeHidden();
                });

                it('should show other bank details', function () {
                    expect(element.find('#OtherBankDebitOrderDetails')).not.toBeHidden();
                });

                describe('account statement consent', function () {
                    it('should show the electronic consent checkbox', function () {
                        expect(element.find('#electronicConsent')).not.toBeHidden();
                    });

                    it('consent should be checked by default', function () {
                        expect(element.find('#electronicConsentCheckbox').is(':checked')).toBeTruthy();
                    });

                    it('should not show process delay notification', function () {
                        scope.debitOrder.electronicConsent = true;
                        scope.$digest();
                        expect(element.find('#rcpConsentNotification')).toBeHidden();
                    });

                    it('should show process delay notification when consent checkbox is not checked', function () {
                        scope.debitOrder.electronicConsent = false;
                        scope.$digest();
                        expect(element.find('#rcpConsentNotification')).not.toBeHidden();
                    });

                    it('track click of electronic consent checkbox', function () {
                        expect(element.find('#electronicConsent label').attr('track-click')).toEqual('Apply.RCP.Your Revolving Credit Plan.Uncheck IDX Consent');
                        expect(element.find('#electronicConsent input').attr('track-click')).toEqual('Apply.RCP.Your Revolving Credit Plan.Uncheck IDX Consent');
                    });
                });
            });
            describe("amount", function () {

                it('should apply with custom amount', function () {
                    scope.debitOrder = {
                        repayment: {amount: 1500}
                    };

                    scope.$digest();
                    templateTest.changeInputValueTo(element.find('section.debitOrder .amount input'), '5000');

                    expect(scope.debitOrder.repayment.amount).toEqual('5000');
                });

                it('should validate amount using the enforcer', function () {
                    scope.enforcer = function () {
                        return {
                            error: true,
                            type: 'foo',
                            message: 'Please enter the minimum repayment amount or higher'
                        };
                    };
                    element =
                        templateTest.compileTemplateInFile('features/accountorigination/rcp/screens/offer/partials/rcpOffer.html');
                    templateTest.changeInputValueTo(element.find('section.debitOrder .amount input'), '2000');
                    scope.$digest();

                    expect(element.find('section.debitOrder span.form-error').text()).toContain('Please enter the minimum repayment amount or higher');
                });

                it('should be disabled if loan amount is not valid', function () {
                    scope.rcpOfferForm.$error = {
                        loanamount: [true]
                    };

                    scope.$digest();

                    expect(element.find('section.debitOrder input#amount').attr('disabled')).toBeDefined();
                });
            });

        });

        describe('Accept', function () {

            beforeEach(function () {
                scope.selection = {
                    selectedBranch: {
                        code: 'code'
                    }
                };
            });

            describe('pay from Standard Bank is selected', function () {
                beforeEach(function () {
                    scope.debitOrder = {
                        account: {
                            number: '3322119',
                            isStandardBank: true
                        },
                        repayment: {
                            day: 5,
                            amount: 3000
                        }
                    };

                    scope.$digest();
                });

                it('should be able to Accept if all details are complete', function () {
                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeFalsy();
                });

                it('should not be able to accept if no account is selected', function () {
                    scope.debitOrder.account = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if no repayment day', function () {
                    scope.debitOrder.repayment.day = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if no repayment amount', function () {
                    scope.debitOrder.repayment.amount = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if Rcp branch is not selected', function () {
                    scope.selection.selectedBranch = null;
                    scope.$digest();
                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });
            });

            describe('pay from Other Bank', function () {
                beforeEach(function () {
                    scope.debitOrder = {
                        account: {
                            number: '3322119',
                            branch: {name: 'branch'},
                            isStandardBank: false,
                            bank: {
                                test: 'bank'
                            }
                        },
                        repayment: {
                            day: 5,
                            amount: 3000
                        }
                    };

                    scope.$digest();
                });

                it('should be able to Accept if all details are complete', function () {
                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeFalsy();
                });

                it('should not be able to accept if no bank is selected', function () {
                    scope.debitOrder.account.bank = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if no branch is selected', function () {
                    scope.debitOrder.account.branch = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if there is no account number', function () {
                    scope.debitOrder.account.number = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if no repayment day', function () {
                    scope.debitOrder.repayment.day = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });

                it('should not be able to accept if no repayment amount', function () {
                    scope.debitOrder.repayment.amount = null;
                    scope.$digest();

                    expect(element.find('#acceptRcpOffer').attr('disabled')).toBeTruthy();
                });
            });
        });
    });


});
