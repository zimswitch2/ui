(function () {
    'use strict';
    var module = angular.module('lithium.lithiumService', ['refresh.configuration']);
    module.factory('LithiumService', function (ServiceEndpoint, $q) {
        return {
            authenticate: function () {
                return ServiceEndpoint.authenticateLithium.makeRequest().then(function (response) {
                    return $q.when(response.data.ssoUrl);
                });
            }
        };
    });
})();

