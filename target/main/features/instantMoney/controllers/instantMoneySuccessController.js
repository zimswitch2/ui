(function () {
    'use strict';

    var module = angular.module('refresh.instantMoney.success', [
        'refresh.flow',
        'refresh.parameters'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/instant-money/success', {
            controller: 'InstantMoneySuccessController',
            templateUrl: 'features/instantMoney/partials/instantMoneySuccess.html'
        });
    });

    module.controller('InstantMoneySuccessController', function ($scope, $location, ViewModel, ApplicationParameters) {
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
        $scope.voucher = ViewModel.current();
        $scope.isSuccessful = true;

        $scope.backToTransact = function () {
            $location.path('/instant-money').replace();
        };

        $scope.makeAnotherTransfer = function () {
            $location.path('/instant-money/details').replace();
        };
    });
}());