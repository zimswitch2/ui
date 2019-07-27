var caterForInternationalOnActivateOtpFeature = false;

if(feature.caterForInternationalOnActivateOtp){
    caterForInternationalOnActivateOtpFeature = true;
}

describe('ACCEPTANCE - Activate Otp Functionality', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var activateOtpPage = require('../../pages/activateOtpPage.js');
    var otpPage = require('../../pages/otpPage.js');

    if(caterForInternationalOnActivateOtpFeature){
        describe('Otp activation for international number', function () {
            var loggedIn;

            beforeEach(function () {
                if (loggedIn === undefined) {
                    loginPage.load();
                    loginPage.enterUserCredentials(browser.params.credentialsForActivateOTP.username, browser.params.credentialsForActivateOTP.password);
                    loggedIn = 1;
                }

            });
            it('should display South Africa as a default country', function () {
                expect(activateOtpPage.baseActions.getCurrentUrl()).toMatch("/otp/activate");
                expect(activateOtpPage.getInternationalDialingCode().isPresent()).toBeTruthy();
                expect(activateOtpPage.getInternationalDialingCode().getText()).toContain('+27');
                expect(activateOtpPage.getCountryInput()).toEqual('South Africa +27');
            });

            it('should not change default when toggling between sms and email', function () {
                activateOtpPage.setOtpType('Email');
                activateOtpPage.setOtpType('SMS');
                expect(activateOtpPage.getCountryInput()).toEqual('South Africa +27');
                expect(activateOtpPage.getInternationalDialingCode().getText()).toContain('+27');
            });

            it('should be able to select different country', function () {
                activateOtpPage.clickOnInternationalDialingCode();
                activateOtpPage.selectCountry('Zimbabwe');
                expect(activateOtpPage.getInternationalDialingCode().getText()).toContain('+263');
            });

            it('should display correct details on confirm page', function () {
                activateOtpPage.enterDetails('0788541124');
                activateOtpPage.proceed();
                expect(activateOtpPage.confirmType().getText()).toEqual('SMS');
                expect(activateOtpPage.cellPhoneValue().getText()).toEqual('+263-788541124');
            });

            it('should display initially captured details when clicking modify button', function () {
                activateOtpPage.modify();
                expect(activateOtpPage.preferredMethodValue()).toEqual('SMS');
                expect(activateOtpPage.getCellPhoneNumber()).toEqual('788541124');
                expect(activateOtpPage.getCountryInput()).toEqual('Zimbabwe +263');
            });

            it('should successfully activate OTP and display correct details on success page', function () {
                activateOtpPage.proceed();
                activateOtpPage.activate();
                otpPage.submitOtp('12345');
                expect(activateOtpPage.baseActions.getCurrentUrl()).toMatch("/otp/activate/success");
                expect(activateOtpPage.confirmType().getText()).toEqual('SMS');
                expect(activateOtpPage.cellPhoneValue().getText()).toEqual('+263-788541124');
            });
        });
    }

    describe('activate OTP', function () {
        var loggedIn;

        beforeEach(function () {
            if (loggedIn === undefined) {
                loginPage.load();
                loginPage.enterUserCredentials(browser.params.credentialsForActivateOTP.username, browser.params.credentialsForActivateOTP.password);
                loggedIn = 1;
            }

        });
        function assertValidationForOtpPreference(otpAddress, message) {
            expect(activateOtpPage.baseActions.getErrorFor(otpAddress)).toMatch(message);
            expect(activateOtpPage.canProceed()).toBeFalsy();
        }

        function assertConfirmationInformation(method, address) {
            expect(activateOtpPage.confirmType()).toEqual(method);
            if (method === 'SMS') {
                expect(activateOtpPage.confirmPhoneNumber()).toEqual(address);
            }
            else {
                expect(activateOtpPage.confirmEmailAddress()).toEqual(address);
            }
        }

        function assertServiceErrorFlow() {
            expect(activateOtpPage.baseActions.getCurrentUrl()).toMatch("/otp/activate");
            expect(activateOtpPage.baseActions.getErrorMessage()).toEqual('An error occurred, please try again later');
        }

        function assertFullSuccessFlow() {
            activateOtpPage.setOtpAddress('SMS', '0815555556');
            activateOtpPage.proceed();
            activateOtpPage.activate();
            otpPage.submitOtp('12345');

            expect(activateOtpPage.baseActions.getCurrentUrl()).toMatch("/otp/activate/success");
        }


        function assertModifyFlow() {
            activateOtpPage.modify();
            expect(activateOtpPage.preferredMethodValue()).toEqual('Email');
            expect(activateOtpPage.emailValue()).toEqual('email@email.com');
            activateOtpPage.setOtpAddress('SMS', '0815555555');
        }

        it("should display valid error message when invalid email address is entered", function () {
            expect(activateOtpPage.baseActions.getCurrentUrl()).toMatch("/otp/activate");

            activateOtpPage.setOtpAddress('Email', 'not-valid-email');
            assertValidationForOtpPreference('email-address', 'Please enter a valid email address');
        });

        it('should set email address as OTP option and display correct details on confirmation page', function () {
            activateOtpPage.setOtpAddress('Email', 'email@email.com');

            activateOtpPage.proceed();
            assertConfirmationInformation('Email', 'email@email.com');
        });

        it('should display correct details on confirmation page', function () {
            assertModifyFlow();

            activateOtpPage.proceed();

            if(caterForInternationalOnActivateOtpFeature){
                assertConfirmationInformation('SMS', '+27-815555555');
            } else{
                assertConfirmationInformation('SMS', '0815555555');
            }
        });

        it('should display correct details on success page', function () {
            activateOtpPage.activate();
            assertServiceErrorFlow();

            assertFullSuccessFlow();
        });

    });
});