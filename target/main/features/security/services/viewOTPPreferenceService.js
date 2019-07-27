(function (app) {
    'use strict';

    app.factory('ViewOTPPreferenceService', function ($q, Cacher, ServiceEndpoint, ServiceError) {
        return {
            getOTPPreference: function (cardNumber) {
                var request = {"card": {"number": cardNumber.number}};
                return ServiceEndpoint.getOTPPreference.makeRequest(request).then(function (response) {
                    var responseCode = response.headers('x-sbg-response-code');
                    if (responseCode === "0000") {
                        return response.data;
                    } else {
                        return $q.reject(ServiceError.newInstance('An error has occurred', cardNumber));
                    }
                }).catch(function () {
                    return $q.reject(ServiceError.newInstance('An error has occurred', cardNumber));
                });
            }
        };
    });
})(angular.module('refresh.viewOTPPreference', ['refresh.cache', 'refresh.configuration', 'refresh.mcaHttp']));