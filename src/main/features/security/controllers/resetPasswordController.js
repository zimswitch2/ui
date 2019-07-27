(function () {
    'use strict';

    var module = angular.module('refresh.resetPasswordCtrl', [
        'ngRoute',
        'refresh.flow',
        'refresh.errorMessages'
    ]);

    module.controller('resetPasswordController', function ($scope, AuthenticationService, $location, Flow, ApplicationParameters, ErrorMessages) {
        Flow.create(['Enter details', 'Verify'], 'Reset your password');

        ApplicationParameters.pushVariable('isReSettingPassword', true);
        $scope.errorMessage = ApplicationParameters.popVariable('errorMessage');

        $scope.resetPassword = function () {
            Flow.next();
            AuthenticationService.resetPassword($scope.authenticationDetails)
                .then(function () {
                    Flow.next();
                    ApplicationParameters.pushVariable('passwordHasBeenReset', true);
                    $location.path('/login');
                })
                .catch(function (error) {
                    $scope.errorMessage = ErrorMessages.messageFor(error);
                    ApplicationParameters.pushVariable('errorMessage', $scope.errorMessage);
                    Flow.previous();
                    $location.path('/reset-password');
                });
        };

        $scope.cancel = function () {
            ApplicationParameters.popVariable('errorMessage');
            Flow.cancel();
        };
    });

}());
