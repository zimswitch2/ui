(function () {
    'use strict';

    var app = angular.module('refresh.webServices.endpointDefinition',
        ['refresh.notifications.service', 'refresh.spinner', 'refresh.dtmanalytics']);

    app.factory('EndpointDefinition', function ($q, $http, $rootScope, Spinner, NotificationService, DtmAnalyticsService) {

        var makeRequest = function (payload, options) {
            payload = payload || {};
            options = options || {};

            options.ignoreErrorResponseCodes = this.ignoreErrorResponseCodes;

            Spinner.spinnerStyle(options.spinnerStyle || this.spinnerStyle);
            var request = {method: this.method, url: this.url};

            if (['GET', 'DELETE'].indexOf(this.method) > -1) {
                request["params"] = payload;
            } else {
                request["data"] = payload;
            }

            var url = this.url;
            return $http(request)
                .then(function (response) {
                    Spinner.spinnerStyle('global');
                    if (response.headers('x-sbg-response-code') !== '0000') {
                        if (!options.ignoreErrorResponseCodes) {
                            return $q.reject(response);
                        }

                        $rootScope.$broadcast('unsuccessfulMcaResponse', response.headers('x-sbg-response-message'), response.headers('x-sbg-response-code'), url);
                    }
                    return response;
                })
                .catch(function (response) {
                    if (response.status === 0) {
                        NotificationService.displayConnectivityProblem();
                    } else if (!options.omitServiceErrorNotification) {
                        NotificationService.displayGenericServiceError(response);
                    }

                    var message = response.status === 0 ? 'Connectivity Lost' : response.headers('x-sbg-response-message');
                    var errorCode = response.status === 0 ? '' : response.headers('x-sbg-response-code');
                    $rootScope.$broadcast('unsuccessfulMcaResponse', message, errorCode, url);

                    return $q.reject(response);
                });
        };

        var makeFormSubmissionRequest = function(payload, options) {
            DtmAnalyticsService.recordFormSubmission();

            var makeRequestResult  = options ? this.makeRequest(payload, options) : this.makeRequest(payload);

            return makeRequestResult.then(function(response) {

                var responseCode = response.headers('x-sbg-response-code');
                if (responseCode !== '0000') {
                    DtmAnalyticsService.cancelFormSubmissionRecord();
                }
                else {
                    DtmAnalyticsService.recordFormSubmissionCompletion();
                }

                return response;
            }).catch(function(response) {
                DtmAnalyticsService.cancelFormSubmissionRecord();
                return $q.reject(response);
            });
        };

        return {
            create: function (url, method, spinnerStyle, ignoreErrorResponseCodes) {
                spinnerStyle = spinnerStyle || 'global';

                return {
                    url: url,
                    method: method,
                    spinnerStyle: spinnerStyle,
                    makeRequest: makeRequest,
                    makeFormSubmissionRequest: makeFormSubmissionRequest,
                    ignoreErrorResponseCodes: ignoreErrorResponseCodes
                };
            }
        };
    });

})();
