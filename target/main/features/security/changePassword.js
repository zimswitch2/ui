(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/change-password', {
            templateUrl: 'features/security/partials/changePassword.html',
            controller: "changePasswordController"
        });
    });
})(angular.module('refresh.changePassword', ['ngRoute', 'refresh.changePasswordController']));
