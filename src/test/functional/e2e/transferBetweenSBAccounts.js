'use strict';

describe('E2E - Transfer Between StandardBank Accounts', function () {
    var helpers = require('../pages/helpers.js');
    var baseActions = require('../pages/baseActions.js');
    var loginPage = require('../pages/loginPage.js');
    var landingPage = require('../pages/landingPage.js');
    var transactionPage = require('../pages/transactionPage.js');
    var transferPage = require('../pages/transferPage.js');
    var confirmPage =  require('../pages/transferConfirmPage.js');

    var __credentialsOfLoggedInUser__;
    var transfer;

    beforeEach(function () {
        var credentials = browser.params.credentials;
        if (__credentialsOfLoggedInUser__ !== credentials) {
            loginPage.loginWith(credentials);
            __credentialsOfLoggedInUser__ = credentials;
             browser.driver.sleep(300000000000);
        }
    });

    var asAmount = function (formattedAmount) {
        return formattedAmount.then(function (amountAsString) {
            return parseFloat(amountAsString.replace('R ', '').replace(/ /g, ''));
        });
    };

    var applyTransferAmount = function (balanceAmount, transferAmount) {
        return balanceAmount.then(function (balance) {
            return balance + transferAmount;
        });
    };

    describe('valid transfer',function(){
        it('should successfully transfer funds',function(){

            landingPage.baseActions.clickOnTab('Transact');
         
            transactionPage.createInterAccountTransfer();

            transfer = {
                from: process.env.FROM_ACCOUNT,
                to: process.env.TO_ACCOUNT,
                reference: 'Test Transfer',
                amount: '1.00'
            };

            transferPage.data(transfer);
            transferPage.proceed();

            var originalFromAvailableBalance = asAmount(confirmPage.availableFromBalance());
            var originalToAvailableBalance = asAmount(confirmPage.availableToBalance());

            confirmPage.proceed();

            expect(confirmPage.baseActions.getVisibleSuccessMessage()).toContain("Transfer was successful");

            var fromAvailableBalanceAfterTransfer = applyTransferAmount(originalFromAvailableBalance, -1.00);
            var toAvailableBalanceAfterTransfer = applyTransferAmount(originalToAvailableBalance, 1.00);

            expect(asAmount(confirmPage.availableFromBalance())).toEqual(fromAvailableBalanceAfterTransfer);
            expect(asAmount(confirmPage.availableToBalance())).toEqual(toAvailableBalanceAfterTransfer);
        });
    });

});
