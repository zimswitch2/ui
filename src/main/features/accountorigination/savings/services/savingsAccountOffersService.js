(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.savings.services.savingsAccountOffersService',
        ['refresh.configuration', 'refresh.accountOrigination.savings.domain.savingsAccountApplication']);

    app.factory('SavingsAccountOffersService', function (ServiceEndpoint, Card, $q, SavingsAccountApplication) {

        var getOffers = function() {
            return ServiceEndpoint.createSavingsAccountApplication.makeRequest({
                productId: SavingsAccountApplication.productCode(),
                analyticsData: "Application for " + SavingsAccountApplication.productName() + " account",
                card: Card.current()
            }, {omitServiceErrorNotification: true}).then(function (response) {
                if (response.headers('x-sbg-response-type') !== 'ERROR') {
                    return response.data;
                } else if (response.headers('x-sbg-response-code') === '9999') {
                    return $q.reject({message: response.headers('x-sbg-response-message')});
                } else if (response.headers('x-sbg-response-code') === '052(ZAO_BS_INT)') {
                    return $q.reject({reason: 'DECLINED'});
                } else {
                    return $q.reject({reason: response.headers('x-sbg-response-message')});
                }
            });
        };

        var originateAccount = function() {
            return ServiceEndpoint.originateSavingsAccount.makeRequest({
                offerId: SavingsAccountApplication.offerId(),
                productId: SavingsAccountApplication.productCode(),
                transferFromAccountNumber: SavingsAccountApplication.transferFromAccount().number,
                initialTransferAmount: SavingsAccountApplication.initialDepositAmount(),
                cardNumber: Card.current().number,
                analyticsData: "Originate " + SavingsAccountApplication.productName() + " account"
            }).then(function(response) {
                if(response.headers('x-sbg-response-type') !== 'ERROR') {
                    return response.data;
                } else {
                    return $q.reject({message: response.headers('x-sbg-response-message')});
                }
            });
        };

        return {
            getOffers: getOffers,
            originateAccount: originateAccount,
            getOfferButtonText: function () {
                return 'Submit';
            }
        };
    });
})();
