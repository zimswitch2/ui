(function (app) {
    'use strict';

    app.service('NotificationCostService', function () {
        var notificationCost = {
            'Email': 0.7,
            'SMS': 0.9,
            'Fax': 3.2
        };

        return {
            getCost: function (confirmationType) {
                return notificationCost[confirmationType];
            }
        };
    });
})
(angular.module('refresh.notificationCostService', []));
