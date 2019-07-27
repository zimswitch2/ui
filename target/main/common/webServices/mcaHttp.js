(function (app) {
    'use strict';

    app.run(function (ApplicationParameters) {
        ApplicationParameters.pushVariable('pendingRequests', 0);
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $rootScope, $location, LastRequest, Spinner, ApplicationParameters, DigitalId, Card) {
            function httpRequestStarted() {
                var _pendingRequest = ApplicationParameters.getVariable('pendingRequests') + 1;
                ApplicationParameters.pushVariable('pendingRequests', _pendingRequest);
                $rootScope.$broadcast('httpRequestStarted');
            }

            function httpRequestStopped() {
                var _pendingRequest = ApplicationParameters.getVariable('pendingRequests') - 1;
                ApplicationParameters.pushVariable('pendingRequests', _pendingRequest);
                $rootScope.$broadcast('httpRequestStopped');
            }

            function saveTimestamp(headers) {
                if (headers && headers('date')) {
                    ApplicationParameters.pushVariable('latestTimestampFromServer', moment(headers('date')));
                }
            }

            return {
                'request': function (config) {
                    ApplicationParameters.pushVariable('blockOutPage', false);

                    if (!DigitalId.isAuthenticated()  && $location.path() === '/otp/verify' &&
                        !( ApplicationParameters.getVariable('isRegistering')|| ApplicationParameters.getVariable('isReSettingPassword'))) {
                        $location.path('/login');
                    }

                    if (config.url.indexOf('/sbg-ib') !== 0 && config.url.indexOf('/BusinessBanking') !== 0) {
                        return $q.when(config);
                    }

                    if ($location.hash() !== 'top') {
                        httpRequestStarted();
                    }

                    return $q.when(config);
                },
                'response': function (response) {
                    var OTPResentMessage = ['One-time PIN successfully re-sent.', 'Verification code successfully resent.'];

                    if (response.config.url.indexOf('/sbg-ib') !== 0 && response.config.url.indexOf('/BusinessBanking') !== 0) {
                        return $q.when(response);
                    }

                    saveTimestamp(response.headers);

                    httpRequestStopped();

                    if (response.headers('x-sbg-response-type') === 'STEPUP' &&
                        response.headers('x-sbg-response-code') === '0000') {
                        if ((OTPResentMessage.indexOf(response.headers('x-sbg-response-message')) > -1)) {
                            var originalResponse = ApplicationParameters.getVariable('originalResponse');
                            originalResponse.data.stepUp.correlationKey = response.data.stepUp.correlationKey;
                            ApplicationParameters.pushVariable('originalResponse', originalResponse);

                            return $q.when(response);
                        } else {
                            var deferred = $q.defer();
                            ApplicationParameters.pushVariable('originalResponse', response);
                            LastRequest.lastRequest(response.config);
                            ApplicationParameters.pushVariable('deferred', deferred);
                            $location.path('/otp/verify').replace();
                            return deferred.promise;

                        }
                    } else if (response.headers('x-sbg-response-type') === 'ERROR' && response.headers('x-sbg-response-code') === '1020') {
                        return $q.reject({
                            message: 'Your OTP service has been locked. Please call Customer Care on 0860 123 000',
                            otpError: true,
                            headers: response.headers
                        });
                    } else {
                        return $q.when(response);
                    }
                },
                'responseError': function (rejection) {
                    if (rejection.config && rejection.config.url.indexOf('/sbg-ib') !== 0 && rejection.config.url.indexOf('/BusinessBanking') !== 0) {
                        return $q.reject(rejection);
                    }

                    saveTimestamp(rejection.headers);

                    if (rejection.status === 403) {
                        DigitalId.remove();
                        Card.setCurrent(undefined);
                        ApplicationParameters.pushVariable('loginError', 'Your session has expired. Please sign in again to continue banking');
                        $location.path('/login');
                    }
                    httpRequestStopped();

                    return $q.reject(rejection);
                }
            };
        });
    });

    app.factory('LastRequest', function () {
        var _lastRequest;
        return {
            lastRequest: function (request) {
                if (request) {
                    _lastRequest = request;
                } else {
                    return _lastRequest;
                }
            },
            clear: function () {
                _lastRequest = null;
            }
        };
    });
})(angular.module('refresh.mcaHttp', ['refresh.parameters', 'refresh.login', 'refresh.otp', 'refresh.spinner', 'refresh.configuration', 'refresh.notifications']));
