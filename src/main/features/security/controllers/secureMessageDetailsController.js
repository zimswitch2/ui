(function () {
    'use strict';

    var module = angular.module('refresh.secure.message.details', ['refresh.flow', 'refresh.card', 'refresh.accounts']);

    module.config(function ($routeProvider) {
        var checkCardSelected = function (Card) {
            return Card.anySelected();
        };

        $routeProvider.when('/secure-message', {
            templateUrl: 'features/security/partials/secureMessageDetails.html',
            controller: 'SecureMessageDetailsController',
            allowedFrom: [{path: new RegExp('.*'), condition: checkCardSelected }],
            safeReturn: '/choose-dashboard'
        });
    });

    module.controller('SecureMessageDetailsController', function ($scope, $location, Flow, ViewModel, Card, AccountsService) {
        Flow.create(['Enter message', 'Confirm message', 'Enter OTP'], 'Secure Message');

        var model = ViewModel.initial();
        $scope.errorMessage = model.error;
        $scope.secureMessage = model.secureMessage || {};

        AccountsService.list(Card.current()).then(function (accountData) {
            $scope.aliveAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);

            if (!$scope.secureMessage.account && $scope.aliveAccounts.length > 0) {
                $scope.secureMessage.account = $scope.aliveAccounts[0];
            }
        });

        $scope.next = function () {
            ViewModel.current({secureMessage: $scope.secureMessage});
            Flow.next();
            $location.path('/secure-message/confirm').replace();
        };
    });
}());