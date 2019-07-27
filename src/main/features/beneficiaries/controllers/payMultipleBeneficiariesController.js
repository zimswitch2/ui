(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/beneficiaries/pay-multiple', {
            templateUrl: 'features/beneficiaries/partials/payMultiple.html',
            controller: 'PayMultipleBeneficiariesController'
        });
        $routeProvider.when('/beneficiaries/pay-multiple/confirm', {
            templateUrl: 'features/beneficiaries/partials/payMultipleConfirmation.html',
            controller: 'PayMultipleBeneficiariesController'
        });
        $routeProvider.when('/beneficiaries/pay-multiple/results', {
            templateUrl: 'features/beneficiaries/partials/payMultipleResults.html',
            controller: 'PayMultipleBeneficiariesController'
        });
    });

    app.controller('PayMultipleBeneficiariesController',
        function ($scope, $filter, $location, BaseMultipleBeneficiaries) {
            BaseMultipleBeneficiaries.setupScope($scope);

            $scope.next = function () {
                $location.path('/beneficiaries/pay-multiple/confirm');
            };

            $scope.confirm = function () {
                $scope.confirmAndRedirectTo('/beneficiaries/pay-multiple/results');
            };

            $scope.filteredBeneficiariesList = function () {
                return $filter('beneficiaryFilter')($scope.beneficiaries, $scope.query, true);
            };

            $scope.beneficiaryList = function () {
                if ($scope.beneficiaries === undefined || $scope.beneficiaries.length === 0) {
                    $scope.informationMessage = "There are no beneficiaries linked to your profile.";
                    return [];
                }

                var filteredList = $scope.filteredBeneficiariesList();

                if (filteredList.length === 0) {
                    $scope.informationMessage = "No matches found.";
                } else {
                    $scope.informationMessage = null;
                }

                if ($scope.isNonEmptySearchQuery()) {
                    return _.sortBy(_.union(filteredList, $scope.findBeneficiariesWithAmount()), function (beneficiary) {
                        return _.contains(_.keys($scope.amounts), beneficiary.recipientId.toString());
                    });
                }
                return filteredList;
            };
        });

})(angular.module('refresh.beneficiaries.pay.multiple.beneficiaries.controller',
    ['ngRoute', 'refresh.beneficiaries.base.multiple.beneficiaries', 'refresh.beneficiaries.filters.beneficiaryFilter']));

