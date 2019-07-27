(function () {
    'use strict';

    var module = angular.module('refresh.otp.activate.success',
        [
            'ngRoute',
            'refresh.security.user',
            'refresh.switch-dashboard.service',
            'refresh.filters'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/otp/activate/success/:profileId', {
            templateUrl: 'features/otp/partials/activateSuccess.html',
            controller: 'ActivateOtpSuccessController'
        });
    });

    module.controller('ActivateOtpSuccessController', function ($rootScope, $scope, ViewModel, $location, User, $routeParams, SwitchDashboardService) {
        $scope.otpPreferences = ViewModel.current();

        $scope.startBanking = function () {
            var dashboard = User.findDashboardByProfileId($routeParams.profileId);
            User.addCardDetailsToDashboards([dashboard]).then(function () {
                SwitchDashboardService.switchToDashboard(dashboard);
            });
        };
    });
}());
