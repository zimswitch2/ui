var overviewPageFeature = false;
if (feature.overviewPage) {
    overviewPageFeature = true;
}

describe('E2E - Register user', function () {
    'use strict';

    var registerPage = require('../pages/registerPage.js');
    var otpPage = require('../pages/otpPage.js');
    var linkCardPage = require('../pages/linkCardPage.js');
    var loginPage = require('../pages/loginPage.js');
    var landingPage = require('../pages/landingPage.js');
    var newRegisteredPage = require('../pages/newRegisteredPage.js');
    var Chance = require('../../lib/chance');

    var chance = new Chance();
    var correctOtp = browser.params.oneTimePassword;
    var incorrectOtp = browser.params.incorrectOneTimePassword;
    var userDetails = browser.params.registrationInformation.userDetails;
    var validCardDetails = browser.params.cardInformation.validDetails;
    var invalidCardDetails = browser.params.cardInformation.invalidDetails;

    beforeEach(function () {
        var randomUsername = chance.email();
        userDetails.username = randomUsername;
        registerPage.load();
        registerPage.completeForm(userDetails);
    });

    function redirectToLoginPage() {
        loginPage.load();
    }

    it('should not register user when OTP is incorrect', function () {
        otpPage.submitOtp(incorrectOtp);
        expect(otpPage.getNotification().getText()).toEqual('The details you have entered are incorrect. Please re-enter and submit it again.');
    });

    it('should not link card with invalid details and redirect to linkcard page when login', function () {
        otpPage.submitOtp(correctOtp);
        newRegisteredPage.linkYourCard.click();

        expect(registerPage.baseActions.getCurrentUrl()).toContain('linkcard');
        expect(linkCardPage.baseActions.getVisibleSuccessMessage()).toEqual("Hello Happy User. Your Standard Bank ID has been successfully created. Last step: link your card below");

        linkCardPage.enterCardDetails(invalidCardDetails);
        linkCardPage.continue();
        expect(registerPage.baseActions.getCurrentUrl()).toContain('linkcard');
        expect(linkCardPage.baseActions.getErrorVisibility()).toBeTruthy();

        //TODO: Replace with logout instead of redirect
        redirectToLoginPage();
        loginPage.enterUserCredentials(userDetails.username, userDetails.password);
        expect(registerPage.baseActions.getCurrentUrl()).toContain('/new-registered');
    });

    it('should link card with valid details and redirect to account summary page when login', function () {
        otpPage.submitOtp(correctOtp);
        newRegisteredPage.linkYourCard.click();

        linkCardPage.enterCardDetails(validCardDetails);
        linkCardPage.continue();
        expect(otpPage.baseActions.getCurrentUrl()).toContain('otp/verify');

        otpPage.submitOtp(correctOtp);
        if (overviewPageFeature) {
            expect(landingPage.baseActions.getCurrentUrl()).toContain('overview');
        } else {
            expect(landingPage.baseActions.getCurrentUrl()).toContain('account-summary');
        }
        expect(landingPage.getWelcomeMessage.isDisplayed()).toBeTruthy();
        expect(landingPage.getWelcomeMessage.getText()).toEqual('Card successfully linked. Your card number is ' +
            browser.params.cardInformation.validDetails.cardNumber);

        //TODO: Replace with logout instead of redirect
        redirectToLoginPage();
        loginPage.enterUserCredentials(userDetails.username, userDetails.password);
        if (overviewPageFeature) {
            expect(landingPage.baseActions.getCurrentUrl()).toContain('overview');
        } else {
            expect(landingPage.baseActions.getCurrentUrl()).toContain('account-summary');
        }
        expect(landingPage.getWelcomeMessage.isDisplayed()).toBeTruthy();
        expect(landingPage.getWelcomeMessage.getText()).toContain('Welcome');
    });
});