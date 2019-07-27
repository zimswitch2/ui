(function () {
    'use strict';

    var module = angular.module('refresh.passwordReset.controller', [
        'refresh.authenticationService',
        'refresh.flow'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/reset-password', {
            templateUrl: 'features/security/partials/passwordReset.html',
            controller: 'PasswordResetController',
            unauthenticated: true
        });
    });

    module.controller('PasswordResetController', function ($scope, $location, Flow, AuthenticationService, ViewModel, ApplicationParameters) {

        Flow.create(['Check email', 'Enter details', 'Verify'], 'Reset Password');

        ViewModel.initial();

        $scope.securityChallenge = {};

        var digitalId = {
            digitalId: ApplicationParameters.getVariable(('digitalId'))
        };

        var resolveResponse = function (response) {
            ApplicationParameters.pushVariable('isReSettingPassword', true);
            ViewModel.current({
                securityChallenge: {
                    digitalId: $scope.securityChallenge.digitalId,
                    hasLinkedCard: response.hasLinkedCard
                }
            });
            $location.path('/reset-password/details');
            Flow.next();
        };

        var validateEmail = function (digitalId) {
            AuthenticationService.linkCardStatus(digitalId).then(function (response) {
                $scope.securityChallenge.digitalId = digitalId.digitalId;
                resolveResponse(response);
            }).catch(function () {
                $location.path('/reset-password');
                Flow.previous();
            });
        };

        $scope.next = function () {
            var digitalId = {
                digitalId: $scope.securityChallenge.digitalId
            };
            AuthenticationService.linkCardStatus(digitalId).then(function (response) {
                resolveResponse(response);
            }).catch(function (error) {
                Flow.previous();
                $scope.errorMessage = error;
            });
        };

        $scope.cancel = function () {
            $location.path('/login').replace();
        };

        if (ApplicationParameters.getVariable('digitalId')) {
            validateEmail(digitalId);
        }
    });
}());
