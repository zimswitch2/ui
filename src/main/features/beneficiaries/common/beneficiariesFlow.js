(function (app) {
    'use strict';

    app.factory('BeneficiariesFlow', function () {

        var preventNavigationFromOtpPage = function ($scope, $location) {
            $scope.$on('$routeChangeSuccess', function (event, currentUrl, oldUrl) {
                if (!$scope.errorMessage && oldUrl.originalPath.indexOf('/otp/verify') !== -1) {
                    $location.path(oldUrl.originalPath);
                }
            });
        };

        return {
            setUpBeneficiaryFlow: function setUpBeneficiaryFlow($scope, BeneficiaryFlowService, BeneficiariesState, beneficiary, heading, $location, CdiService, GroupsService) {
                $scope.errorMessage = BeneficiariesState.errorMessage;
                $scope.editBeneficiary = BeneficiariesState.editBeneficiary;

                BeneficiaryFlowService.initialize(beneficiary, heading);

                $scope.card = BeneficiariesState.card;
                $scope.beneficiary = BeneficiariesState.modifiedBeneficiary;
                $scope.editing = BeneficiariesState.editing;

                preventNavigationFromOtpPage($scope, $location);

                var makeBeneficiaryGroupsListAvailable = GroupsService.list($scope.card).then(function (response) {
                    $scope.beneficiaryGroups = _.map(response.data.groups, function (originalGroup) {
                        originalGroup.label = function () {
                            return originalGroup.name;
                        };
                        originalGroup.oldName = undefined;
                        return originalGroup;
                    });
                });

                var makeCdiListAvailable = CdiService.list().then(function (cdi) {
                    $scope.cdi = _.map(cdi, function (listedBeneficiary) {
                        listedBeneficiary.label = function () {
                            return listedBeneficiary.name;
                        };
                        return listedBeneficiary;
                    });
                });

                return makeCdiListAvailable.then(makeBeneficiaryGroupsListAvailable);
            },

            setConfirmScope: function ($scope, BeneficiaryFlowService, BeneficiariesState, redirectLocation, beneficiary, card) {

                BeneficiaryFlowService.confirm(beneficiary, card, redirectLocation).then(function () {
                    $scope.editing = BeneficiariesState.editing;
                    $scope.errorMessage = BeneficiariesState.errorMessage;
                    if ($scope.errorMessage) {
                        BeneficiariesState.paymentConfirmation = $scope.beneficiary.paymentConfirmation.confirmationType !== 'None';
                    }
                });
            }
        };
    });

}(angular.module('refresh.beneficiaries.flow', [])));