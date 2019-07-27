describe('Beneficiary Group Details', function () {
    beforeEach(module('refresh.beneficiaries.groups', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should use the correct controller to view group details', function () {
            expect(route.routes['/beneficiaries/groups/view/:name'].controller).toEqual('viewGroupDetailsController');
        });

        it('should use the correct template to view group details', function () {
            expect(route.routes['/beneficiaries/groups/view/:name'].templateUrl).toEqual('features/beneficiaries/partials/viewGroupDetails.html');
        });
    });

    describe('Controller', function () {
        var location, groupsService, beneficiariesService, mock, rootScope, scope, currentCard;
        var allGroups = [
            {
                "name": "Alegtest",
                "oldName": "Alegtest",
                "orderIndex": 0
            },
            {
                "name": "Groups Test",
                "oldName": "Groups Test",
                "orderIndex": 0
            }
        ];
        var allBeneficiaries = [];

        var setUp = function (routeParams, deleteGroupFail) {
            inject(function ($rootScope, $controller, _mock_) {
                mock = _mock_;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                var card = jasmine.createSpyObj('card', ['current']);
                location = jasmine.createSpyObj('$location', ['path']);
                groupsService = jasmine.createSpyObj('groupsService', ['listWithMembers', 'rename', 'deleteGroup']);
                beneficiariesService = jasmine.createSpyObj('beneficiariesService', ['changeBeneficiaryGroupMembership']);
                currentCard = {number: 'ABC123'};
                card.current.and.returnValue(currentCard);
                if(deleteGroupFail) {
                    groupsService.deleteGroup.and.returnValue(mock.reject({}));
                } else {
                    groupsService.deleteGroup.and.returnValue(mock.resolve({}));
                }
                groupsService.listWithMembers.and.returnValue(mock.resolve({beneficiaryList: allBeneficiaries, beneficiaryGroups: angular.copy(allGroups)}));

                $controller('viewGroupDetailsController', {$scope: scope, Card: card, GroupsService: groupsService, BeneficiariesService: beneficiariesService, $routeParams: routeParams, $location: location});
            });
        };

        describe('initialize', function () {
            it('should place beneficiary groups on the scope', function () {
                setUp({});
                scope.$digest();

                expect(scope.beneficiaryGroups).toEqual(allGroups);
            });

            it('should redirect to groups/list when selectedGroup is undefined', function () {
                setUp({});
                scope.$digest();

                expect(scope.selectedGroup).toEqual(undefined);
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/list');
            });

            it('should direct to /groups/list when group does not exist', function () {
                setUp({"name": 'non existing group'});
                scope.$digest();

                expect(scope.selectedGroup).toEqual(undefined);
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/list');
            });

            it('should have selectedGroup in scope when group exist', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.selectedGroup.name).toEqual('Alegtest');
                expect(scope.selectedGroup.oldName).toEqual('Alegtest');
                expect(scope.selectedGroup.orderIndex).toEqual(0);
            });

            it('should set isEditing to false', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.isEditing).toBeFalsy();
            });

            it('should set errorMessage and successMessage to undefined', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.errorMessage).toBeUndefined();
                expect(scope.successMessage).toBeUndefined();
            });

            it('should set errorMessage to undefined and isSuccessful to false', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.errorMessage).toBeFalsy();
                expect(scope.isSuccessful).toBeFalsy();
            });

            it('should set isRemovingMembers to false', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.isRemovingMembers).toBeFalsy();
            });

            it('should set hasMemberForRemoval to false', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.hasMembersForRemoval).toBeFalsy();
            });

            it('should have no selected members', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.membersForRemoval).toBeUndefined();
            });

            it('should set the isConfirmRemoval to false', function(){
                setUp({"name": 'Alegtest'});
                scope.$digest();

                expect(scope.isConfirmRemoval).toBeFalsy();
            });
        });

        describe('edit group name', function () {
            it('should set isEditing to true', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();
                scope.editGroupName();

                expect(scope.isEditing).toBeTruthy();
            });

            it('should set isSuccessful and errorMessage to undefined', function () {
                setUp({"name": 'Alegtest'});
                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };

                scope.errorMessage = 'asd';
                scope.isSuccessful = true;
                scope.$apply();

                scope.editGroupName();

                expect(scope.errorMessage).toBeFalsy();
                expect(scope.isSuccessful).toBeFalsy();
            });

            it('should set groupNewName to selectedGroup.name', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();
                scope.editGroupName();

                expect(scope.groupNewName).toEqual('Alegtest');
            });

        });

        describe('cancel edit group name', function () {
            it('should set isEditing to false', function () {
                setUp({"name": 'Alegtest'});
                scope.$digest();

                scope.editGroupName();
                scope.cancelEditingGroupName();
                expect(scope.isEditing).toBeFalsy();
            });
        });

        describe('save group name', function () {
            it('should set isEditing to false', function () {
                setUp({"name": 'Alegtest'});
                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };

                scope.isEditing = true;
                groupsService.rename.and.returnValue(mock.resolve({}));

                scope.saveGroup();

                expect(scope.isEditing).toBeFalsy();
            });

            it('should call rename with groupNewName and selectedGroup.name', function () {
                setUp({"name": 'Alegtest'});
                scope.groupNewName = 'New Name';
                scope.groupNewName = 'New Name';

                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };
                groupsService.rename.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));

                scope.saveGroup();

                expect(groupsService.rename).toHaveBeenCalledWith(scope.groupNewName, scope.selectedGroup.name, {number: 'ABC123'});
            });

            it('should resolve the promise and update selectedGroup and set isSuccessful to true', function () {
                setUp({"name": 'Alegtest'});
                scope.groupNewName = 'New Name';
                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };
                groupsService.rename.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));

                scope.saveGroup();
                scope.$apply();

                expect(scope.selectedGroup.oldName).toEqual('Alegtest');
                expect(scope.selectedGroup.name).toEqual('New Name');
                expect(scope.errorMessage).toBeFalsy();
                expect(scope.isSuccessful).toBeTruthy();
                expect(scope.successMessage).toEqual('Group has been successfully renamed.');
            });

            it('should reject the promise and set errorMessage and isSuccessful', function () {
                setUp({"name": 'Alegtest'});
                scope.groupNewName = 'New Name';
                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };
                groupsService.rename.and.returnValue(mock.reject({'message': 'Some error message'}));

                scope.saveGroup();
                scope.$apply();

                expect(scope.isSuccessful).toBeFalsy();
                expect(scope.errorMessage).toEqual('Some error message');
            });

            it('should update the group name associated with each beneficiary', function(){
                setUp({"name": 'oldgroup'});
                scope.$digest();
                scope.groupNewName = 'New Name';
                var selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1,
                    "beneficiaries": [{
                        recipientId: 1,
                            originalBeneficiary: {
                                recipientGroup: {
                                    "name": "oldgroup",
                                    "oldName": null,
                                    "orderIndex": 0
                                }
                            }
                    }]
                };
                scope.beneficiaryGroups[0] = selectedGroup;
                scope.selectedGroup = selectedGroup;
                groupsService.rename.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));

                scope.saveGroup();
                scope.$apply();

                expect(scope.selectedGroup.beneficiaries[0].originalBeneficiary.recipientGroup.name).toEqual('New Name');
            });

            it('should not allow duplicates group name when editing beneficiary groups', function(){
                setUp({"name": 'Groups Test'});
                scope.$digest();

                scope.groupNewName = 'Alegtest';
                groupsService.rename.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));
                expect(scope.errorMessage).toBeUndefined();
                scope.saveGroup();

                expect(groupsService.rename).not.toHaveBeenCalled();
                expect(scope.errorMessage).toEqual('You already have a beneficiary group with this name.');
            });
        });

        describe('amendBeneficiariesGroup', function () {
            var initialGroup, expectedGroup, request;
            beforeEach(function () {
                setUp({'name': 'Alegtest'});
                scope.$digest();
                initialGroup = {
                    "name": "Alegtest",
                    "oldName": null,
                    "orderIndex": 1
                };
                expectedGroup = {
                    "name": null,
                    "oldName": "Alegtest",
                    "orderIndex": 0
                };
                scope.membersForRemoval = [
                    {'name': 'CJ', "recipientGroup": initialGroup},
                    {'name': 'Faris', "recipientGroup": initialGroup}
                ];

                request = [
                    {'name': 'CJ', "recipientGroup": expectedGroup},
                    {'name': 'Faris', "recipientGroup": expectedGroup}
                ];
            });

            it('resets notification flags', function(){
                spyOn(scope, 'resetNotificationFlags');
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));
                scope.amendBeneficiariesGroup();
                expect(scope.resetNotificationFlags).toHaveBeenCalled();
            });

            it('should call addMultiple with correct argument', function () {
                scope.selectedGroup = {beneficiaries: [{recipientId: 1}, {recipientId: 2}, {recipientId: 3}]};
                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));
                scope.amendBeneficiariesGroup();
                scope.$digest();

                expect(beneficiariesService.changeBeneficiaryGroupMembership).toHaveBeenCalledWith(request, { number: 'ABC123' });
            });

            it('should resolve promise and remove the beneficiaries from scope', function () {
                scope.selectedGroup = {beneficiaries: [{recipientId: 1}, {recipientId: 2}, {recipientId: 3}]};
                scope.isRemovingMembers = true;
                scope.isConfirmRemoval = true;
                scope.isSuccessful = false;
                scope.membersForRemoval = [
                    {recipientId: 1, "recipientGroup": initialGroup, name: 'CJ'},
                    {recipientId: 2, "recipientGroup": initialGroup, name: 'Faris'}
                ];

                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.resolve(200, {}, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'}));

                scope.amendBeneficiariesGroup();
                scope.$digest();

                expect(scope.selectedGroup.beneficiaries).toEqual([{recipientId: 3}]);
                expect(scope.isRemovingMembers).toBeFalsy();
                expect(scope.membersForRemoval).toBeUndefined();
                expect(scope.isConfirmRemoval).toBeFalsy();
                expect(scope.isSuccessful).toBeTruthy();
                expect(scope.successMessage).toEqual('Member(s) have been successfully removed from group.');
            });

            it('should reject promise and remove the beneficiaries from scope', function () {
                scope.selectedGroup = {beneficiaries: [{recipientId: 1}, {recipientId: 2}, {recipientId: 3}]};
                scope.isRemovingMembers = true;
                scope.membersForRemoval = [
                    {recipientId: 1, recipientGroup: initialGroup, name: 'CJ'},
                    {recipientId: 2, recipientGroup: initialGroup, name: 'Faris'}
                ];

                beneficiariesService.changeBeneficiaryGroupMembership.and.returnValue(mock.reject({'message': 'An error has occurred'}));

                scope.amendBeneficiariesGroup();
                scope.$digest();

                expect(scope.selectedGroup.beneficiaries).toEqual([{recipientId: 1}, {recipientId: 2}, {recipientId: 3}]);
                expect(scope.isRemovingMembers).toBeTruthy();
                expect(scope.membersForRemoval).toEqual([
                    {recipientId: 1, "recipientGroup": initialGroup, name: 'CJ'},
                    {recipientId: 2, "recipientGroup": initialGroup, name: 'Faris'}
                ]);
                expect(scope.errorMessage).toEqual('An error has occurred');
            });

        });

        describe('remove group members', function () {
            it('set isRemovingMembers to true', function () {
                setUp({'name': 'Alegtest'});
                scope.isRemovingMembers = false;

                scope.removeMembers();
                scope.$apply();

                expect(scope.isRemovingMembers).toBeTruthy();
            });
            it('resets the error flag', function() {
                scope.errorMessage = 'asd';
                scope.removeMembers();
                expect(scope.errorMessage).toBeFalsy();
            });
            it('resets the success flag', function() {
                scope.isSuccessful = true;
                scope.removeMembers();
                expect(scope.isSuccessful).toBeFalsy();
            });
        });

        describe('cancel remove group members', function () {

            it('should set isRemovingMemebers to false', function () {
                setUp({'name': 'Alegtest'});
                scope.isRemovingMembers = true;
                scope.isConfirmRemoval = true;

                scope.cancelRemoveMembers();
                scope.$apply();

                expect(scope.isRemovingMembers).toBeFalsy();
                expect(scope.isConfirmRemoval).toBeFalsy();
            });

            it('should set membersForRemoval to undefined', function () {
                setUp({'name': 'Alegtest'});
                scope.membersForRemoval = ['CJ', 'Faris', 'Mmathabo'];

                scope.cancelRemoveMembers();
                scope.$apply();

                expect(scope.membersForRemoval).toBeUndefined();
            });

            it('should set hasMembersForRemoval to false', function () {
                setUp({'name': 'Alegtest'});
                scope.hasMembersForRemoval = true;

                scope.cancelRemoveMembers();
                scope.$apply();

                expect(scope.hasMembersForRemoval).toBeFalsy();
            });
            it('should reset flag notification', function(){
                setUp({'name': 'Alegtest'});
                scope.errorMessage = 'asd';
                scope.isSuccessful = true;

                scope.cancelRemoveMembers();

                expect(scope.errorMessage).toBeFalsy();
                expect(scope.isSuccessful).toBeFalsy();
            });
        });

        describe('toggleSelected', function () {
            beforeEach(function () {
                this.tempBeneficiaries = allBeneficiaries;
                this.tempGroups = allGroups;
                allBeneficiaries = [
                    {recipientId: 12345, originalBeneficiary: {name: 'CJ'}},
                    {recipientId: 5678, originalBeneficiary: {name: 'Faris'}}];
                allGroups[0].beneficiaries = allBeneficiaries;
                setUp({'name': 'Alegtest'});
                scope.$digest();
            });

            afterEach(function () {
                allBeneficiaries = this.tempBeneficiaries;
                allGroups = this.tempGroups;
            });

            it('should add member to membersForRemoval', function () {
                scope.toggleSelected(12345);
                scope.$apply();

                expect(scope.membersForRemoval).toEqual([
                    {name: 'CJ'}
                ]);
            });

            it('should prepend to the selected list', function () {
                scope.membersForRemoval = [
                    {name: 'CJ'}
                ];

                scope.toggleSelected(5678);
                scope.$apply();

                expect(scope.membersForRemoval).toEqual([
                    {name: 'Faris'},
                    {name: 'CJ'}
                ]);

            });

            it('should remove member from membersForRemoval', function () {
                scope.toggleSelected(12345);
                scope.$apply();

                expect(scope.membersForRemoval).toEqual([
                    {name: 'CJ'}
                ]);

                scope.toggleSelected(12345);
                scope.$apply();

                expect(scope.membersForRemoval).toEqual([]);
            });

            it('should set hasMembersForRemoval to true when the membersForRemoval list has members', function () {
                expect(scope.hasMembersForRemoval).toBeFalsy();

                scope.toggleSelected(12345);
                scope.$apply();

                expect(scope.hasMembersForRemoval).toBeTruthy();
            });

            it('should set hasMembersForRemoval to false when the membersForRemoval list has no members', function () {
                expect(scope.hasMembersForRemoval).toBeFalsy();

                scope.toggleSelected(12345);
                scope.$apply();

                scope.toggleSelected(12345);
                scope.$apply();

                expect(scope.hasMembersForRemoval).toBeFalsy();
            });
        });

        describe('hasMember', function () {
            it('should return true when has member in membersForRemoval', function () {
                setUp({'name': 'Alegtest'});
                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };
                scope.membersForRemoval = [
                    {'recipientId': 12345}
                ];
                var result = scope.hasMember(12345);
                scope.$apply();

                expect(result).toBeTruthy();
            });

            it('should return false when has member not in membersForRemoval', function () {
                setUp({'name': 'Alegtest'});
                scope.selectedGroup = {
                    "name": 'Alegtest',
                    "oldName": 'Alegtest',
                    "orderIndex": 1
                };
                scope.membersForRemoval = [
                    {'recipientId': 12345}
                ];
                var result = scope.hasMember(98745);
                scope.$apply();

                expect(result).toBeFalsy();
            });

        });

       describe('pay beneficiary group', function () {
            it('should redirect to the pay multiple page', function () {
                setUp({});
                scope.payBeneficiaryGroup({name: 'test', beneficiaries: ['foo']});
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/pay-group/test');
            });

            it('should not redirect to the pay multiple page if the group is empty', function () {
                setUp({});
                location.path('/foo');
                scope.payBeneficiaryGroup({name: 'test', beneficiaries: []});
                expect(location.path).toHaveBeenCalledWith('/foo');
            });
        });

        describe('#isEmptyGroup', function () {
            it('should know a group may be empty', function () {
                expect(scope.isEmptyGroup({beneficiaries: []})).toBeTruthy();
            });

            it('should return true if group is undefined', function () {
                expect(scope.isEmptyGroup(undefined)).toBeTruthy();
            });

            it('should know a group may be populated', function () {
                expect(scope.isEmptyGroup({beneficiaries: ['foo']})).toBeFalsy();
            });
        });

        describe('delete group', function () {

            it('should set the cancel a deletion', function () {
                setUp({});
                scope.beingDeleted = true;
                scope.deletionError = true;
                scope.cancelDeletion();
                expect(scope.beingDeleted).toBeFalsy();
                expect(scope.deletionError).toBeNull();
            });

            it('should mark the group for deletion', function () {
                scope.beingDeleted = false;
                scope.markForDeletion();
                expect(scope.beingDeleted).toBeTruthy();
            });

            it('should call delete group on the group service with the selected group and the current card', function () {
                setUp({});
                scope.$digest();
                var selectedGroup = {};
                scope.selectedGroup = selectedGroup;

                scope.confirmDeletion();

                expect(groupsService.deleteGroup).toHaveBeenCalledWith(selectedGroup, currentCard); // with selectedGroup card
            });

            it('should redirect to the beneficiary list page when successfully deleting', function (done) {
                setUp({});
                scope.$digest();

                scope.selectedGroup = {};

                scope.confirmDeletion();
                scope.$digest();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/groups/list');
                done();
            });

            it('should display an error message when can not delete the group', function () {
                setUp({}, true);
                scope.$digest();
                scope.confirmDeletion();
                scope.$digest();
                expect(scope.deletionError).toBeTruthy();
            });
        });
    });
});
