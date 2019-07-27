(function (app) {
    'use strict';

    app.filter('prepositionForNotificationTypeFilter', function () {
        return function (notificationType) {
            return notificationType === 'Email' ? "at" : "on";
        };
    });

})(angular.module('refresh.beneficiaries.filters.prepositionForNotificationTypeFilter', []));