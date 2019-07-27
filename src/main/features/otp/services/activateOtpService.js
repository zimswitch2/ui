var caterForInternationalOnActivateOtpFeature = false;

if (feature.caterForInternationalOnActivateOtp) {
    caterForInternationalOnActivateOtpFeature = true;
}

(function () {
    'use strict';

    var module = angular.module('refresh.otp.activate.service',
        [
            'refresh.configuration',
            'refresh.security.user',
            'refresh.error.service'
        ]);

    module.factory('ActivateOtpService', function (ServiceEndpoint, ServiceError, $q, Principal, User) {
        var rejectWithError = function (response, otpPreferences, responseMessage) {
            var responseCode = response.headers('x-sbg-response-code');
            if (!responseMessage) {
                responseMessage = response.headers('x-sbg-response-message') || 'An error occurred, please try again later';
            }

            var otpPreferencesWithoutStepUp = _.omit(otpPreferences, 'stepUp');
            var cleanOtpPreferences = _.omit(otpPreferencesWithoutStepUp, 'keyValueMetadata');

            return $q.reject(ServiceError.newInstance(responseMessage, cleanOtpPreferences, responseCode));
        };

        return {
            activate: function (otpPreferences, profileId) {
                var dashboard = User.findDashboardByProfileId(profileId);
                var request = Principal.newInstance(dashboard.systemPrincipalId, dashboard.systemPrincipalKey);

                if (caterForInternationalOnActivateOtpFeature && otpPreferences.contactDetails) {
                    otpPreferences.cellPhoneNumber = otpPreferences.contactDetails.cellPhoneNumber;
                    otpPreferences.internationalDialingCode = otpPreferences.contactDetails.internationalDialingCode;
                    otpPreferences.countryCode = otpPreferences.contactDetails.countryCode;
                    delete otpPreferences.contactDetails;
                }


                request = _.merge(request, otpPreferences);

                return ServiceEndpoint.activateOTP.makeRequest(request)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-type') === 'ERROR') {
                            return rejectWithError(response, otpPreferences);
                        }
                    }, function (response) {
                        return rejectWithError(response, otpPreferences, 'An error occurred, please try again later');
                    });
            },

            amendAccessDirect: function (profileId) {
                var dashboard = User.findDashboardByProfileId(profileId);
                var request = Principal.newInstance(dashboard.systemPrincipalId, dashboard.systemPrincipalKey);
                return ServiceEndpoint.activateAccessDirect.makeRequest(request)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-type') === 'ERROR') {
                            return $q.reject(response);
                        } else {
                            return User.addCardDetailsToDashboards([dashboard]);
                        }
                    }).catch(function (response) {
                        var responseMessage = response.headers('x-sbg-response-message') || 'An error occurred, please try again later';
                        return $q.reject(ServiceError.newInstance(responseMessage, request));
                    });
            }
        };
    });
}());