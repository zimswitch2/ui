(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentPersonalDetailsController',
        [
            'refresh.flow',
            'refresh.internationalPayment.domain.internationalPaymentCustomer',
            'refresh.internationalPaymentService'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/personal-details', {
            controller: 'InternationalPaymentPersonalDetailsController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentPersonalDetails.html'
        });
    });

    module.controller('InternationalPaymentPersonalDetailsController', function ($scope, $location, Flow, InternationalPaymentCustomer, InternationalPaymentService) {
        $scope.customerDetails = InternationalPaymentCustomer.customer();

        InternationalPaymentService.getCountries(InternationalPaymentCustomer.customer().isResident(), "ZA").then(function (countries) {
            var country = _.find(countries, function(c){
                return c.code === $scope.customerDetails.countryOfIssue;
            });
            if (!_.isUndefined(country)) {
                $scope.countryOfIssueName = country.name;
            } else {
                $scope.countryOfIssueName = $scope.customerDetails.countryOfIssue;
            }
        });

        $scope.submit = function () {
            Flow.next();
            $location.path('/international-payment/beneficiary/details');
        };

        $scope.back = function () {
            $location.path('/international-payment');
        };
    });
})();
