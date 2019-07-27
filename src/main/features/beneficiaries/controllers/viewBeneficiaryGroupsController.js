(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/groups/add', {
            templateUrl: 'features/beneficiaries/partials/addGroup.html',
            controller: 'ViewBeneficiaryGroupsController'
        });
    });

    app.controller('ViewBeneficiaryGroupsController', function ($scope, $sorter, $location, GroupsService,
                                                                BeneficiariesState, ApplicationParameters,
                                                                Card, BeneficiariesService) {
        $scope.sortBy = $sorter;
        $scope.sortBy('name');
        $scope.shouldDisplayGroupPage = false;
        $scope.shouldDisplayBeneficiariesPage = true;
        $scope.selectedBeneficiaries = [];
        $scope.beneficiaryGroups = [];
        $scope.canClick = false;
        $scope.displayClass = '';

        GroupsService.listWithMembers(Card.current()).then(function (beneficiaryData) {
            $scope.beneficiaryList = beneficiaryData.beneficiaryList;
            $scope.beneficiaryGroups = _.map(beneficiaryData.beneficiaryGroups, function (group) {
                group.numberOfMembers = group.beneficiaries.length;
                return group;
            });
        });

        $scope.numberOfMembers = function (group) {
            var memberCount = 0;
            _.map($scope.beneficiaryList, function (originalBeneficiary) {
                if (originalBeneficiary.recipientGroupName === group.name) {
                    memberCount = memberCount + 1;
                }
            });

            return memberCount;
        };

        function modifyBeneficiaryGroupToOld() {
            _.map($scope.selectedBeneficiaries, function (originalBeneficiary) {
                originalBeneficiary.originalBeneficiary.recipientGroup = originalBeneficiary.oldGroup;
                originalBeneficiary.selectedClass = 'selected';
                return originalBeneficiary;
            });
        }

        function updateBeneficiaryGroupMemberNumber(beneficiaryGroup) {
            $scope.selectedBeneficiaries = _.map($scope.selectedBeneficiaries, function (originalBeneficiary) {
                beneficiaryGroup.numberOfMembers = beneficiaryGroup.numberOfMembers + 1;
                originalBeneficiary.recipientGroupName = beneficiaryGroup.name;
                originalBeneficiary.canSelect = false;
                return originalBeneficiary;
            });
        }

        function error(errorMessage) {
            if (!errorMessage || errorMessage === undefined || errorMessage === '') {
                errorMessage = 'An error has occurred';
            }
            $scope.isSuccessful = false;
            $scope.errorMessage = errorMessage;
            $scope.showBeneficiariesPage();
            $location.path('/beneficiaries/groups/add');
        }

        $scope.showGroupPage = function () {
            $scope.shouldDisplayGroupPage = true;
            $scope.shouldDisplayBeneficiariesPage = false;
        };

        $scope.showBeneficiariesPage = function () {
            $scope.shouldDisplayGroupPage = false;
            $scope.shouldDisplayBeneficiariesPage = true;
        };

        $scope.addGroupMemberNumber = function () {
            $scope.beneficiaryGroups = _.map($scope.beneficiaryGroups, function (originalGroup) {
                _.map($scope.selectedBeneficiaries, function (selectedBeneficiary) {
                    if (selectedBeneficiary.recipientGroupName !== undefined &&
                        selectedBeneficiary.recipientGroupName === originalGroup.name &&
                        selectedBeneficiary.oldGroup.name !== selectedBeneficiary.recipientGroupName) {
                        originalGroup.numberOfMembers++;
                    }
                });
                return originalGroup;
            });
        };

        $scope.decrementGroupMemberNumber = function () {
            $scope.beneficiaryGroups = _.map($scope.beneficiaryGroups, function (originalGroup) {
                _.map($scope.selectedBeneficiaries, function (selectedBeneficiary) {

                    if (selectedBeneficiary.oldGroup !== undefined &&
                        selectedBeneficiary.oldGroup.name === originalGroup.name) {
                        originalGroup.numberOfMembers--;
                    }
                });
                return originalGroup;
            });
        };

        $scope.clearNotifications = function () {
            angular.element('.notification').addClass('closing');
            $scope.isSuccessful = false;
            $scope.errorMessage = undefined;
        };

        $scope.selectBeneficiary = function (beneficiary) {
            $scope.clearNotifications();
            var selectedBeneficiaries = $scope.selectedBeneficiaries;
            var currentBeneficiaryIndex = selectedBeneficiaries.indexOf(beneficiary);
            $scope.canClick = false;
            $scope.displayClass = '';

            if (currentBeneficiaryIndex > -1) {
                beneficiary.selectedClass = '';
                selectedBeneficiaries.splice(currentBeneficiaryIndex, 1);
            } else {
                beneficiary.selectedClass = 'selected';
                selectedBeneficiaries.push(beneficiary);
            }

            if (selectedBeneficiaries.length > 0) {
                $scope.canClick = true;
                $scope.displayClass = 'can-add';
            }
            $scope.selectedBeneficiaries = selectedBeneficiaries;
        };

        $scope.amendBeneficiariesGroup = function (beneficiaryGroup) {
            $scope.currentGroup = beneficiaryGroup;

            var modifiedBeneficiaryGroup = {
                'name': beneficiaryGroup.name,
                'orderIndex': beneficiaryGroup.orderIndex
            };

            var selectedBeneficiaries = $scope.selectedBeneficiaries;

            $scope.selectedBeneficiaries = _.map(selectedBeneficiaries, function (originalBeneficiary) {

                originalBeneficiary.oldGroup = originalBeneficiary.originalBeneficiary.recipientGroup;
                originalBeneficiary.recipientGroup = modifiedBeneficiaryGroup;
                originalBeneficiary.originalBeneficiary.recipientGroup = modifiedBeneficiaryGroup;
                originalBeneficiary.selectedClass = '';
                return originalBeneficiary;
            });

            var originalBeneficiaries = _.map($scope.selectedBeneficiaries, function (originalBeneficiary) {
                return originalBeneficiary.originalBeneficiary;
            });

            BeneficiariesService.changeBeneficiaryGroupMembership(originalBeneficiaries, Card.current()).then(function () {
                updateBeneficiaryGroupMemberNumber(beneficiaryGroup);
                $scope.errorMessage = undefined;
                $scope.isSuccessful = true;
                $scope.successMessage = 'Beneficiary has been successfully added to group.';
                $scope.selectedBeneficiaries = [];
                $scope.canClick = false;
                $scope.displayClass = '';
                $scope.decrementGroupMemberNumber();
                $scope.showBeneficiariesPage();
                $location.path('/beneficiaries/groups/add');
            }, function (_error) {
                error(_error.message);

                modifyBeneficiaryGroupToOld();
            });
        };

        $scope.addGroup = function () {
            $scope.currentGroup = undefined;
            $scope.clearNotifications();
            GroupsService.add($scope.groupName, Card.current()).then(function () {
                $scope.beneficiaryGroups.push({
                    'name': $scope.groupName,
                    'oldName': null,
                    'orderIndex': '1',
                    'numberOfMembers': 0,
                    'highlightClass': 'highlight'
                });

                var latestBeneficiaryGroup = _.find($scope.beneficiaryGroups, function (beneficiaryGroup) {
                    return beneficiaryGroup.name === $scope.groupName;
                });

                _.remove($scope.beneficiaryGroups, function (beneficiaryGroup) {
                    return beneficiaryGroup.name === $scope.groupName;
                });

                $scope.beneficiaryGroups.splice(0, 0, latestBeneficiaryGroup);
                $scope.sortBy('');

                angular.element('.group-list ul').scrollTop(0);

                $scope.errorMessage = undefined;
                $scope.groupName = '';
                $scope.addGroupForm.$setPristine();

                if ($scope.selectedBeneficiaries.length > 0) {
                    $scope.amendBeneficiariesGroup(latestBeneficiaryGroup);
                }
            }, function (_error) {
                error(_error.message);
            });
            $location.path('/beneficiaries/groups/add');
        };
    });

})(angular.module('refresh.beneficiaries.controllers.viewBeneficiaryGroups', ['ngRoute', 'refresh.sorter', 'refresh.beneficiaries.beneficiariesService']));