(function (app) {
    'use strict';

    app.controller('RechargeResultsController', function ($scope, ViewModel, ApplicationParameters,
                                                          $routeParams, $location) {
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
        $scope.recharge = ViewModel.current();
        $scope.isSuccessful = true;
        var providerId = $routeParams.providerId;
        $scope.makeAnotherRecharge = function () {
            $location.path('/prepaid/recharge/' + providerId);
        };
    });
})(angular.module('refresh.prepaid.recharge.controllers.results', ['ngRoute', 'refresh.filters', 'refresh.parameters']));
