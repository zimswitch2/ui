var menigaTransactionsHistoryFeature;


(function (app) {
    'use strict';
    app.factory('MenigaUserCategoriesService', function ($q, Cacher, ServiceEndpoint, ServiceError) {
        return {
            getUserCategories: function (card) {
                var requestBody = {
                    personalFinanceManagementId: card.personalFinanceManagementId,
                    payload: { }
                };
                return Cacher.shortLived.fetch('getUserCategories', {
                    personalFinanceManagementId: requestBody.personalFinanceManagementId,
                    payload: requestBody.payload
                }).then(function(response) {
                    if (response.headers('x-sbg-response-type') !== "ERROR") {
                        return response.data;
                    } else if (response.headers('x-sbg-response-code') !== "9999") {
                        return $q.reject(ServiceError.newInstance(response.headers('x-sbg-response-message'), requestBody, response.headers('x-sbg-response-code')));
                    } else {
                        return $q.reject(ServiceError.newInstance('An error has occurred.', requestBody, response.headers('x-sbg-response-code')));
                    }
                }, function () {
                    return $q.reject(ServiceError.newInstance('An error has occurred.', requestBody));
                });
            },
            clear: function () {
                Cacher.shortLived.flushEndpoint('getUserCategories');
            }
        };
    });
})
(angular.module('refresh.meniga.userCategoriesService', ['refresh.configuration', 'refresh.mcaHttp','refresh.error.service']));

