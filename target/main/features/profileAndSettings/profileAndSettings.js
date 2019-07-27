(function (app) {
    'use strict';
    app.config(function ($routeProvider) {
        $routeProvider
            .when('/monthly-payment-limit', {
                templateUrl: 'features/profileAndSettings/partials/maintainEapLimit.html',
                controller: 'MaintainMonthlyEAPLimitController'
            });
    });
})(angular.module('refresh.profileAndSettings', [
    'refresh.profileAndSettings.preferences',
    'refresh.profileAndSettings.profileAndSettingsSubNav',
    'refresh.profileAndSettings.eapLimitValidations',
    'refresh.profileAndSettings.editPreferences',
    'refresh.profileAndSettings.preferences.formal',
    'refresh.profileAndSettings.profileAndSettingsMenu',
    'refresh.profileAndSettings.dashboards',
    'refresh.profileAndSettings.securitySettings',
    'refresh.profileAndSettings.internetBankingSubNav',
    'refresh.profileAndSettings.maintainMonthlyEAP.controllers'
]));
