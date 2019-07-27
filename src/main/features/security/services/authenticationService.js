(function () {
    'use strict';

    var module = angular.module('refresh.authenticationService',
        [
            'refresh.parameters',
            'refresh.digitalId',
            'ipCookie',
            'refresh.error.service',
            'refresh.security.user'
        ]);

    module.run(function ($window, ipCookie) {
        $window.addEventListener('beforeunload', function () {
            ipCookie.remove('x-sbg-token');
        });
    });

    module.factory('AuthenticationService', function ($window, DigitalId, ServiceEndpoint, ServiceError, $q, ApplicationParameters, User, ipCookie) {
        var resetPasswordErrorResponses = {
            '10202': 'Password does not conform.',
            '10203': 'Please enter a valid email address.',
            '2004': 'Your card has been deactivated for security reasons. Please call Customer Care on 0860 123 000 to reactivate',
            '2003': 'The card linked to this Standard Bank ID has been inactive for more than 18 months. Please call Customer Care on 0860 123 000.',
            '1000': 'You have not yet linked your card to Internet banking. To change your password, please do so via the tablet or mobile app',
            "2532": 'Please activate your OTP service by accessing the old Internet banking site, or call Customer Care on 0860 123 000'
        };

        var authenticationErrorResponses = {
            '1AUTH': "Please check the sign-in details entered and try again",
            '2AUTH': "Please check the sign-in details entered and try again. After your next failed sign in attempt, your profile will be locked",
            '3AUTH': "Your Profile has not yet been activated. Please complete the registration process",
            '4AUTH': "Your profile has been locked. Please reset your password",
            '6001': "This service is not available at the moment. Please try again in a few minutes"
        };

        var changePasswordAuthenticationErrorResponses = {
            '1': 'The old password is invalid.',
            '2': 'The old password is invalid. After your next failed attempt, your profile will be locked',
            '4': 'Your profile has been locked. You will be returned to the sign in page, where you can reset your password'
        };

        var linkCardStatusResponses = {
            '10203': 'The email you entered is invalid. Please re-enter the email address you used to register'
        };

        var passwordRestResponse = {
            '2004': "These details don't match those we have on record. Check your details and try again – or contact Customer Care on 0860 123 000",
            '1000': "These details don't match those we have on record. Check your details and try again – or contact Customer Care on 0860 123 000",
            '6001': "This service is not available at the moment. Please try again in a few minutes"
        };

        var errorMessage = 'We are experiencing technical problems. Please try again later';

        var rejectChangePassword = function (responseCode, request) {
            if (responseCode === '4') {
                return $q.reject(ServiceError.newInstance(changePasswordAuthenticationErrorResponses[responseCode], request, 'accountHasBeenLocked'));
            } else if (changePasswordAuthenticationErrorResponses[responseCode]) {
                return $q.reject(ServiceError.newInstance(changePasswordAuthenticationErrorResponses[responseCode], request));
            } else {
                return $q.reject(ServiceError.newInstance('An error has occurred', request));
            }
        };

        return {
            logout: function () {
                ipCookie.remove('x-sbg-token');
                $window.location.reload();
            },

            login: function (username, password) {
                if(!username || !password) {
                    return $q.reject(ServiceError.newInstance('Please enter a username and password'));
                }
                return ServiceEndpoint.authenticate.makeFormSubmissionRequest(DigitalId.newInstance(username, password), { omitServiceErrorNotification: true })
                    .then(function (response) {
                        var responseCode = response.headers('x-sbg-response-code');
                        if (responseCode !== '0000') {
                            return $q.reject(ServiceError.newInstance(authenticationErrorResponses[responseCode] || 'An error occurred, please try again later'));
                        } else {
                            return $q.when(response.data);
                        }
                    }, function (authenticationErrorResponse) {
                        var responseCode = authenticationErrorResponse.headers('x-sbg-response-code');
                        return $q.reject(ServiceError.newInstance(authenticationErrorResponses[responseCode] || 'An error occurred, please try again later'));
                    });
            },

            renewSession: function () {
                ServiceEndpoint.reissueToken.makeRequest();
            },

            changePassword: function (oldPassword, newPassword) {
                var request = {
                    securityChallenge: {
                        digitalId: User.userProfile.username,
                        oldPassword: oldPassword,
                        password: newPassword
                    }
                };

                return ServiceEndpoint.changePassword.makeRequest(request)
                    .then(function (response) {
                        var responseCode = response.headers('x-sbg-response-code');
                        if (responseCode === '0000') {
                            return response;
                        } else {
                            return rejectChangePassword(responseCode, request);
                        }
                    }, function (response) {
                        return rejectChangePassword(response.headers('x-sbg-response-code'), request);
                    });
            },

            resetPassword: function (authenticationDetails) {
                var deferred = $q.defer();
                var request = {
                    securityChallenge: {
                        digitalId: authenticationDetails.username,
                        password: authenticationDetails.newPassword
                    }
                };
                ServiceEndpoint.resetPassword.makeRequest(request)
                    .then(function (response) {
                        var responseCode = response.headers('x-sbg-response-code');
                        if (responseCode === '0000') {
                            deferred.resolve(response);
                        } else if (resetPasswordErrorResponses[responseCode]) {
                            deferred.reject(ServiceError.newInstance(resetPasswordErrorResponses[responseCode], request));
                        } else {
                            deferred.reject(ServiceError.newInstance('An error has occurred', request));
                        }
                    }, function (error) {
                        var errorMessage = error.message || 'An error has occurred';
                        deferred.reject(ServiceError.newInstance(errorMessage, request));
                    });
                return deferred.promise;
            },

            passwordReset: function (authenticationDetails) {
                var request = {};
                if (authenticationDetails.securityChallenge.hasLinkedCard) {
                    request = {
                        securityChallenge: {
                            digitalId: authenticationDetails.securityChallenge.digitalId,
                            cardNumber: authenticationDetails.securityChallenge.cardNumber,
                            atmPin: authenticationDetails.securityChallenge.atmPIN,
                            password: authenticationDetails.securityChallenge.password
                        }
                    };
                } else {
                    request = {
                        securityChallenge: {
                            digitalId: authenticationDetails.securityChallenge.digitalId,
                            password: authenticationDetails.securityChallenge.password
                        }
                    };
                }
                return ServiceEndpoint.resetPassword.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'ERROR') {
                        if (passwordRestResponse[response.headers('x-sbg-response-code')]) {
                            return $q.reject({message: passwordRestResponse[response.headers('x-sbg-response-code')]});
                        }
                        return $q.reject({message: response.headers('x-sbg-response-message')});
                    }
                    return response.data;
                }).catch(function (error) {
                    return $q.reject(error.message || errorMessage);
                });
            },

            linkCardStatus: function (digitalId) {
                return ServiceEndpoint.linkCardStatus.makeRequest(digitalId).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'ERROR') {
                        if (linkCardStatusResponses[response.headers('x-sbg-response-code')]) {
                            return $q.reject({message: linkCardStatusResponses[response.headers('x-sbg-response-code')]});
                        }
                        return $q.reject({message: response.headers('x-sbg-response-message')});
                    }
                    return response.data;
                }).catch(function (error) {
                    return $q.reject(error.message || errorMessage);
                });
            }
        };
    });
}());
