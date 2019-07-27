var statementPreferences = false;
if (feature.statementPreferences) {
    statementPreferences = true;
}

(function (app) {
    'use strict';

    app.factory('ProfilesAndSettingsMenu', function () {

        var menuItems = [];
        menuItems.push(
            {
                id: 'profile',
                name: 'My Profile',
                tagLine: 'Moving up in the world',
                partial: 'features/profileAndSettings/partials/myProfile.html',
                url: ["/monthly-payment-limit", "/dashboards"]
            });

        if (statementPreferences) {
            menuItems.push({
                id: 'preferences',
                name: 'Product Preferences',
                tagLine: 'Moving up in the world',
                partial: 'common/accountdropdown/partials/accountList.html',
                url: ["/account-preferences", "/edit-account-preferences"]
            });
        }

        menuItems.push(
            {
                id: 'security',
                name: 'Security Settings',
                tagLine: 'Moving up in the world',
                partial: 'features/profileAndSettings/partials/securitySettings.html',
                url: [" /internet-banking"]
            });

        return {
            getMenu: function () {
                return menuItems;
            }
        };
    });
})(angular.module('refresh.profileAndSettings.profileAndSettingsMenu', []));