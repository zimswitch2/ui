var newRegisteredPageFeature = false;
{
    newRegisteredPageFeature = true;
}

describe('RegistrationService', function () {
    'use strict';

    beforeEach(module('refresh.registration', 'refresh.test', 'refresh.security.user', 'refresh.fixture'));

    var registrationService, test, applicationParameters, serviceError, digitalId, user, fixture, registrationResponse,
        linkCardResponse, _mock_;

    beforeEach(inject(function (ServiceTest, RegistrationService, ApplicationParameters, ServiceError, DigitalId, User,
                                Fixture, mock) {
        registrationService = RegistrationService;
        test = ServiceTest;
        digitalId = DigitalId;
        applicationParameters = ApplicationParameters;
        serviceError = ServiceError;
        test.spyOnEndpoint('register');
        test.spyOnEndpoint('linkCard');
        fixture = Fixture;
        user = User;
        _mock_ = mock;

        registrationResponse =
            JSON.parse(fixture.load('base/test/unit/fixtures/registrationResponse.json'));
        linkCardResponse =
            JSON.parse(fixture.load('base/test/unit/fixtures/linkCardResponse.json'));
    }));

    describe('create digital id', function () {

        it('should know when in registering process', function () {


            test.stubResponse('register', 200, registrationResponse,
                {'x-sbg-response-code': '0000', 'x-sbg-response-type': 'SUCCESS'});
            registrationService.createDigitalID('name', 'password', 'Best Name');
            test.resolvePromise();

            expect(applicationParameters.getVariable('isRegistering')).toBeTruthy();
            expect(user.userProfile.defaultProfileId).toEqual('44532');
        });

        it('should invoke the create digital id service with correct params', function () {
            test.stubResponse('register', 200, {
                'userProfile': {
                    channelProfiles: [
                        {'profileId': 1}
                    ]
                }
            }, {'x-sbg-response-code': '0000', 'x-sbg-response-type': 'SUCCESS'});
            var username = "userName";
            var password = "passWord";
            var preferredName = "preferredName";
            var expectedDigitalId = {
                digitalId: {
                    username: username,
                    password: password,
                    systemPrincipals: []

                },
                preferredName: preferredName
            };

            registrationService.createDigitalID(username, password, preferredName);
            expect(test.endpoint('register')).toHaveBeenCalledWith(expectedDigitalId);
        });

        describe('upon success', function () {
            it('should create profile data on success', function () {
                registrationResponse.userProfile.preferredName = "Best Name";
                registrationResponse.userProfile.digitalId.username = "name";
                test.stubResponse('register', 200, registrationResponse,
                    {'x-sbg-response-code': '0000', 'x-sbg-response-type': 'SUCCESS'});
                newRegisteredPageFeature = true;
                registrationService.createDigitalID('name', 'password', 'Best Name');
                test.resolvePromise();

                expect(digitalId.current().preferredName).toEqual('Best Name');
                expect(digitalId.current().username).toEqual('name');
            });

            it('should create profile data on success with newRegisteredPage off', function () {
                registrationResponse.userProfile.preferredName = "Best Name";
                registrationResponse.userProfile.digitalId.username = "name";
                test.stubResponse('register', 200, registrationResponse,
                    {'x-sbg-response-code': '0000', 'x-sbg-response-type': 'SUCCESS'});
                newRegisteredPageFeature = false;
                registrationService.createDigitalID('name', 'password', 'Best Name');
                test.resolvePromise();

                expect(digitalId.current().preferredName).toEqual('Best Name');
                expect(digitalId.current().username).toEqual('name');
                expect(applicationParameters.getVariable('hasAdded')).toBeTruthy();
                expect(applicationParameters.getVariable('isSuccessful')).toBeTruthy();
            });
        });

        describe('upon failure', function () {
            it('should reject with default message when there is no message in headers', function () {
                test.stubResponse('register', 500, {}, {'x-sbg-response-code': '9999', 'x-sbg-response-type': 'ERROR'});

                expect(registrationService.createDigitalID('name', 'password', 'Best Name'))
                    .toBeRejectedWith(serviceError.newInstance('User could not be registered. Check your network connection.',
                        {}));

                test.resolvePromise();
            });

            it('should reject with service error message when there is message in headers', function () {
                test.stubResponse('register', 500, {},
                    {'x-sbg-response-code': '9999', 'x-sbg-response-type': 'ERROR', 'x-sbg-response-message': 'OMG'});

                expect(registrationService.createDigitalID('name', 'password', 'Best Name'))
                    .toBeRejectedWith(serviceError.newInstance('OMG', {}));

                test.resolvePromise();
            });

            it('should reject on an error service response disguised as 200', function () {
                test.stubResponse('register', 200, {},
                    {'x-sbg-response-code': '9999', 'x-sbg-response-type': 'ERROR', 'x-sbg-response-message': 'OMG'});

                expect(registrationService.createDigitalID('name', 'password', 'Best Name'))
                    .toBeRejectedWith(serviceError.newInstance('OMG', {}));

                test.resolvePromise();
            });

            it('should reject on an error when card is invalid', function () {
                test.stubResponse('register', 500, {}, {
                    'x-sbg-response-code': '2003',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'Some error occured'
                });

                expect(registrationService.createDigitalID('name', 'password', 'Best Name'))
                    .toBeRejectedWith(serviceError.newInstance('The details you have entered are incorrect. Please re-enter and submit it again.',
                        {}));

                test.resolvePromise();
            });

            it('should reject with generic OTP error message', function () {
                test.stubResponse('register', 500,
                    {message: "Your OTP service has been locked. Please call Customer Care on 0860 123 000"}, {
                        'x-sbg-response-code': '1020',
                        'x-sbg-response-type': 'ERROR',
                        'x-sbg-response-message': 'OTP Locked'
                    });
                expect(registrationService.createDigitalID('name', 'password', 'Best Name'))
                    .toBeRejectedWith(serviceError.newInstance('Your OTP service has been locked. Please call Customer Care on 0860 123 000',
                        {}));
                test.resolvePromise();
            });
        });
    });

    describe('link card', function () {

        var cardNumber = "12345678";
        var profileId = "IBUser";
        var contactDetails = {
            countryCode: '01-26598791',
            internationalDialingCode: 'Zap',
            cellPhoneNumber: '26598791'
        };
        var atmPin = "12345";

        var expectedLinkedCardData = {
            cardNumber: cardNumber,
            profileId: profileId,
            countryCode: '01-26598791',
            internationalDialingCode: 'Zap',
            cellPhoneNumber: '26598791',
            atmPIN: atmPin
        };

        it('should resolve with success and data from service endpoint', function () {
            test.stubResponse('linkCard', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(registrationService.linkCard(cardNumber, profileId, contactDetails, atmPin)).toBeResolvedWith({
                success: true,
                data: {message: 'OK'}
            });
            expect(test.endpoint('linkCard')).toHaveBeenCalledWith(expectedLinkedCardData);
            test.resolvePromise();
        });

        it('should resolve with error and message from service endpoint when with error in header', function () {
            test.stubResponse('linkCard', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(registrationService.linkCard(cardNumber, profileId, contactDetails, atmPin)).toBeResolvedWith({
                success: false,
                message: 'Something is wrong'
            });
            test.resolvePromise();
        });

        it('should resolve with specified error message when with a hot card message error in header', function () {
            test.stubResponse('linkCard', 200, {message: 'OK'}, {
                'x-sbg-response-code': '2001',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Your card number is either illegal or has expired. Please contact our call centre on 0860 123 000 or your branch to resolve this problem. Alternatively you can send an email to Support at ibsupport@standardbank.co.za'
            });
            expect(registrationService.linkCard(cardNumber, profileId, contactDetails, atmPin)).toBeResolvedWith({
                success: false,
                message: 'Please enter a valid card number'
            });
            test.resolvePromise();
        });

        it('should resolve with specific error from service endpoint when promise rejects', function () {
            test.stubRejection('linkCard', 400, {message: 'Technical Error'}, {
                'x-sbg-response-code': '2001',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Card could not be linked.'
            });
            expect(registrationService.linkCard(cardNumber, profileId, contactDetails, atmPin)).toBeResolvedWith({
                success: false,
                message: 'Technical Error'
            });
            test.resolvePromise();
        });

        it('should resolve with generic error (Card could not be linked. Check your network connection) for any uncaught error occurs',
            function () {
                test.stubRejection('linkCard', 500, {}, {
                    'x-sbg-response-code': '2001',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'Card could not be linked.'
                });
                expect(registrationService.linkCard(cardNumber, profileId, contactDetails, atmPin)).toBeResolvedWith({
                    success: false,
                    message: 'Card could not be linked. Check your network connection.'
                });
                test.resolvePromise();
            });
    });

    describe('link additional card', function () {

        var cardNumber = "12345678";
        var contactDetails = {
            countryCode: '01-26598791',
            internationalDialingCode: 'Zap',
            cellPhoneNumber: '26598791'
        };
        var atmPin = "12345";

        var expectedLinkedCardData = {
            cardNumber: cardNumber,
            profileId: null,
            countryCode: '01-26598791',
            internationalDialingCode: 'Zap',
            cellPhoneNumber: '26598791',
            atmPIN: atmPin
        };

        it('should invoke the link additional card service', function () {
            test.stubResponse('linkCard', 200, {}, {
                'x-sbg-response-code': '2003',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Some error occured'
            });

            registrationService.linkAdditionalCard(cardNumber, contactDetails, atmPin);
            expect(test.endpoint('linkCard')).toHaveBeenCalledWith(expectedLinkedCardData);
        });

    });

    describe('process linked card', function () {
        var expectedResponseData = {
            digitalId: {
                username: 'username'
            },
            preferredName: 'preferredName',
            defaultProfileId: 'profileId'
        };
        var currentDigitalId = {
            username: 'username',
            preferredName: 'preferredName',
            authToken: 'authToken'
        };

        beforeEach(function () {
            spyOn(digitalId, 'current');
            digitalId.current.and.returnValue(currentDigitalId);
        });


        it('should push "newlyLinkedCardNumber" into application parameter', function () {
            spyOn(applicationParameters, 'pushVariable');
            registrationService.processLinkedCard('12334', {}, 'profileId');
            expect(applicationParameters.pushVariable).toHaveBeenCalledWith('newlyLinkedCardNumber', '12334');
        });

        it('should push "hasInfo" into application parameter', function () {
            spyOn(applicationParameters, 'pushVariable');
            registrationService.processLinkedCard('12334', {}, 'profileId');
            expect(applicationParameters.pushVariable).toHaveBeenCalledWith('hasInfo', true);
        });

        it('should set response.data properties', function () {
            var responseData = {};
            registrationService.processLinkedCard('12334', responseData, 'profileId');
            expect(responseData).toEqual(expectedResponseData);
        });

        it('should build user', function () {
            spyOn(user, 'build');
            user.build.and.returnValue(_mock_.resolve({}));
            expect(registrationService.processLinkedCard('12334', {},
                'profileId')).toBeResolvedWith({});
            expect(user.build).toHaveBeenCalledWith(expectedResponseData, 'authToken');
        });
    });

});