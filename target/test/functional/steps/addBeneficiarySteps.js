'use strict';

var addBeneficiarySteps = function(){

    var helpers = require('../pages/helpers.js');
    var loginPage = require('../pages/loginPage.js');
    var anyPage = require('../pages/anyPage.js');
    var landingPage = require('../pages/landingPage.js');
    var beneficiaryListPage = require('../pages/listBeneficiaryPage.js');
    var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
    var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
    var otpPage = require('../pages/otpPage.js');
    var paymentConfirmationPreferencesPage = require('../pages/paymentConfirmationPreferencesPage.js');

    var correctOtp = browser.params.oneTimePassword;

    var __credentialsOfLoggedInUser__;

    this.navigateUsing = function(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToBeneficiaries();
        beneficiaryListPage.clickAddBeneficiary();
    };

    this.proceedAndSubmitOtp = function() {
        addBeneficiaryPage.proceed();
        confirmBeneficiaryPage.clickConfirm();
        otpPage.submitOtp(correctOtp);

    };

    this.ensureFieldsNotVisibleOnConfirmationWhenListedBeneficiary = function() {
        addBeneficiaryPage.enterListedBeneficiaryDetails('telko', 'myref', 'herref');
        addBeneficiaryPage.setSetupPaymentConfirmation(false);
        addBeneficiaryPage.proceed();
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).not.toContain("Bank");
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).not.toContain("Branch");
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).not.toContain("Account number");
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).toContain("TELKOM");
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).toContain("myref");
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).toContain("herref");
    };

    this.ensureFieldsValuesOnConfirmationWhenSMSPayment = function() {
        helpers.scrollThenClick(confirmBeneficiaryPage.getModifyButton());
        addBeneficiaryPage.setPaymentConfirmation("SMS", browser.params.smsPaymentConfirmation.successInformation);
        addBeneficiaryPage.proceed();
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).toContain("0782345678");
        expect(confirmBeneficiaryPage.getBeneficiaryDetails()).toContain("ben");
    };

    this.ensureRecipientNameIsNotCopiedToPaymentConfirmationSectionWhenInvalid = function() {
        addBeneficiaryPage.enterPrivateBeneficiaryDetails(browser.params.badBeneficiaryInformation.wrongPattern);
        addBeneficiaryPage.setSetupPaymentConfirmation(true);
        expect(paymentConfirmationPreferencesPage.preferredName()).toEqual('');
    };
};

module.exports = new addBeneficiarySteps();