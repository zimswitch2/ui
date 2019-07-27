(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.savings.screens.marketLink',
        [
            'ngRoute'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/market-link', {
            templateUrl: 'features/accountorigination/savings/screens/products/marketLink/partials/marketLinkDetails.html'
        });
    });
})();