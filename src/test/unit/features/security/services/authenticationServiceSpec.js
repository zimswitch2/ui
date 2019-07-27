describe('Authentication Service', function () {
    'use strict';

    beforeEach(module('refresh.authenticationService'));

    beforeEach(module(function ($provide) {
        var user = jasmine.createSpyObj('User', ['build']);
        $provide.value('User', user);
    }));

    var AuthenticationService, ServiceError, test, DigitalId;

    describe('Login', function () {
        var loginCall;

        beforeEach(inject(function (_AuthenticationService_, _ServiceTest_, _ServiceError_, _DigitalId_) {
            AuthenticationService = _AuthenticationService_;
            test = _ServiceTest_;
            DigitalId = _DigitalId_;
            ServiceError = _ServiceError_;
            test.spyOnEndpoint('authenticate');
            test.spyOnEndpoint('cards');
        }));

        describe('when username or password is blank', function () {
            var blankUsernameOrPasswords = [
                { username: null,  password: null },
                { username: undefined,  password: undefined },
                { username: '',  password: '' },
                { username: null,  password: '' },
                { username: undefined,  password: '' },
                { username: '',  password: null },
                { username: '',  password: undefined }
            ];

            blankUsernameOrPasswords.forEach(function (blankUsernameOrPassword) {
                    it('should return a rejection with the correct error message', function () {
                        expect(AuthenticationService.login(blankUsernameOrPassword.username, blankUsernameOrPassword.password)).toBeRejectedWith({
                            message: 'Please enter a username and password',
                            model: undefined,
                            code: undefined
                        });
                        test.resolvePromise();
                    });

                    it('should not call the gateway', function () {
                        expect(test.endpoint('authenticate')).not.toHaveBeenCalled();
                        test.resolvePromise();
                    });
                }
            );
        });

        describe('when authentication fails', function () {
            it('should know when the username or password are wrong on the first attempt', function () {
                test.stubResponse('authenticate', 200, {}, {'x-sbg-response-code': '1AUTH'});

                expect(AuthenticationService.login("invalid@sb.co.za", "invalidPwd")).toBeRejectedWith({
                    message: 'Please check the sign-in details entered and try again',
                    model: undefined,
                    code: undefined
                });
                test.resolvePromise();
            });

            it('should know when the username or password are wrong on the second attempt and will be locked on the next one', function () {
                test.stubResponse('authenticate', 401, {}, {'x-sbg-response-code': '2AUTH'});

                expect(AuthenticationService.login("invalid@sb.co.za", "invalidPwdSecondTime")).toBeRejectedWith({
                    message: 'Please check the sign-in details entered and try again. After your next failed sign in attempt, your profile will be locked',
                    model: undefined,
                    code: undefined
                });
                test.resolvePromise();
            });

            it('should throw an error if registration is not completed ', function () {
                test.stubResponse('authenticate', 401, {}, {'x-sbg-response-code': '3AUTH'});

                expect(AuthenticationService.login("invalid@sb.co.za", "invalidPwd")).toBeRejectedWith({
                    message: 'Your Profile has not yet been activated. Please complete the registration process',
                    model: undefined,
                    code: undefined
                });
                test.resolvePromise();
            });

            it('should know when the digital ID has been locked', function () {
                test.stubResponse('authenticate', 401, {}, {'x-sbg-response-code': '4AUTH'});

                expect(AuthenticationService.login("invalid@sb.co.za", "lcoed")).toBeRejectedWith({
                    message: 'Your profile has been locked. Please reset your password',
                    model: undefined,
                    code: undefined
                });
                test.resolvePromise();
            });

            it('should know when there has been an unknown error', function () {
                test.stubResponse('authenticate', 401, {}, {'x-sbg-response-code': '9999'});

                expect(AuthenticationService.login("invalid@sb.co.za", "invalidPwd")).toBeRejectedWith({
                    message: 'An error occurred, please try again later',
                    model: undefined,
                    code: undefined
                });
                test.resolvePromise();
            });
        });

        describe('when authentication is successful', function () {
            var response, cardResponse;

            beforeEach(inject(function (Fixture) {
                response = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponse.json'));
                test.stubResponse('authenticate', 200, response, {
                    'x-sbg-token': 'abcde',
                    'x-sbg-response-code': '0000'
                });
                cardResponse = JSON.parse(Fixture.load('base/test/unit/fixtures/cardNumberResponse.json'));
                test.stubResponse('cards', 200, cardResponse, {
                    'x-sbg-response-type': 'SUCCESS',
                    'x-sbg-response-code': '0000'
                });

                loginCall = AuthenticationService.login("ibrefresh@standardbank.co.za", "passworD45");
                test.resolvePromise();
            }));

            afterEach(function () {
                expect(test.endpoint('authenticate')).toHaveBeenCalled();
            });

            describe('with lithiumSSO login', function () {
                it('should return a promise containing a response object', function () {
                    AuthenticationService.login("ibrefresh@standardbank.co.za", "passworD45").then(function (actualResponse) {
                        expect(actualResponse).toEqual(response);
                    });
                    test.resolvePromise();
                });

            });

            it('should take you to the link card if you are newly registered user', function () {
                response.userProfile.channelProfiles[0].systemPrincipalIdentifiers = [];
                response.userProfile.channelProfiles[1].systemPrincipalIdentifiers = [];
                test.stubResponse('authenticate', 200, response, {'x-sbg-token': 'abcde'});

                AuthenticationService.login("ibrefresh@standardbank.co.za", "passworD45").then(function (hasALinkedCard) {
                    expect(hasALinkedCard).toBeFalsy();
                });

                test.resolvePromise();

            });

            it('should have a preferred name', function () {
                loginCall.then(function () {
                    expect(DigitalId.current().preferredName).toEqual("Internet Banking User");
                });
            });

            it('should have the username', function () {
                loginCall.then(function () {
                    expect(DigitalId.current().username).toEqual(response.userProfile.digitalId.username);
                });
            });

            it('should say the digital ID has a card linked to it', function () {
                loginCall.then(function (hasALinkedCard) {
                    expect(hasALinkedCard).toBeTruthy();
                });
            });
        });

        describe('when there is no card linked to the digital ID', function () {
            var response;

            beforeEach(inject(function (Fixture) {
                response = JSON.parse(Fixture.load('base/test/unit/fixtures/authenticateResponseNoSystemPrincipalId.json'));
                test.stubResponse('authenticate', 200, response, {'x-sbg-token': 'abcde'});

                loginCall = AuthenticationService.login("unlinked@standardbank.co.za", "passworD45");
            }));

            afterEach(function () {
                expect(test.endpoint('authenticate')).toHaveBeenCalled();
                test.resolvePromise();
            });

            beforeEach(inject(function (_AuthenticationService_, _ServiceTest_) {
                AuthenticationService = _AuthenticationService_;
                test = _ServiceTest_;
            }));

            it('should have a token', function () {
                loginCall.then(function () {
                    expect(DigitalId.current().authToken).toEqual('abcde');
                });
            });

            it('should say the digital ID has NO card linked to it', function () {
                loginCall.then(function (hasALinkedCard) {
                    expect(hasALinkedCard).toBeFalsy();
                });
            });
        });
    });

    describe('Log out', function () {
        var AuthenticationService, windowFake, ipCookie, unloadCallback;
        beforeEach(function () {
            ipCookie = jasmine.createSpyObj('ipCookie', ['remove']);
            windowFake = jasmine.createSpyObj('window', ['addEventListener']);
            windowFake.location = jasmine.createSpyObj('location', ['reload']);
            windowFake.addEventListener.and.callFake(function (name, callback) {
                unloadCallback = callback;
            });

            module(function ($provide) {
                $provide.constant('$window', windowFake);
                $provide.constant('ipCookie', ipCookie);
            });

            inject(function (_AuthenticationService_) {
                AuthenticationService = _AuthenticationService_;
            });
        });

        it('should remove the cookie on window unload', function () {
            expect(windowFake.addEventListener).toHaveBeenCalledWith('beforeunload', jasmine.any(Function));
            unloadCallback.call();
            expect(ipCookie.remove).toHaveBeenCalledWith('x-sbg-token');
        });

        it('should refresh the page into order to logout', function () {
            AuthenticationService.logout();
            expect(windowFake.location.reload).toHaveBeenCalled();
        });

        it('should delete the token cookie', function () {
            AuthenticationService.logout();
            expect(ipCookie.remove).toHaveBeenCalledWith('x-sbg-token');
        });
    });

    describe('Change password', function () {

        var user;

        beforeEach(inject(function (_ServiceTest_, _AuthenticationService_, _ServiceError_, _User_) {
            test = _ServiceTest_;
            AuthenticationService = _AuthenticationService_;
            ServiceError = _ServiceError_;
            user = _User_;
            test.spyOnEndpoint('changePassword');

            user.userProfile = {username: 'the name'};
        }));

        var changePasswordRequest = {
            securityChallenge: {
                digitalId: "the name",
                password: "newPassword",
                oldPassword: "oldPassword"
            }
        };

        it('should respond with success', function () {
            test.stubResponse('changePassword', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeResolved();
            test.resolvePromise();
        });

        it('should respond with wrong old password with error code 1', function () {
            test.stubResponse('changePassword', 401, {}, {'x-sbg-response-code': '1'});
            expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance('The old password is invalid.', changePasswordRequest));
            test.resolvePromise();
        });

        it('should respond with wrong old password with error code 2', function () {
            test.stubResponse('changePassword', 401, {}, {'x-sbg-response-code': '2'});
            expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance('The old password is invalid. After your next failed attempt, your profile will be locked', changePasswordRequest));
            test.resolvePromise();
        });

        it('should invoke the authentication service and respond with wrong old password with error code 4 ', function () {
            var message = 'Your profile has been locked. You will be returned to the sign in page, where you can reset your password';
            test.stubResponse('changePassword', 401, {}, {'x-sbg-response-code': '4'});

            expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance(message, changePasswordRequest, 'accountHasBeenLocked'));
            test.resolvePromise();
        });

        describe('on IE responding with 200', function () {
            it('should respond with wrong old password with error code 1', function () {
                test.stubResponse('changePassword', 200, {}, {'x-sbg-response-code': '1'});
                expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance('The old password is invalid.', changePasswordRequest));
                test.resolvePromise();
            });

            it('should respond with wrong old password with error code 2', function () {
                test.stubResponse('changePassword', 200, {}, {'x-sbg-response-code': '2'});
                expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance('The old password is invalid. After your next failed attempt, your profile will be locked', changePasswordRequest));
                test.resolvePromise();
            });

            it('should invoke the authentication service and respond with wrong old password with error code 4 ', function () {
                var message = 'Your profile has been locked. You will be returned to the sign in page, where you can reset your password';
                test.stubResponse('changePassword', 200, {}, {'x-sbg-response-code': '4'});

                expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance(message, changePasswordRequest, 'accountHasBeenLocked'));
                test.resolvePromise();
            });
        });

        it('should invoke the authentication service and respond with failure', function () {
            test.stubResponse('changePassword', 200, {}, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR'
            });

            expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance('An error has occurred', changePasswordRequest));
            test.resolvePromise();
        });

        it('should invoke the authentication service with an error', function () {
            test.stubResponse('changePassword', 500, {}, {});

            expect(AuthenticationService.changePassword("oldPassword", "newPassword")).toBeRejectedWith(ServiceError.newInstance('An error has occurred', changePasswordRequest));
            test.resolvePromise();
        });
    });

    describe('Reset password', function () {
        var resetPasswordRequest = {
            securityChallenge: {
                digitalId: "refresh",
                password: "newPassword"
            }
        };

        beforeEach(inject(function (_ServiceTest_, _AuthenticationService_, _ServiceError_) {
            test = _ServiceTest_;
            AuthenticationService = _AuthenticationService_;
            ServiceError = _ServiceError_;
            test.spyOnEndpoint('resetPassword');
        }));

        it('should reset password and respond with success', function (done) {
            test.stubResponse('resetPassword', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            AuthenticationService.resetPassword("refresh", "newPassword").then(function (response) {
                expect(response.data).toEqual({});
                done();
            });
            test.resolvePromise();
        });

        it('should invoke the authentication service and respond with failure', function (done) {
            test.stubResponse('resetPassword', 200, {}, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR'
            });

            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('An error has occurred', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should invoke the authentication service with failure when user does not exist', function (done) {
            test.stubResponse('resetPassword', 200, {}, {
                'x-sbg-response-code': '1000',
                'x-sbg-response-type': 'ERROR'
            });

            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('You have not yet linked your card to Internet banking. To change your password, please do so via the tablet or mobile app', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should not reset password and should respond with an error when given a wrong username', function (done) {
            test.stubResponse('resetPassword', 204, {}, {
                'x-sbg-response-code': '10203',
                'x-sbg-response-type': 'ERROR'
            });
            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('Please enter a valid email address.', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should not reset password and should respond with an error when new password does not conform', function (done) {
            test.stubResponse('resetPassword', 200, {}, {
                'x-sbg-response-code': '10202',
                'x-sbg-response-type': 'ERROR'
            });
            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('Password does not conform.', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should not reset password and should respond with an error when card is hot-carded', function (done) {
            test.stubResponse('resetPassword', 200, {}, {
                'x-sbg-response-code': '2004',
                'x-sbg-response-type': 'ERROR'
            });
            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('Your card has been deactivated for security reasons. Please call Customer Care on 0860 123 000 to reactivate', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should not reset password and should respond with an error when profile is inactive for 18 months', function (done) {
            test.stubResponse('resetPassword', 200, {}, {
                'x-sbg-response-code': '2003',
                'x-sbg-response-type': 'ERROR'
            });
            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('The card linked to this Standard Bank ID has been inactive for more than 18 months. Please call Customer Care on 0860 123 000.', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should not reset password when OTP is inactive', function (done) {
            test.stubResponse('resetPassword', 204, {}, {
                'x-sbg-response-code': '2532',
                'x-sbg-response-type': 'ERROR'
            });
            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('Please activate your OTP service by accessing the old Internet banking site, or call Customer Care on 0860 123 000', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should invoke the authentication service with an error', function (done) {
            test.stubResponse('resetPassword', 500, {}, {});
            AuthenticationService.resetPassword({
                username: "refresh",
                newPassword: "newPassword"
            }).catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('An error has occurred', resetPasswordRequest));
                done();
            });
            test.resolvePromise();
        });
    });

    describe('Reissue token', function () {
        beforeEach(inject(function (_AuthenticationService_, _ServiceTest_, _DigitalId_) {
            AuthenticationService = _AuthenticationService_;
            DigitalId = _DigitalId_;
            test = _ServiceTest_;
            test.spyOnEndpoint('reissueToken');
            test.spyOnEndpoint('authenticate');
            test.spyOnEndpoint('cards');
        }));

        it('should be able to renew session', function () {
            test.stubResponse('reissueToken', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            AuthenticationService.renewSession();
            test.resolvePromise();

            expect(test.endpoint('reissueToken')).toHaveBeenCalled();
        });
    });

    describe('Password Reset', function () {
        describe('with card', function () {
            var passwordResetRequest = {
                securityChallenge: {
                    digitalId: 'refresh',
                    password: 'newPassword',
                    atmPIN: '1234',
                    cardNumber: '12345678901',
                    hasLinkedCard: true
                }
            };

            var expectedPasswordReset = {
                securityChallenge: {
                    digitalId: 'refresh',
                    password: 'newPassword',
                    atmPin: '1234',
                    cardNumber: '12345678901'
                }
            };

            beforeEach(inject(function (_ServiceTest_, _AuthenticationService_, _ServiceError_) {
                test = _ServiceTest_;
                AuthenticationService = _AuthenticationService_;
                ServiceError = _ServiceError_;
                test.spyOnEndpoint('resetPassword');
            }));

            it('should reset password with success', function () {
                test.stubResponse('resetPassword', 200, {}, {
                    'x-sbg-response-code': '0000',
                    'x-sbg-response-type': 'SUCCESS'
                });

                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeResolvedWith({});
                test.resolvePromise();
                expect(test.endpoint('resetPassword')).toHaveBeenCalledWith(expectedPasswordReset);
            });

            it('should reject with message from custom error when response code is 2004', function () {
                test.stubResponse('resetPassword', 200, {message: 'OK'}, {
                    'x-sbg-response-code': '2004',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'Something is wrong'
                });
                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeRejectedWith("These details don't match those we have on record. Check your details and try again – or contact Customer Care on 0860 123 000");
                test.resolvePromise();
            });

            it('should reject with message from custom error when response code is 6001', function () {
                test.stubResponse('resetPassword', 200, {message: 'OK'}, {
                    'x-sbg-response-code': '6001',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'This service is not available at the moment. Please try again in a few minutes'
                });
                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeRejectedWith("This service is not available at the moment. Please try again in a few minutes");
                test.resolvePromise();
            });

            it('should reject with message from service endpoint', function () {
                test.stubResponse('resetPassword', 200, {message: 'OK'}, {
                    'x-sbg-response-code': '0000',
                    'x-sbg-response-type': 'ERROR',
                    'x-sbg-response-message': 'Something is wrong'
                });
                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeRejectedWith('Something is wrong');
                test.resolvePromise();
            });

            it('should reject with error and message when the status is not success and no error message', function () {
                test.stubResponse('resetPassword', 404);
                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
                test.resolvePromise();
            });

            it('should reject with error message when the http call is rejected', function () {
                test.stubRejection('resetPassword', 200, {message: 'this is a custom error'});
                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeRejectedWith('this is a custom error');
                test.resolvePromise();
            });

        });

        describe('without card', function () {
            var passwordResetRequest = {
                securityChallenge: {
                    digitalId: 'refresh',
                    password: 'newPassword',
                    hasLinkedCard: false
                }
            };

            var expectedPasswordReset = {
                securityChallenge: {
                    digitalId: 'refresh',
                    password: 'newPassword'
                }
            };

            beforeEach(inject(function (_ServiceTest_, _AuthenticationService_, _ServiceError_) {
                test = _ServiceTest_;
                AuthenticationService = _AuthenticationService_;
                ServiceError = _ServiceError_;
                test.spyOnEndpoint('resetPassword');
            }));

            it('should reset password with success', function () {
                test.stubResponse('resetPassword', 200, {message: 'OK'}, {
                    'x-sbg-response-code': '0000',
                    'x-sbg-response-type': 'SUCCESS'
                });

                expect(AuthenticationService.passwordReset(passwordResetRequest)).toBeResolved();
                test.resolvePromise();
                expect(test.endpoint('resetPassword')).toHaveBeenCalledWith(expectedPasswordReset);
            });
        });
    });

    describe('Link Card Status', function () {

        var linkCardStatusRequest = {
            digitalId: 'refresh'
        };

        beforeEach(inject(function (_ServiceTest_, _AuthenticationService_, _ServiceError_) {
            test = _ServiceTest_;
            AuthenticationService = _AuthenticationService_;
            ServiceError = _ServiceError_;
            test.spyOnEndpoint('linkCardStatus');
        }));

        it('should check card status successfully', function () {
            test.stubResponse('linkCardStatus', 200, {"hasLinkedCard": true}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS',
                'x-sbg-response-message': 'SUCCESS'
            });

            expect(AuthenticationService.linkCardStatus(linkCardStatusRequest)).toBeResolvedWith({"hasLinkedCard": true});
            test.resolvePromise();
            expect(test.endpoint('linkCardStatus')).toHaveBeenCalledWith(linkCardStatusRequest);
        });
        
        it('should reject with message in the custom errors', function () {
            test.stubResponse('linkCardStatus', 200, {message: 'OK'}, {
                'x-sbg-response-code': '10203',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(AuthenticationService.linkCardStatus(linkCardStatusRequest)).toBeRejectedWith(
                'The email you entered is invalid. Please re-enter the email address you used to register'
            );
            test.resolvePromise();
        });

        it('should reject with message from endpoint', function () {
            test.stubResponse('linkCardStatus', 200, {message: 'OK'}, {
                'x-sbg-response-code': '10201',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(AuthenticationService.linkCardStatus(linkCardStatusRequest)).toBeRejectedWith(
                'Something is wrong'
            );
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('linkCardStatus', 404);
            expect(AuthenticationService.linkCardStatus(linkCardStatusRequest)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });

    });
});
