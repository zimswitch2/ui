(function (app) {
    'use strict';

    app.factory('MenigaNetIncomeService', function ($q, AccountsService, ServiceEndpoint, ServiceError) {
        var genericErrorMessage = 'An error has occurred.';

        var rejectResponse = function(message) {
            return $q.reject(ServiceError.newInstance(message));
        };

        var resolveOrRejectResponse = function (response) {
            if (response.headers('x-sbg-response-type') !== "ERROR") {
                return response.data;
            } else if (response.headers('x-sbg-response-code') !== "9999") {
                return rejectResponse(response.headers('x-sbg-response-message'));
            } else {
                return rejectResponse(genericErrorMessage);
            }
        };

        var mapAccounts = function (accounts, propertiesToMap) {
            return _.map(_.filter(accounts, function (account) {
                return account.accountType === "CURRENT" ||
                    account.accountType === "CREDIT_CARD";
            }), function (account) {
                var mappedAccount = {};
                _.each(propertiesToMap, function (propertyName) {
                    mappedAccount[propertyName] = account[propertyName];
                });
                return mappedAccount;
            });
        };

        var buildRequestPayload = function (personalFinanceManagementId, accounts, propertiesToMapOnAccounts) {
            return {
                personalFinanceManagementId: personalFinanceManagementId,
                accounts: mapAccounts(accounts, propertiesToMapOnAccounts)
            };
        };

        return {
            getAccountsNetIncome: function (personalFinanceManagementId, accounts) {
                var requestPayload = buildRequestPayload(personalFinanceManagementId, accounts, ['accountType', 'number']);
                return ServiceEndpoint.getAccountsNetIncome.makeRequest(requestPayload, {omitServiceErrorNotification:true}).then(function(response) {
                    return resolveOrRejectResponse(response);
                }, function () {
                    return rejectResponse(genericErrorMessage);
                });
            },
            getAccountsCashflows: function (personalFinanceManagementId, accounts) {
                var requestPayload = buildRequestPayload(personalFinanceManagementId, accounts, ['accountType', 'number', 'name']);
                return ServiceEndpoint.getAccountsCashflows.makeRequest(requestPayload, {omitServiceErrorNotification:true}).then(function(response) {
                    return resolveOrRejectResponse(response);
                }, function () {
                    return rejectResponse(genericErrorMessage);
                });
            }
        };
    });
})(angular.module('refresh.meniga.netIncomeService', ['refresh.accountsService', 'refresh.configuration', 'refresh.mcaHttp','refresh.error.service']));
