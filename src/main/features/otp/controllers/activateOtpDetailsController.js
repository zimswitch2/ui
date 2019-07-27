(function () {
    'use strict';

    var module = angular.module('refresh.otp.activate.details',
        [
            'ngRoute',
            'refresh.flow',
            'refresh.switch-dashboard.service',
            'refresh.otp.activate.service'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/otp/activate/:profileId', {
            templateUrl: 'features/otp/partials/activate.html',
            controller: 'ActivateOtpController'
        });
    });

    module.controller('ActivateOtpController', function ($scope, $location,$routeParams, Flow, ViewModel, AuthenticationService) {
        Flow.create(['Enter details', ' Confirm details', 'Enter OTP'], 'Activate your one-time password (OTP)', undefined, false);
        $scope.otpPreferences = ViewModel.initial();

        if (ViewModel.isInitial()) {
            $scope.otpPreferences.preferredMethod = 'SMS';
        }
        $scope.errorMessage = ($scope.otpPreferences.error !== undefined);

        $scope.next = function () {
            ViewModel.current($scope.otpPreferences);
            Flow.next();
            $location.path('/otp/activate/confirm/' + $routeParams.profileId);
        };

        $scope.signOut = function () {
            AuthenticationService.logout();
        };
    });
}());