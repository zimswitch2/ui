var personalFinanceManagementFeature = false;


describe('ActivateOtpService', function () {
    'use strict';

    beforeEach(module('refresh.otp.activate.service'));

    beforeEach(inject(function (ActivateOtpService, ServiceTest, User) {
        this.ServiceTest = ServiceTest;
        this.service = ActivateOtpService;

        this.dashboard = new Dashboard({
            systemPrincipalId: '45',
            systemPrincipalKey: 'SBSA_BANKING'
        });
        spyOn(User, 'findDashboardByProfileId').and.returnValue(this.dashboard);
        this.User = User;
    }));

    describe('amend access direct', function () {
        beforeEach(function () {
            this.ServiceTest.spyOnEndpoint('activateAccessDirect');
        });

        describe('successful activate', function () {
            beforeEach(function () {
                this.ServiceTest.stubResponse('activateAccessDirect', 200, {},
                    {'x-sbg-response-type': "SUCCESS", 'x-sbg-response-code': "0000"});

                this.ServiceTest.spyOnEndpoint('cards');
                var cardResponse = personalFinanceManagementFeature ? {
                    card: null,
                    keyValueMetadata: [],
                    stepUp: null,
                    cards: [
                        {
                            cardNumber: '12345',
                            personalFinanceManagementId: 9,
                            systemPrincipalId: '45',
                            statusCode: '0000'
                        }
                    ]
                } : {
                    card: null,
                    keyValueMetadata: [],
                    stepUp: null,
                    cards: [
                        {
                            cardNumber: '12345',
                            systemPrincipalId: '45',
                            statusCode: '0000'
                        }
                    ]
                };
                this.ServiceTest.stubResponse('cards', 200, cardResponse);
            });

            it('should retrieve the user dashboard with the profileId', function () {
                this.service.amendAccessDirect('1');
                expect(this.User.findDashboardByProfileId).toHaveBeenCalledWith('1');
            });

            it('should call activate access direct endpoint', function () {
                expect(this.service.amendAccessDirect('1')).toBeResolved();
                expect(this.ServiceTest.endpoint('activateAccessDirect')).toHaveBeenCalledWith({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '45',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                });
                this.ServiceTest.resolvePromise();
            });

            it('should add card to dashboard', function () {
                expect(this.service.amendAccessDirect('1')).toBeResolved();
                this.ServiceTest.resolvePromise();

                expect(this.dashboard.card).toEqual('12345');
            });
        });

        it('should reject when service returns an error', function () {
            this.ServiceTest.stubResponse('activateAccessDirect', 500, {}, {
                'x-sbg-response-type': "ERROR",
                'x-sbg-response-code': "9999",
                'x-sbg-response-message': 'Technical Exception'
            });

            expect(this.service.amendAccessDirect('1')).toBeRejectedWith({
                message: 'Technical Exception',
                model: {
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '45',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                },
                code: undefined
            });

            this.ServiceTest.resolvePromise();
        });

        it('should reject when HTTP error codes are in the response headers for access direct', function () {
            this.ServiceTest.stubResponse('activateAccessDirect', 204, {},
                {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "9999"});

            expect(this.service.amendAccessDirect('1')).toBeRejectedWith({
                message: 'An error occurred, please try again later',
                model: {
                    systemPrincipalIdentifier: {
                        systemPrincipalId: '45',
                        systemPrincipalKey: 'SBSA_BANKING'
                    }
                },
                code: undefined
            });

            this.ServiceTest.resolvePromise();
        });
    });

    describe('activate otp', function () {
        beforeEach(function () {
            this.ServiceTest.spyOnEndpoint('activateOTP');
        });

        it('should retrieve the user dashboard with the profileId', function () {
            this.ServiceTest.stubResponse('activateOTP', 200, {},
                {'x-sbg-response-type': "SUCCESS", 'x-sbg-response-code': "0000"});

            this.service.activate({}, '1');
            expect(this.User.findDashboardByProfileId).toHaveBeenCalledWith('1');
        });

        it('should call activate endpoint when toggled on', function () {
            caterForInternationalOnActivateOtpFeature = true;
            var contactDetails = {
                cellPhoneNumber: '0811231234',
                internationalDialingCode: '27',
                countryCode: 'ZAF'
            };

            this.ServiceTest.stubResponse('activateOTP', 200, {},
                {'x-sbg-response-type': "SUCCESS", 'x-sbg-response-code': "0000"});

            expect(this.service.activate({
                preferredMethod: 'SMS',
                contactDetails: contactDetails
            }, '1')).toBeResolved();

            expect(this.ServiceTest.endpoint('activateOTP')).toHaveBeenCalledWith({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '45',
                    systemPrincipalKey: 'SBSA_BANKING'
                },
                preferredMethod: 'SMS',
                cellPhoneNumber: '0811231234',
                internationalDialingCode: '27',
                countryCode: 'ZAF'
            });
            this.ServiceTest.resolvePromise();
        });

        it('should call activate endpoint when toggled off', function () {
            caterForInternationalOnActivateOtpFeature = false;
            this.ServiceTest.stubResponse('activateOTP', 200, {},
                {'x-sbg-response-type': "SUCCESS", 'x-sbg-response-code': "0000"});

            expect(this.service.activate({
                preferredMethod: 'SMS',
                cellPhoneNumber: '0811231234'
            }, '1')).toBeResolved();

            expect(this.ServiceTest.endpoint('activateOTP')).toHaveBeenCalledWith({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '45',
                    systemPrincipalKey: 'SBSA_BANKING'
                },
                preferredMethod: 'SMS',
                cellPhoneNumber: '0811231234'
            });
            this.ServiceTest.resolvePromise();
        });

        it('should reject when HTTP error codes are in the response headers', function () {
            this.ServiceTest.stubResponse('activateOTP', 204, {}, {
                'x-sbg-response-type': "ERROR",
                'x-sbg-response-code': "9999",
                'x-sbg-response-message': 'Technical Exception'
            });

            expect(this.service.activate({})).toBeRejectedWith({
                message: 'Technical Exception',
                model: {},
                code: '9999'
            });

            this.ServiceTest.resolvePromise();
        });

        it('should reject when HTTP error codes are in the response headers with generic error message', function () {
            this.ServiceTest.stubResponse('activateOTP', 204, {},
                {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "9999"});

            expect(this.service.activate({})).toBeRejectedWith({
                message: 'An error occurred, please try again later',
                model: {},
                code: '9999'
            });

            this.ServiceTest.resolvePromise();
        });

        it('should reject when HTTP returns failure status', function () {
            this.ServiceTest.stubResponse('activateOTP', 500, {},
                {'x-sbg-response-type': "ERROR", 'x-sbg-response-message': "Technical exception"});

            expect(this.service.activate({})).toBeRejectedWith({
                message: 'An error occurred, please try again later',
                model: {},
                code: undefined
            });

            this.ServiceTest.resolvePromise();
        });

        it('should remove stepup and keyvalue objects from otpPreference object when failure status', function () {
            var expectedOtpPreference = {
                cellPhoneNumber: '',
                emailAddress: "email@email.com",
                preferredMethod: "Email"
            };

            var otpPreferenceWithStepUp = {
                cellPhoneNumber: '',
                emailAddress: "email@email.com",
                preferredMethod: "Email",
                stepUp: {},
                keyValueMetadata: {}
            };

            this.ServiceTest.stubResponse('activateOTP', 204, {},
                {'x-sbg-response-type': "ERROR", 'x-sbg-response-code': "9999"});

            expect(this.service.activate(otpPreferenceWithStepUp)).toBeRejectedWith({
                message: 'An error occurred, please try again later',
                model: expectedOtpPreference,
                code: '9999'
            });

            this.ServiceTest.resolvePromise();
        });
    });
});
