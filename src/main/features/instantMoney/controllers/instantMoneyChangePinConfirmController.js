(function () {
    var module = angular.module('refresh.instantMoneyChangePinConfirmController', [
        'refresh.flow',
        'refresh.accounts',
        'refresh.InstantMoneyService',
        'refresh.card'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/instant-money/change-pin/confirm', {
            controller: 'InstantMoneyChangePinConfirmController',
            templateUrl: 'features/instantMoney/partials/instantMoneyChangePinConfirm.html'
        });
    });

    module.controller('InstantMoneyChangePinConfirmController', function ($scope, Flow, ViewModel, InstantMoneyService, Card, $q, $location, AccountsService) {
        $scope.voucher = ViewModel.current();
        $scope.confirm = function(){
            InstantMoneyService.changeInstantMoneyVoucherPin($scope.voucher, Card.current())
                .then(function(response){
                    ViewModel.current($scope.voucher);
                    $location.path('/instant-money/change-pin/success').replace();
                }).catch(function (error) {
                    $location.path('/instant-money/change-pin').replace();
                    Flow.previous();
                    ViewModel.error({message: error});
                });
        };
    });
}());