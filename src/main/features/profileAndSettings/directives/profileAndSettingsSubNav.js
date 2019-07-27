(function (app) {
    'use strict';
    app.directive('profileAndSettingsSubNav', function () {
        return {
            restrict: 'E',
            scope: {
                currentUrl: '@',
                menuItems: '='
            },
            controller: 'ProfileAndSettingsSubNavController',
            templateUrl: 'features/profileAndSettings/partials/settingsSubNav.html'
        };
    });
})(angular.module('refresh.profileAndSettings.profileAndSettingsSubNavDirective', ['refresh.profileAndSettings.profileAndSettingsSubNav']));