(function (app) {
    'use strict';

    app.factory('ServiceError', function () {
        return {
            newInstance: function (message, originalRequest, code) {
                return {
                    message: message,
                    model: originalRequest,
                    code: code
                };
            }
        };
    });
})(angular.module('refresh.error.service', []));