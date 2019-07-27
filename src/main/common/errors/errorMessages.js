'use strict';

(function (app) {

    app.factory('ErrorMessages', function (DtmAnalyticsService) {

        var isServiceError = function (error) {
            return !(error instanceof Error);
        };

        return {
            messageFor: function (error) {
                if (isServiceError(error)) {
                    var curErrorCode = error.code;

                    DtmAnalyticsService.sendError(error.message, curErrorCode);

                    return error.message;
                } else {
                    return "This service is currently unavailable. Please try again later, while we investigate";
                }
            }
        };
    });
})(angular.module('refresh.errorMessages', ['refresh.dtmanalytics']));
