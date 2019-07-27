(function() {
    'use strict';

    var module = angular.module('refresh.resendConfirmation', ['refresh.digitalId', 'refresh.configuration']);

    module.factory('ResendConfirmationService', function (ServiceEndpoint, DigitalId) {
        return {
            resendConfirmation: function (card, paymentConfirmationHistory) {
                var request = {
                    card: card,
                    paymentConfirmationHistory: paymentConfirmationHistory,
                    keyValueMetadata: [{
                        "key": "PreferredName",
                        "value": DigitalId.current().preferredName
                    }]
                };
                return ServiceEndpoint.resendPaymentConfirmation.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') !== "ERROR") {
                        return {
                            success: true
                        };
                    } else {
                        return {
                            success: false,
                            message: response.headers('x-sbg-response-message')
                        };
                    }
                }, function () {
                    return {
                        success: false,
                        message: "An error has occurred"
                    };
                });
            }
        };
    });
}());