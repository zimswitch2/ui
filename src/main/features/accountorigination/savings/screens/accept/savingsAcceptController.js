(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.savings.screens.accept',
        ['refresh.flow', 'refresh.accountOrigination.savings.domain.savingsAccountApplication', 'refresh.accountsService']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:productName/accept', {
            templateUrl: 'features/accountorigination/savings/screens/accept/partials/savingsAccept.html',
            controller: 'SavingsAcceptController',
            safeReturn: '/apply'
        });
    });

    app.controller('SavingsAcceptController', function ($scope, $location, $routeParams, Flow, SavingsAccountApplication, SavingsAccountOffersService, AccountsService) {
        $scope.ProductName = SavingsAccountApplication.productName();
        $scope.ProductTermsAndConditionsLink = SavingsAccountApplication.productTermsAndConditionsLink();
        $scope.agreedToTermsAndConditions = false;
        $scope.offerDetails = {
            sourceAccount: SavingsAccountApplication.transferFromAccount(),
            initialDepositAmount: SavingsAccountApplication.initialDepositAmount()
        };

        $scope.backToTransfer = function () {
            Flow.previous();
            $location.path('/apply/' + $routeParams.productName + '/transfer').replace();
        };

        var moveToNextPage = function () {
            Flow.next();
            $location.path('/apply/' + $routeParams.productName + '/finish').replace();
        };

        $scope.proceed = function () {
            SavingsAccountOffersService.originateAccount().then(function (newAccount) {
                SavingsAccountApplication.accountOriginated(newAccount);
                AccountsService.clear();
                moveToNextPage();
            }).catch(function () {
                moveToNextPage();
            });
        };
    });
}());