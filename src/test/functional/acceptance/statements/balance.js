'use strict';

describe('ACCEPTANCE - Account and Balance Information', function () {
    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var accountSummaryPage = require('../../pages/accountSummaryPage.js');
    var __credentialsOfLoggedInUser__;

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.clickOnTab('Account Summary');
        //accountSummaryPage.waitForAccountInfo();
    });

    it('should display account summary page URL', function() {
        expect(accountSummaryPage.baseActions.getCurrentUrl()).toContain("/account-summary");
    });

    it('should display four big account categories', function() {
        expect(accountSummaryPage.getAccountInfo('transaction')).toContain("Transaction accounts");
        expect(accountSummaryPage.getAccountInfo('creditcard')).toContain("Credit card");
        expect(accountSummaryPage.getAccountInfo('loan')).toContain("Loans");
        expect(accountSummaryPage.getAccountInfo('investment')).toContain("Investments");
    });

    it('should display details for the four big account categories', function() {
        expect(accountSummaryPage.getAccountInfo('transaction')).toContain("ACCESSACC");
        expect(accountSummaryPage.getAccountInfo('creditcard')).toContain("CREDIT CARD");
        expect(accountSummaryPage.getAccountInfo('loan')).toContain("HOME LOAN");
        expect(accountSummaryPage.getAccountInfo('investment')).toContain("SAVINGS");
    });

});