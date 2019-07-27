'use strict';
(function (app) {

    app.config(function ($routeProvider) {
        $routeProvider.when('/choose-dashboard', {
            controller: 'SwitchDashboardController',
            templateUrl: 'features/security/partials/chooseDashboard.html'
        });
        $routeProvider.when('/switchDashboard', {
            controller: 'SwitchDashboardController',
            templateUrl: 'features/security/partials/chooseDashboard.html'
        });
    });

    app.controller('SwitchDashboardController', function ($scope, $location, User, SwitchDashboardService, ApplicationParameters, HomeService) {
        $scope.dashboards = User.userProfile.dashboards;
        $scope.showLinkCard = User.checkAllHotCardedCards();

        if (User.userProfile.currentDashboard) {
            $scope.hasInfo = ApplicationParameters.popVariable('hasInfo');
            $scope.newlyLinkedCardNumber = ApplicationParameters.popVariable('newlyLinkedCardNumber');
            $scope.infoMessage = "Card successfully linked. Your card number is " + $scope.newlyLinkedCardNumber;
        }

        if (User.userProfile.dashboards.length === 0) {
            return HomeService.goHome();
        } else if (User.userProfile.dashboards.length === 1) {
                if (User.userProfile.dashboards[0].isHotCarded()) {
                    return $location.path('/choose-dashboard');
                }
            SwitchDashboardService.switchToDashboard(User.defaultDashboard());
        } else {
            if (User.hasBlockedCard()) {
                $location.path('/choose-dashboard');
            } else if (_.isUndefined(User.userProfile.currentDashboard)) {
                SwitchDashboardService.switchToDashboard(User.defaultDashboard());
            }
        }

        $scope.switchToDashboard = function (dashboard) {
            if (!dashboard.isBlocked()) {
                SwitchDashboardService.switchToDashboard(dashboard);
            }
        };
    });

})(angular.module('refresh.switch-dashboard', ['refresh.switch-dashboard.service', 'refresh.security.user']));
