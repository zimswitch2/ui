var overviewPageFeature = false;
if (feature.overviewPage) {
    overviewPageFeature = true;
}
var newRegisteredPageFeature = false;
if (feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

describe('ACCEPTANCE - Register user', function () {
    'use strict';

    var registerPage = require('../../pages/registerPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var linkCardPage = require('../../pages/linkCardPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var newRegisteredPage = require('../../pages/newRegisteredPage.js');

    var correctOtp = browser.params.oneTimePassword;
    var userDetails = browser.params.registrationInformation.userDetails;
    var linkCardDetails = browser.params.cardInformation.validDetails;

    describe('new registration', function () {
        beforeEach(function () {
            loginPage.load();
            loginPage.clickRegister();
        });

        it('should complete the registration form with OTP validation and link card successfully', function () {
            expect(anyPage.canContinue()).toBeFalsy();

            registerPage.completeForm(userDetails);

            expect(registerPage.baseActions.getCurrentUrl()).toContain('otp/verify');
            expect(otpPage.getVerificationHeaderText()).toEqual('We need to verify your email address');
            expect(otpPage.getMessageAddress()).toContain('A verification code has been sent to email address s***@m***.c***');
            expect(otpPage.getSpamOrJunkFolderText()).toEqual("Can't see your email? Check your spam or junk folder");
            expect(otpPage.getEmailVerificationLabelText()).toEqual('Email verification code');
            otpPage.submitOtp(correctOtp);
            if (newRegisteredPageFeature) {
                registerPage.baseActions.closeNotificationMessages();
            }
            newRegisteredPage.linkYourCard.click();
            expect(registerPage.baseActions.getCurrentUrl()).toContain('linkcard');
            if (!newRegisteredPageFeature) {
                registerPage.baseActions.closeNotificationMessages();
            }
            linkCardPage.enterCardDetails(linkCardDetails);
            linkCardPage.continue();

            expect(registerPage.baseActions.getCurrentUrl()).toContain('otp/verify');
            expect(otpPage.getMessageAddress()).toEqual('Enter the one-time password (OTP) that has been sent to your cell 27******1124.');
            otpPage.submitOtp(correctOtp);

            if (overviewPageFeature) {
                expect(registerPage.baseActions.getCurrentUrl()).toContain('overview');
            } else {
                expect(registerPage.baseActions.getCurrentUrl()).toContain('account-summary');
            }
            expect(landingPage.getWelcomeMessage.getText()).toEqual('Card successfully linked. Your card number is ' +
                browser.params.cardInformation.validDetails.cardNumber);

            landingPage.baseActions.navigateToBeneficiaries();
            landingPage.baseActions.clickOnTab('Account Summary');
            expect(landingPage.getWelcomeMessage.isDisplayed()).toBeFalsy();
        });

        if (newRegisteredPageFeature) {
            it('should go back to new registered page when click back button', function () {
                gotoLinkCardPage();
                linkCardPage.back();
                expect(registerPage.baseActions.getCurrentUrl()).toContain('/new-registered');
                newRegisteredPage.linkYourCard.click();
                expect(registerPage.baseActions.getCurrentUrl()).toContain('linkcard');
            });
        }

        it('should register a user with a country code', function () {
            gotoLinkCardPage();
            linkCardPage.enterCardDetails(linkCardDetails);
            linkCardPage.helpers.scrollThenClick(linkCardPage.internationalDialingCode());
            linkCardPage.selectCountry('Zimbabwe');
            expect(linkCardPage.internationalDialingCode().getText()).toContain('+263');
            linkCardPage.continue();
            expect(linkCardPage.getEntryMessage()).toContain('263');
            otpPage.submitOtp(correctOtp);
            browser.waitForAngular();
        });

        it('should hide a warning message when the country code is selected', function () {
            gotoLinkCardPage();
            linkCardPage.enterCellPhoneNumber('27');
            expect(linkCardPage.getWarningMessage()).toContain('The number you entered contains the same prefix as the international dialling code. Please review and amend if incorrect.');
            linkCardPage.helpers.scrollThenClick(linkCardPage.internationalDialingCode());
            expect(linkCardPage.getWarningMessage()).toBeFalsy();
        });
    });

    describe('existing user', function () {
        it('should take user to the link card page when a newly registered account logs in', function () {
            loginPage.load();
            loginPage.enterUserCredentials('unlinked@standardbank.co.za', 'password');

            expect(registerPage.baseActions.getCurrentUrl()).toContain('/new-registered');
        });
    });


    function gotoLinkCardPage() {
        registerPage.completeForm(userDetails);
        otpPage.submitOtp(correctOtp);
        if (newRegisteredPageFeature) {
            registerPage.baseActions.closeNotificationMessages();
        }
        newRegisteredPage.linkYourCard.click();
        if (!newRegisteredPageFeature) {
            registerPage.baseActions.closeNotificationMessages();
        }
    }
});