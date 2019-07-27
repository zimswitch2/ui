(function () {
    'use strict';
    var module = angular.module('refresh.paymentNotificationHistory', ['refresh.configuration']);

    module.factory('ViewPaymentNotificationHistoryService', function (ServiceEndpoint, $q) {
        return {
            viewPaymentNotificationHistory: function (account) {
                var payload = {
                    "account": account,
                    "dateTo": moment().format('YYYY-MM-DDTHH:mm:ss'),
                    "dateFrom": moment().subtract('days', 365).format('YYYY-MM-DDTHH:mm:ss')
                };

                return ServiceEndpoint.paymentNotificationHistory.makeRequest(payload).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "SUCCESS" &&
                        response.headers('x-sbg-response-code') === "0000") {
                        return {paymentConfirmationItems: response.data.paymentConfirmationItems};
                    } else if (response.headers('x-sbg-response-type') === "WARNING") {
                        return {
                            paymentConfirmationItems: response.data.paymentConfirmationItems,
                            warningMessage: 'Displaying your 100 most recent notifications'
                        };
                    } else {
                        return $q.reject({message: response.headers('x-sbg-response-message')});
                    }
                }).catch(function (error) {
                    return $q.reject(error || 'An error has occurred');
                });
            }
        };
    });
}());