describe('ACCEPTANCE - Prepaid History', function () {
    'use strict';

    var loginPage = require('../../pages/loginPage.js');
    var landingPage = require('../../pages/landingPage.js');
    var transactionPage = require('../../pages/transactionPage.js');
    var prepaidHistoryPage = require('../../pages/prepaidHistoryPage.js');
    var __credentialsOfLoggedInUser__;

    function navigateUsing(credentials) {
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
        }
        landingPage.baseActions.navigateToTransact();
        transactionPage.clickPrepaidHistoryButton();
    }

    describe('with transactions', function () {

        beforeEach(function () {
            navigateUsing(browser.params.credentials);
        });

        var ensureCorrectDataIsDisplayed = function () {
            prepaidHistoryPage.getPrepaidHistory().then(function (prepaidHistoryData) {
                expect(prepaidHistoryData[2]).toEqual({transactionDate: '2 November 2013',
                    serviceProvider: 'Vodacom',
                    voucherType: 'Airtime',
                    purchasedFor: '0829800600',
                    invoiceNumber: '20141210131958600',
                    amount: 'R 25.00'
                });
            });
        };

        it('should be on the prepaid history page', function () {
            expect(prepaidHistoryPage.baseActions.getCurrentUrl()).toContain('/prepaid/history');
            expect(prepaidHistoryPage.getTitle()).toEqual('Prepaid History');
        });

        it('should have correct data', function () {
          ensureCorrectDataIsDisplayed();
        });

        it('should have no notification message displayed', function () {
            expect(prepaidHistoryPage.getInfoMessage()).toEqual('');
        });

        it('should display the print button', function () {
            expect(prepaidHistoryPage.getPrintButton().isDisplayed()).toBeTruthy();
        });
    });

    describe('with no transactions' ,function(){

        beforeEach(function () {
            navigateUsing(browser.params.credentialsWithZeroBeneficiaries);
        });

        it('should have no data displayed', function () {
            expect(prepaidHistoryPage.getInfoMessage()).toEqual('No prepaid purchases in this period');
        });

        it('should not display the print button', function () {
            expect(prepaidHistoryPage.getPrintButton().isDisplayed()).toBeFalsy();
        });
    });

    describe('when service error', function () {

        it('should display generic notification error', function () {
            navigateUsing(browser.params.credentialsForNoFutureTransactions);
            expect(prepaidHistoryPage.baseActions.getErrorVisibility()).toBeTruthy();
            expect(prepaidHistoryPage.baseActions.getErrorMessage()).toEqual('This service is currently unavailable. Please try again later, while we investigate');
        });
    });
});
