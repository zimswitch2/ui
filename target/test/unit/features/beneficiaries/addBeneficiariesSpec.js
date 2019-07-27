describe('Beneficiaries', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries', 'refresh.beneficiaries.add', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a beneficiary is to be added', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/beneficiaries/add'].controller).toEqual('AddBeneficiariesController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/beneficiaries/add'].templateUrl).toEqual('features/beneficiaries/partials/add.html');
            });
        });
    });

    describe('when AddBeneficiariesController', function () {
        var scope, card, location, mock, flow, beneficiariesFlowParameters, expectedSteps, beneficiaryFlowService,
            bankService, cdiService, groupsService, branchLazyLoadingService, wooliesInTheCdi,
            listedBeneficiaryThatCannotBeAdded, $controller;

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

        function createController() {
            $controller('AddBeneficiariesController', {
                $scope: scope,
                BeneficiariesState: beneficiariesFlowParameters,
                BeneficiaryFlowService: beneficiaryFlowService,
                BranchLazyLoadingService: branchLazyLoadingService,
                $location: location,
                BankService: bankService,
                CdiService: cdiService,
                GroupsService: groupsService
            });
        }


        beforeEach(inject(function ($rootScope, $location, _$controller_, _mock_, Flow, BeneficiariesState) {
            scope = $rootScope.$new();
            beneficiariesFlowParameters = BeneficiariesState;
            beneficiaryFlowService = jasmine.createSpyObj('beneficiaryFlowService', ['initialize', 'proceed', 'modify', 'confirm']);
            mock = _mock_;
            $controller = _$controller_;
            location = jasmine.createSpyObj('location', ['path']);
            flow = Flow;
            bankService = jasmine.createSpyObj('bankService', ['list', 'searchBranches']);
            bankService.list.and.returnValue(mock.resolve(banks));
            bankService.searchBranches.and.returnValue(mock.resolve(branches));
            branchLazyLoadingService = jasmine.createSpyObj('branchLazyLoadingService', ['bankUpdate']);
            cdiService = jasmine.createSpyObj('cdiService', ['list', 'findCompany']);
            cdiService.findCompany.and.returnValue(mock.resolve(null));

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
            wooliesInTheCdi = {name: "woolies", number: "12345"};
            listedBeneficiaryThatCannotBeAdded = {name: "will not work", number: '808080'};
            cdiService.list.and.returnValue(mock.resolve([wooliesInTheCdi, listedBeneficiaryThatCannotBeAdded]));

            expectedSteps = [
                {name: 'Enter details', complete: false, current: true},
                {name: 'Confirm details', complete: false, current: false},
                {name: 'Enter OTP', complete: false, current: false}
            ];

            verifyCompanyDepositIdentifierFeature = true;

            createController();
        }));

        it('should know if a listed beneficiary is being added', function () {
            scope.listedBeneficiary = {name: "edgars", number: "67890"};
            expect(scope.isPrivateBeneficiary()).toBeFalsy();
            expect(scope.isListedBeneficiary()).toBeTruthy();
        });

        it('should know if a private beneficiary is being added', function () {
            scope.listedBeneficiary = undefined;
            expect(scope.isPrivateBeneficiary()).toBeTruthy();
            expect(scope.isListedBeneficiary()).toBeFalsy();
        });

        describe('is initialized', function () {
            beforeEach(inject(function (Beneficiary) {
                scope.listedBeneficiary = wooliesInTheCdi;
                beneficiariesFlowParameters.errorMessage = undefined;
                beneficiariesFlowParameters.editBeneficiary = false;
                beneficiariesFlowParameters.card = card;
                beneficiariesFlowParameters.modifiedBeneficiary = Beneficiary.newInstance();
                beneficiariesFlowParameters.editing = true;
                flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
                createController();
                scope.$digest();
            }));

            it('should set payment confirmation to true by default', function () {
                expect(scope.paymentConfirmation).toBeTruthy();
            });

            it('should set payment confirmation to the previous value when there is an error', function () {
                beneficiariesFlowParameters.errorMessage = 'asd';
                beneficiariesFlowParameters.paymentConfirmation = 'whatever payment choice';
                createController();
                scope.$digest();
                expect(scope.paymentConfirmation).toEqual(beneficiariesFlowParameters.paymentConfirmation);
            });

            it('should load the CDI onto the scope with the label function available so that the typeahead widget works', function () {
                expect(scope.cdi).toEqual([wooliesInTheCdi, listedBeneficiaryThatCannotBeAdded]);
                expect(scope.cdi[0].label()).toEqual("woolies");
                expect(scope.cdi[1].label()).toEqual("will not work");
            });

            it('should initialize the beneficiary', inject(function (Beneficiary) {
                var modifiedBeneficiary = Beneficiary.newInstance();
                modifiedBeneficiary.paymentConfirmation.confirmationType = 'Email';
                expect(scope.beneficiary).toEqual(modifiedBeneficiary);
                expect(beneficiaryFlowService.initialize).toHaveBeenCalledWith(Beneficiary.newInstance(), 'Add beneficiary');
            }));

            it('should call $location.path when errorMessage is undefined and oldUrl is /otp/verify', function () {
                scope.$broadcast('$routeChangeSuccess', '/beneficiaries/add', {originalPath: '/otp/verify'});

                expect(location.path).toHaveBeenCalledWith('/otp/verify');
            });

            it('should not call $location.path when errorMessage is defined and oldUrl is /beneficiaries/list', function () {
                beneficiariesFlowParameters.errorMessage = 'asd';

                createController();
                scope.$broadcast('$routeChangeSuccess', '/beneficiaries/add', {originalPath: '/beneficiaries/list'});

                expect(location.path).not.toHaveBeenCalledWith('/beneficiaries/list');
            });

            it('should not call $location.path when errorMessage is defined and oldUrl is /otp/verify', function () {
                beneficiariesFlowParameters.errorMessage = 'asd';

                createController();
                scope.$broadcast('$routeChangeSuccess', '/beneficiaries/add', {originalPath: '/otp/verify'});

                expect(location.path).not.toHaveBeenCalledWith('/otp/verify');
            });

            it('should not call $location.path when errorMessage is undefined and oldUrl not /otp/verify', function () {
                beneficiariesFlowParameters.editBeneficiary = true;

                createController();
                scope.$broadcast('$routeChangeSuccess', '/beneficiaries/add', {originalPath: '/beneficiaries/list'});

                expect(location.path).not.toHaveBeenCalledWith('/beneficiaries/list');
            });

            it('should set the default mode to editing', function () {
                expect(scope.editing).toBeTruthy();
            });

            it('should ensure no listed beneficiary is selected when add flow is started', function () {
                expect(scope.listedBeneficiary).toBeUndefined();
            });

            it('should ensure the original listed beneficiary is selected when adding a listed beneficiary flow has an error', function () {
                beneficiariesFlowParameters.modifiedBeneficiary = {
                    beneficiaryType: 'COMPANY',
                    accountNumber: '808080',
                    paymentConfirmation: {}
                };

                createController();
                scope.$digest();

                expect(scope.listedBeneficiary).toEqual(listedBeneficiaryThatCannotBeAdded);
            });

            it('should clear previous errors', function () {
                expect(scope.errorMessage).toBeFalsy();
            });

            it('should know the flow steps and state of the steps with the first step as current', function () {
                var steps = flow.get().steps;
                expect(steps).toEqual(expectedSteps);
            });

            it('should initialize the beneficiary using the last request', inject(function (LastRequest) {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": "051",
                    "branch": branches[0]
                };
                LastRequest.lastRequest({
                    data: {
                        beneficiaries: [
                            {foo: 'bar', bank: standardBank, paymentConfirmation: {recipientName: undefined}}
                        ]
                    }
                });
                beneficiariesFlowParameters.modifiedBeneficiary = {
                    foo: 'bar',
                    bank: standardBank,
                    paymentConfirmation: {recipientName: undefined}
                };
                createController();
                scope.$digest();
                expect(scope.beneficiary).toEqual({
                    foo: 'bar',
                    bank: standardBank,
                    paymentConfirmation: {recipientName: undefined}
                });
                expect(scope.beneficiary.bank).toEqual(standardBank);
            }));

            it('should retrieve a list of banks and label them', function () {
                scope.$digest();
                expect(scope.banks[0].label()).toEqual(banks[0].name);
            });

            it('should not retrieve branches because of lazy loading', function () {
                scope.$digest();
                expect(scope.branches).toEqual({undefined: []});
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
                scope.bankUpdate(newBank, oldBank);
                expect(branchLazyLoadingService.bankUpdate).toHaveBeenCalledWith(scope.branches, scope.beneficiary, newBank, oldBank);
            });
        });

        describe('when proceed is clicked', function () {

            var setupProceedClickData = function(accountNumber, bankCode) {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": bankCode || "051",
                    "branch": branches[0]
                };
                beneficiariesFlowParameters.editing = false;
                scope.beneficiary.bank = standardBank;
                scope.beneficiary.accountNumber = accountNumber;

                scope.$digest();

                scope.proceed();
                scope.$digest();
            };

            beforeEach(inject(function(BeneficiaryFlowService) {
                beneficiaryFlowService = BeneficiaryFlowService;
                createController();
            }));

            it('should call the proceed for the beneficiary flow service', function () {
                spyOn(beneficiaryFlowService, 'proceed');
                setupProceedClickData();
                expect(beneficiaryFlowService.proceed).toHaveBeenCalled();
            });

            it('should call the proceed for the beneficiary flow service if the account number is not a listed beneficiary', function () {
                cdiService.findCompany.and.returnValue(mock.resolve(null));
                spyOn(beneficiaryFlowService, 'proceed');
                createController();
                setupProceedClickData('3452345');

                expect(beneficiaryFlowService.proceed).toHaveBeenCalled();
            });

            it('should set the editing mode as false', function () {
                setupProceedClickData();
                expect(scope.editing).toBeFalsy();
            });

            it('should call the cdi find company service', function() {
                createController();

                setupProceedClickData('3452345');
                expect(cdiService.findCompany).toHaveBeenCalledWith('3452345');
            });

            it('should set the listed beneficiary if the find company service returns a company', function() {
                cdiService.findCompany.and.returnValue(mock.resolve({ name: 'woolies', number: '12345' }));
                createController();
                scope.$digest();

                setupProceedClickData('3452345');

                expect(scope.listedBeneficiary.name).toEqual('woolies');
                expect(scope.listedBeneficiary.number).toEqual('12345');
            });

            it('should set the cdi beneficiary as private beneficiary flag to be true', function() {
                cdiService.findCompany.and.returnValue(mock.resolve({ name: 'woolies', number: '12345' }));
                createController();
                scope.$digest();

                setupProceedClickData('3452345');

                expect(scope.flags.cdiBeneficiaryAsPrivateBeneficiary).toEqual(true);
            });

            it('should set the cdi beneficiary as private beneficiary flag to be false if no company is returned', function() {
                cdiService.findCompany.and.returnValue(mock.resolve(null));
                createController();
                scope.$digest();

                setupProceedClickData('3452345');

                expect(scope.flags.cdiBeneficiaryAsPrivateBeneficiary).toEqual(false);
            });

            it('should not call the cdi find company service if the release toggle is off', function() {
                createController();

                verifyCompanyDepositIdentifierFeature = false;

                setupProceedClickData('3452345');
                expect(cdiService.findCompany).not.toHaveBeenCalled();
            });

            it('should not call the cdi find company service if the bank is not standard bank', function() {
                createController();
                setupProceedClickData('3452345', "100");
                expect(cdiService.findCompany).not.toHaveBeenCalled();
            });

            it('should set the cdi beneficiary as private beneficiary flag to be false if bank is not standard bank', function() {
                createController();

                scope.flags.cdiBeneficiaryAsPrivateBeneficiary = true;
                setupProceedClickData('3452345', "100");
                expect(scope.flags.cdiBeneficiaryAsPrivateBeneficiary).toEqual(false);
            });

            it('should know the flow steps and state of the first step should be complete and state of second step should be current', function () {
                setupProceedClickData();

                expectedSteps[0].current = false;
                expectedSteps[0].complete = true;

                expectedSteps[1].current = true;
                expectedSteps[1].complete = false;

                var steps = flow.get().steps;
                expect(steps).toEqual(expectedSteps);
            });
        });

        describe('toggle payment confirmation when adding', function () {
            beforeEach(function () {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": "051",
                    "branch": branches[0]
                };
                beneficiariesFlowParameters.editing = false;
                scope.beneficiary = {
                    name: 'derp', foo: 'bar', bank: standardBank,
                    paymentConfirmation: {
                        recipientName: null,
                        address: null,
                        confirmationType: "None",
                        sendFutureDated: null
                    }
                };
                scope.$digest();
            });

            it('should set the email address as the default payment confirmation', function () {
                scope.paymentConfirmation = true;
                scope.$digest();
                expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("Email");
            });

            it('should default the payment confirmation recipient name to the beneficiary name', function () {
                scope.paymentConfirmation = true;
                scope.$digest();
                expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual(scope.beneficiary.name);
            });

            it('should set payment confirmation type to none', function () {
                scope.paymentConfirmation = false;
                scope.$digest();
                expect(scope.beneficiary.paymentConfirmation.confirmationType).toEqual("None");
            });
        });

        describe("when beneficiary name is edited", function () {

            beforeEach(function () {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": "051",
                    "branch": {}
                };
                beneficiariesFlowParameters.editing = false;
                scope.beneficiary = {
                    name: 'derp', foo: 'bar', bank: standardBank,
                    paymentConfirmation: {
                        recipientName: null,
                        address: null,
                        confirmationType: "None",
                        sendFutureDated: null
                    }
                };
            });

            describe("when payment confirmation is true", function () {

                beforeEach(function () {
                    scope.paymentConfirmation = true;
                });

                it("should set the payment confirmation recipient to the beneficiary name", function () {
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toBeNull();
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');
                });

                it("should not update the recipient name when it already has a value", function () {
                    scope.beneficiary.paymentConfirmation.recipientName = 'someone';
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('someone');
                });

                it('should update the recipient name when its value is not the same as the old beneficiary name', function () {
                    scope.$digest();

                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');
                    scope.beneficiary.name = 'derp herp';
                    scope.$digest();

                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp herp');
                });

                it('should not update the recipient name for listed beneficiaries', function () {
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');

                    scope.listedBeneficiary = {name: 'woolies', 'number': '12345'};
                    scope.$digest();
                    expect(scope.beneficiary.paymentConfirmation.recipientName).toEqual('derp');
                });
            });

        });

        describe('when modify is clicked', function () {
            beforeEach(function () {
                beneficiariesFlowParameters.editing = true;
                beneficiariesFlowParameters.errorMessage = undefined;
                flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
                scope.modify();
            });

            it('should call the modify for the beneficiary flow service', function () {
                expect(beneficiaryFlowService.modify).toHaveBeenCalled();
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

        describe('when confirm is clicked', function () {
            beforeEach(function () {
                var standardBank = {
                    "name": "Standard Bank",
                    "code": "051",
                    "branch": branches[0]
                };
                scope.beneficiary = {
                    name: 'derp', foo: 'bar', bank: standardBank,
                    paymentConfirmation: {
                        recipientName: null,
                        address: null,
                        confirmationType: "None",
                        sendFutureDated: null
                    }
                };
                flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Add beneficiary');
                flow.previous();
                beneficiariesFlowParameters.errorMessage = 'errorMessage123';
                beneficiariesFlowParameters.addBeneficiaryFlow = true;
                beneficiaryFlowService.confirm.and.returnValue(mock.resolve({}));
                scope.$digest();
            });

            it('should set the previous payment confirmation state on the scope when there is an error and yes option was selected', function () {
                scope.beneficiary.paymentConfirmation.confirmationType = "Email";
                scope.confirm(scope.beneficiary, card);
                scope.$digest();
                expect(beneficiariesFlowParameters.paymentConfirmation).toBeTruthy();
            });

            it('should set the previous payment confirmation state on the scope when there is an error and no option was selected', function () {
                scope.confirm(scope.beneficiary, card);
                scope.$digest();
                expect(beneficiariesFlowParameters.paymentConfirmation).not.toBeUndefined();
                expect(beneficiariesFlowParameters.paymentConfirmation).toBeFalsy();
            });

            it('should set the results of the operations to the scope when there is an error', inject(function (Beneficiary) {
                scope.confirm(Beneficiary.newInstance(), card);
                scope.$digest();

                expect(scope.errorMessage).toEqual('errorMessage123');
            }));

            describe('for a private beneficiary', function () {
                it('should tell that a listed beneficiary is of the PRIVATE beneficiary type', inject(function (Beneficiary) {
                    scope.listedBeneficiary = undefined;
                    scope.confirm(Beneficiary.newInstance(), card);
                    scope.$digest();

                    var expected = angular.extend(Beneficiary.newInstance(), {beneficiaryType: 'PRIVATE'});

                    expect(beneficiaryFlowService.confirm).toHaveBeenCalledWith(expected, card, '/beneficiaries/add');
                }));
            });

            describe('for a listed beneficiary', function () {
                it('should tell that a listed beneficiary is of the COMPANY beneficiary type', inject(function (Beneficiary) {
                    scope.listedBeneficiary = {name: 'woolies', 'number': '12345'};
                    scope.confirm(Beneficiary.newInstance(), card);
                    scope.$digest();

                    var expected = angular.extend(Beneficiary.newInstance(), {
                        beneficiaryType: 'COMPANY',
                        accountNumber: scope.listedBeneficiary.number,
                        name: "woolies"
                    });

                    expect(beneficiaryFlowService.confirm).toHaveBeenCalledWith(expected, card, '/beneficiaries/add');
                }));
            });
        });
    });
});
