describe('view beneficiary groups controller', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries.controllers.viewBeneficiaryGroups'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should use the correct controller ', function () {
            expect(route.routes['/beneficiaries/groups/add'].controller).toEqual('ViewBeneficiaryGroupsController');
        });

        it('should use the correct template ', function () {
            expect(route.routes['/beneficiaries/groups/add'].templateUrl).toEqual('features/beneficiaries/partials/addGroup.html');
        });
    });

    var scope, mock, service, sorter, groupResponse, location, beneficiaries, expectedFormattedBeneficiaries,
        beneficiariesService, beneficiariesState, applicationParametersService, cardService, cached, groups;

    beforeEach(inject(function ($rootScope, $controller, _mock_, $sorter) {
        beneficiaries = [
            {
                recipientId: "1",
                name: "Test",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 0}}
                ],
                recipientGroup: {
                    'name': 'Group 1',
                    'oldName': null,
                    'orderIndex': "1"
                }
            },
            {
                recipientId: "2",
                name: "Test2",
                accountNumber: "211",
                recipientReference: "Test",
                customerReference: "Test",
                recentPayment: [
                    {date: "2014-02-03", amount: {amount: 10}}
                ],
                recipientGroup: null
            }
        ];

        expectedFormattedBeneficiaries = [
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
                originalBeneficiary: beneficiaries[0],
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
                originalBeneficiary: beneficiaries[1],
                selectedClass: ""
            }
        ];

        groups = [
            {
                'name': 'Group 1',
                'oldName': null,
                'orderIndex': "1",
                'beneficiaries': [beneficiaries[0]]
            },
            {
                'name': 'Group 2',
                'oldName': null,
                'orderIndex': "1",
                'beneficiaries': []
            }
        ];

        cached = {
            beneficiaryList: expectedFormattedBeneficiaries,
            beneficiaryGroups: groups
        };

        scope = $rootScope.$new();
        mock = _mock_;
        service = jasmine.createSpyObj('service', ['listWithMembers', 'add']);
        service.listWithMembers.and.returnValue(mock.resolve(cached));
        beneficiariesService = jasmine.createSpyObj('beneficiariesService', ['changeBeneficiaryGroupMembership']);
        beneficiariesState = {};
        applicationParametersService = jasmine.createSpyObj('applicationParametersService', ['pushVariable', 'getVariable']);
        cardService = jasmine.createSpyObj('cardService', ['current']);
        cardService.current.and.returnValue({"countryCode": "ZA", "number": 12345, "type": "0"});
        sorter = $sorter;
        location = jasmine.createSpyObj('location', ['path']);

        $controller('ViewBeneficiaryGroupsController', {
            $scope: scope,
            $sorter: sorter,
            GroupsService: service,
            BeneficiariesService: beneficiariesService,
            BeneficiariesState: beneficiariesState,
            ApplicationParameters: applicationParametersService,
            Card: cardService,
            $location: location
        });
    }));

    describe('when showing group page', function () {
        it('should show group page', function () {
            scope.showGroupPage();
            expect(scope.shouldDisplayGroupPage).toEqual(true);
            expect(scope.shouldDisplayBeneficiariesPage).toEqual(false);
        });
    });

    describe('when showing beneficiaries page', function () {
        it('should show beneficiaries page', function () {
            scope.showBeneficiariesPage();
            expect(scope.shouldDisplayGroupPage).toEqual(false);
            expect(scope.shouldDisplayBeneficiariesPage).toEqual(true);
        });
    });

    describe('selectBeneficiary', function () {

        beforeEach(function () {
            scope.selectedBeneficiaries = [];
        });

        it('should add current beneficiary to selectedBeneficiaries list', function () {
            scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
            expect(scope.selectedBeneficiaries).toEqual([expectedFormattedBeneficiaries[0]]);
        });

        it('should have the beneficiary selected', function () {
            scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
            expect(expectedFormattedBeneficiaries[0].selectedClass).toEqual("selected");
        });

        it('should be able to click if beneficiary is selected', function () {
            scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
            expect(scope.canClick).toBeTruthy();
        });

        describe('beneficiary selected', function () {
            beforeEach(function () {
                expectedFormattedBeneficiaries[0].selectedClass = "selected";
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[0]);
            });

            it('should add current beneficiary to selectedBeneficiaries list', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[1]);
                expect(scope.selectedBeneficiaries).toEqual(expectedFormattedBeneficiaries);
                expect(scope.selectedBeneficiaries.length).toEqual(2);
            });

            it('should have the beneficiary selected', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[1]);
                expect(expectedFormattedBeneficiaries[1].selectedClass).toEqual("selected");
            });

            it('should be able to click if beneficiary is selected', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[1]);
                expect(scope.canClick).toBeTruthy();
            });

            it('should have the beneficiary length as zero', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.selectedBeneficiaries.length).toEqual(0);
            });

            it('should have the current beneficiary as unselected', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(expectedFormattedBeneficiaries[0].selectedClass).toEqual("");
            });

            it('should have not be able to click the groups', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.canClick).toBeFalsy();
            });

            it('should not display the add buttons', function () {
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.displayClass).toEqual("");
            });

            it('should have one selected beneficiary if two beneficiaries selected and one gets unselected', function () {
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.selectedBeneficiaries).toEqual([expectedFormattedBeneficiaries[1]]);
                expect(scope.selectedBeneficiaries.length).toEqual(1);
            });

            it('should display if two beneficiaries selected and one gets unselected', function () {
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.displayClass).toEqual("can-add");
            });

            it('should select one beneficiary if two beneficiaries selected and one gets unselected', function () {
                expectedFormattedBeneficiaries[1].selectedClass = 'selected';
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(expectedFormattedBeneficiaries[1].selectedClass).toEqual("selected");
            });

            it('should be able to click if two beneficiaries selected and one gets unselected', function () {
                expectedFormattedBeneficiaries[1].selectedClass = 'selected';
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.canClick).toBeTruthy();
            });

            it('should display if two beneficiaries selected and one gets unselected', function () {
                expectedFormattedBeneficiaries[1].selectedClass = 'selected';
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.displayClass).toEqual("can-add");
            });

            it('should reset previous operation status', function () {
                scope.isSuccessful = true;
                scope.errorMessage = 'something went wrong';
                scope.selectBeneficiary(expectedFormattedBeneficiaries[0]);
                expect(scope.isSuccessful).toBeFalsy();
                expect(scope.errorMessage).toBeUndefined();
            });

        });

        describe('addGroupMemberNumber', function () {
            var groups = [
                {
                    'name': 'Group 1',
                    'oldName': null,
                    'orderIndex': "1"
                },
                {
                    'name': 'Group 2',
                    'oldName': null,
                    'orderIndex': "1"
                }
            ];

            beforeEach(function () {
                expectedFormattedBeneficiaries[0].oldGroup = groups[0];
                expectedFormattedBeneficiaries[1].oldGroup = groups[0];

                expectedFormattedBeneficiaries[0].originalBeneficiary.recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].originalBeneficiary.recipientGroup = groups[0];
                scope.selectedBeneficiaries = expectedFormattedBeneficiaries;
                scope.beneficiaryGroups = groups;
            });

            it('should not update the member group numbers based on new and old group of selected beneficiaries', function () {
                scope.beneficiaryGroups[0].numberOfMembers = 2;
                scope.selectedBeneficiaries[0].recipientGroupName = groups[0].name;
                scope.beneficiaryGroups[1].numberOfMembers = 2;
                scope.selectedBeneficiaries[1].recipientGroupName = groups[0].name;

                scope.addGroupMemberNumber();
                expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(2);
                expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(2);
            });

            it('should update the member group numbers based on new and old group of selected beneficiaries', function () {
                expectedFormattedBeneficiaries[0].recipientGroupName = groups[1].name;
                expectedFormattedBeneficiaries[1].recipientGroupName = groups[1].name;

                scope.beneficiaryGroups[0].numberOfMembers = 2;
                scope.beneficiaryGroups[1].numberOfMembers = 2;

                scope.addGroupMemberNumber();
                expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(2);
                expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(4);
            });
        });
    });

    describe('addGroupMemberNumber', function () {
        var groups = [
            {
                'name': 'Group 1',
                'oldName': null,
                'orderIndex': "1"
            },
            {
                'name': 'Group 2',
                'oldName': null,
                'orderIndex': "1"
            }
        ];

        it('should not update the member group numbers based on new and old group of selected beneficiaries', function () {
            expectedFormattedBeneficiaries[0].oldGroup = groups[1];
            expectedFormattedBeneficiaries[1].oldGroup = groups[1];
            scope.selectedBeneficiaries = expectedFormattedBeneficiaries;

            scope.beneficiaryGroups = groups;
            scope.beneficiaryGroups[0].numberOfMembers = 2;
            scope.selectedBeneficiaries[0].recipientGroupName = groups[1].name;
            scope.beneficiaryGroups[1].numberOfMembers = 2;
            scope.selectedBeneficiaries[1].recipientGroupName = groups[1].name;

            scope.addGroupMemberNumber();
            expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(2);
            expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(2);
        });
    });

    describe('decrementGroupMemberNumber', function () {
        var groups = [
            {
                'name': 'Group 1',
                'oldName': null,
                'orderIndex': "1"
            },
            {
                'name': 'Group 2',
                'oldName': null,
                'orderIndex': "1"
            }
        ];

        it('should decrement the member group numbers based on new and old group of selected beneficiaries', function () {
            expectedFormattedBeneficiaries[0].oldGroup = groups[1];
            expectedFormattedBeneficiaries[1].oldGroup = groups[1];
            scope.selectedBeneficiaries = expectedFormattedBeneficiaries;

            scope.beneficiaryGroups = groups;
            scope.beneficiaryGroups[0].numberOfMembers = 2;
            scope.beneficiaryGroups[1].numberOfMembers = 2;

            scope.decrementGroupMemberNumber();
            expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(2);
            expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(0);
        });

    });

    describe('when initialized', function () {
        describe('when all service calls return values', function () {
            beforeEach(inject(function () {
                scope.groupName = 'Test Name';
                scope.$apply();

                groupResponse = {};
            }));

            it('should know how many members are in beneficiary group', function () {
                var group1Members = scope.numberOfMembers(groups[0]);
                var group2Members = scope.numberOfMembers(groups[1]);
                expect(group1Members).toEqual(1);
                expect(group2Members).toEqual(0);
            });

            it('should have the selectedBeneficiaries as an empty array', function () {
                expect(scope.selectedBeneficiaries.length).toEqual(0);
            });

            it('should know the default beneficiary groups length', function () {
                expect(scope.beneficiaryGroups.length).toEqual(2);
            });

            it('should know default state group click is false', function () {
                expect(scope.canClick).toBeFalsy();
            });

            it('should know default display', function () {
                expect(scope.displayClass).toEqual("");
            });

            it('should call list beneficiary service', function () {
                expect(service.listWithMembers).toHaveBeenCalled();
            });

            it('should know the groups returned by the service', function () {
                //TODO fix; this works because the object being compared to is actually being changed (by ref)
                expect(scope.beneficiaryGroups).toEqual(groups);
            });

            it('should know number of members in groups which have no beneficiaries', function () {
                expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(1);
                expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(0);
            });

            it('should have the beneficiary list in the scope on initialize of the group beneficiaries', function () {
                //TODO fix; this works because the object being compared to is actually being changed (by ref)
                expect(service.listWithMembers).toHaveBeenCalled();
                expect(scope.beneficiaryList).toEqual(expectedFormattedBeneficiaries);
            });

            it('should amend a beneficiary group by calling the addMultiple service with new beneficiary details', function () {
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[0]);
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);

                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.response({}, 200, {
                    'x-sbg-response-code': "0000",
                    'x-sbg-response-type': 'SUCCESS'
                }));

                expectedFormattedBeneficiaries[0].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[0].originalBeneficiary.recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].originalBeneficiary.recipientGroup = groups[0];

                var expectedBeneficiaries = [expectedFormattedBeneficiaries[0].originalBeneficiary, expectedFormattedBeneficiaries[1].originalBeneficiary];

                scope.amendBeneficiariesGroup(groups[0]);
                scope.$digest();

                expect(beneficiariesService.changeBeneficiaryGroupMembership).toHaveBeenCalledWith(expectedBeneficiaries, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.errorMessage).toEqual(undefined);
                expect(scope.selectedBeneficiaries.length).toEqual(0);
                expect(scope.displayClass).toEqual("");
                expect(scope.canClick).toBeFalsy();
            });

            it('should not amend a beneficiary group by calling the addMultiple service when there is an error', function () {
                expectedFormattedBeneficiaries[0].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].recipientGroup = groups[0];

                expectedFormattedBeneficiaries[0].originalBeneficiary.recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].originalBeneficiary.recipientGroup = groups[0];

                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[0]);
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.reject({}, 200, {
                    'x-sbg-response-type': "ERROR",
                    'x-sbg-response-code': "9999", 'x-sbg-response-message': 'An error has occurred'
                }));

                var expectedBeneficiaries = [expectedFormattedBeneficiaries[0].originalBeneficiary, expectedFormattedBeneficiaries[1].originalBeneficiary];

                scope.amendBeneficiariesGroup(groups[1]);
                scope.$digest();

                expect(beneficiariesService.changeBeneficiaryGroupMembership).toHaveBeenCalledWith(expectedBeneficiaries, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.errorMessage).toEqual("An error has occurred");
                expect(scope.selectedBeneficiaries[0].originalBeneficiary.recipientGroup).toEqual(groups[0]);
                expect(scope.selectedBeneficiaries[0].selectedClass).toEqual("selected");
                expect(scope.shouldDisplayBeneficiariesPage).toBeTruthy();
            });

            it('should show an error if amending beneficiary fails', function () {
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[0]);
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.response({}, 500));

                expectedFormattedBeneficiaries[0].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[0].originalBeneficiary.recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].originalBeneficiary.recipientGroup = groups[0];

                var expectedBeneficiaries = [expectedFormattedBeneficiaries[0].originalBeneficiary, expectedFormattedBeneficiaries[1].originalBeneficiary];

                scope.amendBeneficiariesGroup(groups[0]);
                scope.$digest();

                expect(beneficiariesService.changeBeneficiaryGroupMembership).toHaveBeenCalledWith(expectedBeneficiaries, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.errorMessage).toEqual("An error has occurred");
            });

            it('should show an error has occurred if amending beneficiary fails with response message as an empty string', function () {
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.reject({}, 200, {
                    'x-sbg-response-type': "ERROR",
                    'x-sbg-response-message': ""
                }));
                scope.amendBeneficiariesGroup(groups[0]);
                scope.$digest();

                expect(scope.errorMessage).toEqual("An error has occurred");
            });

            it('should not clear the display if there is an error when adding a beneficiary to group', function () {
                scope.displayClass = "can-add";
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.reject({}, 200, {
                    'x-sbg-response-type': "ERROR",
                    'x-sbg-response-message': ""
                }));

                scope.amendBeneficiariesGroup(groups[0]);
                scope.$digest();

                expect(scope.displayClass).toEqual("can-add");
            });

            it('should indicate to which group beneficiaries are being added so that the inline spinner is next to the group\'s name', function () {
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.response({}, 200, {
                    'x-sbg-response-type': "ERROR",
                    'x-sbg-response-message': ""
                }));

                scope.currentGroup = undefined;
                scope.amendBeneficiariesGroup(groups[0]);
                scope.$digest();

                expect(scope.currentGroup).toEqual(groups[0]);
            });

            it('should not change the number of members in old beneficiary group if amending beneficiary fails', function () {
                groups[0].numberOfMembers = 2;
                groups[1].numberOfMembers = 2;

                expectedFormattedBeneficiaries[0].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].recipientGroup = groups[0];

                expectedFormattedBeneficiaries[0].originalBeneficiary.recipientGroup = groups[0];
                expectedFormattedBeneficiaries[1].originalBeneficiary.recipientGroup = groups[0];

                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[0]);
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[1]);

                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.reject({}, 200, {
                    'x-sbg-response-type': "ERROR",
                    'x-sbg-response-code': "9999", 'x-sbg-response-message': 'An error has occurred'
                }));

                scope.amendBeneficiariesGroup(groups[1]);
                scope.$digest();

                expect(groups[1].numberOfMembers).toEqual(2);
                expect(groups[0].numberOfMembers).toEqual(2);
            });

            it('should show an error if amending beneficiary fails for unspecified application error', function () {
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.reject({}, 200, {'x-sbg-response-type': "ERROR"}));
                scope.amendBeneficiariesGroup(groups[0]);
                scope.$digest();

                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.errorMessage).toEqual("An error has occurred");
            });

            it('should sort by group name', function () {
                expect(scope.sort.criteria).toEqual('name');
            });

            it('should put the latest group added at the top of the list', function () {
                var expectedName = 'Test Name';
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.response({}, 200, {'x-sbg-response-code': "0000"}));

                scope.addGroup();
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(expectedName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.beneficiaryGroups).toEqual([
                    {
                        'name': expectedName,
                        'oldName': null,
                        'orderIndex': "1",
                        'numberOfMembers': 0,
                        'highlightClass': 'highlight'
                    },
                    groups[0],
                    groups[1]
                ]);
                expect(scope.sort.criteria).toEqual('');
                expect(scope.addGroupForm.$setPristine).toHaveBeenCalled();
            });

            it('should add the beneficiary group', function () {
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.response(groupResponse, 200, {'x-sbg-response-code': "0000"}));
                var originalGroupName = scope.groupName;

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(originalGroupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.errorMessage).toBeUndefined();
                expect(scope.addGroupForm.$setPristine).toHaveBeenCalled();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
            });

            it('should add the beneficiary group and add selected beneficiaries into it', function () {
                scope.selectedBeneficiaries.push(expectedFormattedBeneficiaries[0]);
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.response(groupResponse, 200, {'x-sbg-response-code': "0000"}));
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.response({}, 200, {
                    'x-sbg-response-code': "0000",
                    'x-sbg-response-type': 'SUCCESS'
                }));
                var originalGroupName = scope.groupName;

                expectedFormattedBeneficiaries[0].recipientGroup = groups[0];
                expectedFormattedBeneficiaries[0].originalBeneficiary.recipientGroup = groups[0];

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(originalGroupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.errorMessage).toBeUndefined();
                expect(scope.addGroupForm.$setPristine).toHaveBeenCalled();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.selectedBeneficiaries.length).toEqual(0);
            });

            it('should not add beneficiary group when group name exists', function () {
                scope.isSuccessful = true;
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.reject({message: 'You already have a beneficiary group with this name. Please create a different beneficiary group name.'}));

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(scope.groupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.errorMessage).toEqual('You already have a beneficiary group with this name. Please create a different beneficiary group name.');
                expect(scope.isSuccessful).toBeFalsy();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.addGroupForm.$setPristine).not.toHaveBeenCalled();
            });

            it('should not add beneficiary group when maximum number of groups has been exceeded', function () {
                scope.isSuccessful = true;
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.reject({message: 'Group cannot be added as you are already at your maximum number of 30 groups.'}));

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(scope.groupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.errorMessage).toEqual('Group cannot be added as you are already at your maximum number of 30 groups.');
                expect(scope.isSuccessful).toBeFalsy();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.addGroupForm.$setPristine).not.toHaveBeenCalled();
            });

            it('should not add beneficiary group when group name exists and there is no response error message', function () {
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.reject({}, 200, {
                    'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "9999",
                    'x-sbg-response-message': ""
                }));

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(scope.groupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.errorMessage).toEqual('An error has occurred');
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.addGroupForm.$setPristine).not.toHaveBeenCalled();
            });

            it('should not add beneficiary group when an unspecified application error has occurred', function () {
                scope.isSuccessful = true;
                scope.addGroupForm = jasmine.createSpyObj('addGroupForm', ['$setPristine']);
                service.add.and.returnValue(mock.response({}, 500, {'x-sbg-response-type': "ERROR"}));

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(scope.groupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(scope.errorMessage).toEqual('An error has occurred');
                expect(scope.isSuccessful).toBeFalsy();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.addGroupForm.$setPristine).not.toHaveBeenCalled();
            });

            it('should redirect to the add group page when an unspecified error has occurred', function () {
                service.add.and.returnValue(mock.response({}, 500));

                scope.addGroup('Test Group');
                scope.$digest();

                expect(service.add).toHaveBeenCalledWith(scope.groupName, {
                    countryCode: 'ZA',
                    number: 12345,
                    type: '0'
                });
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/add');
                expect(scope.errorMessage).toEqual("An error has occurred");
            });

            it('should not have an inline spinner next to any group when adding a new group', function () {
                scope.currentGroup = {something: 'about a group'};
                service.add.and.returnValue(mock.reject({}, 200, {
                    'x-sbg-response-type': "ERROR",
                    'x-sbg-response-code': "9999"
                }));

                scope.addGroup('New Group being added');
                scope.$digest();

                expect(scope.currentGroup).toBeUndefined();
            });
        });

        it('should count number of members in group based on group name when both groups have beneficiaries', function () {
            cached.beneficiaryGroups[1].beneficiaries.push(beneficiaries[1]);
            scope.$apply();

            expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(1);
            expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(1);
        });

        it('should count number of members in group based on group name when one group has beneficiaries and the other does not', function () {
            cached.beneficiaryGroups[0].beneficiaries.push(beneficiaries[1]);
            scope.$apply();

            expect(scope.beneficiaryGroups[0].numberOfMembers).toEqual(2);
            expect(scope.beneficiaryGroups[1].numberOfMembers).toEqual(0);
        });
    });
});
