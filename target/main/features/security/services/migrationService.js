'use strict';

(function (app) {

    app.factory('MigrationService', function (ServiceEndpoint, ServiceError, $q) {
        var userMigrationErrorCodes = {
            '1000': 'Incorrect password or CSP',
            '1001': 'Incorrect password or CSP',
            '2048': 'As a safety measure, no more attempts will be allowed. Please reset your credentials',
            '6001': 'This service is not available at the moment. Please try again in a few minutes',
            '2003': 'The details you have entered are incorrect. Please re-enter and submit it again.',
            '2055': 'As a safety measure, no more attempts will be allowed. To reset your ATM PIN you will need to go to your branch.',
            '10001': 'The details you entered do not match those we have on record. Please try again, or contact your branch'
        };

        return {
            migrateExistingUser: function (authenticationCredentials, userProfile) {
                var migrationRequest = _.merge(authenticationCredentials, {"userProfile": userProfile});

                return ServiceEndpoint.migrateExistingUser.makeFormSubmissionRequest(migrationRequest)
                    .then(function (response) {
                        var responseCode = response.headers('x-sbg-response-code');
                        if (responseCode === '0000') {
                            return response;
                        } else if (userMigrationErrorCodes[responseCode]) {
                            return $q.reject(ServiceError.newInstance(userMigrationErrorCodes[responseCode], migrationRequest));
                        } else {
                            return $q.reject(ServiceError.newInstance('There is a problem with your profile. Please call Customer Care on 0860 123 000 or visit your nearest branch', migrationRequest));
                        }
                    }, function (response) {
                        var message = response.message || "An error has occurred";
                        return $q.reject(ServiceError.newInstance(message, migrationRequest));
                    });
            }

        };
    });

})(angular.module('refresh.migration', ['refresh.configuration']));
