(function(app) {
    'use strict';
    app.directive('securitySettingsSubNav', function () {
        return {
            restrict: 'E',
            scope: {
                currentUrl: '@',
                menuItems: '='
            },
            controller: 'SecuritySettingController',
            templateUrl: 'features/profileAndSettings/partials/settingsSubNav.html'
        };
    });
})(angular.module('refresh.profileAndSettings.securitySettingsSubNavDirective', ['refresh.profileAndSettings.securitySettings']));