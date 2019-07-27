(function (app) {
    'use strict';

    app.factory('LimitMaintenanceService', function (ServiceEndpoint, $q, ServiceError) {
        var limitsMessages = {
            '300': 'Please enter an amount lower than your monthly limit',
            '301': 'Please enter an amount lower than your monthly limit',
            '302': 'Please enter an amount greater than 0',
            '303': 'Please contact your branch to change the limit on your temporary card'
        };
        return {
            maintain: function (request) {
                return ServiceEndpoint.maintainMonthlyPaymentLimit.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'ERROR') {
                        var errorMessage = limitsMessages[response.headers('x-sbg-response-code')] || 'We are experiencing technical problems. Please try again later';
                        return $q.reject(ServiceError.newInstance(errorMessage, request, response.headers('x-sbg-response-code')));
                    }
                    return response.data;
                });
            }
        };
    });
})(angular.module('refresh.profileAndSettings.limitMaintenanceService', ['refresh.configuration', 'refresh.mcaHttp', 'refresh.error.service']));