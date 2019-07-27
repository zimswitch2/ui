'use strict';

var editFormalStatementPreferences = false;

if (feature.editFormalStatementPreferences) {
    editFormalStatementPreferences = true;
}

(function (app) {

    app.factory('StatementService', function (ServiceEndpoint, $q) {
        var otherAccountTypes = ['HOME_LOAN', 'CREDIT_CARD'];

        var getStatementType = function (statementType) {
            var defaultStatementType = 'Provisional';
            var otherAllowedStatementTypes = ['Thirty', 'Sixty', 'Ninety', 'OneHundredEighty'];
            return _.contains(otherAllowedStatementTypes, statementType) ? statementType : defaultStatementType;
        };

        return {
            statement: function (statementType, account, pageNumber, containerName) {
                var payload = {
                    account: account,
                    statementType: getStatementType(statementType),
                    pageNumber: pageNumber,
                    containerName: containerName,
                    morePagesIndicator: 'Yes'
                };
                return ServiceEndpoint.paginatedStatements.makeRequest(payload).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "SUCCESS" && response.headers('x-sbg-response-code') === "0000") {
                        return response.data;
                    } else {
                        return $q.reject({message: 'An error has occurred'});
                    }
                });
            },

            getTransactions: function (transactionRequest) {
                if(_.indexOf(otherAccountTypes, transactionRequest.account.accountType)!== -1 && transactionRequest.numberOfDays === undefined) {
                    transactionRequest.numberOfDays = 'Thirty';
                }

                var gatewayRequest = {
                    account: transactionRequest.account,
                    statementType: getStatementType(transactionRequest.numberOfDays),
                    pageNumber: transactionRequest.pageNumber,
                    containerName: transactionRequest.containerName,
                    firstLoad: transactionRequest.firstLoad,
                    morePagesIndicator: transactionRequest.morePagesIndicator,
                    pagingRequired: transactionRequest.pagingRequired,
                    sortCriteria: 'Normal',
                    currentDate: transactionRequest.currentDate.toString()

                };
                return ServiceEndpoint.getTransactions.makeRequest(gatewayRequest).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'SUCCESS') {
                        return response.data;
                    }

                    return $q.reject(response.headers('x-sbg-response-message'));
                }).catch(function (error) {
                    return $q.reject('We are experiencing technical problems. Please try again later');
                });
            },

            getStatementTypesForAccount: function (accountType) {
                if (accountType === 'CREDIT_CARD') {
                    return [
                        {value: 'Provisional', description: 'Latest transactions'},
                        {value: 'Thirty', description: 'Previous month'},
                        {value: 'Sixty', description: 'Two months ago'},
                        {value: 'Ninety', description: 'Three months ago'}
                    ];
                } else {
                    var statementTypes = [
                        {value: 'Provisional', description: 'Latest transactions'},
                        {value: 'Thirty', description: '30 days'},
                        {value: 'Sixty', description: '60 days'},
                        {value: 'Ninety', description: '90 days'}
                    ];
                    statementTypes.push({value: 'OneHundredEighty', description: '180 days'});

                    return statementTypes;
                }
            },

            formalStatementPreference: function (card, account) {
                var payload = {
                    accountNumber: account.number,
                    cardNumber: card.number
                };
                return ServiceEndpoint.formalStatementPreference.makeRequest(payload).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "SUCCESS" && response.headers('x-sbg-response-code') === "0000") {
                        return response.data;
                    } else {
                        return $q.reject({message: 'An error has occurred'});
                    }
                });
            },

            editFormalStatementPreference: function (statementPreference) {
                var payload = {
                    "cardNumber": statementPreference.card.number,
                    "formalStatementPreferences": [
                        {
                            "account": {
                                "number": statementPreference.account.number
                            },
                            "emailAddress": statementPreference.emailAddress,
                            "emailAddrActive": statementPreference.emailAddrActive,
                            "emailAddrValidated": statementPreference.emailAddrValidated
                        }
                    ]
                };
                return ServiceEndpoint.editFormalStatementPreference.makeRequest(payload).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "SUCCESS" && response.headers('x-sbg-response-code') === "0000") {
                        return response.data;
                    } else {
                        return $q.reject({message: 'An error has occurred'});
                    }
                });
            }

        };
    });
})(angular.module('refresh.statements.services', ['refresh.mcaHttp']));
