(function () {
    'use strict';

    var module = angular.module('refresh.secure.message.confirm',
        [
            'refresh.flow',
            'refresh.secure.message.service'
        ]);

    module.config(function ($routeProvider) {
        var isSecureMessage = function (ViewModel) {
            return ViewModel.current().secureMessage;
        };

        $routeProvider.when('/secure-message/confirm', {
            templateUrl: 'features/security/partials/secureMessageConfirm.html',
            controller: 'SecureMessageConfirmController',
            allowedFrom: [{path: '/secure-message', condition: isSecureMessage}],
            safeReturn: '/secure-message'
        });
    });

    module.controller('SecureMessageConfirmController', function ($scope, $location, Flow, ViewModel, SecureMessageService) {
        $scope.secureMessage = ViewModel.current().secureMessage;

        $scope.modify = function () {
            ViewModel.modifying();
            Flow.previous();
            $location.path('/secure-message').replace();
        };

        $scope.confirm = function() {
            Flow.next();
            SecureMessageService.sendSecureMessage($scope.secureMessage).then(function () {
                ViewModel.current({secureMessage: $scope.secureMessage});
                $location.path('/secure-message/results').replace();
            }, function(error) {
                ViewModel.error({message: error});
                Flow.previous();
                $location.path('/secure-message').replace();
            });
        };
    });
}());