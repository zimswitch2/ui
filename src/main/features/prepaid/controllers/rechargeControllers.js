(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/prepaid', {templateUrl: 'features/prepaid/partials/list.html', controller: 'RechargeDashboardController'});
        $routeProvider.when('/prepaid/recharge/:providerId', {templateUrl: 'features/prepaid/partials/recharge.html', controller: 'RechargeDetailsController'});
        $routeProvider.when('/prepaid/recharge/:providerId/confirm', {templateUrl: 'features/prepaid/partials/rechargeConfirm.html', controller: 'RechargeConfirmController'});
        $routeProvider.when('/prepaid/recharge/:providerId/results', {templateUrl: 'features/prepaid/partials/rechargeResults.html', controller: 'RechargeResultsController'});
    });

})(angular.module('refresh.prepaid.recharge.controllers', [
    'ngRoute',
    'refresh.prepaid.recharge.controllers.dashboard',
    'refresh.prepaid.recharge.controllers.details',
    'refresh.prepaid.recharge.controllers.confirm',
    'refresh.prepaid.recharge.controllers.results'
]));
