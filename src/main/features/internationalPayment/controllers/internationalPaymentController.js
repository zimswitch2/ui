(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentController',
        [
            'refresh.flow',
            'ipCookie',
            'refresh.accounts',
            'refresh.internationalPayment.domain.internationalPaymentCustomer',
            'refresh.internationalPayment.domain.internationalPaymentBeneficiary',
            'refresh.internationalPayment.domain.reasonForPaymentSearch'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment', {
            controller: 'InternationalPaymentController',
            templateUrl: 'features/internationalPayment/partials/internationalPayment.html'
        });
    });

    module.controller('InternationalPaymentController', function ($scope, $location, Flow, Card, AccountsService, ipCookie, InternationalPaymentCustomer, InternationalPaymentBeneficiary, InternationalPaymentService, ReasonForPaymentSearch) {

        InternationalPaymentService.getCustomerDetails().then(function (customerDetails) {
            $scope.customerDetails = InternationalPaymentCustomer.initialize(customerDetails);
        });

        AccountsService.currentAndSavingsAccounts(Card.current()).then(function (accountData) {
            $scope.hasValidAccount = !_.isEmpty(accountData);
        });

        InternationalPaymentBeneficiary.initialize();
        ReasonForPaymentSearch.clear();

        $scope.submit = function () {
            if($scope.internationalPaymentTermsAndConditions && _.isUndefined(ipCookie('HAS_ACCEPTED_XBP_TERMS_AND_CONDITIONS'))){
                ipCookie('HAS_ACCEPTED_XBP_TERMS_AND_CONDITIONS', true, { path: '/', expires: 60 });
            }
            Flow.create(['Personal details', 'Beneficiary details', 'Reason for payment', 'Pay', 'OTP', 'Confirm details'], 'International Payment');
            $location.path('/international-payment/personal-details');
        };

        if (ipCookie('HAS_ACCEPTED_XBP_TERMS_AND_CONDITIONS')) {
            $scope.hideTermsAndConditions = true;
            $scope.internationalPaymentTermsAndConditions = true;
        }
    });
})();
