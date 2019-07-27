(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.savings.screens.finish',
        ['refresh.flow', 'refresh.accountOrigination.savings.domain.savingsAccountApplication']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/:productName/finish', {
            templateUrl: 'features/accountorigination/savings/screens/finish/partials/savingsFinish.html',
            controller: 'SavingsFinishController',
            safeReturn: '/apply'
        });
    });

    app.controller('SavingsFinishController', function ($scope, $location, SavingsAccountApplication) {
        $scope.productName = SavingsAccountApplication.productName();
        $scope.accountNumber = SavingsAccountApplication.accountNumber();
        $scope.acceptedTimestamp = SavingsAccountApplication.originationDate();


        $scope.applicationSuccessful = function() {
            return SavingsAccountApplication.applicationSuccessful();
        };

    });
}());
