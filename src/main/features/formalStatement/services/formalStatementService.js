(function () {
    var app = angular.module('refresh.formalStatement.service', ['refresh.configuration']);

    app.factory('FormalStatementService', function ($q, ServiceEndpoint) {
        var errorMessage = 'We are experiencing technical problems. Please try again later';

        return {
            viewFormalStatementList: function (accountNumber, accountType, card) {
                var request = {
                    formalStatementAccount: {
                        number: accountNumber,
                        accountType: accountType
                    },
                    card: {
                        number: card.number
                    }
                };

                return ServiceEndpoint.viewFormalStatementList.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-code') === '4444') {
                        return $q.reject({message: 'Cannot find this card number on your profile.'});
                    } else if (response.headers('x-sbg-response-type') === 'ERROR') {
                        return $q.reject({message: errorMessage});
                    }
                    return response.data && response.data.statements;
                }).catch(function (error) {
                    return $q.reject(error.message || errorMessage);
                });
            },
            emailFormalStatement: function (cardNumber, statementId, accountNumber, accountType, emailAddress) {
                return ServiceEndpoint.emailFormalStatement.makeRequest({
                    cardNumber: cardNumber,
                    statementId: statementId,
                    accountNumber: accountNumber,
                    accountType: accountType,
                    emailAddress: emailAddress
                }).then(function (response) {
                    if(response.headers('x-sbg-response-type') === 'ERROR') {
                        return $q.reject({message: errorMessage});
                    }
                    return {};
                }).catch(function (error) {
                    return $q.reject(error.message || errorMessage);
                });
            }
        };
    });
}());
