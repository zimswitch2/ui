(function (app) {
    'use strict';

    app.controller('SecuritySettingController', function ($scope, $location) {

        var securitySettingsMenuItems = [
            {
                url: '#/internet-banking',
                text: 'Internet banking'
            }
        ];
        var menuItems = {'securitySettingsMenuItems':securitySettingsMenuItems};

        $scope.isCurrentLocation = function (item) {
            return $location.path() === _.trimLeft(item.url,'#');
        };

        $scope.getItems = function (items) {
            return menuItems[items];
        };

    });
})(angular.module('refresh.profileAndSettings.securitySettings', ['refresh.accordion', 'refresh.profileAndSettings.securitySettingsSubNavDirective']));
