describe('edit beneficiaries', function () {

    beforeEach(module('refresh.beneficiaries'));

    describe('routes', function () {
        var editBeneficiary, route;
        beforeEach(inject(function ($route) {
            route = $route;
            editBeneficiary = {};
        }));

        it('should not allow edit beneficiary', function () {
            editBeneficiary.beneficiary = undefined;
            expect(route.routes['/beneficiaries/edit'].allowedFrom[0].condition(editBeneficiary)).toBeFalsy();
        });

        it('should allow edit beneficiary', function () {
            editBeneficiary.beneficiary = {};
            expect(route.routes['/beneficiaries/edit'].allowedFrom[0].condition(editBeneficiary)).toBeTruthy();
        });

    });

    describe('EditBeneficiariesController', function () {
        var scope, service, mock, location, flow, beneficiariesState, expectedSteps, beneficiaryFlowsService,
            bankService, cdiService, groupsService, scheduledPaymentsService, card, controller,
            branchLazyLoadingService, wooliesInTheCdi;

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

        var aCard = {'number': 1234, 'type': '0', 'countryCode': 'ZA', 'systemPrincipalKey': 'SBSA_Banking'};

        function initializeController() {
            controller('EditBeneficiariesController', {
                $scope: scope,
                BeneficiariesState: beneficiariesState,
                BeneficiaryFlowService: beneficiaryFlowsService,
                BranchLazyLoadingService: branchLazyLoadingService,
                $location: location,
                BankService: bankService,
                CdiService: cdiService,
                Card: card,
                GroupsService: groupsService,
                ScheduledPaymentsService: scheduledPaymentsService
            });
        }

        beforeEach(inject(function ($rootScope, $location, $controller, _mock_, Flow, BeneficiariesState,
                                    ScheduledPaymentsService, Beneficiary) {
            scope = $rootScope.$new();
            service = jasmine.createSpyObj('service', ['add']);
            beneficiariesState = BeneficiariesState;
            beneficiaryFlowsService = jasmine.createSpyObj('beneficiaryFlowsService', ['initialize', 'proceed', 'modify', 'confirm']);
            mock = _mock_;
            controller = $controller;
            location = jasmine.createSpyObj('location', ['path']);
            card = jasmine.createSpyObj('card', ['current']);
            flow = Flow;
            bankService = jasmine.createSpyObj('bankService', ['list', 'searchBranches']);
            bankService.list.and.returnValue(mock.resolve(banks));
            bankService.searchBranches.and.returnValue(mock.resolve(branches));
            branchLazyLoadingService = jasmine.createSpyObj('branchLazyLoadingService', ['bankUpdate']);
            cdiService = jasmine.createSpyObj('cdiService', ['list']);
            scheduledPaymentsService = ScheduledPaymentsService;
            spyOn(scheduledPaymentsService, 'list');
            scheduledPaymentsService.list.and.returnValue(mock.resolve([{recipientId: 56}]));

            groupsService = jasmine.createSpyObj('GroupsService', ['list']);
            groupsService.list.and.returnValue(mock.response({
                "groups": [
                    {
                        "name": "Group 1",
                        "oldName": "Group 1",
                        "orderIndex": 0
                    },
                    {
                        "name": "Group 2",
                        "oldName": "Group 2",
                        "orderIndex": 0
                    }
                ]
            }));

            card.current.and.returnValue(aCard);

            wooliesInTheCdi = {name: "woolies", number: "12345"};
            cdiService.list.and.returnValue(mock.resolve([wooliesInTheCdi]));

            expectedSteps = [
                {name: 'Enter details', complete: false, current: true},
                {name: 'Confirm details', complete: false, current: false},
                {name: 'Enter OTP', complete: false, current: false}
            ];

            beneficiariesState.errorMessage = undefined;
            beneficiariesState.editBeneficiary = false;
            beneficiariesState.card = aCard;
            beneficiariesState.editing = true;
            beneficiariesState.beneficiary = Beneficiary.newInstance();
            beneficiariesState.modifiedBeneficiary = Beneficiary.newInstance();
        }));

        it('should immediately return if beneficiary parameter is empty', function () {
            beneficiariesState.beneficiary = undefined;
            initializeController();
            expect(scope.branches).toBeUndefined();
        });

        it('should call scheduledPaymentsService and set hasScheduledPayments to true', function () {
            beneficiariesState.beneficiary.recipientId = 56;
            beneficiariesState.modifiedBeneficiary.recipientId = 56;

            initializeController();
            scope.$digest();

            expect(scheduledPaymentsService.list).toHaveBeenCalledWith(aCard);
            expect(scope.hasScheduledPayments).toBeTruthy();
        });

        it('should call scheduledPaymentsService and set hasScheduledPayments to false', function () {
            scheduledPaymentsService.list.and.returnValue(mock.resolve([]));

            initializeController();
            scope.$digest();

            expect(scheduledPaymentsService.list).toHaveBeenCalledWith(aCard);
            expect(scope.hasScheduledPayments).toBeFalsy();
        });

        it('should know if a listed beneficiary is being added', function () {
            beneficiariesState.modifiedBeneficiary.beneficiaryType = 'COMPANY';

            initializeController();
            scope.$digest();

            expect(scope.isPrivateBeneficiary()).toBeFalsy();
            expect(scope.isListedBeneficiary()).toBeTruthy();
        });

        it('should know if a private beneficiary is being added', function () {
            beneficiariesState.modifiedBeneficiary.beneficiaryType = 'PRIVATE';

            initializeController();
            scope.$digest();

            expect(scope.isPrivateBeneficiary()).toBeTruthy();
            expect(scope.isListedBeneficiary()).toBeFalsy();
        });

        describe('controller initialized', function () {
            beforeEach(function () {
                initializeController();
                scope.$digest();
            });

            describe('selectedBankBranches', function () {
                it('should return the branches for the selected bank', function () {
                    scope.branches = {};
                    scope.branches[banks[0].code] = branches;
                    scope.branches[banks[0].code].code = 12345;
                    scope.beneficiary = {bank: banks[0]};
                    expect(scope.selectedBankBranches(banks[0]).code).toEqual(12345);
                });

                it('should return an empty list for undefined', function () {
                    scope.beneficiary = {bank: undefined};
                    expect(scope.selectedBankBranches(undefined)).toEqual([]);
                });
            });

            describe('watch beneficiary.bank', function () {
                it('should call BranchLazyLoadingService.bankUpdate', function () {
                    var oldBank = {code: '123', branch: {}};
                    var newBank = {code: '051', branch: {}};
                    scope.beneficiary = {bank: oldBank};
                    scope.branches = {};
                    scope.bankUpdate(newBank, oldBank);
                    scope.bankUpdate(newBank, oldBank);
                    expect(branchLazyLoadingService.bankUpdate).toHaveBeenCalledWith(scope.branches, scope.beneficiary, newBank, oldBank);
                });
            });

            describe('when listing existing beneficiary groups', function () {
                it('should retrieve list of existing beneficiary groups', function () {
                    expect(scope.beneficiaryGroups.length).toEqual(2);
                    expect(scope.beneficiaryGroups[0].name).toEqual("Group 1");
                    expect(scope.beneficiaryGroups[1].name).toEqual("Group 2");
                });

                it('should use the group name in the typeahead for group', function () {
                    expect(scope.beneficiaryGroups[0].label()).toEqual(scope.beneficiaryGroups[0].name);
                    expect(scope.beneficiaryGroups[1].label()).toEqual(scope.beneficiaryGroups[1].name);
                });

                it('should strip out oldName to please the service', function () {
                    expect(scope.beneficiaryGroups[0].oldName).toBeUndefined();
                    expect(scope.beneficiaryGroups[1].oldName).toBeUndefined();
                });
            });

            it('should set the old beneficiary group name to undefined if beneficiary does not belong to a group', function () {
                expect(scope.previousGroupName).toBeUndefined();
            });

            it('should load the CDI onto the scope with the label function available so that the typeahead widget works', function () {
                expect(scope.cdi).toEqual([wooliesInTheCdi]);
                expect(scope.cdi[0].label()).toEqual("woolies");
            });

            it('should call $location.path when errorMessage is undefined and oldUrl is /otp/verify', function () {
                scope.$broadcast('$routeChangeSuccess', '/beneficiaries/edit', {originalPath: '/otp/verify'});

                expect(location.path).toHaveBeenCalledWith('/otp/verify');
            });

            it('should not call $location.path when errorMessage is undefined and oldUrl is /beneficiaries/list', function () {
                scope.$broadcast('$routeChangeSuccess', '/beneficiaries/edit', {originalPath: '/beneficiaries/list'});

                expect(location.path).not.toHaveBeenCalledWith('/beneficiaries/list');
            });

            it('should know the default editBeneficiary flag based on what has been set on the beneficiaryFlowParameters', function () {
                expect(scope.editBeneficiary).toBeFalsy();
            });

            it('should initialize the beneficiary', inject(function (Beneficiary) {
                expect(scope.beneficiary).toEqual(Beneficiary.newInstance());
                expect(beneficiaryFlowsService.initialize).toHaveBeenCalledWith(beneficiariesState.beneficiary, 'Edit beneficiary');
            }));

            it('should set the mode of editing to that of the BeneficiaryState', function () {
                expect(scope.editing).toBeTruthy();
            });

            it('should clear previous errors', function () {
                expect(scope.errorMessage).toBeUndefined();
            });

            it('should not retrieve branches because of lazy loading', function () {
                expect(scope.branches).toEqual({undefined: []});
            });

            it('should retrieve a list of banks and label them', function () {
                scope.beneficiary = {bank: {}, paymentConfirmation: {}};

                scope.$digest();
                expect(scope.banks[0].label()).toEqual(banks[0].name);
            });
        });

        describe('when proceed is clicked', function () {
            beforeEach(function () {
                beneficiariesState.editing = false;
                flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
                flow.next();

                initializeController();
                scope.$digest();

                scope.proceed();
            });

            it('should call the proceed for the beneficiary flow service', function () {
                expect(beneficiaryFlowsService.proceed).toHaveBeenCalled();
            });

            it('should set the editing mode as false', function () {
                expect(scope.editing).toBeFalsy();
            });

            it('should know the flow steps and state of the first step should be complete and state of second step should be current', function () {
                expectedSteps[0].current = false;
                expectedSteps[0].complete = true;

                expectedSteps[1].current = true;
                expectedSteps[1].complete = false;

                var steps = flow.get().steps;
                expect(steps).toEqual(expectedSteps);
            });

            it('should set the previous group name on the request when changing group membership', function () {
                scope.previousGroupName = "the old group";
                scope.beneficiary = {name: "ABC", recipientGroup: {"name": "My new group", orderIndex: null}};

                scope.proceed();

                expect(scope.beneficiary.recipientGroup.oldName).toEqual("the old group");
                expect(scope.beneficiary.recipientGroup.name).toEqual("My new group");
            });

            it('should send the service a recipient group containing the name of the previous group when removing beneficiary from a group', function () {
                scope.previousGroupName = "the old group";
                scope.beneficiary = {name: "ABC", recipientGroup: undefined};

                scope.proceed();

                expect(scope.beneficiary.recipientGroup.oldName).toEqual("the old group");
                expect(scope.beneficiary.recipientGroup.name).toBeUndefined();
            });

            it('should send the service an empty recipient group when beneficiary group is not set and it is still not set', function () {
                scope.previousGroupName = undefined;
                scope.beneficiary = {name: "ABC", recipientGroup: undefined};

                scope.proceed();

                expect(scope.beneficiary.recipientGroup.oldName).toBeUndefined();
                expect(scope.beneficiary.recipientGroup.name).toBeUndefined();
            });
        });

        it('should set listedBeneficiary if beneficiary type is company', function () {
            beneficiariesState.modifiedBeneficiary = {
                foo: 'bar',
                beneficiaryType: 'COMPANY',
                name: 'some company',
                accountNumber: '56789',
                paymentConfirmation: {confirmationType: 'None'}
            };

            initializeController();
            scope.$digest();

            expect(scope.listedBeneficiary).toEqual({name: 'some company', number: '56789'});
        });

        it('should not set listedBeneficiary if beneficiary type is private', function () {
            beneficiariesState.modifiedBeneficiary = {
                foo: 'bar',
                beneficiaryType: 'PRIVATE',
                name: 'some person',
                accountNumber: '7738773837',
                paymentConfirmation: {confirmationType: 'None'}
            };

            initializeController();
            scope.$digest();

            expect(scope.listedBeneficiary).toBeUndefined();
        });

        it('should not call $location.path when errorMessage is defined and oldUrl is /otp/verify', function () {
            beneficiariesState.errorMessage = 'asd';

            initializeController();
            scope.$digest();
            scope.$broadcast('$routeChangeSuccess', '/beneficiaries/edit', {originalPath: '/otp/verify'});

            expect(location.path).not.toHaveBeenCalledWith('/otp/verify');
        });

        it('should set the payment confirmation parameter to true for a beneficiary with a confirmation type', function () {
            var standardBank = {
                "name": "Standard Bank",
                "code": "051",
                "branch": branches[0]
            };
            beneficiariesState.modifiedBeneficiary = {
                foo: 'bar',
                bank: standardBank,
                paymentConfirmation: {confirmationType: 'SMS'}
            };

            initializeController();
            scope.$digest();

            expect(scope.paymentConfirmation).toBeTruthy();
        });

        it('should set the payment confirmation to false for a beneficiary without a confirmation type', function () {
            var standardBank = {
                "name": "Standard Bank",
                "code": "051",
                "branch": branches[0]
            };
            beneficiariesState.modifiedBeneficiary = {
                foo: 'bar',
                bank: standardBank,
                paymentConfirmation: {confirmationType: 'None'}
            };

            initializeController();
            scope.$digest();

            expect(scope.paymentConfirmation).toBeFalsy();
        });

        it('should initialize the beneficiary using the last request', inject(function (LastRequest) {
            var standardBank = {
                "name": "Standard Bank",
                "code": "051",
                "branch": branches[0]
            };
            var theBeneficiary = {
                foo: 'bar',
                bank: standardBank,
                paymentConfirmation: {confirmationType: "None"},
                "recipientGroup": {"name": "Some Group", "oldName": "Some Group", "orderIndex": null}
            };

            LastRequest.lastRequest({data: {beneficiaries: [theBeneficiary]}});
            beneficiariesState.modifiedBeneficiary = theBeneficiary;

            initializeController();
            scope.$digest();

            expect(scope.beneficiary).toEqual(theBeneficiary);
            expect(scope.beneficiary.bank).toEqual(standardBank);
            expect(scope.beneficiary.bank.label()).toEqual(scope.beneficiary.bank.name);
            var branch = scope.beneficiary.bank.branch;
            expect(branch.label()).toEqual(branch.code + ' - ' + branch.name);

            expect(scope.beneficiary.recipientGroup.label()).toEqual("Some Group");
            expect(scope.previousGroupName).toEqual(scope.beneficiary.recipientGroup.name);
        }));

        describe('toggle payment confirmation when editing', function () {
            beforeEach(function () {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": "051",
                    "branch": branches[0]
                };
                beneficiariesState.editing = false;
                beneficiariesState.modifiedBeneficiary = {
                    name: 'derp', foo: 'bar', bank: standardBank,
                    paymentConfirmation: {
                        recipientName: null,
                        address: null,
                        confirmationType: "None",
                        sendFutureDated: null
                    }
                };
            });

            describe('beneficiary is a private individual', function () {
                beforeEach(function () {
                    beneficiariesState.modifiedBeneficiary.beneficiaryType = "PRIVATE";
                    initializeController();
                    scope.$digest();
                });

                it('should set the email address as the default payment confirmation if beneficiary has no confirmation type', function () {
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("Email");
                });

                it('should clear the fields when payment confirmation is set to false', function () {
                    scope.paymentConfirmation = false;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.address).toBeNull();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');
                    expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("None");
                });

                it('should set payment confirmation recipient name for a private beneficiary', function () {
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');
                });
            });

            describe('beneficiary is a company', function () {
                beforeEach(function () {
                    beneficiariesState.modifiedBeneficiary.beneficiaryType = "COMPANY";
                    initializeController();
                    scope.$digest();
                });

                it('should not set payment confirmation recipient name for a company beneficiary', function () {
                    scope.paymentConfirmation = true;
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toBeNull();
                });
            });
        });

        describe('when modify is clicked', function () {
            beforeEach(function () {
                flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');

                initializeController();
                scope.$digest();

                scope.modify();
            });

            it('should call the modify for the beneficiary flow service', function () {
                expect(beneficiaryFlowsService.modify).toHaveBeenCalled();
            });


            it('should set the editing mode as false', function () {
                expect(scope.editing).toBeTruthy();
            });

            it('should remove any previous errors', function () {
                expect(scope.errorMessage).toBeFalsy();
            });

            it('should know the flow steps and state of the steps with the first step as current', function () {
                var steps = flow.get().steps;
                expect(steps).toEqual(expectedSteps);
            });
        });

        describe('when confirm is clicked when there is a success', function () {
            beforeEach(inject(function (Beneficiary) {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": "051",
                    "branch": branches[0]
                };
                beneficiariesState.modifiedBeneficiary = {
                    name: 'derp', foo: 'bar', bank: standardBank,
                    paymentConfirmation: {
                        recipientName: null,
                        address: null,
                        confirmationType: "None",
                        sendFutureDated: null
                    }
                };

                flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
                flow.next();
                beneficiaryFlowsService.confirm.and.returnValue(mock.resolve({}));

                initializeController();
                scope.$digest();

                scope.confirm(Beneficiary.newInstance(), aCard);
                scope.$digest();
            }));

            it('should initialize the beneficiary', inject(function (Beneficiary) {
                expect(beneficiaryFlowsService.confirm).toHaveBeenCalledWith(Beneficiary.newInstance(), aCard, '/beneficiaries/edit');
                expect(scope.errorMessage).toBeUndefined();
            }));
        });
    });
});