(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/pay-group/confirm/:groupName', {
            templateUrl: 'features/beneficiaries/partials/payMultipleConfirmation.html',
            controller: 'PayBeneficiaryGroupController'
        });
        $routeProvider.when('/beneficiaries/pay-group/results/:groupName', {
            templateUrl: 'features/beneficiaries/partials/payMultipleResults.html',
            controller: 'PayBeneficiaryGroupController'
        });
        $routeProvider.when('/beneficiaries/pay-group/:groupName', {
            templateUrl: 'features/beneficiaries/partials/payGroup.html',
            controller: 'PayBeneficiaryGroupController'
        });
    });

    app.controller('PayBeneficiaryGroupController',
        function ($scope, $routeParams, $location, BaseMultipleBeneficiaries) {
            BaseMultipleBeneficiaries.setupScope($scope);

            $scope.groupOnly = function () {
                return true;
            };

            $scope.next = function () {
                $location.path('/beneficiaries/pay-group/confirm/' + $routeParams.groupName);
            };

            $scope.confirm = function () {
                $scope.confirmAndRedirectTo('/beneficiaries/pay-group/results/' + $routeParams.groupName);
            };

            $scope.filteredBeneficiariesList = function () {
                return _.where($scope.beneficiaries, {'recipientGroupName': $routeParams.groupName});
            };

            $scope.beneficiaryList = function () {
                return $scope.filteredBeneficiariesList();
            };

        });

})(angular.module('refresh.beneficiaries.pay.beneficiary.group.controller',
    ['ngRoute', 'refresh.beneficiaries.base.multiple.beneficiaries']));
