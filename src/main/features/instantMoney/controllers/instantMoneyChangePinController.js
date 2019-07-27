(function () {
    var module = angular.module('refresh.instantMoneyChangePinController', [
        'refresh.flow',
        'refresh.accounts'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/instant-money/change-pin', {
            controller: 'InstantMoneyChangePinController',
            templateUrl: 'features/instantMoney/partials/instantMoneyChangePin.html'
        });
    });

    module.controller('InstantMoneyChangePinController', function ($scope, Flow, ViewModel, AccountsService, Card, $location) {
        Flow.create(['Change PIN', 'Confirm details'], 'Instant Money');
        $scope.voucher = ViewModel.current();

        $scope.next = function(){
            ViewModel.current($scope.voucher);
            Flow.next();
            $location.path('/instant-money/change-pin/confirm').replace();
        };
    });
}());