var newRegisteredPageFeature = false;
if(feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

(function (app) {
    'use strict';

    app.factory('RegistrationService',
        function (ServiceEndpoint, DigitalIdData, LinkCardData, ApplicationParameters, $q, ServiceError, DigitalId,
                  User) {

            var linkCardErrorResponses = {
                'Your card number is either illegal or has expired. Please contact our call centre on 0860 123 000 or your branch to resolve this problem. Alternatively you can send an email to Support at ibsupport@standardbank.co.za': 'Please enter a valid card number',
                'Mobile Banking is not available at present. Please try again later.': 'This service is not available at the moment. Please try again in a few minutes',
                'The details you entered do not match the details we have on record. Please enter the correct login details, or contact your relationship manager to verify your details.': 'The details you entered do not match those we have on record. Please try again, or contact your branch'
            };

            var serviceRejection = function (headerMessage, responseCode, responseMessage) {
                var linkCardMessages = {
                    '2003': 'The details you have entered are incorrect. Please re-enter and submit it again.',
                    '6001': 'This service is not available at the moment. Please try again in a few minutes',
                    '10001': 'The details you entered do not match those we have on record. Please try again, or contact your branch'
                };
                var errorMessage = linkCardMessages[responseCode] || responseMessage || headerMessage ||
                    'User could not be registered. Check your network connection.';
                return $q.reject(ServiceError.newInstance(errorMessage, {}));
            };

            var linkCard = function (cardNumber, profileId, contactDetails, atmPin) {
                return ServiceEndpoint.linkCard.makeFormSubmissionRequest(LinkCardData.newInstance(cardNumber, profileId, contactDetails, atmPin))
                    .then(function (response) {
                        if (response.headers('x-sbg-response-type') !== "ERROR") {
                            return {
                                success: true,
                                data: response.data
                            };
                        } else {
                            return {
                                success: false,
                                message: linkCardErrorResponses[response.headers('x-sbg-response-message')] ||
                                response.headers('x-sbg-response-message')
                            };
                        }
                    }, function (error) {
                        return {
                            success: false,
                            message: error.message || "Card could not be linked. Check your network connection."
                        };
                    });
            };

            return {
                createDigitalID: function (username, password, preferredName) {
                    ApplicationParameters.pushVariable('isRegistering', true);

                    return ServiceEndpoint.register.makeFormSubmissionRequest(DigitalIdData.newInstance(username, password,
                        preferredName))
                        .then(function (response) {
                            var responseCode = response.headers('x-sbg-response-code');
                            if (responseCode !== '0000') {
                                return serviceRejection(response.headers('x-sbg-response-message'), responseCode);
                            } else {
                                User.build(response.data.userProfile);

                                if (!newRegisteredPageFeature) {
                                    ApplicationParameters.pushVariable('hasAdded', true);
                                    ApplicationParameters.pushVariable('isSuccessful', true);
                                }
                                return response;
                            }
                        }, function (response) {
                            var message = response.data.message || response.message;
                            return serviceRejection(response.headers('x-sbg-response-message'),
                                response.headers('x-sbg-response-code'), message);
                        });
                },

                linkCard: function (cardNumber, profileId, cellPhoneNumber, atmPin) {
                    return linkCard(cardNumber, profileId, cellPhoneNumber, atmPin);
                },

                linkAdditionalCard: function (cardNumber, cellPhoneNumber, atmPin) {
                    return linkCard(cardNumber, null, cellPhoneNumber, atmPin);
                },
                processLinkedCard: function (cardNumber, responseData, profileId) {
                    var currentDigitalId = DigitalId.current();
                    ApplicationParameters.pushVariable('newlyLinkedCardNumber', cardNumber);
                    ApplicationParameters.pushVariable('hasInfo', true);
                    responseData.digitalId = {
                        username: currentDigitalId.username
                    };
                    responseData.preferredName = currentDigitalId.preferredName;
                    responseData.defaultProfileId = profileId;
                    return User.build(responseData, currentDigitalId.authToken);
                }
            };
        });

    app.factory('DigitalIdData', function () {
        return {
            newInstance: function (user, password, preferredName) {
                return {
                    digitalId: {
                        username: user,
                        password: password,
                        systemPrincipals: []
                    },
                    preferredName: preferredName
                };
            }
        };
    });

    app.factory('LinkCardData', function () {
        return {
            newInstance: function (cardNumber, profileId, contactDetails, atmPin) {
                return {
                    cardNumber: cardNumber,
                    profileId: profileId,
                    countryCode: contactDetails.countryCode,
                    internationalDialingCode: contactDetails.internationalDialingCode,
                    cellPhoneNumber: contactDetails.cellPhoneNumber,
                    atmPIN: atmPin
                };
            }
        };
    });

})(angular.module('refresh.registration.service',
    ['refresh.configuration', 'refresh.navigation', 'refresh.flow', 'refresh.parameters', 'refresh.card',
        'refresh.error.service']));