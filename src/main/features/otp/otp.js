(function () {
    'use strict';

    var module = angular.module('refresh.otp',
        [
            'ngRoute',
            'refresh.configuration',
            'refresh.flow',
            'refresh.parameters',
            'refresh.filters',
            'refresh.dtmanalytics'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/otp/verify', {
            templateUrl: 'features/otp/partials/verify.html',
            controller: 'OtpController'
        });
    });

    module.controller('OtpController',
            function ($scope, $http, URL, Flow, ApplicationParameters, AuthenticationService, $location, dateTimeFormatFilter, DtmAnalyticsService) {
            $scope.initialize = function () {
                $scope.originalResponse = ApplicationParameters.getVariable('originalResponse');
                $scope.isVerificationCode = $scope.originalResponse && $scope.originalResponse.data.stepUp.stepUpType === "VerificationCode";

                $scope.headerName = Flow.getHeaderName();
                $scope.entryMessage = entryMessage($scope.originalResponse);

                if ($scope.originalResponse && $scope.originalResponse.data.stepUp.stepUpType === "VerificationCode") {
                    $scope.closingMessage = 'Check your email inbox and enter the code below.';
                }

                $scope.$on('$routeChangeSuccess', function (event, currentUrl, oldUrl) {
                    if ($scope.originalResponse === undefined) {
                        $location.path(oldUrl.originalPath).replace();
                    }
                });
            };

            $scope.send = function (otp) {
                var errorMessageMap = {'You have Exceeded the number of attempted you can enter your OTP. Please contact your branch.': 'Your OTP service has been locked. Please call Customer Care on 0860 123 000'};
                $scope.originalResponse = ApplicationParameters.getVariable('originalResponse');

                var keyValueMetadataResponse = angular.copy($scope.originalResponse.data.keyValueMetadata);

                var stepUpResponse = angular.copy($scope.originalResponse.data.stepUp);
                stepUpResponse.code = otp;
                var stepUppedRequest = $scope.originalResponse.config;
                stepUppedRequest.data.stepUp = stepUpResponse;
                stepUppedRequest.data.keyValueMetadata =
                    keyValueMetadataResponse.concat(stepUppedRequest.data.keyValueMetadata || []);

                $http(stepUppedRequest).then(function (response) {
                    if (response.headers('x-sbg-response-type') === "ERROR" &&
                        response.headers('x-sbg-response-code') === "STEPUP") {
                        $scope.notificationType = 'error';
                        var serverMessage = response.headers('x-sbg-response-message');
                        $scope.otpMessage = errorMessageMap[serverMessage] || serverMessage;
                    } else if (response.headers('x-sbg-response-type') === "STEPUP" &&
                        response.headers('x-sbg-response-code') === "STEPUP") {
                        var originalResponse = ApplicationParameters.getVariable('originalResponse');

                        var originalResponseWithNewStepUpValues = angular.copy(originalResponse);
                        originalResponseWithNewStepUpValues.data.keyValueMetadata = response.data.keyValueMetadata;
                        originalResponseWithNewStepUpValues.data.stepUp = response.data.stepUp;
                        originalResponseWithNewStepUpValues.data.stepUp.code = otp;
                        ApplicationParameters.pushVariable('originalResponse', originalResponseWithNewStepUpValues);

                        $scope.notificationType = 'error';
                        $scope.otpMessage = response.headers('x-sbg-response-message');
                    } else {
                        $scope.deferred = ApplicationParameters.getVariable('deferred');

                        $scope.deferred.resolve(response);
                        $scope.originalResponse = undefined;
                        ApplicationParameters.pushVariable('originalResponse', undefined);
                        //ShaunK: Not sure why this is here, was coded by Mmathabo originally
                        if(ApplicationParameters.getVariable('acceptInvitationRedirect')){
                            Flow.next();
                        }
                    }
                }, function (response) {
                    $scope.notificationType = 'error';
                    $scope.otpMessage = response.headers('x-sbg-response-message');
                    $scope.deferred = ApplicationParameters.getVariable('deferred');
                    ApplicationParameters.pushVariable('errorMessage', $scope.otpMessage);
                    $scope.deferred.reject(response);
                });
            };

            $scope.resend = function () {
                $scope.originalResponse = ApplicationParameters.getVariable('originalResponse');

                var stepUpResponse = angular.copy($scope.originalResponse.data.stepUp);
                var keyValueMetadataResponse = angular.copy($scope.originalResponse.data.keyValueMetadata);
                $scope.initialStatement = 'A new OTP has been sent at ';
                $scope.otp = "";

                if (keyValueMetadataResponse.length === 1 && keyValueMetadataResponse[0].key === "VerificationId") {
                    $scope.initialStatement = 'A new verification code has been sent at ';
                }

                var stepUp = {
                    "code": stepUpResponse.code,
                    "correlationKey": stepUpResponse.correlationKey,
                    "stepUpType": stepUpResponse.stepUpType,
                    "contactMethod": stepUpResponse.contactMethod
                };

                var errorOccurred = function (response) {
                    $scope.notificationType = 'error';
                    $scope.otpMessage = 'Failed to request a new OTP.';
                    if (response.otpError) {
                        $scope.otpMessage = response.message;
                    }
                };

                $http({
                    method: 'POST', url: URL.resendStepUp,
                    data: {
                        keyValueMetadata: keyValueMetadataResponse,
                        stepUp: stepUp
                    }
                }).
                    then(function (response) {
                        if (response.headers('x-sbg-response-type') === 'STEPUP' &&
                            response.headers('x-sbg-response-code') === '0000') {
                            $scope.notificationType = 'info';
                            var timeStamp = response.headers('date');
                            $scope.otpMessage = $scope.initialStatement + dateTimeFormatFilter(timeStamp);
                        } else {
                            errorOccurred(response);
                        }
                    }, function (response) {
                        errorOccurred(response);
                    });
            };

            $scope.cancel = function () {
                Flow.cancel();
                DtmAnalyticsService.cancelFormSubmissionRecord();
            };

            $scope.signout = function () {
                AuthenticationService.logout();
            };

            $scope.showSignOut = function () {
                return !Flow.cancelable();
            };

            var entryMessage = function (originalResponse) {
                var maskedAddress;
                var otpMessage  = 'Enter the one-time password (OTP) that has been sent to your ';

                if(originalResponse && (maskedAddress = originalResponse.data.stepUp.maskedAddress)){
                    var contactMethod = originalResponse.data.stepUp.contactMethod;
                    var stepUpType = originalResponse.data.stepUp.stepUpType;

                    if(stepUpType === 'OTP' && contactMethod === 'SMS'){
                        return otpMessage + 'cell ' + maskedAddress;
                    } else if (stepUpType === 'OTP' && contactMethod === 'Email') {
                        return otpMessage + 'email address ' + maskedAddress;
                    } else {
                        return 'A verification code has been sent to email address ' + maskedAddress;
                    }
                } else {
                    return otpMessage;
                }
            };
        });
}());
