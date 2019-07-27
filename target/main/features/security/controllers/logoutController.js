(function () {
    'use strict';

    var module = angular.module('refresh.logout',
        [
            'refresh.authenticationService',
            'refresh.digitalId',
            'refresh.parameters',
            'ipCookie'
        ]);

    module.controller('LogoutController', function ($scope, AuthenticationService, DigitalId, ipCookie) {
        $scope.logout = function () {
            AuthenticationService.logout();
        };

        $scope.shouldDisplayLogoutOption = function () {
            return DigitalId.isAuthenticated();
        };
    });
}());
