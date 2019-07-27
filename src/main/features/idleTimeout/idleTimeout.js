'use strict';

var countdownTimer;

(function () {
    var module = angular.module('refresh.idleTimeout',
        [
            'refresh.idleTimer'
        ]);

    module.directive('idleNotification', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'features/idleTimeout/partials/idleTimeout.html',
            controller: function ($scope, $idle, AuthenticationService) {
                $scope.keepBanking = $idle.watch;
                $scope.logout = AuthenticationService.logout;
            }
        };
    });

    module.run(function ($idle, $rootScope, AuthenticationService) {
        $rootScope.$on('$idleStart', function () {
            $rootScope.beenIdle = true;
        });

        $rootScope.$on('$idleWarn', function (e, countdown) {
            $rootScope.idleCountdown = countdown;
            countdownTimer = countdown;
        });

        $rootScope.$on('$idleEnd', function () {
            $rootScope.beenIdle = false;
        });

        $rootScope.$on('$idleTimeout', AuthenticationService.logout);
        $rootScope.$on('$keepalive', AuthenticationService.renewSession);
        $rootScope.$on('loggedOut', $idle.unwatch);
        $rootScope.$on('loggedIn', $idle.watch);
    });

}());
