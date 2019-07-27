(function (app) {
    'use strict';

    app.factory('ScheduledPaymentsService', function (ServiceEndpoint, AccountsService, $q) {
        function requestFutureTransactionEndpoint(futureTransactionEndpoint, futureTransaction, card, recipientId) {
            AccountsService.clear();
            var deferred = $q.defer();
            futureTransactionEndpoint.makeRequest({
                futureTransaction: futureTransaction,
                card: card,
                recipientId: recipientId
            }).then(function (response) {
                if (response.headers('x-sbg-response-code') === '0000' &&
                    response.headers('x-sbg-response-type') === 'SUCCESS') {
                    deferred.resolve({success: true});
                } else {
                    deferred.reject({success: false, message: response.headers('x-sbg-response-message')});
                }
            }).catch(function () {
                deferred.reject({success: false});
            });
            return deferred.promise;
        }

        return {
            list: function (card) {
                return ServiceEndpoint.viewFutureTransactions.makeRequest({card: card}).then(function (response) {
                    var formattedPaymentList = [];
                    _.forEach(response.data.beneficiaryFutureTransactions, function (beneficiaryFutureTransaction) {
                        var beneficiaryName = beneficiaryFutureTransaction.beneficiary.name;
                        var recipientId = beneficiaryFutureTransaction.beneficiary.recipientId;
                        _.forEach(beneficiaryFutureTransaction.futureTransactions, function (futureTransaction) {
                            formattedPaymentList.push({
                                beneficiaryName: beneficiaryName,
                                amount: futureTransaction.amount.amount,
                                nextPaymentDate: futureTransaction.nextPaymentDate,
                                finalPaymentDate: futureTransaction.futureDatedItems[futureTransaction.futureDatedItems.length - 1].nextPaymentDate,
                                frequency: futureTransaction.futureDatedInstruction.repeatInterval,
                                remainingPayments: futureTransaction.futureDatedItems.length,
                                recipientId: recipientId,
                                futureTransaction: futureTransaction
                            });
                        });
                    });
                    return formattedPaymentList;
                });
            },

            amend: function (futureTransaction, card, recipientId) {
                return requestFutureTransactionEndpoint(ServiceEndpoint.amendFutureTransactions, futureTransaction,
                    card, recipientId);
            },

            delete: function (futureTransaction, card, recipientId) {
                return requestFutureTransactionEndpoint(ServiceEndpoint.deleteFutureTransactions, futureTransaction,
                    card, recipientId);
            }
        };
    });
})(angular.module('refresh.payment.future.services',
    ['ngRoute', 'refresh.configuration', 'refresh.parameters', 'refresh.accounts']));
