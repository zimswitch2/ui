describe('Beneficiaries', function () {
    var scope, listService, card, location, accountsService, paymentService, windowSpy;

    beforeEach(module('refresh.beneficiaries.pay-multiple','refresh.beneficiaries.beneficiariesListService'));

    describe('BaseMultipleBeneficiaries', function () {
        var expectedFormattedBeneficiaries = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: undefined,
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 0,
                recipientGroupName: 'Group 1',
                canSelect: false,
                selectedClass: ""
            },
            {
                recipientId: '2',
                name: 'Test2',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                lastPaymentDate: moment("2014-02-03"),
                formattedLastPaymentDate: '3 February 2014',
                amountPaid: 10,
                recipientGroupName: "",
                canSelect: true,
                selectedClass: ""
            }
        ];

        var accounts = [
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "12-34-567-890-0",
                "availableBalance": {"amount": 9000.0 },
                name: "CURRENT"
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": 10000.0,
                name: "CREDIT_CARD"
            },
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": false
                    }
                ],
                "formattedNumber": "1234-1234-1234-1234",
                "availableBalance": 10000.0,
                name: "HOME_LOAN"
            }
        ];

        beforeEach(module('refresh.beneficiaries.pay-multiple', function ($provide) {
            listService = jasmine.createSpyObj('BeneficiariesListService', ['formattedBeneficiaryList']);

            $provide.value('BeneficiariesListService', listService);

            card = jasmine.createSpyObj('card', ['current']);
            $provide.value('Card', card);

            location = jasmine.createSpyObj('location', ['path', 'hash']);
            $provide.value('$location', location);

            windowSpy = jasmine.createSpyObj('$window', ['print', 'addEventListener']);
            windowSpy.history = jasmine.createSpyObj('history', ['go']);
            $provide.value('$window', windowSpy);

            accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
            accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
            $provide.value('AccountsService', accountsService);

            paymentService = jasmine.createSpyObj('MultiplePaymentsService', ['payMultipleBeneficiaries', 'updatePayments', 'selectedPayments', 'amounts', 'confirm', 'paymentResults', 'reset', 'updateFromAccount', 'getFromAccount', 'totalAmount']);
            paymentService.getFromAccount.and.returnValue(accounts[0]);
            paymentService.totalAmount.and.returnValue(100);

            $provide.value('MultiplePaymentsService', paymentService);
        }));

        var singleSuccessfulPaymentResponse;

        beforeEach(inject(function ($rootScope, $controller, mock, BaseMultipleBeneficiaries) {
            scope = $rootScope.$new();

            listService.formattedBeneficiaryList.and.returnValue(mock.resolve(expectedFormattedBeneficiaries));

            accountsService.list.and.returnValue(mock.resolve({
                    "accounts": accounts,
                    "cardProfile": {
                        "monthlyEAPLimit": {"amount": 10000, "currency": "ZAR"},
                        "monthlyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
                        "usedEAPLimit": {"amount": 2000, "currency": "ZAR"}
                    }
                }
            ));

            singleSuccessfulPaymentResponse = {
                data: {
                    account:[{availableBalance:{amount:1}}],
                    transactionResults: [
                        {
                            responseCode: {
                                code: "0000",
                                responseType: "SUCCESS",
                                message: "Successful"
                            }

                        }
                    ]
                }
            };
            paymentService.payMultipleBeneficiaries.and.returnValue(mock.resolve(singleSuccessfulPaymentResponse));

            BaseMultipleBeneficiaries.setupScope(scope);
            scope.initialize();
            scope.$digest();
        }));

        describe('on location change', function () {
            it('should clear payment related data when exiting the multiple payment flow', function () {
                scope.$emit('$locationChangeStart', '/account-summary', '/beneficiaries/pay-multiple');
                scope.$apply();
                expect(paymentService.reset).toHaveBeenCalled();
            });

            it('should not clear payment related data when within the multiple payment flow', function () {
                scope.$emit('$locationChangeStart', '/beneficiaries/pay-multiple', '/beneficiaries/pay-multiple/confirm');
                expect(paymentService.reset).not.toHaveBeenCalled();
            });

            it('should clear payment related data when exiting the group payment flow', function () {
                scope.$emit('$locationChangeStart', '/account-summary', '/beneficiaries/pay-group');
                expect(paymentService.reset).toHaveBeenCalled();
            });

            it('should not clear payment related data when within the group payment flow', function () {
                scope.$emit('$locationChangeStart', '/beneficiaries/pay-group', '/beneficiaries/pay-group/confirm');
                expect(paymentService.reset).not.toHaveBeenCalled();
            });
        });

        it('should tell the notification preferences modal that we are in the pay multiple beneficiaries flow', function () {
            expect(scope.payMultiple).toBeTruthy();
        });

        it('should set details id', function () {
            scope.setDetailsId(10);
            expect(scope.showDetailsId).toEqual(10);
            scope.setDetailsId(10);
            expect(scope.showDetailsId).toEqual(undefined);
        });

        it('should return true if show details id is correct', function () {
            scope.setDetailsId(10);
            expect(scope.toggleDetails(10)).toEqual(true);
            scope.setDetailsId(12);
            expect(scope.toggleDetails(10)).toEqual(false);
        });

        describe('isCompanyBeneficiary', function () {
            it('should know if a result is for a payment to a company beneficiary', function () {
                var theResult = {beneficiary: {beneficiaryType: 'COMPANY'}};
                expect(scope.isCompanyBeneficiary(theResult)).toBeTruthy();
            });

            it('should return false if the payment result is undefined', function () {
                expect(function() {scope.isCompanyBeneficiary(undefined);}).not.toThrow();
                expect(scope.isCompanyBeneficiary(undefined)).toBeFalsy();
            });
        });

        describe('on print receipt', function () {

            it('should call window.print', inject(function ($timeout) {
                scope.print('1');
                $timeout.flush();
                expect(windowSpy.print).toHaveBeenCalled();
            }));

            it('should set the selected transaction to the matching transaction', inject(function ($timeout) {
                var transaction = {beneficiary: {recipientId: '1'}};
                scope.paymentResults = [transaction];
                scope.print('1');
                expect(scope.printSelectedTransaction).toBe(transaction);
            }));

            it('should set the selected transaction to the undefined after the timeout', inject(function ($timeout) {
                var transaction = {beneficiary: {recipientId: '1'}};
                scope.paymentResults = [transaction];
                scope.print('1');
                $timeout.flush();
                expect(scope.printSelectedTransaction).toBe(undefined);
            }));
        });

        describe('when editing payment notification preferences', function () {
            it('should set the current beneficiary as the one being changed when there is a preference previously selected', function () {
                var theBeneficiary = {paymentConfirmation: {confirmationType: 'Email'}};
                scope.editNotificationPreferences(theBeneficiary);

                expect(scope.beneficiary).toBe(theBeneficiary);
                expect(scope.paymentConfirmation).toBeTruthy();
            });

            it('should set the current beneficiary as the one being changed when there is no preference previously selected', function () {
                var theBeneficiary = {paymentConfirmation: {confirmationType: 'None'}};
                scope.editNotificationPreferences(theBeneficiary);

                expect(scope.beneficiary).toBe(theBeneficiary);
                expect(scope.paymentConfirmation).toBeFalsy();
            });

            it('should clear beneficiary being edited', function () {
                scope.beneficiary = {a: 'b'};

                scope.closeNotificationPreferences();

                expect(scope.beneficiary).toBeUndefined();
            });

            it('should cancel edit modal window', function () {
                var currentBeneficiary = scope.beneficiaries[0];
                var originalBeneficiary = _.cloneDeep(currentBeneficiary);
                scope.originalBeneficiary = {index: 0, beneficiary: originalBeneficiary};

                scope.cancel();

                expect(scope.beneficiary).toBeUndefined();
                expect(scope.originalBeneficiary).toBeUndefined();

                expect(currentBeneficiary).toEqual(originalBeneficiary);
            });

            describe('toggle payment confirmation when editing', function () {
                var initialPaymentConfirmation = {
                    recipientName: 'derp',
                    address: 'abc',
                    confirmationType: "SMS"
                };

                beforeEach(function () {
                    scope.beneficiary = {
                        paymentConfirmation: _.cloneDeep(initialPaymentConfirmation)
                    };
                });

                it('should set the email address as the default payment confirmation if beneficiary has no confirmation type', function () {
                    scope.paymentConfirmation = true;
                    scope.beneficiary.paymentConfirmation.confirmationType = "None";
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("Email");
                });

                it('should clear the fields when payment confirmation is set to false', function () {
                    scope.paymentConfirmation = false;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.address).toBeNull();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toBe(null);
                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("None");
                });

                it('should not default option to Email if a notification is selected', function () {
                    scope.paymentConfirmation = true;

                    scope.$digest();

                    expect(scope.beneficiary.paymentConfirmation).toEqual(initialPaymentConfirmation);
                });

                it('should clear the fields when payment confirmation is set to None', function () {
                    scope.beneficiary = {
                        name: 'Ben',
                        paymentConfirmation: {
                            confirmationType: 'None',
                            address: 'addy',
                            recipientName: 'Name'
                        }
                    };
                    scope.paymentConfirmation = false;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.address).toBeNull();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toBe(null);
                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("None");
                });

                it('should set payment confirmation recipient name for a private beneficiary', function () {
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');
                });
            });
        });

        describe('on modify', function () {
            it('should keep changes on beneficiaries', function () {

                var selectedPayments = [
                    {
                        amount: {amount: 2},
                        beneficiary: {
                            recipientId: '1',
                            customerReference: 'was there',
                            recipientReference: 'changed'
                        }
                    }
                ];

                paymentService.selectedPayments.and.returnValue(selectedPayments);

                scope.initialize();
                scope.$apply();

                var actual = _.find(scope.beneficiaries, function (beneficiaryInScope) {
                    return beneficiaryInScope.recipientId === '1';
                });

                expect(actual.customerReference).toEqual('was there');
                expect(actual.recipientReference).toEqual('changed');
            });
        });

        describe("on initialization", function () {
            it('should have empty query', function () {
                expect(scope.query).toEqual('');
            });

            it('should have beneficiaries list', function () {
                expect(listService.formattedBeneficiaryList).toHaveBeenCalledWith(card.current());
                expect(scope.beneficiaries).toEqual(expectedFormattedBeneficiaries);
            });

            it('should only list accounts that are payable from', function () {
                expect(scope.payFromAccounts.length).toEqual(2);
            });

            it('should have an empty amounts hash', function () {
                expect(paymentService.amounts).toHaveBeenCalled();
            });

            it('should set account limits on the scope', function () {
                expect(scope.monthlyEAPLimit).toEqual(10000);
                expect(scope.hasZeroEAPLimit).toEqual(false);
                expect(scope.availableEAPLimit).toEqual(8000);
            });

            it('should set the total amount to zero by default', function () {
                expect(paymentService.totalAmount).toHaveBeenCalled();
                expect(scope.totalAmount).toEqual(100);
            });

            it('should set the defaults for print scope vars', function () {
                expect(_.isDate(scope.printDate)).toBeTruthy();
                expect(scope.printSelectedTransaction).toBeUndefined();
            });
        });

        describe('invalid', function () {
            it('should be true when invalidAvailableBalance is true', function () {
                scope.invalidAvailableBalance = true;
                expect(scope.invalid()).toBeTruthy();
            });

            it('should be true when invalidAvailableBalance is true', function () {
                scope.invalidAvailableTransferLimit = true;
                expect(scope.invalid()).toBeTruthy();
            });

            it('should be false when valid', function () {
                scope.invalidAvailableBalance = false;
                scope.invalidAvailableTransferLimit = false;
                scope.totalAmount = 1;
                scope.$digest();
                expect(scope.invalid()).toBeFalsy();
            });

            describe('no account', function () {
                it('should set hasInfo and infoMessage if no available account exists', function () {
                    expect(scope.hasInfo).toBeFalsy();
                    expect(scope.infoMessage).toBeUndefined();
                    expect(scope.invalid()).toBeFalsy();

                    accountsService.validFromPaymentAccounts.and.returnValue([]);
                    scope.initialize();
                    scope.$digest();
                    expect(scope.hasInfo).toBeTruthy();
                    expect(scope.infoMessage).toEqual('You do not have an account linked to your profile from which payment may be made to a third party');
                    expect(scope.invalid()).toBeTruthy();
                });
            });
        });

        describe('on amount change', function () {
            it('should update selected payment beneficiaries', function () {
                var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                scope.amounts = { 19: '100' };
                scope.updateSelectedBeneficiaries(beneficiary);
                expect(paymentService.updatePayments).toHaveBeenCalled();
            });

            it('should update the total amount', function () {
                var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                scope.amounts = { 19: '100' };
                scope.updateSelectedBeneficiaries(beneficiary);
                expect(scope.totalAmount).toEqual(100);
                expect(paymentService.totalAmount).toHaveBeenCalled();
            });

            it('should remove amount when empty string', function () {
                var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                scope.query = 'some name';
                scope.amounts = { 19: '' };
                scope.updateSelectedBeneficiaries(beneficiary);

                expect(scope.amounts).toEqual({});
                expect(paymentService.updatePayments).toHaveBeenCalledWith(beneficiary, {});
            });

            it('should not remove amount when it is not empty string', function () {
                var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                scope.query = 'some name';
                scope.amounts = { 19: 3 };
                scope.updateSelectedBeneficiaries(beneficiary);

                expect(scope.amounts).toEqual({ 19: 3 });
                expect(paymentService.updatePayments).toHaveBeenCalledWith(beneficiary, { 19: 3 });
            });

            describe('validation on total amount', function () {
                it('should set invalidAvailableTransferLimit when total amount is bigger than availableEAPLimit', function () {
                    var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                    scope.amounts = { 19: '100' };
                    scope.availableEAPLimit = 50;
                    scope.updateSelectedBeneficiaries(beneficiary);

                    expect(scope.invalidAvailableTransferLimit).toBeTruthy();
                });

                it('should unset invalidAvailableBalance when total amount is bigger than availableEAPLimit', function () {
                    var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                    scope.amounts = { 19: '100' };
                    scope.availableEAPLimit = 50;
                    scope.updateSelectedBeneficiaries(beneficiary);
                    scope.availableEAPLimit = 200;
                    scope.updateSelectedBeneficiaries(beneficiary);
                    expect(scope.invalidAvailableTransferLimit).toBeFalsy();
                });

                it('should set invalidAvailableBalance when total amount is bigger than availableBalance', function () {
                    var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                    scope.amounts = { 19: '100' };
                    scope.account.availableBalance.amount = 50;
                    scope.updateSelectedBeneficiaries(beneficiary);
                    expect(scope.invalidAvailableBalance).toBeTruthy();
                });

                it('should not set invalidAvailableBalance when no account', function () {
                    scope.account = undefined;
                    var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                    scope.amounts = { 19: '100' };
                    scope.updateSelectedBeneficiaries(beneficiary);
                    expect(scope.invalidAvailableBalance).toBeUndefined();
                });

                it('should unset invalidAvailableBalance when total amount is bigger than availableBalance', function () {
                    var beneficiary = {recipientId: 19, name: 'Beneficiary'};
                    scope.amounts = { 19: '100' };
                    scope.account.availableBalance.amount = 50;
                    scope.updateSelectedBeneficiaries(beneficiary);
                    scope.account.availableBalance.amount = 1000;
                    scope.updateSelectedBeneficiaries(beneficiary);
                    expect(scope.invalidAvailableBalance).toBeFalsy();
                });
            });
        });

        describe('on confirmation summary', function () {
            beforeEach(function () {
                scope.confirmation();
                scope.$apply();
            });

            it('should populate the selectedPayments scope variable', function () {
                expect(paymentService.selectedPayments).toHaveBeenCalled();
            });

            it('should populate the current account', function () {
                expect(accountsService.list).toHaveBeenCalled();
                expect(accountsService.validFromPaymentAccounts).toHaveBeenCalled();
            });

            it('should set account limits on the scope', function () {
                expect(scope.monthlyEAPLimit).toEqual(10000);
                expect(scope.hasZeroEAPLimit).toEqual(false);
                expect(scope.availableEAPLimit).toEqual(8000);
            });

            it('should get the total amount form the service', function () {
                expect(paymentService.totalAmount).toHaveBeenCalled();
                expect(scope.totalAmount).toEqual(100);
            });
        });

        describe('on account change', function () {
            it('should update selected payment beneficiaries', function () {
                scope.updateFromAccount(accounts[1]);
                expect(paymentService.updateFromAccount).toHaveBeenCalled();
            });
        });

        describe('on confirmAndRedirectTo', function () {
            beforeEach(function () {
                var beneficiaries = [
                    {recipientId: 19, name: 'Beneficiary'},
                    {recipientId: 20, name: 'Beneficiary' }
                ];

                scope.amounts = { 19: '100', 20: '22.5' };
                scope.updateSelectedBeneficiaries(beneficiaries[0]);
                scope.updateSelectedBeneficiaries(beneficiaries[1]);
            });

            it('should call pay on model', function () {
                scope.confirmAndRedirectTo();
                expect(paymentService.payMultipleBeneficiaries).toHaveBeenCalledWith(accounts[0]);
            });

            it('sets the "canDelay" flag on the application parameters', inject(function (ApplicationParameters) {
                scope.confirmAndRedirectTo();
                expect(ApplicationParameters.getVariable('canDelay')).toBeTruthy('canDelay variable should be true on ApplicationParameters');
            }));

            it('should call confirm on model', function () {
                scope.confirmAndRedirectTo();
                scope.$apply();

                expect(paymentService.confirm).toHaveBeenCalledWith(singleSuccessfulPaymentResponse.data.transactionResults);
            });

            it('should direct the provided path', function () {
                scope.confirmAndRedirectTo('/direct/path');
                scope.$apply();

                expect(location.path).toHaveBeenCalledWith('/direct/path');
            });

            it('should set account limits on the scope', function () {
                scope.confirmAndRedirectTo();

                expect(scope.monthlyEAPLimit).toEqual(10000);
                expect(scope.hasZeroEAPLimit).toEqual(false);
                expect(scope.availableEAPLimit).toEqual(8000);
            });

        });

        describe('on results', function () {
            beforeEach(function () {
                scope.results();
                scope.$apply();
            });

            it('should fetch paymentResults', function () {
                expect(paymentService.paymentResults).toHaveBeenCalled();
            });

            it('should clear all payment related data', function () {
                expect(paymentService.reset).toHaveBeenCalled();
            });

            it('should set account limits on the scope', function () {
                expect(scope.monthlyEAPLimit).toEqual(10000);
                expect(scope.hasZeroEAPLimit).toEqual(false);
                expect(scope.availableEAPLimit).toEqual(8000);
            });

            it('should get the total amount form the service', function () {
                expect(paymentService.totalAmount).toHaveBeenCalled();
                expect(scope.totalAmount).toEqual(100);
            });
        });
    });
});
