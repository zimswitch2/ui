(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.savings.screens.products.savingsAndInvestmentsOptions', ['ngRoute']);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/savings-and-investments', {
            templateUrl: 'features/accountorigination/savings/screens/products/savingsAndInvestments/partials/savingsAndInvestmentsOptions.html'
        });
    });
})();