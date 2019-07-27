(function (app) {

    'use strict';

    app.directive('savingsPrescreening', function(SavingsAccountApplication, CustomerService, Card) {
        return {
            restrict: 'E',
            templateUrl: 'features/accountorigination/savings/directives/partials/savingsPrescreening.html',
            scope: {
                productType: '@',
                isEnabled: '='
            },
            link: function (scope) {
                scope.creditAndFraudCheckConsent = false;

                scope.apply = function () {
                    var productInformation = SavingsAccountApplication.availableProducts()[scope.productType];
                    CustomerService.isCustomerCompliant(Card.current(), 'Apply for ' + productInformation.ProductName + ' Account').then(function (isCompliant) {
                        scope.fraudCheckModalIsShown = isCompliant;
                        scope.referCustomerToBranch = !isCompliant;
                    });
                };
                scope.cancel = function () {
                    scope.fraudCheckModalIsShown = false;
                };
                scope.closeNonKycModal = function() {
                    scope.referCustomerToBranch = false;
                };
            }
        };
    });

})(angular.module('refresh.accountOrigination.savings.directives.savingsPrescreening', ['refresh.accountOrigination.customerService']));
