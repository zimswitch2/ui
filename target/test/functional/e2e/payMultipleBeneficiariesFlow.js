describe('E2E - Pay multiple beneficiaries', function () {
    'use strict';

    var loginPage = require('../pages/loginPage.js');
    var helpers = require('../pages/helpers.js');
    var otpPage = require('../pages/otpPage.js');
    var landingPage = require('../pages/landingPage.js');
    var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
    var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
    var listBeneficiaryPage = require('../pages/listBeneficiaryPage.js');
    var transactionPage = require('../pages/transactionPage.js');
    var payMultipleBeneficariesPage = require('../pages/payMultipleBeneficiariesPage.js');

    var beneficiariesSteps = require('./../steps/beneficiariesSteps.js');
    var paymentSteps = require('./../steps/paymentSteps.js');

    var correctBeneficiaryDetails = browser.params.beneficiaryInformation.sbsaBank;
    var beneficiaryNames = [];
    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
    });

    it('should pay multiple beneficiaries at once', function () {
        _.times(2, function () {
            var name = beneficiariesSteps.addPrivateBeneficiary(correctBeneficiaryDetails);
            beneficiaryNames.push(name.toUpperCase());
        });

        landingPage.baseActions.navigateToTransact();

        helpers.scrollThenClick(transactionPage.payMultipleButton());

        _.forEach(beneficiaryNames, function (name) {
            payMultipleBeneficariesPage.getBeneficiaryInputBox(name).sendKeys('0.01');
        });

        helpers.scrollThenClick(payMultipleBeneficariesPage.nextButton());
        helpers.scrollThenClick(payMultipleBeneficariesPage.confirmButton());

        _.times(beneficiaryNames.length, function (index) {
            expect(payMultipleBeneficariesPage.notification(index).getText()).toEqual("Successful");
        });

        helpers.scrollThenClick(payMultipleBeneficariesPage.morePaymentsButton());

        _.forEach(beneficiaryNames, function (beneficiaryName) {
            beneficiariesSteps.deleteBeneficiary(beneficiaryName);
        });
    });

});
