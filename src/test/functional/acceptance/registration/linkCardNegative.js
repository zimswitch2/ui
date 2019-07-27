describe('ACCEPTANCE - Link Card Functionality', function () {
    'use strict';

    var registerPage = require('../../pages/registerPage.js');
    var otpPage = require('../../pages/otpPage.js');
    var linkCardPage = require('../../pages/linkCardPage.js');
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var newRegisteredPage = require('../../pages/newRegisteredPage.js');


    var correctOtp = browser.params.oneTimePassword;
    var userDetails = browser.params.registrationInformation.userDetails;
    var linkCardDetails = browser.params.cardInformation.validDetails;
    var invalidCardDetails = browser.params.cardInformation.invalidDetails;

    beforeEach(function () {
        loginPage.load();
        loginPage.clickRegister();
        registerPage.completeForm(userDetails);
        expect(registerPage.baseActions.getCurrentUrl()).toContain('otp/verify');
        otpPage.submitOtp(correctOtp);
        newRegisteredPage.linkYourCard.click();
    });

    it('should try to link card when information provided contains a wrong pattern', function () {
        expect(linkCardPage.baseActions.getCurrentUrl()).toContain('/linkcard');

        _.forEach(browser.params.cardInformation.wrongPatterns, function (wrongPattern) {
            linkCardPage.enterCardDetails(wrongPattern);
            expect(linkCardPage.baseActions.getErrorFor('cardnumber')).toEqual('Please enter a valid card number');
            expect(linkCardPage.baseActions.getErrorFor('atmpin')).toEqual('Please enter a valid ATM PIN');
            expect(linkCardPage.getErrorForCellPhoneNumber()).toEqual('Please enter a valid cell phone number');
        });
    });

    it('should try to link card when information provided exceeds characters limit', function () {
        linkCardPage.enterCardDetails(browser.params.cardInformation.charactersLimit);
        expect(linkCardPage.baseActions.getErrorFor('cardnumber')).toContain('Must be 16 or 18 numbers long');
        expect(linkCardPage.baseActions.getErrorFor('atmpin')).toContain('Must be 5 numbers long');
        expect(linkCardPage.getErrorForCellPhoneNumber()).toContain('Must be 10 numbers long');
    });

    it('should translate the error message from the service to IB domain message', function () {
        linkCardPage.enterCardDetails(browser.params.cardInformation.hotCard);
        linkCardPage.continue();
        expect(registerPage.baseActions.getCurrentUrl()).toContain('/linkcard');
        expect(registerPage.baseActions.getErrorMessage()).toEqual('Please enter a valid card number');
    });

    it('should try to link card with incorrect details', function () {
        linkCardPage.enterCardDetails(linkCardDetails);
        linkCardPage.enterCardNumber(invalidCardDetails.cardNumber);
        linkCardPage.continue();
        expect(registerPage.baseActions.getCurrentUrl()).toContain('/linkcard');
        expect(registerPage.baseActions.getErrorMessage()).toContain('The details you entered do not match the details we have on record.');

        linkCardPage.enterCardDetails(linkCardDetails);
        linkCardPage.enterAtmPIN(invalidCardDetails.atmPIN);
        linkCardPage.continue();
        expect(registerPage.baseActions.getCurrentUrl()).toContain('/linkcard');
        expect(registerPage.baseActions.getErrorMessage()).toContain('The details you entered do not match the details we have on record.');

        linkCardPage.enterCardDetails(linkCardDetails);
        linkCardPage.enterCellPhoneNumber(invalidCardDetails.cellPhoneNumber);
        linkCardPage.continue();
        expect(registerPage.baseActions.getCurrentUrl()).toContain('/linkcard');
        expect(registerPage.baseActions.getErrorMessage()).toContain('The details you entered do not match the details we have on record.');
    });

    it('should navigate to the first step of link card when click cancel on otp page', function () {
        linkCardPage.enterCardDetails(linkCardDetails);
        linkCardPage.continue();
        otpPage.clickSignOut();
        linkCardPage.baseActions.waitForSignOut();

        expect(registerPage.baseActions.getCurrentUrl()).toContain('/login');
    });
});