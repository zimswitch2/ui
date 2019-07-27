'use strict';

describe('E2E - OnceOff Pay private beneficiary', function () {
    var helpers = require('../pages/helpers.js');
    var baseActions = require('../pages/baseActions.js');
    var loginPage = require('../pages/loginPage.js');
    var landingPage = require('../pages/landingPage.js');
    var paymentPage = require('../pages/paymentPage.js');
    var transactionPage = require('../pages/transactionPage.js');
    var onceOffPrivatePaymentPage = require('../pages/onceOffPrivatePaymentPage.js');
    var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
    var otpPage = require('../pages/otpPage.js');
    var beneficiariesSteps = require('./../steps/beneficiariesSteps.js');
    var paymentSteps = require('./../steps/paymentSteps.js');

    var sbsaBank, absaBank;
    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        sbsaBank = browser.params.beneficiaryInformation.sbsaBank;
        absaBank = browser.params.beneficiaryInformation.absaBank;
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
    });

    describe('once off payment for private beneficiary', function() {
        it('should process onceoff payment successfully using valid Standard Bank data', function () {
            paymentSteps.validPayment();
            addBeneficiaryPage.enterPrivateBeneficiaryDetails(sbsaBank);
            paymentSteps.submitPayment();
            onceOffPrivatePaymentPage.clickBackToTransactionTab();
            expect(onceOffPrivatePaymentPage.baseActions.getCurrentUrl()).toContain("/transaction/dashboard");
        });

        it('should process onceoff payment successfully using valid ABSA data', function () {
            paymentSteps.validPayment();
            addBeneficiaryPage.enterPrivateBeneficiaryDetails(absaBank);
            paymentSteps.submitPayment();
            onceOffPrivatePaymentPage.clickBackToTransactionTab();
            expect(onceOffPrivatePaymentPage.baseActions.getCurrentUrl()).toContain("/transaction/dashboard");
        });

        it('should process onceoff payment successfully with payment confirmation details', function() {
            paymentSteps.validPayment();
            addBeneficiaryPage.enterPrivateBeneficiaryDetails(sbsaBank);
            paymentSteps.setPaymentConfirmation('Email', browser.params.emailPaymentConfirmation.successInformation);
            paymentSteps.submitPayment();
            onceOffPrivatePaymentPage.clickBackToTransactionTab();
            expect(onceOffPrivatePaymentPage.baseActions.getCurrentUrl()).toContain("/transaction/dashboard");
        });

        it('should show an error message when using invalid account number', function () {
            sbsaBank = _.merge({}, sbsaBank, {accountNumber: '123'});
            paymentSteps.validPayment();
            addBeneficiaryPage.enterPrivateBeneficiaryDetails(sbsaBank);
            paymentSteps.submitPayment();
            expect(onceOffPrivatePaymentPage.baseActions.getErrorMessage()).toEqual('Could not process payment: Invalid beneficiary account number');
        });
    });

    describe('once off payment for listed beneficiary', function() {
        it('should process onceoff payment successfully', function () {
            paymentSteps.validPayment();
            addBeneficiaryPage.enterListedBeneficiaryDetails('kirkp', 'myref', 'herref');
            paymentSteps.submitPayment();
            onceOffPrivatePaymentPage.clickBackToTransactionTab();
            expect(onceOffPrivatePaymentPage.baseActions.getCurrentUrl()).toContain("/transaction/dashboard");
        });

        it('should process onceoff payment successfully with payment confirmation details', function() {
            paymentSteps.validPayment();
            addBeneficiaryPage.enterListedBeneficiaryDetails('kirkp', 'myref', 'herref');
            paymentSteps.setPaymentConfirmation('Email', browser.params.emailPaymentConfirmation.successInformation);
            paymentSteps.submitPayment();
            onceOffPrivatePaymentPage.clickBackToTransactionTab();
            expect(onceOffPrivatePaymentPage.baseActions.getCurrentUrl()).toContain("/transaction/dashboard");
        });
    });
 });
