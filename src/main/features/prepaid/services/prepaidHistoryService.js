(function (app) {
    'use strict';

    app.factory('PrepaidHistoryService', function (ServiceEndpoint, $q, Card) {

        var serviceErrors = {'3100': 'No prepaid purchases in this period'};

        return {
            history: function (dateFrom, dateTo) {

                var request = {
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    card: Card.current(),
                    prepaidProviderType: "All"
                };

                return ServiceEndpoint.prepaidHistory.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "SUCCESS" && response.headers('x-sbg-response-code') === "0000") {
                        return response.data.prepaidHistoryItems;
                    } else if (serviceErrors[response.headers('x-sbg-response-code')]) {
                        return $q.reject({
                            'message': serviceErrors[response.headers('x-sbg-response-code')],
                            'id': response.headers('x-sbg-response-code')
                        });
                    } else {
                        return $q.reject({message: 'An error occurred'});
                    }
                });
            }
        };
    });
})(angular.module('refresh.prepaid.history.services.service', ['refresh.configuration', 'refresh.card']));
