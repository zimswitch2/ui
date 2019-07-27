describe('ACCEPTANCE - Register user', function () {
    'use strict';
    var registerPage = require('../../pages/registerPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var linkCardPage = require('../../pages/linkCardPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');

    var correctOtp = browser.params.oneTimePassword;
    var userDetails = browser.params.registrationInformation.userDetails;
    var linkCardDetails = browser.params.cardInformation.validDetails;
    var invalidCardDetails = browser.params.cardInformation.invalidDetails;

    beforeEach(function () {
        loginPage.load();
        loginPage.clickRegister();
    });

    function enterFieldsWithWrongPatterns() {
        registerPage.completeForm(browser.params.registrationInformation.wrongPattern);
        expect(registerPage.baseActions.getValidationMessageFor('username')).toEqual('Please enter a valid email address');
        expect(registerPage.baseActions.getValidationMessageFor('password')).toEqual('Please enter a valid password');
        expect(registerPage.baseActions.getValidationMessageFor('confirmPassword')).toEqual('The two passwords do not match');
        expect(registerPage.baseActions.getValidationMessageFor('preferredName')).toEqual('Please enter a valid preferred name');
    }

    function enterEmailEndingInDot() {
        registerPage.completeForm(browser.params.registrationInformation.dotAtTheEnd);
        expect(registerPage.baseActions.getValidationMessageFor('username')).toEqual('Please enter a valid email address');
    }

    function enterFieldsWithTooManyCharacters() {
        registerPage.completeForm(browser.params.registrationInformation.charactersLimit);
        expect(registerPage.baseActions.getValidationMessageFor('username')).toContain('not be longer than 100 characters');
        expect(registerPage.baseActions.getValidationMessageFor('password')).toContain('not be longer than 20 characters');
        expect(registerPage.baseActions.getValidationMessageFor('confirmPassword')).toContain('not be longer than 20 characters');
        expect(registerPage.baseActions.getValidationMessageFor('preferredName')).toContain('not be longer than 15 characters');
    }

    it('should try to register with bad data', function () {
        enterFieldsWithWrongPatterns();
        enterEmailEndingInDot();
        enterFieldsWithTooManyCharacters();
        expect(anyPage.canContinue()).toBeFalsy();
    });

    it('should try to register an existing username', function (){
        expect(registerPage.baseActions.getCurrentUrl()).toContain('/register');

        registerPage.completeForm(browser.params.registrationInformation.existingInfo);
        expect(registerPage.baseActions.getErrorMessage()).toEqual('This email address is currently registered for Standard Bank Online. Enter a new email address to register now or sign-in');
    });
});
