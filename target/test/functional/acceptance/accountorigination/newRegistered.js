var rcpEnabled = false;
{
    rcpEnabled = true;
}
var newRegisteredPageFeature = false;
{
    newRegisteredPageFeature = true;
}

describe('ACCEPTANCE - New Registered Customer', function () {
    'use strict';
    var loginPage = require('../../pages/loginPage.js');
    var registerPage = require('../../pages/registerPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var newRegisteredPage = require('../../pages/newRegisteredPage.js');

    var correctOtp = browser.params.oneTimePassword;
    var userDetails = browser.params.registrationInformation.userDetails;

    beforeEach(function () {
        loginPage.load();
        loginPage.clickRegister();
        registerPage.completeForm(userDetails);
        otpPage.submitOtp(correctOtp);
    });

    if (newRegisteredPageFeature) {
        it('should show registered successfully notification', function () {
            expect(newRegisteredPage.baseActions.getSuccessVisibility()).toBeTruthy();
            expect(newRegisteredPage.baseActions.getVisibleSuccessMessage()).toContain('Your profile was successfully created.');

            newRegisteredPage.baseActions.closeNotificationMessages();
            expect(newRegisteredPage.baseActions.getSuccessVisibility()).toBeFalsy();
        });
    }

    it('should go to the application page page when click open an account', function () {
        expect(newRegisteredPage.baseActions.getCurrentUrl()).toContain('/new-registered');

        newRegisteredPage.openAnAccount.click();

        if (rcpEnabled) {
            expect(newRegisteredPage.baseActions.getCurrentUrl()).toContain('/apply');
        } else {
            expect(newRegisteredPage.baseActions.getCurrentUrl()).toContain('/apply/current-account');
        }
    });

    it('should show link your card button when default or no radio is clicked', function () {
        expect(newRegisteredPage.linkYourCard.isDisplayed()).toBeTruthy();

        if (!newRegisteredPageFeature) {
            newRegisteredPage.actions.clickYes();
            expect(newRegisteredPage.linkYourCard.isDisplayed()).toBeFalsy();

            newRegisteredPage.actions.clickNo();
            expect(newRegisteredPage.linkYourCard.isDisplayed()).toBeTruthy();
        }

        newRegisteredPage.linkYourCard.click();
        expect(newRegisteredPage.baseActions.getCurrentUrl()).toContain('/linkcard');
    });

    if (newRegisteredPageFeature) {
        it('should show copy your profile button', function () {
            expect(newRegisteredPage.copyYourProfile.isDisplayed()).toBeTruthy();

            newRegisteredPage.copyYourProfile.click();
            expect(newRegisteredPage.baseActions.getCurrentUrl()).toContain('/migrate');
        });
    } else {
        it('should show start banking button when yes radio is clicked', function () {
            newRegisteredPage.actions.clickYes();
            expect(newRegisteredPage.startBanking.isDisplayed()).toBeTruthy();

            newRegisteredPage.startBanking.click();
            expect(newRegisteredPage.baseActions.getCurrentUrl()).toContain('/migrate');
        });
    }
});
