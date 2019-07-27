(function (app) {
    'use strict';

    app.factory('PrepaidHistoryRequest', function (Card) {
        return {
            create: function (days) {
                return {
                    days: days,
                    prepaidProviderType: "All",
                    card: Card.current()
                };
            }
        };
    });
})(angular.module('refresh.prepaid.history.services.request', ['refresh.card']));
