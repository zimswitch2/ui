describe('Migration Service', function () {
    'use strict';
    beforeEach(module('refresh.migration', 'refresh.fixture', 'refresh.navigation', 'refresh.test', 'refresh.parameters'));

    var ServiceError, test, MigrationService, ServiceEndpoint;
    var expectedErrorMsg = 'There is a problem with your profile. Please call Customer Care on 0860 123 000 or visit your nearest branch';

    describe('Migrate Existing user', function () {
        var userProfile = {
            "channelProfiles": [
                {
                    "image": "",
                    "imageDate": null,
                    "tileViews": [],
                    "profileId": "54122",
                    "profileName": "My Personal Dashboard",
                    "profileStyle": "PERSONAL",
                    "systemPrincipalIdentifiers": []
                }
            ],
            "channelSettings": [],
            "defaultProfileId": "54122",
            "digitalId": {
                "devices": [],
                "password": null,
                "systemPrincipals": [],
                "username": "migrate1@ib.co.za"
            },
            "lastLoggedIn": null,
            "preferredName": "SP Something"
        };

        var oldIbAuthenticationCredentials = {
            "something":"sth"
        };

        var expectedRequest = {
            "something":"sth",
            "userProfile": userProfile
        };

        beforeEach(inject(function (_ServiceTest_, _ServiceError_, _MigrationService_, _ServiceEndpoint_) {
            test = _ServiceTest_;
            ServiceError = _ServiceError_;
            MigrationService = _MigrationService_;
            ServiceEndpoint = _ServiceEndpoint_;
            test.spyOnEndpoint('migrateExistingUser');
        }));

        it('should call make request with the correct argument', function () {
            test.stubResponse('migrateExistingUser', 200, {}, {
                'x-sbg-response-type': 'SUCCESS',
                'x-sbg-response-code': '0000'
            });
            MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            expect(test.endpoint('migrateExistingUser')).toHaveBeenCalledWith(expectedRequest);
        });

        it('should call make request and return success', function () {
            test.stubResponse('migrateExistingUser', 200, {}, {
                'x-sbg-response-type': 'SUCCESS',
                'x-sbg-response-code': '0000'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            expect(migrationCall).toBeResolved();
            test.resolvePromise();
        });

        it('should call make request and reject when password or csp is invalid', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '1001'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('Incorrect password or CSP', expectedRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should call make request and reject when card number is invalid', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '2004'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance(expectedErrorMsg, expectedRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should call make request and reject when CSP pin is locked', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '2048'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('As a safety measure, no more attempts will be allowed. Please reset your credentials', expectedRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should call make request and reject when ATM pin is locked', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '2055'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('As a safety measure, no more attempts will be allowed. To reset your ATM PIN you will need to go to your branch.', expectedRequest));
                done();
            });
            test.resolvePromise();
        });


        it('should call make request and reject when service is not available', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '6001'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('This service is not available at the moment. Please try again in a few minutes', expectedRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should call make request and reject when error has occurred', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '9999'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance(expectedErrorMsg, expectedRequest));
                done();
            });
            test.resolvePromise();
        });


        it('should provide the correct message when an invalid card is supplied', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '2003'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('The details you have entered are incorrect. Please re-enter and submit it again.', expectedRequest));
                done();
            });
            test.resolvePromise();
        });


        it('should call make request and reject when error has occurred but no error code', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {'x-sbg-response-type': 'ERROR'});
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance(expectedErrorMsg, expectedRequest));
                done();
            });
            test.resolvePromise();
        });
        it('should call make request and reject with generic OTP locked error message', function (done) {
            test.stubRejection('migrateExistingUser', 200, {message: "Your OTP service has been locked. Please call Customer Care on 0860 123 000"}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '1020',
                'x-sbg-response-message': 'OTP Locked'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance("Your OTP service has been locked. Please call Customer Care on 0860 123 000", expectedRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should call make request and reject when generic error has occurred', function (done) {
            test.stubResponse('migrateExistingUser', 204, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '9876'
            });
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance(expectedErrorMsg, expectedRequest));
                done();
            });
            test.resolvePromise();
        });

        it('should call make request and reject when generic error has occurred', function (done) {
            test.stubResponse('migrateExistingUser', 500, {}, {});
            var migrationCall = MigrationService.migrateExistingUser(oldIbAuthenticationCredentials, userProfile);
            test.resolvePromise();
            migrationCall.catch(function (response) {
                expect(response).toEqual(ServiceError.newInstance('An error has occurred', expectedRequest));
                done();
            });
            test.resolvePromise();
        });


    });
});
