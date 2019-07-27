describe('OnceOffPaymentController', function () {
    beforeEach(module('refresh.onceOffPayment', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a beneficiary is to be paid once off', function () {
            it('should use the correct controller', function () {
                expect(route.routes['/payment/onceoff'].controller).toEqual('OnceOffPaymentController');
            });

            it('should use the correct template', function () {
                expect(route.routes['/payment/onceoff'].templateUrl).toEqual('features/payment/partials/payBeneficiaryOnceOff.html');
            });
        });
    });

    describe('for onceoff payment', function () {
        var scope, accountsService, paymentService, branchLazyLoadingService, mock, card, flow, location,
            expectedSteps, bankService, cdiService, windowSpy, onceOffPaymentModel;
        var accounts = [
            {
                "accountFeature": [
                    {
                        "feature": "PAYMENTFROM",
                        "value": true
                    }
                ],
                "formattedNumber": "12-34-567-890-0",
                "availableBalance": 9000.0,
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

        var banks = [
            {
                "name": "Standard Bank",
                "code": "051"
            },
            {
                "name": "ABSA",
                "code": "089"
            }
        ];

        var branches = [
            {
                "code": 20091600,
                "name": "DURBAN CENTRAL FOREX OPS"
            }
        ];

        var wooliesInTheCdi;

        var listedBeneficiaryThatCannotBeAdded;

        wooliesInTheCdi = {name: "woolies", number: "12345"};
        listedBeneficiaryThatCannotBeAdded = {name: "will not work", number: '808080'};

        var controller, profile;

        beforeEach(inject(function ($rootScope, $controller, _mock_, Flow, ViewModel, OnceOffPaymentModel) {
            scope = $rootScope.$new();
            accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
            paymentService = jasmine.createSpyObj('onceOffPaymentService', ['payPrivateBeneficiaryOnceOff']);
            card = jasmine.createSpyObj('card', ['current']);
            location = jasmine.createSpyObj('location', ['path']);
            mock = _mock_;
            flow = Flow;
            onceOffPaymentModel = OnceOffPaymentModel;
            onceOffPaymentModel.initialise();
            bankService = jasmine.createSpyObj('bankService', ['list', 'searchBranches']);
            branchLazyLoadingService = jasmine.createSpyObj('branchLazyLoadingService', ['bankUpdate']);
            cdiService = jasmine.createSpyObj('cdiService', ['list']);
            bankService.list.and.returnValue(mock.resolve(banks));
            bankService.searchBranches.and.returnValue(mock.resolve(branches));
            cdiService.list.and.returnValue(mock.resolve([wooliesInTheCdi, listedBeneficiaryThatCannotBeAdded]));
            windowSpy = jasmine.createSpyObj('$window', ['print']);

            accountsService.list.and.returnValue(mock.resolve({
                "accounts": accounts,
                "cardProfile": {
                    "monthlyEAPLimit": {"amount": 10000, "currency": "ZAR"},
                    "monthlyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
                    "usedEAPLimit": {"amount": 2000, "currency": "ZAR"}
                }
            }));

            accountsService.validFromPaymentAccounts.and.returnValue([accounts[0], accounts[1]]);
            scope.successfulPaymentToSingleBeneficiary = true;
            scope.errorMessage = 'asd';

            expectedSteps = [
                {name: 'Enter details', complete: false, current: true},
                {name: 'Confirm details', complete: false, current: false},
                {name: 'OTP', complete: false, current: false}
            ];

            controller = $controller;
        }));

        function createController() {
            controller('OnceOffPaymentController', {
                $scope: scope,
                AccountsService: accountsService,
                OnceOffPaymentService: paymentService,
                BranchLazyLoadingService: branchLazyLoadingService,
                $location: location,
                Card: card,
                BankService: bankService,
                CdiService: cdiService,
                $window: windowSpy,
                OnceOffPaymentModel: onceOffPaymentModel
            });
        }

        describe('watch beneficiary.bank', function () {
            it('should call BranchLazyLoadingService.bankUpdate', function () {
                var oldBank = {code: '123', branch: {}};
                var newBank = {code: '051', branch: {}};

                createController();
                var beneficiary = scope.onceOffPaymentModel.beneficiary;
                beneficiary.bank = oldBank;
                onceOffPaymentModel.setBeneficiary(beneficiary);
                scope.branches = branches;
                scope.changeBank(scope.onceOffPaymentModel.beneficiary.bank);

                scope.onceOffPaymentModel.beneficiary.bank = newBank;
                scope.changeBank(scope.onceOffPaymentModel.beneficiary.bank);
                expect(branchLazyLoadingService.bankUpdate.calls.argsFor(1)).toEqual([scope.branches, scope.onceOffPaymentModel.beneficiary, newBank, oldBank]);
            });
        });

        describe("initial controller", function () {
            beforeEach(inject(function () {
                spyOn(flow, "create").and.callThrough();
            }));

            describe('when initialized', function () {
                it('should set payment confirmation to true by default', function () {
                    createController();
                    expect(scope.onceOffPaymentModel.paymentConfirmation).toBeTruthy();
                });

                it('should load the CDI onto the scope with the label function available so that the typeahead widget works', function () {
                    createController();
                    scope.$digest();
                    expect(scope.cdi).toEqual([wooliesInTheCdi, listedBeneficiaryThatCannotBeAdded]);
                    expect(scope.cdi[0].label()).toEqual("woolies");
                    expect(scope.cdi[1].label()).toEqual("will not work");
                });

                it('should not retrieve branches because of lazy loading', function () {
                    createController();
                    expect(scope.selectedBankBranches()).toEqual([]);
                });

                it('should ensure no listed beneficiary is selected when add flow is started', function () {
                    createController();
                    expect(scope.onceOffPaymentModel.listedBeneficiary).toBeUndefined();
                });

                it('should set the listed beneficiary when it exists in the flow parameters', function () {
                    onceOffPaymentModel.setListedBeneficiary('listed');
                    createController();
                    expect(scope.onceOffPaymentModel.listedBeneficiary).toEqual('listed');
                });

                it('should have the flow header as pay once off private beneficiary', function () {
                    onceOffPaymentModel.setListedBeneficiary('listed');
                    createController();
                    expect(flow.get().headerName).toEqual("Once-off Payment");
                });

                it('should create a flow', function () {
                    onceOffPaymentModel.setListedBeneficiary('listed');
                    createController();
                    expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Confirm details', 'OTP'], 'Once-off Payment');
                });


                it('should clear error notifications if listed beneficiary changes', function () {
                    createController();
                    scope.onceOffPaymentModel.errorMessage = 'asd';
                    onceOffPaymentModel.setListedBeneficiary({name: "oldValue", number: "67890"});
                    scope.onceOffPaymentModel.listedBeneficiary = {name: "newValue", number: "67890"};
                    scope.changeListedBeneficiary(scope.onceOffPaymentModel.listedBeneficiary);
                    expect(scope.onceOffPaymentModel.errorMessage).toBeFalsy();
                });
            });
            describe("initial", function () {
                beforeEach(inject(function () {
                    onceOffPaymentModel.setPaymentConfirmation(false);
                    createController();
                }));

                it('should not clear error notifications when listed beneficiary does not change', function () {
                    onceOffPaymentModel.setListedBeneficiary({name: "value", number: "67890"});
                    scope.changeListedBeneficiary(scope.onceOffPaymentModel.listedBeneficiary);
                    onceOffPaymentModel.setErrorMessage('asd');
                    scope.onceOffPaymentModel.listedBeneficiary = {name: "value", number: "67890"};
                    scope.changeListedBeneficiary(scope.onceOffPaymentModel.listedBeneficiary);
                    expect(scope.onceOffPaymentModel.errorMessage).toBeTruthy();
                });

                it('should clear error notifications when listed beneficiary changes twice', function () {
                    onceOffPaymentModel.setListedBeneficiary({name: "oldValue", number: "67890"});
                    onceOffPaymentModel.setErrorMessage('asd');
                    scope.onceOffPaymentModel.listedBeneficiary = {name: "newValue", number: "67890"};
                    expect(scope.onceOffPaymentModel.errorMessage).toBeTruthy();
                    scope.changeListedBeneficiary(scope.onceOffPaymentModel.listedBeneficiary);
                    scope.onceOffPaymentModel.listedBeneficiary = {name: "oldValue", number: "67890"};
                    scope.changeListedBeneficiary(scope.onceOffPaymentModel.listedBeneficiary);
                    expect(scope.onceOffPaymentModel.errorMessage).toBeFalsy();
                });

                it('should set hasInfo and infoMessage if no accounts that have payment functionality are available', function () {
                    expect(scope.hasInfo).toBeFalsy();
                    expect(scope.infoMessage).toBeUndefined();

                    accountsService.validFromPaymentAccounts.and.returnValue([]);
                    createController();
                    scope.$digest();
                    expect(scope.hasInfo).toBeTruthy();
                    expect(scope.infoMessage).toEqual('You do not have an account linked to your profile from which payment may be made to a third party');
                });

                it('should load the payment flow parameter when it exists and there is an error', function () {
                    var beneficiary = {
                        name: 'Someone',
                        accountNumber: '12345',
                        paymentConfirmation: {recipientName: 'derp', confirmationType: 'None', address: null}
                    };
                    onceOffPaymentModel.setBeneficiary(_.cloneDeep(beneficiary));
                    beneficiary.oldName = 'Someone';
                    onceOffPaymentModel.setErrorMessage('asd');
                    createController();
                    expect(scope.onceOffPaymentModel.beneficiary).toEqual(beneficiary);
                });
            });

            describe('when previously selected account is undefined', function () {
                it('should default to the first account', function () {
                    createController();
                    scope.$digest();
                    expect(scope.onceOffPaymentModel.account).toEqual(accounts[0]);
                });
            });

            describe('when account has been previously selected', function () {
                beforeEach(function () {
                    onceOffPaymentModel.initialise();
                    onceOffPaymentModel.setAccount(accounts[1]);
                });

                describe('when account is defined', function () {
                    it('should default to the previously selected account', function () {
                        createController();
                        scope.$digest();
                        expect(scope.onceOffPaymentModel.account).toEqual(accounts[1]);
                    });
                });

                describe('when account is reset', function () {
                    it('should default to the first account', function () {
                        onceOffPaymentModel.initialise();
                        createController();
                        scope.$digest();
                        expect(scope.onceOffPaymentModel.account).toEqual(accounts[0]);
                    });
                });
            });

            it('should know the flow steps and state of the steps with the first step as current', function () {
                createController();
                expect(flow.get().steps).toEqual(expectedSteps);
            });

            it('should have checking account number to transfer from available', function () {
                createController();
                scope.$digest();
                expect(scope.onceOffPaymentModel.account.formattedNumber).toEqual('12-34-567-890-0');
            });

            it('should have the available balance on the account in the scope', function () {
                createController();
                scope.$digest();
                expect(scope.onceOffPaymentModel.account.availableBalance).toEqual(9000.0);
            });

            it('should have the monthly electronic transfer limit', function () {
                createController();
                scope.$digest();
                expect(scope.onceOffPaymentModel.cardProfile.monthlyEAPLimit.amount).toEqual(10000);
            });

            it('should have the card profile', function () {
                createController();
                scope.$digest();
                var expectedCardProfile = {
                    "monthlyEAPLimit": {"amount": 10000, "currency": "ZAR"},
                    "monthlyWithdrawalLimit": {"amount": 10000, "currency": "ZAR"},
                    "usedEAPLimit": {"amount": 2000, "currency": "ZAR"}
                };
                expect(scope.onceOffPaymentModel.cardProfile).toEqual(expectedCardProfile);
            });

            it('should have the used electronic transfer limit', function () {
                createController();
                scope.$digest();
                expect(scope.onceOffPaymentModel.cardProfile.usedEAPLimit.amount).toEqual(2000);
            });

            it('should clean up successful status', function () {
                createController();
                expect(scope.onceOffPaymentModel.isSuccessful).toBeFalsy();
            });

            it('should clear any previous errors', function () {
                createController();
                expect(scope.onceOffPaymentModel.errorMessage).toBeFalsy();
            });

            it('should have a new beneficiary when no flow parameter has been set', function () {
                createController();
                onceOffPaymentModel.setPaymentConfirmation(false);
                expect(scope.onceOffPaymentModel.beneficiary).toEqual({
                    name: null,
                    oldName: null,
                    accountNumber: null,
                    beneficiaryType: 'PRIVATE',
                    recipientId: '1',
                    "oldBank": undefined,
                    "bank": undefined,
                    "paymentConfirmation": {
                        "address": null,
                        "confirmationType": 'None',
                        "recipientName": null,
                        "sendFutureDated": null
                    }
                });
            });

            describe('when the URL changes', function () {

                describe('to any other URL', function () {
                    it('should reset the payment flow parameters', function () {

                        onceOffPaymentModel.setBeneficiary({name: 'derp', paymentConfirmation: {}});
                        onceOffPaymentModel.setErrorMessage('has error');
                        onceOffPaymentModel.setAmount('an amount');
                        onceOffPaymentModel.setIsSuccessful(false);
                        onceOffPaymentModel.setPaymentConfirmation(false);
                        onceOffPaymentModel.setListedBeneficiary(null);
                        onceOffPaymentModel.setAccount('00000000000');
                        var modelBeforeCreatingController = _.cloneDeep(onceOffPaymentModel.getOnceOffPaymentModel());
                        createController();

                        expect(modelBeforeCreatingController).toEqual(scope.onceOffPaymentModel);
                        expect(modelBeforeCreatingController).toEqual(onceOffPaymentModel.getOnceOffPaymentModel());
                    });
                });
            });

            it('should retrieve a list of banks and label them', function () {

                createController();
                scope.$digest();
                expect(scope.banks[0].label()).toEqual(banks[0].name);
            });

            it('should not retrieve branches because of lazy loading', function () {
                createController();
                scope.$digest();
                expect(scope.selectedBankBranches()).toEqual([]);
            });

            describe('selectedBankBranches', function () {
                it('should return the branches for the selected bank', function () {
                    createController();
                    scope.$digest();
                    scope.branches = {};
                    scope.branches[banks[0].code] = branches;
                    scope.branches[banks[0].code].code = 12345;
                    scope.onceOffPaymentModel.beneficiary.bank = banks[0];
                    expect(scope.selectedBankBranches(banks[0]).code).toEqual(12345);
                });

                it('should return an empty list for undefined', function () {
                    createController();
                    scope.$digest();
                    scope.onceOffPaymentModel.beneficiary = {bank: undefined};
                    expect(scope.selectedBankBranches(undefined)).toEqual([]);
                });
            });

            describe('toggle payment confirmation when making once off payment', function () {
                beforeEach(function () {
                    var standardBank = {
                        "name": "Standard Bank",
                        "code": "051",
                        "branch": branches[0]
                    };
                    onceOffPaymentModel.setBeneficiary({
                        name: 'derp', foo: 'bar', bank: standardBank,
                        paymentConfirmation: {
                            recipientName: null,
                            address: null,
                            confirmationType: "Email",
                            sendFutureDated: null
                        }
                    });
                    onceOffPaymentModel.setPaymentConfirmation(false);
                    scope.$digest();
                });

                it('should set the email address as the default payment confirmation', function () {

                    createController();
                    onceOffPaymentModel.setPaymentConfirmation(true);
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType).toEqual("Email");
                });

                it('should default the payment confirmation recipient name to the beneficiary name for private beneficiaries', function () {
                    onceOffPaymentModel.initialise();
                    onceOffPaymentModel.setPaymentConfirmation(false);
                    onceOffPaymentModel.setBeneficiary({name: 'derp'});
                    createController();
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toBeNull();
                    onceOffPaymentModel.setPaymentConfirmation(true);
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual(scope.onceOffPaymentModel.beneficiary.name);
                });

                it('should not default the payment confirmation recipient name to the beneficiary name for company beneficiaries', function () {
                    onceOffPaymentModel.initialise();
                    onceOffPaymentModel.setListedBeneficiary({name: "edgars", number: "67890"});
                    onceOffPaymentModel.setPaymentConfirmation(true);
                    createController();
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toBeNull();
                });

                it('should not clear payment confirmation fields when confirmation is set to false and back to true again', function () {
                    onceOffPaymentModel.initialise();
                    createController();
                    var beneficiary = scope.onceOffPaymentModel.beneficiary;
                    beneficiary.paymentConfirmation.recipientName = 'name';
                    beneficiary.paymentConfirmation.address = 'address';
                    beneficiary.paymentConfirmation.confirmationType = 'Email';
                    onceOffPaymentModel.setBeneficiary(beneficiary);
                    onceOffPaymentModel.setPaymentConfirmation(false);
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation).toEqual({
                        confirmationType: 'None',
                        recipientName: 'name',
                        address: null,
                        sendFutureDated: null
                    });
                    onceOffPaymentModel.setPaymentConfirmation(true);
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation).toEqual({
                        confirmationType: 'Email',
                        recipientName: 'name',
                        address: 'address',
                        sendFutureDated: null
                    });
                });
            });

            describe('when the beneficiary name is edited', function () {

                describe('when paymentConfirmation is true', function () {
                    beforeEach(function () {
                        onceOffPaymentModel.initialise();
                        createController();
                    });

                    it('should update the recipient name for payment confirmation', function () {
                        var beneficiary = scope.onceOffPaymentModel.beneficiary;
                        beneficiary.name = 'uncle bob';
                        onceOffPaymentModel.setBeneficiary(beneficiary);
                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual('uncle bob');
                    });

                    it('should not update the recipient name when it already has a value', function () {
                        var beneficiary = scope.onceOffPaymentModel.beneficiary;
                        beneficiary.paymentConfirmation.recipientName = 'someone';
                        beneficiary.name = 'uncle bob';
                        scope.onceOffPaymentModel.beneficiary = beneficiary;
                        scope.changeBeneficiaryName(scope.onceOffPaymentModel.beneficiary.name);

                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual('someone');
                    });

                    it('should update the recipient name when its value is the same as the old beneficiary name', function () {
                        var beneficiary = scope.onceOffPaymentModel.beneficiary;
                        beneficiary.name = 'uncle bo';
                        scope.onceOffPaymentModel.beneficiary = beneficiary;
                        scope.changeBeneficiaryName(scope.onceOffPaymentModel.beneficiary.name);

                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual('uncle bo');

                        scope.onceOffPaymentModel.beneficiary.name = 'uncle bob';
                        scope.changeBeneficiaryName(scope.onceOffPaymentModel.beneficiary.name);

                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual('uncle bob');
                    });

                    it('should not update the recipient name for listed beneficiaries', function () {
                        onceOffPaymentModel.setListedBeneficiary({name: "woolies", number: "12345"});
                        var beneficiary = scope.onceOffPaymentModel.beneficiary;
                        beneficiary.paymentConfirmation.recipientName = 'old';
                        onceOffPaymentModel.setBeneficiary(beneficiary);
                        scope.onceOffPaymentModel.beneficiary.name = 'uncle bob';
                        scope.changeBeneficiaryName(scope.onceOffPaymentModel.beneficiary.name);

                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual('old');
                    });
                });

                describe('when paymentConfirmation is false', function () {
                    beforeEach(function () {
                        onceOffPaymentModel.initialise();
                        createController();
                        onceOffPaymentModel.setPaymentConfirmation(false);
                        var beneficiary = scope.onceOffPaymentModel.beneficiary;
                        beneficiary.name = 'uncle bob';
                        onceOffPaymentModel.setBeneficiary(beneficiary);
                    });

                    it('should not update the recipient name for payment confirmation', function () {
                        scope.changePaymentConfirmation(false);

                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toBeNull();
                    });

                    it('should update the beneficiary confirmation type', function () {
                        scope.changePaymentConfirmation(true);

                        scope.changeConfirmationType('SMS');
                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType).toEqual('SMS');

                        scope.changeConfirmationType('Email');
                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.confirmationType).toEqual('Email');
                    });

                    it('should update the recipient name for payment confirmation when paymentConfirmation switches to true', function () {
                        scope.changePaymentConfirmation(true);

                        expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation.recipientName).toEqual('uncle bob');
                    });

                });

            });

            describe('when proceed', function () {
                beforeEach(function () {
                    onceOffPaymentModel.initialise();
                    flow.create(['Enter details', 'Confirm details', 'OTP'], 'Pay single beneficiary');
                    createController();
                });

                it('should display transaction details for confirmation', function () {
                    scope.proceed();
                    expect(location.path).toHaveBeenCalledWith('/payment/onceoff/confirm');
                });

                it('should know the current step is the last step and the other two steps have been completed', function () {
                    scope.proceed();
                    expectedSteps[0].current = false;
                    expectedSteps[0].complete = true;

                    expectedSteps[1].current = true;
                    expectedSteps[1].complete = false;

                    expect(flow.get().steps).toEqual(expectedSteps);
                });

                it('should not send the payment notification details when user chooses the NO option', function () {
                    scope.onceOffPaymentModel.beneficiary.paymentConfirmation = {
                        "address": '0787772292',
                        "confirmationType": 'SMS',
                        "recipientName": 'Recipient',
                        "sendFutureDated": null
                    };
                    var expectedPaymentConfirmationInfo = _.cloneDeep(scope.onceOffPaymentModel.beneficiary.paymentConfirmation);
                    expectedPaymentConfirmationInfo.confirmationType = 'None';
                    expectedPaymentConfirmationInfo.address = null;
                    onceOffPaymentModel.setPaymentConfirmation(false);
                    scope.proceed();
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation).toEqual(expectedPaymentConfirmationInfo);
                });

                it('should send the payment notification details when user chooses the YES option', function () {
                    var beneficiary = scope.onceOffPaymentModel.beneficiary;
                    beneficiary.paymentConfirmation = {
                        "address": '0787772292',
                        "confirmationType": 'SMS',
                        "recipientName": 'Recipient',
                        "sendFutureDated": null
                    };
                    onceOffPaymentModel.setBeneficiary(beneficiary);

                    scope.proceed();
                    expect(scope.onceOffPaymentModel.beneficiary.paymentConfirmation).toEqual({
                        "address": '0787772292',
                        "confirmationType": 'SMS',
                        "recipientName": 'Recipient',
                        "sendFutureDated": null
                    });
                });

                it('should send the save as beneficiary when user chooses YES option', function () {
                    onceOffPaymentModel.setSaveAsBeneficiary(true);
                    scope.proceed();
                    expect(scope.onceOffPaymentModel.saveAsBeneficiary).toBeTruthy();
                });
            });
        });
    });
});
