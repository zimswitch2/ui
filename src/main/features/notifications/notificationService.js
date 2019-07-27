(function (app) {
    'use strict';

    app.factory('NotificationService', function ($rootScope, Card) {
        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.closePopup();
        });

        $rootScope.closePopup = function() {
            delete $rootScope.notificationError;
            delete $rootScope.notificationOptions;
        };

        var getReloadPath = function(){
            return Card.anySelected() ? '#/account-summary/' : '#/apply/';
        };

        return {
            displayGenericServiceError: function (response) {
                if (response.status !== 401 && response.status !== 403 && !response.otpError) {
                    this.displayPopup(
                        'Service Error',
                        'This service is currently unavailable. Please try again later, while we investigate',
                        { showLogoutAction: true, actions: { 'Reload': getReloadPath() }});
                }
            },

            displayConnectivityProblem: function(){
                this.displayPopup(
                    'Connectivity Lost',
                    'Sorry – Internet Banking lost communication with your device. This is sometimes caused by an intermittent Internet connection',
                    { showLogoutAction: true, actions: { 'Reload': getReloadPath() }});
            },

            displayPopup: function (title, message, options) {
                $rootScope.notificationTitle = title || 'Service Error';
                $rootScope.notificationError = message;
                $rootScope.notificationOptions = options || {};
                $rootScope.notificationOptions.actions = $rootScope.notificationOptions.actions || {};
            }
        };
    });
})(angular.module('refresh.notifications.service', ['refresh.card']));
