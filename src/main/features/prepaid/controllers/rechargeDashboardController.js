(function (app) {
    'use strict';

    app.controller('RechargeDashboardController', function ($scope, RechargeService) {
        RechargeService.listProviders().then(function (providers) {
            $scope.providers = providers;
        });
    });
})(angular.module('refresh.prepaid.recharge.controllers.dashboard', ['refresh.prepaid.recharge.services']));
