(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentBeneficiaryDetailsController',
        [
            'refresh.flow',
            'refresh.lookups',
            'refresh.internationalPayment.domain.internationalPaymentBeneficiary',
            'refresh.internationalPayment.domain.internationalPaymentCustomer'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/beneficiary/details', {
            controller: 'InternationalPaymentBeneficiaryDetailsController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentBeneficiaryDetails.html'
        });
    });

    module.controller('InternationalPaymentBeneficiaryDetailsController',
        function ($scope, $location, LookUps, Flow, capitalizeFilter, InternationalPaymentBeneficiary, InternationalPaymentService, InternationalPaymentCustomer) {
            $scope.beneficiary = InternationalPaymentBeneficiary.current();
            $scope.customerDetails = InternationalPaymentCustomer.customer();

            $scope.beneficiaryTypes = LookUps.beneficiaryType.values();

            InternationalPaymentService.getCountries(InternationalPaymentCustomer.customer().isResident(), "ZA").then(function (countries) {
                $scope.countries = _.map(countries, function (country) {
                    country.label = function () {
                        return capitalizeFilter(country.name);
                    };

                    return country;
                });
            });

            $scope.beneficiaryTypeChanged = function () {
                if($scope.beneficiary.type === 'ENTITY'){
                    $scope.beneficiary.firstName = undefined;
                    $scope.beneficiary.lastName = undefined;
                    $scope.beneficiary.gender = undefined;
                }
                else{
                    $scope.beneficiary.entityName = undefined;
                }
            };

            $scope.next = function () {
                $scope.beneficiary.bankDetailsActive = true;
                $location.path('/international-payment/beneficiary/bank-details');
            };

            $scope.back = function () {
                Flow.previous();
                $location.path('/international-payment/personal-details');
            };
        });
})();
