(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/groups/list', {
            templateUrl: 'features/beneficiaries/partials/viewGroups.html',
            controller: 'ListBeneficiaryGroupsController'
        });
        $routeProvider.when('/beneficiaries/groups/view/:name', {
            templateUrl: 'features/beneficiaries/partials/viewGroupDetails.html',
            controller: 'viewGroupDetailsController'
        });
    });

    app.controller('ListBeneficiaryGroupsController', function ($scope, $sorter, $location, Card, GroupsService, $q) {
        GroupsService.listWithMembers(Card.current())
            .then(function (beneficiaryData) {
                $scope.beneficiaryGroups = beneficiaryData.beneficiaryGroups;
            });

        $scope.sortBy = $sorter;
        $scope.sortBy('name');
        $scope.sortArrowClass = function (criteria) {
            return "icon icon-sort" + (this.sort.criteria === criteria ? " active" : "");
        };

        $scope.isBeingDeleted = function (group) {
            return group.name === $scope.beingDeleted;
        };

        $scope.markForDeletion = function (group) {
            $scope.beingDeleted = group;
        };

        $scope.confirmDeleteMessage = function (beingDeleted) {
            return "Delete " + beingDeleted.name + "? Any beneficiaries in this group will remain in your profile";
        };

        $scope.errorDeleteMessage = function (beingDeleted) {
            return "Couldn't delete beneficiary " + beingDeleted.name + ". Please try again later.";
        };

        $scope.delete = function (group) {
            var deferred = $q.defer();
            GroupsService.deleteGroup(group, Card.current())
                .then(function () {
                    _.remove($scope.beneficiaryGroups, function (g) {
                        return g.name === group.name;
                    });
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
            return deferred.promise;
        };

        $scope.go = function (url, id) {
            $location.path(url + id);
        };

        $scope.payBeneficiaryGroup = function (group) {
            if (!$scope.isEmptyGroup(group)) {
                $location.path('/beneficiaries/pay-group/' + group.name);
            }
        };

        $scope.isEmptyGroup = function (group) {
            return group.beneficiaries.length === 0;
        };
    });

    app.controller('viewGroupDetailsController', function ($scope, $sorter, $routeParams, $location, Card,
                                                           GroupsService, BeneficiariesService) {
        $scope.resetNotificationFlags = function () {
            $scope.errorMessage = undefined;
            $scope.isSuccessful = false;
        };

        $scope.isEditing = false;
        $scope.errorMessage = undefined;
        $scope.successMessage = undefined;
        $scope.resetNotificationFlags();
        $scope.isRemovingMembers = false;
        $scope.hasMembersForRemoval = false;
        $scope.membersForRemoval = undefined;
        $scope.isConfirmRemoval = false;

        GroupsService.listWithMembers(Card.current())
            .then(function (beneficiaryData) {
                $scope.beneficiaryGroups = beneficiaryData.beneficiaryGroups;

                $scope.selectedGroup = _.find($scope.beneficiaryGroups, {'name': $routeParams.name});
                if ($scope.selectedGroup === undefined) {
                    $location.path('/beneficiaries/groups/list');
                }
            });

        $scope.payBeneficiaryGroup = function (group) {
            if (!$scope.isEmptyGroup(group)) {
                $location.path('/beneficiaries/pay-group/' + group.name);
            }
        };

        $scope.isEmptyGroup = function (group) {
            if (group) {
                return group.beneficiaries.length === 0;
            } else {
                return true;
            }
        };

        $scope.editGroupName = function () {
            $scope.isEditing = true;
            $scope.groupNewName = $scope.selectedGroup.name;
            $scope.resetNotificationFlags();
        };

        $scope.cancelEditingGroupName = function () {
            $scope.isEditing = false;
        };

        $scope.saveGroup = function () {
            $scope.isEditing = false;
            var groupNameFound = _.find($scope.beneficiaryGroups, function (groupName) {
                return $scope.groupNewName === groupName.name;
            });

            if (groupNameFound) {
                $scope.errorMessage = 'You already have a beneficiary group with this name.';
            } else {
                GroupsService.rename($scope.groupNewName, $scope.selectedGroup.name, Card.current())
                    .then(function () {
                        $scope.selectedGroup.oldName = $scope.selectedGroup.name;
                        $scope.selectedGroup.name = $scope.groupNewName;
                        $scope.successMessage = 'Group has been successfully renamed.';
                        $scope.isSuccessful = true;

                        _.map($scope.selectedGroup.beneficiaries, function (beneficiary) {
                            beneficiary.originalBeneficiary.recipientGroup.name = $scope.groupNewName;
                        });

                    }, function (error) {
                        $scope.errorMessage = error.message;
                    });
            }
        };

        $scope.confirmDeletion = function () {
            GroupsService.deleteGroup($scope.selectedGroup, Card.current()).then(function () {
                $location.path('/beneficiaries/groups/list');
            }, function () {
                $scope.deletionError = true;
            });
        };

        $scope.markForDeletion = function () {
            $scope.beingDeleted = true;
        };

        $scope.cancelDeletion = function () {
            $scope.beingDeleted = false;
            $scope.deletionError = null;
        };

        $scope.removeMembers = function () {
            $scope.isRemovingMembers = true;
            $scope.resetNotificationFlags();
        };

        $scope.cancelRemoveMembers = function () {
            $scope.isRemovingMembers = false;
            $scope.hasMembersForRemoval = false;
            $scope.membersForRemoval = undefined;
            $scope.isConfirmRemoval = false;
            $scope.resetNotificationFlags();
        };

        $scope.toggleSelected = function (memberId) {
            var selectedBeneficiary = _.find($scope.selectedGroup.beneficiaries, {recipientId: memberId});
            $scope.membersForRemoval = _.xor([selectedBeneficiary.originalBeneficiary], $scope.membersForRemoval);
            $scope.hasMembersForRemoval = $scope.membersForRemoval.length > 0;
        };

        $scope.hasMember = function (memberId) {
            var member = _.find($scope.membersForRemoval, {recipientId: memberId});
            return member !== undefined;
        };

        $scope.amendBeneficiariesGroup = function () {
            $scope.resetNotificationFlags();
            var removeMembersRequest = _.map($scope.membersForRemoval, function (beneficiary) {
                var oldName = beneficiary.recipientGroup.name;
                var newBeneficiary = _.clone(beneficiary);
                var newGroup = _.clone(beneficiary.recipientGroup);

                newGroup.name = null;
                newGroup.oldName = oldName;
                newGroup.orderIndex = 0;

                newBeneficiary.recipientGroup = newGroup;

                return newBeneficiary;
            });
            BeneficiariesService.changeBeneficiaryGroupMembership(removeMembersRequest, Card.current()).then(function () {
                _.map($scope.membersForRemoval, function (beneficiary) {
                    _.remove($scope.selectedGroup.beneficiaries, {recipientId: beneficiary.recipientId});
                });
                $scope.isRemovingMembers = false;
                $scope.membersForRemoval = undefined;
                $scope.isConfirmRemoval = false;
                $scope.isSuccessful = true;
                $scope.successMessage = 'Member(s) have been successfully removed from group.';
            }, function (error) {
                $scope.errorMessage = error.message;
            });
        };
    });
})(angular.module('refresh.beneficiaries.groups', ['refresh.beneficiaries', 'refresh.beneficiaries.beneficiariesService', 'refresh.beneficiaries.groupsService', 'ngRoute', 'refresh.configuration', 'refresh.parameters', 'refresh.filters', 'refresh.navigation', 'refresh.sorter', 'refresh.mcaHttp']));
