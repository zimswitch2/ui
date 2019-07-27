(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/view/:recipientId', {
            templateUrl: 'features/beneficiaries/partials/viewBeneficiaryDetails.html',
            controller: 'ViewBeneficiaryDetailsController'
        });
    });

    app.controller('ViewBeneficiaryDetailsController', function ($scope, $routeParams, $sorter, $location,
                                                                 BeneficiariesListService, Card,
                                                                 BeneficiariesState, BeneficiariesService,
                                                                 BeneficiaryPayment) {

        $scope.sortBy = $sorter;
        $scope.beneficiary = null;

        BeneficiariesListService.formattedBeneficiaryList(Card.current()).then(function (beneficiaries) {
            var recipientId = parseInt($routeParams.recipientId);
            return $scope.beneficiary = _.find(beneficiaries, {'recipientId': recipientId});
        });

        $scope.sortBy('nextPaymentDate');

        $scope.payBeneficiary = function (beneficiary) {
            BeneficiaryPayment.start(beneficiary);
            $location.path('/payment/beneficiary');
        };

        $scope.edit = function (beneficiary) {
            $scope.editBeneficiary = true;
            $scope.beneficiary = beneficiary;
            BeneficiariesState.editBeneficiary = $scope.editBeneficiary;
            BeneficiariesState.beneficiary = $scope.beneficiary;
            $location.path('/beneficiaries/edit');
        };

        $scope.markForDeletion = function () {
            $scope.beingDeleted = true;
        };

        $scope.cancelDeletion = function () {
            $scope.beingDeleted = false;
            $scope.deletionError = null;
        };

        $scope.confirmDeletion = function () {
            BeneficiariesService.deleteBeneficiary($scope.beneficiary.originalBeneficiary,
                Card.current()).then(function () {
                    $location.path('/beneficiaries/list');
                }, function () {
                    $scope.deletionError = true;
                });
        };

        $scope.isPrivateBeneficiary = function () {
            return $scope.beneficiary && $scope.beneficiary.originalBeneficiary &&
                $scope.beneficiary.originalBeneficiary.beneficiaryType === 'PRIVATE';
        };
    });

})(angular.module('refresh.beneficiaries.controllers.viewBeneficiaryDetails', ['ngRoute', 'refresh.sorter', 'refresh.payment']));
