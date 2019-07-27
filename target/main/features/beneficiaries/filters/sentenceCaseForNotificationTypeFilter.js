(function (app) {
    'use strict';

    app.filter('sentenceCaseForNotificationTypeFilter', function () {
        return function (notificationType) {
            return notificationType === 'SMS' ? notificationType : notificationType.toLowerCase();
        };
    });

})(angular.module('refresh.beneficiaries.filters.sentenceCaseForNotificationTypeFilter', []));