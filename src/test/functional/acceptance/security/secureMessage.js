var secureMessageFeature = false;
if (feature.secureMessage) {
    secureMessageFeature = true;
}

var overviewFeature = false;
if (feature.overviewPage) {
    overviewFeature = true;
}

if (secureMessageFeature) {
    describe('ACCEPTANCE - secure message', function () {
        'use strict';

        var loginPage = require('../../pages/loginPage.js');
        var otpPage = require('../../pages/otpPage.js');
        var landingPage = require('../../pages/landingPage.js');
        var secureMessagePage = require('../../pages/secureMessagePage.js');

        var validCardDetails = browser.params.cardInformation.validDetails;
        var credentials = browser.params.credentials;
        var correctOtp = browser.params.oneTimePassword;

        function checkValidDetails() {
            expect(secureMessagePage.getTextById('account')).toEqual('ACCESSACC - 10-00-035-814-0');
            expect(secureMessagePage.getTextById('branch')).toEqual('BALLITO BRANCH');
            expect(secureMessagePage.getTextById('homeTelephone')).toEqual('0788541124');
            expect(secureMessagePage.getTextById('businessTelephone')).toEqual('0788541124');
            expect(secureMessagePage.getTextById('message')).toEqual('Help please');
        }

        function checkDetailsInputs() {
            expect(secureMessagePage.accountLabelSelected()).toBe('ACCESSACC - 10-00-035-814-0');
            expect(secureMessagePage.homeTelephone()).toBe(validCardDetails.cellPhoneNumber);
            expect(secureMessagePage.businessTelephone()).toBe(validCardDetails.cellPhoneNumber);
            expect(secureMessagePage.message()).toBe('Help please');
        }

        beforeEach(function () {
            loginPage.loginWith(credentials);
            landingPage.baseActions.navigateToSendSecureMessage();

            browser.wait(function () {
                return secureMessagePage.nextButton().isDisplayed();
            }, 10000);
        });

        describe('happy path', function () {
            it('should complete all details and submit', function () {
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('/secure-message');

                secureMessagePage.homeTelephone(validCardDetails.cellPhoneNumber);
                secureMessagePage.businessTelephone(validCardDetails.cellPhoneNumber);
                secureMessagePage.message('Help please');

                secureMessagePage.nextButton().click();
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('/secure-message/confirm');

                secureMessagePage.modifyButton().click();
                expect(secureMessagePage.baseActions.getCurrentUrl()).toMatch('.*/secure-message$');
                checkDetailsInputs();

                secureMessagePage.nextButton().click();
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('/secure-message/confirm');
                checkValidDetails();

                secureMessagePage.confirmButton().click();
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('otp/verify');
                otpPage.submitOtp(correctOtp);
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('secure-message/results');
                expect(secureMessagePage.baseActions.getVisibleSuccessMessage()).toBe('Secure message was successfully sent');

                checkValidDetails();
                expect(secureMessagePage.printButton().isPresent()).toBeTruthy();
            });
        });

        describe('cancel button should return to home page', function () {
            it('from details page', function () {
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('/secure-message');
                secureMessagePage.clickCancelButton();
                var homeUrl = overviewFeature ? '/overview' : '/account-summary';
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain(homeUrl);
            });

            it('from confirm page', function () {
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('/secure-message');
                secureMessagePage.homeTelephone(validCardDetails.cellPhoneNumber);
                secureMessagePage.businessTelephone(validCardDetails.cellPhoneNumber);
                secureMessagePage.message('Help please');
                secureMessagePage.nextButton().click();
                expect(secureMessagePage.baseActions.getCurrentUrl()).toContain('/secure-message/confirm');

                secureMessagePage.clickCancelButton();
                expect(secureMessagePage.baseActions.isHomePage()).toBeTruthy();
            });
        });
    });
}