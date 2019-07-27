(function () {
    var module = angular.module('refresh.instantMoneyChangePinSuccessController', []);

    module.config(function ($routeProvider) {
        $routeProvider.when('/instant-money/change-pin/success', {
            controller: 'InstantMoneyChangePinSuccessController',
            templateUrl: 'features/instantMoney/partials/instantMoneyChangePinSuccess.html'
        });
    });

    module.controller('InstantMoneyChangePinSuccessController', function ($scope, ViewModel, $location) {
        $scope.voucher = ViewModel.current();
        $scope.isSuccessful = true;

        $scope.backToInstantMoney = function(){
            $location.path('/instant-money').replace();
        };
    });
}());