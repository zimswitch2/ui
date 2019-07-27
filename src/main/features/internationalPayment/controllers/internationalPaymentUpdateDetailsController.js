(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentUpdateDetailsController',[
        'refresh.internationalPayment.domain.internationalPaymentCustomer'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/update-details', {
            controller: 'InternationalPaymentUpdateDetailsController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentUpdateDetails.html'
        });
    });

    module.controller('InternationalPaymentUpdateDetailsController', function ($scope, InternationalPaymentCustomer) {
        $scope.isResident = InternationalPaymentCustomer.customer().isResident;
    });
})();
