(function () {
    'use strict';

    var module = angular.module('refresh.secure.message.service',
        [
            'refresh.configuration',
            'refresh.mcaHttp',
            'refresh.card'
        ]);

    module.factory('SecureMessageService', function ($q, ServiceEndpoint, Card) {
        return {
            sendSecureMessage: function (secureMessage) {
                var request = {
                    card: Card.current(),
                    account: secureMessage.account,
                    businessPhoneNumber: secureMessage.businessTelephone,
                    homePhoneNumber: secureMessage.homeTelephone,
                    message: secureMessage.content,
                    preferredBranch: secureMessage.account.branch
                };
                return ServiceEndpoint.sendSecureMessage.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') !== 'ERROR') {
                        return;
                    } else {
                        return $q.reject(response.headers('x-sbg-response-message'));
                    }
                }, function (error) {
                    return $q.reject(error.message || 'An error has occurred');
                });
            }
        };
    });
}());
