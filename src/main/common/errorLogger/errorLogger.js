(function () {
    'use strict';
    var module = angular.module('refresh.errorLogger', ['refresh.configuration']);

    module.factory('ErrorLogger', function (ServiceEndpoint) {
        return {
            send: function (error) {

                var errorPayload = {
                    error: error
                };
                ServiceEndpoint.errorFeedback.makeRequest(errorPayload);
            }
        };
    });
})();
