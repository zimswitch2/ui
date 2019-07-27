(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.savings.screens.taxFreeCallAccount',
        [
            'ngRoute'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/tax-free-call-account', {
            templateUrl: 'features/accountorigination/savings/screens/products/taxFreeCallAccount/partials/taxFreeCallAccountDetails.html'
        });
    });
})();