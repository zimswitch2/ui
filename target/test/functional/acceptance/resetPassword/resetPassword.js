describe('ACCEPTANCE TEST - Password Reset', function () {
    'use strict';

    var resetPasswordPage = require('../../pages/resetPasswordPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var passwordResetPage = require('../../pages/passwordResetPage.js');
    var otpPage = require('../../pages/otpPage.js');

    beforeEach(function () {
        loginPage.load();
        loginPage.clickResetPassword();
    });

    var userWithCard = {
        cardNumber: '1100001111000011',
        atmPin: '12345',
        password: 'Pro12345',
        confirmPassword: 'Pro12345'
    };
    var userWithInvalidCard = {
        cardNumber: '1100001111000000',
        atmPin: '12345',
        password: 'Pro12345',
        confirmPassword: 'Pro12345'
    };

    var userWithoutCard = {
        password: 'Pro12345',
        confirmPassword: 'Pro12345'
    };

    describe('password reset with card', function () {
        it('should successfully reset password', function () {
            passwordResetPage.enterEmailAddress('withcard@test.co.za');
            passwordResetPage.clickNext();
            passwordResetPage.enterDetailsWithCard(userWithCard);
            passwordResetPage.clickNext();
            otpPage.submitOtp('12345');
            expect(resetPasswordPage.baseActions.getCurrentUrl()).toContain("/login");
            expect(loginPage.getResetPasswordMessage()).toEqual('Your password has been successfully changed.');
        });
    });

    describe('password reset without card', function () {
        it('should successfully reset password', function () {
            passwordResetPage.enterEmailAddress('withoutcard@test.co.za');
            passwordResetPage.clickNext();
            passwordResetPage.enterDetailsWithoutCard(userWithoutCard);
            passwordResetPage.clickNext();
            otpPage.submitOtp('12345');
            expect(resetPasswordPage.baseActions.getCurrentUrl()).toContain("/login");
            expect(loginPage.getResetPasswordMessage()).toEqual('Your password has been successfully changed.');
        });
    });

    describe('password reset without card', function () {
        it('should successfully reset password', function () {
            passwordResetPage.enterEmailAddress('userwithinvalidcard@test.co.za');
            passwordResetPage.clickNext();
            passwordResetPage.enterDetailsWithCard(userWithInvalidCard);
            passwordResetPage.clickNext();
            expect(passwordResetPage.baseActions.getErrorMessage()).toMatch(
                "This card number is not valid. Please check and try again");
        });
    });

    describe('invalid email address', function () {
        it('should stop user from resetting a password', function () {
            passwordResetPage.enterEmailAddress('invalid@test.co.za');
            passwordResetPage.clickNext();
            expect(passwordResetPage.baseActions.getErrorMessage()).toMatch(
                'The email you entered is invalid. Please re-enter the email address you used to register');

        });
    });
});