var menigaTransactionsHistoryFeature = false;
if (feature.menigaTransactionsHistory) {
    menigaTransactionsHistoryFeature = true;
}

(function (app) {
    'use strict';
    app.factory('MenigaTransactionsPageService', function (ServiceEndpoint, $q) {
        return {
            getTransactionsPage: function (menigaTransactionsPageQuery) {
                if(menigaTransactionsPageQuery.monthsToGoBack === undefined) {
                    menigaTransactionsPageQuery.monthsToGoBack  = 0;
                }
                var fromDate = new Date();
                fromDate.setHours(0);
                fromDate.setMinutes(0);
                fromDate.setSeconds(0);
                fromDate.setMilliseconds(0);
                fromDate.setDate(1);
                fromDate.setMonth(fromDate.getMonth() - menigaTransactionsPageQuery.monthsToGoBack);
                var requestBody = {
                    personalFinanceManagementId: menigaTransactionsPageQuery.personalFinanceManagementId,
                    payload: {
                        page: menigaTransactionsPageQuery.pageIndex,
                        transactionsPerPage: 50,
                        filter: {
                            AccountIdentifiers: [menigaTransactionsPageQuery.account.number],
                            AscendingOrder: false,
                            HideExcluded: false,
                            PeriodFrom: fromDate
                        }
                    }
                };

                return ServiceEndpoint.getTransactionsPage.makeRequest(requestBody).then(function (response) {
                    if (response.headers('x-sbg-response-type') !== "ERROR") {
                        return response.data;
                    } else if(response.headers('x-sbg-response-code') === '9999') {
                        return $q.reject({message: 'An error has occurred'});
                    } else {
                        return $q.reject({message: response.headers('x-sbg-response-message')});
                    }
                }, function (error) {
                    return $q.reject({message: 'An error has occurred'});
                });
            }
        };
    });
})(angular.module('refresh.menigaTransactionsPage.services', []));
