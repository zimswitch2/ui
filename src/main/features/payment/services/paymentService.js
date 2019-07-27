(function (app) {
    'use strict';

    app.factory('PaymentService', function (ServiceEndpoint, $q, DigitalId, Card, User) {
        var getHistory = function (dateFrom, dateTo, accountNumber, nextPageReference, atmdbtsqName) {

            return ServiceEndpoint.paymentHistory.makeRequest({
                accountNumber: accountNumber,
                cardNumber: Card.current().number,
                cardType: Card.current().type,
                cardCountryCode: Card.current().countryCode,
                systemPrincipalId: User.principal().systemPrincipalIdentifier.systemPrincipalId,
                dateFrom: escape(dateFrom),
                dateTo: escape(dateTo),
                nextPageReference: nextPageReference,
                atmdbtsqName: atmdbtsqName
            }).then(function (response) {
                return response.data;
            });
        };

        return {
            pay: function (account, transactions) {
                return ServiceEndpoint.pay.makeRequest({
                    account: account,
                    transactions: transactions,
                    keyValueMetadata: [{
                        "key": "PreferredName",
                        "value": DigitalId.current().preferredName
                    }]
                }).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "ERROR" && !response.data) {
                        return $q.reject({message: ": " + response.headers('x-sbg-response-message')});
                    }

                    return response;
                }, function (error) {
                    var errorMessage = (error.message) ? ': ' + error.message : undefined;
                    return $q.reject({message: errorMessage});
                });
            },
            getHistory: getHistory
        };
    });
})
(angular.module('refresh.paymentService', ['refresh.mcaHttp', 'refresh.digitalId']));
