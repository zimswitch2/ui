describe('ACCEPTANCE - EAP Payment Limit Not Set', function(){
    'use strict';

    var helpers = require('../../pages/helpers.js');
    var loginPage = require('../../pages/loginPage.js');
    var anyPage = require('../../pages/anyPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var paymentPage = require('../../pages/paymentPage.js');
    var beneficiaryPage = require('../../pages/listBeneficiaryPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        var credentials = browser.params.credentialsWithZeroEAPLimit;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.clickOnTab('Account Summary');
        landingPage.baseActions.clickOnTab('Transact');
        transactionPage.clickOnceOffPaymentButton();
    });

    beforeEach(function () {
        navigateUsing(browser.params.credentialsWithZeroEAPLimit);
    });

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToBeneficiaries();
        beneficiaryPage.clickOnPay();
    }

    describe('account with zero EAP limit', function () {
        it('should display zero monthly limit and also relevant warning messages', function () {
            expect(paymentPage.baseActions.getErrorMessage()).toEqual('Your electronic account payment (EAP) limit needs to be set in order to make payments. Please call Customer Care (0860 123 000) for further assistance.');
            expect(paymentPage.monthlyLimit().getText()).toEqual('R 0.00');
            expect(paymentPage.availableLimit().getText()).toEqual("R 0.00");
        });

    });

    it('should check that the next button is disabled even when the user enters an amount', function(){
        paymentPage.proceedPayment(browser.params.paymentInformation.amount.valid);
        expect(anyPage.canProceed()).toEqual(false);
    });
});
