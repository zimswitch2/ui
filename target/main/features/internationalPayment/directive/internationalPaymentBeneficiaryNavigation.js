(function () {
    'use strict';

    var app = angular.module('refresh.internationalPaymentBeneficiaryNavigation', ['refresh.internationalPayment.domain.internationalPaymentBeneficiary']);

    app.controller('internationalPaymentBeneficiaryNavigationController', function ($scope, $location, InternationalPaymentBeneficiary) {
        $scope.beneficiary = InternationalPaymentBeneficiary.current();
        function cannotNavigate(section) {
            var sectionCheck = {
                'details': true,
                'bank-details': $scope.beneficiary.bankDetailsActive,
                'preferences': $scope.beneficiary.preferencesActive
            };
            return !sectionCheck[section];
        }

        $scope.navigate = function (section) {
            if (section === $scope.currentPage || cannotNavigate(section)) {
                return;
            }
            $location.url('/international-payment/beneficiary/' + section);
        };
    });

    app.directive('internationalPaymentBeneficiaryNavigation', function () {
        return {
            restrict: 'E',
            templateUrl: 'features/internationalPayment/directive/partials/internationalPaymentBeneficiaryNavigation.html',
            scope: {
                currentPage: '='
            },
            controller: 'internationalPaymentBeneficiaryNavigationController'
        };
    });
})();