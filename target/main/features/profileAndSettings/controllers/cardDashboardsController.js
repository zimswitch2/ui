(function () {
    'use strict';

    var module = angular.module('refresh.profileAndSettings.dashboards',
        [
            'refresh.card',
            'refresh.profileAndSettings.profileAndSettingsMenu',
            'refresh.parameters',
            'refresh.switch-dashboard.service',
            'refresh.profileAndSettings.profileService'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/dashboards', {
            templateUrl: 'features/profileAndSettings/partials/dashboards.html',
            controller: 'CardDashboardsController'
        });
    });

    module.controller('CardDashboardsController', function ($scope, $q, User, ProfilesAndSettingsMenu, ApplicationParameters,
                                                            SwitchDashboardService, ProfileService) {

        $scope.menuItems = ProfilesAndSettingsMenu.getMenu();

        var dashboards = _.cloneDeep(User.userProfile.dashboards);

        $scope.additionalLinkedCardNumber = ApplicationParameters.getVariable('additionalLinkedCardNumber');
        if ($scope.additionalLinkedCardNumber) {
            ApplicationParameters.popVariable('additionalLinkedCardNumber');
            var additionalLinkDashboard = dashboards.pop();
            dashboards.splice(1, 0, additionalLinkDashboard);
        }

        $scope.userDashboards = dashboards;

        $scope.cardStatus = function (dashboard) {
            var card = new Dashboard({});
            card.card = dashboard.card;
            card.cardError = dashboard.cardError ? {code: dashboard.cardError.code} : undefined;
            return card.cardStatus();
        };

        $scope.cardStatusClass = function (dashboard) {
            var cardStatus = $scope.cardStatus(dashboard);

            if (cardStatus === 'Active') {
                return 'text-notification success';
            } else if (cardStatus === 'Activate OTP' || cardStatus === 'Activate internet banking') {
                return 'text-notification info';
            } else if (cardStatus === 'Blocked')  {
                return 'text-notification error';
            }
        };

        $scope.indicatorClass = function (dashboard) {
            return isCurrentDashboard(dashboard) ? 'text-notification check' : '';
        };

        $scope.dashboardIndicator = function (dashboard) {
            return isCurrentDashboard(dashboard) ? ' ' : '';
        };

        $scope.currentDashboard = function (dashboard) {
            return isCurrentDashboard(dashboard) ? 'row-highlight' : '';
        };

        $scope.isAdditionalCardLinked = function (dashboard) {
            return (dashboard.cardNumber === $scope.additionalLinkedCardNumber) ? 'highlight' : '';
        };

        $scope.switchDashboard = function (dashboard) {
            if (!dashboard.isBlocked()) {
                SwitchDashboardService.switchToDashboard(dashboard);
            }
        };

        var isCurrentDashboard = function (dashboard) {
            return dashboard.profileId === User.userProfile.currentDashboard.profileId;
        };

        $scope.deleteDashboard = function (dashboard) {
            return ProfileService.deleteDashboard(dashboard.profileId, dashboard.cardNumber, dashboard.cardError ? dashboard.cardError.code : undefined).then(function () {
                $scope.lastDeletedDashboardName = dashboard.dashboardName;
                var currentDashboard = User.userProfile.currentDashboard;
                User.deleteCachedDashboard(dashboard.profileId);

                $scope.userDashboards = User.userProfile.dashboards;
                $scope.isSuccessful = true;

                var newDashboard = _.find($scope.userDashboards, function (dashboard) {
                    return $scope.cardStatus(dashboard) === 'Active';
                });

                if(_.isEqual(currentDashboard.card, dashboard.card) && _.isEqual(currentDashboard.profileId, dashboard.profileId)) {
                    $scope.switchDashboard(newDashboard);
                }
            }).catch(function () {
                $scope.lastDeletedDashboardName = undefined;
                $q.reject('Could not delete this dashboard, try again later.');
            });
        };

        $scope.confirmationMessage = function (dashoboard) {
            return 'Delete dashboard? You will no longer be able to use this card for online transactions';
        };

        var hasMoreThanOneCardWithActiveStatus = function () {
            var activeDashboards = _.filter($scope.userDashboards, function (dashboard) {
                return $scope.cardStatus(dashboard) === 'Active';
            });

            return activeDashboards && activeDashboards.length >=2;
        };

        $scope.deletable = function (dashboard) {
            if($scope.cardStatus(dashboard) !== 'Active') {
                return true;
            }
            return hasMoreThanOneCardWithActiveStatus();
        };

        $scope.trackMessage = function () {
            return 'De-Link Additional Cards from Standard Bank ID.confirm';
        };
    });

})();