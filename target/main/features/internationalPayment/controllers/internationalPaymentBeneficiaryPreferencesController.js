(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentBeneficiaryPreferencesController',
        [
            'refresh.configuration',
            'refresh.flow',
            'refresh.lookups',
            'refresh.internationalPayment.domain.internationalPaymentBeneficiary'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/beneficiary/preferences', {
            controller: 'InternationalPaymentBeneficiaryPreferencesController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentBeneficiaryPreferences.html'
        });
    });

    module.controller('InternationalPaymentBeneficiaryPreferencesController',
        function ($scope, $location, LookUps, Flow, InternationalPaymentBeneficiary) {
            $scope.beneficiaryFees = LookUps.beneficiaryFee.values();
            $scope.beneficiary = InternationalPaymentBeneficiary.current();

            if (_.isUndefined($scope.beneficiary.preferences)) {
                $scope.beneficiary.preferences = {fee: {code: "OWN", description: 'You pay all the fees'}};
            }

            $scope.next = function () {
                Flow.next();
                $location.path('/international-payment/reason');
            };

            $scope.back = function () {
                $location.path('/international-payment/beneficiary/bank-details');
            };
        });
})();
