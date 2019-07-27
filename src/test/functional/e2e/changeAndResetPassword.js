'use strict';

describe('E2E - Change password', function () {
    var helpers = require('../pages/helpers.js');
    var loginPage = require('../pages/loginPage.js');
    var changePasswordPage = require('../pages/changePasswordPage.js');
    var landingPage = require('../pages/landingPage.js');
    var __credentialsOfLoggedInUser__;
    var credentials;
    beforeEach(function () {
        credentials = browser.params.credentialsForPasswordRelated;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
    });
    describe('E2E - Positive Scenarios', function () {

        function changePassword(currentPassword, newPassword) {
            landingPage.baseActions.navigateToChangePassword();
            changePasswordPage.currentPassword(currentPassword);
            changePasswordPage.newPassword(newPassword);
            changePasswordPage.confirmPassword(newPassword);
            changePasswordPage.clickSavePassword();
        }

        it("should change current password successfully", function () {
            changePassword(credentials.password, credentials.newPassword);

            expect(landingPage.baseActions.getCurrentUrl()).toContain("/account-summary");
            expect(landingPage.baseActions.getSuccessVisibility()).toBeTruthy();

            changePassword(credentials.newPassword, credentials.password);
        });
    });

});

describe('E2E - Reset Password Functionality', function () {
    var resetPasswordPage = require('../pages/resetPasswordPage.js');
    var otpPage = require('../pages/otpPage.js');
    var loginPage = require('../pages/loginPage.js');

    beforeEach(function () {
        resetPasswordPage.load();
    });

    describe('Happy path', function () {
        it('should be on reset password page', function () {
            expect(resetPasswordPage.baseActions.getCurrentUrl()).toContain("/reset-password");
        });

        it('should go to OTP page after everything is filled', function () {
            fillDetailsThenNext();
            expect(resetPasswordPage.baseActions.getCurrentUrl()).toContain("/otp/verify");
        });

        it('should go to login page and show success message after correct OTP entered', function () {
            fillDetailsThenNext();
            otpPage.submitOtp('12345');
            expect(resetPasswordPage.baseActions.getCurrentUrl()).toContain("/login");
            expect(loginPage.getResetPasswordMessage()).toEqual('Your password has been successfully changed.');
        });
    });

    function fillDetailsThenNext() {
        var information = {
            username: browser.params.credentialsForPasswordRelated.username,
            password: browser.params.credentialsForPasswordRelated.password,
            confirmPassword: browser.params.credentialsForPasswordRelated.password
        };
        resetPasswordPage.enterResetPasswordDetails(information);
        resetPasswordPage.next();
    }
});