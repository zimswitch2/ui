(function(){
   'use strict';

    var module = angular.module('refresh.passwordReset.detailsController', [
        'refresh.flow',
        'refresh.parameters'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/reset-password/details', {
            templateUrl: 'features/security/partials/passwordResetDetails.html',
            controller: 'PasswordResetDetailsController',
            unauthenticated: true
        });
    });

    module.controller('PasswordResetDetailsController', function ($scope, $location, ViewModel, AuthenticationService, Flow, ApplicationParameters) {
        var viewModelCurrent = ViewModel.current();

        if(_.isUndefined(viewModelCurrent.securityChallenge)) {
            $location.path('/login').replace();
        }

        if(viewModelCurrent.securityChallenge) {
            Flow.modify('Verify', viewModelCurrent.securityChallenge.hasLinkedCard? 'OTP' : 'Verification code');
        }

        $scope.securityChallenge = viewModelCurrent.securityChallenge ?  viewModelCurrent.securityChallenge : {};

        $scope.cancel = function () {
            $location.path('/login').replace();
        };

        $scope.next = function () {
            Flow.next();
            AuthenticationService.passwordReset({securityChallenge: $scope.securityChallenge}).then(function (response) {
                ApplicationParameters.pushVariable('passwordHasBeenReset', true);
                $location.path('/login').replace();
            }).catch(function (error) {
                $scope.errorMessage = error;
                Flow.previous();
            });
        };
    });
}());