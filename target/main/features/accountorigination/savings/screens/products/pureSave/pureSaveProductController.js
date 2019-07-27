(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.savings.screens.pureSave',
        [
            'ngRoute'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/pure-save', {
            templateUrl: 'features/accountorigination/savings/screens/products/pureSave/partials/pureSaveDetails.html'
        });
    });
})();