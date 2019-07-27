var menigaTransactionsHistoryFeature = false;
if(feature.menigaTransactionsHistory){
    menigaTransactionsHistoryFeature = true;
}

if(menigaTransactionsHistoryFeature) {

    describe('ACCEPTANCE -- MenigaTransactionsPage', function () {
        'use strict';

        var loginPage = require('../../pages/loginPage.js');
        var menigaTransactionsPage = require('../../pages/menigaTransactionsPage.js');
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
            accountSummaryPage.viewFirstTransactionAccountStatement();

            //expect(menigaTransactionsPage.isLoadingDisplayed()).toBeTruthy();

        });


        it('Should display downloadPDF',function(){
            expect(menigaTransactionsPage.isDownloadPDFDisplayed()).toBeTruthy();
        });

        it('Should display print',function(){
            expect(menigaTransactionsPage.isPrintDisplayed()).toBeTruthy();
        });

        it('Should display the statement types',function(){
            expect(menigaTransactionsPage.isStatementTypePresent()).toBeTruthy();
        });

        it('Should display the 5 statement types on a drop down',function(){
            expect(menigaTransactionsPage.numberOfStatementTypes()).toBe(5);
        });

        it('Should display the list of accounts',function(){
            expect(menigaTransactionsPage.isAccountPresent()).toBeTruthy();
        });

        it('Should display the list of transactions', function () {
            expect(menigaTransactionsPage.isTransactionsListPresent()).toBeTruthy();
        });

        it('Should display the list of user accounts ',function(){
            expect(menigaTransactionsPage.numberOfAccounts()).toBe(12);
        });

        it('When Both an account and monthsToGoBackTo Are Selected the relevant transactions should be gotten',function(){
            expect(menigaTransactionsPage.transactions().count()).toBe(6);
            assertContainsFirstTransaction();
            assertContainsSecondTransaction();
        });

        function assertContainsFirstTransaction(){
            expect(menigaTransactionsPage.transactionDates().getText()).toContain('31 July 2015');
            expect(menigaTransactionsPage.transactionCategories().getText()).toContain('Alimony Paid');
            expect(menigaTransactionsPage.transactionAmounts().getText()).toContain('88.00');
            expect(menigaTransactionsPage.transactionBalances().getText()).toContain('56.00');
        }

        function assertContainsSecondTransaction(){
            expect(menigaTransactionsPage.transactionDates().getText()).toContain('13 January 2015');
            expect(menigaTransactionsPage.transactionCategories().getText()).toContain('Alcohol');
            expect(menigaTransactionsPage.transactionAmounts().getText()).toContain('- 5.00');
            expect(menigaTransactionsPage.transactionBalances().getText()).toContain('- 98.00');
        }

        it('Should Set The Opening Balance',function(){
            expect(menigaTransactionsPage.openingBalance().getText()).toBe('- 93.00');
        });

        it('Should Set The Closing Balance',function(){
            expect(menigaTransactionsPage.closingBalance().getText()).toBe('56.00');
        });


        it('Should Display The Search Input Field When There Are Transactions',function(){
            expect(menigaTransactionsPage.isSearchPresent()).toBeTruthy();
        });

        it('Typing On The Search Box Should Hide The Opening And Closing Balance',function(){
            menigaTransactionsPage.typeOnSearchBox('Blah blah blah');
            expect(menigaTransactionsPage.isClosingBalanceDisplayed()).toBeFalsy();
            expect(menigaTransactionsPage.isOpeningBalanceDisplayed()).toBeFalsy();
        });

        it('Typing Text That Does Not Match Any Transaction Should Not Display Any Transactions',function(){
            menigaTransactionsPage.typeOnSearchBox('Text That Does Not Match Any Transactions');
            expect(menigaTransactionsPage.transactions().count()).toBe(0);
        });

        it('Typing On The Search Box Should Only Show The Transaction Containing The Typed Text' ,function(){
            menigaTransactionsPage.typeOnSearchBox('Alimony');
            expect(menigaTransactionsPage.transactions().count()).toBe(2);
            assertContainsFirstTransaction();
        });

        it('Should NOT show no transaction found',function(){
            expect(menigaTransactionsPage.isNoMatchesMessageDisplayed()).toBeFalsy();
        });

        it('Should Show always on top when there are more than 5 transactions',function(){
            expect(menigaTransactionsPage.is_alwaysBackToTop_Displayed()).toBeTruthy();
        });

        describe('When There Are No Transactions',function(){

            beforeEach(function(){
                menigaTransactionsPage.selectSecondAccount();
                menigaTransactionsPage.selectPeriodWithNoTransactions();
            });

            it('Should Display No Transaction For The Given Period When There Are No Transactions During The Period',function(){
                expect(menigaTransactionsPage.isNoTransactionsDisplayed()).toBeTruthy();
            });

            it('Should NOT show the Download PDF',function(){
                expect(menigaTransactionsPage.isDownloadPDFDisplayed()).toBeFalsy();
            });

            it('Should NOT show print',function(){
                expect(menigaTransactionsPage.isPrintDisplayed()).toBeFalsy();
            });

            it('Should Show no transactions found',function(){
                expect(menigaTransactionsPage.isNoMatchesMessageDisplayed()).toBeTruthy();
            });

            it('Should NOT show Opening Balance',function(){
                expect(menigaTransactionsPage.isOpeningBalanceDisplayed()).toBeFalsy();
            });

            it('Should NOT show closing Balance',function(){
                expect(menigaTransactionsPage.isClosingBalanceDisplayed()).toBeFalsy();
            });

            it('Should NOT show always-back-to-top',function(){
                expect(menigaTransactionsPage.is_alwaysBackToTop_Displayed()).toBeFalsy();
            });
        });

    });

}