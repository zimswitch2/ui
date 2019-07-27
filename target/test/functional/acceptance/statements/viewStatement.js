var viewTransactionsFeature = false;
{
    viewTransactionsFeature = true;
}

var menigaTransactionsHistoryFeature = false;

if (!viewTransactionsFeature) {
    if (!menigaTransactionsHistoryFeature) {
        describe('ACCEPTANCE - Statement Functionality', function () {
            'use strict';
            var anyPage = require('../../pages/anyPage.js');
            var loginPage = require('../../pages/loginPage.js');
            var statementPage = require('../../pages/statementPage.js');
            var landingPage = require('../../pages/landingPage.js');
            var accountSummaryPage = require('../../pages/accountSummaryPage.js');

            var DEFAULT_ACCOUNT = 'ACCESSACC - 10-00-035-814-0';
            var ACCOUNT_THAT_WILL_THROW_ERROR = 'NOTICE - 5592-0070-1204-1560';
            var ACCOUNT_WITH_NO_PAYFROM_FEATURE = 'FIXED TERM - 5592-0070-1204-0000';
            var __credentialsOfLoggedInUser__;

            beforeEach(function () {
                var credentials = browser.params.credentials;
                if (__credentialsOfLoggedInUser__ !== credentials) {
                    loginPage.loginWith(credentials);
                    __credentialsOfLoggedInUser__ = credentials;
                }
            });

            function ensureCanFilterByDescription() {
                expect(statementPage.getNumberOfTransactions()).toEqual(3);

                anyPage.setFilterQuery('demo');

                expect(statementPage.getNumberOfTransactions()).toEqual(1);
                expect(statementPage.openingBalanceDisplayed()).toBeFalsy();
                expect(statementPage.closingBalanceDisplayed()).toBeFalsy();
            }

            function ensureUserIsNotifiedIfFilterReturnsNoResults() {
                anyPage.setFilterQuery("won't match");

                expect(statementPage.getNumberOfTransactions()).toEqual(0);

                expect(statementPage.getNoMatchesMessage()).toEqual('No matches found');
            }

            function ensureUserIsNotifiedIfNoTransactions() {
                expect(statementPage.latestBalanceDescription()).toEqual('No transactions during this period');
            }

            function ensureUserIsNotifiedIfErrorOccurs() {
                statementPage.selectAccount(ACCOUNT_THAT_WILL_THROW_ERROR);
                expect(statementPage.baseActions.getErrorVisibility()).toBeTruthy();
                expect(statementPage.baseActions.getErrorMessage()).toEqual('An error has occurred');
                expect(statementPage.searchBox().isDisplayed()).toBeFalsy();

                ensureTableAndSearchBoxAreHiddenWhenNotificationIsClosed();
            }

            function ensureTableAndSearchBoxAreHiddenWhenNotificationIsClosed() {
                statementPage.baseActions.closeNotificationMessages();

                expect(statementPage.getErrorNotification().isDisplayed()).toBeFalsy();
                expect(statementPage.searchBox().isDisplayed()).toBeFalsy();
            }

            function ensureErrorGoesAwayWhenSwitchingToNewAccount() {
                statementPage.selectAccount(ACCOUNT_THAT_WILL_THROW_ERROR);
                statementPage.selectAccount(DEFAULT_ACCOUNT);
                expect(statementPage.getErrorNotification().isDisplayed()).toBeFalsy();
            }

            function ensureDisplaysLatestAccountBalanceWhenThereAreNoStatementLines(account, balance) {
                statementPage.selectAccount(account);
                expect(statementPage.getNumberOfTransactions()).toEqual(0);
                expect(statementPage.openingBalanceDisplayed()).toBeFalsy();
                expect(statementPage.latestBalanceDisplayed()).toBeTruthy();
                expect(statementPage.latestBalance()).toEqual(balance);
                ensureUserIsNotifiedIfNoTransactions();
            }

            function ensureDisplaysOpeningBalance() {
                expect(statementPage.openingBalance()).toEqual('0.00');
            }

            function ensureProvisionalStatementPageIsLoaded() {
                expect(anyPage.getTitle()).toEqual('Transaction History');
            }

            function ensureFilteringTransactionsWorksAsExpected() {
                ensureCanFilterByDescription();
                ensureUserIsNotifiedIfFilterReturnsNoResults();
            }

            function ensureCannotViewPayNotificationHistoryWhenAccountCannotBePaidFrom() {
                statementPage.selectAccount(ACCOUNT_WITH_NO_PAYFROM_FEATURE);
                expect(statementPage.viewPaymentNotificationHistoryButton().isDisplayed()).toBeFalsy();
            }

            function ensureYouCanSwitchBetweenStatementTypes() {
                statementPage.switchToStatementType('90 days');
                expect(statementPage.baseActions.getCurrentUrl()).toContain('statementType=Ninety');
            }

            function ensurePrintButtonExists() {
                expect(statementPage.printButton().getText()).toEqual('Print');
            }

            function ensureCannotViewDownloadButtonWhenAccountDoesNotHaveTransactions() {
                statementPage.selectAccount(ACCOUNT_WITH_NO_PAYFROM_FEATURE);
                expect(statementPage.viewDownloadButton().isDisplayed()).toBeFalsy();
            }

            function ensureDownloadButtonExists() {
                expect(statementPage.viewDownloadButton().isDisplayed()).toBeTruthy();
            }

            it('should display provisional statements for different types of accounts', function () {
                landingPage.baseActions.clickOnTab('Account Summary');
                accountSummaryPage.viewFirstTransactionAccountStatement();
                ensurePrintButtonExists();
                ensureDownloadButtonExists();
                ensureProvisionalStatementPageIsLoaded();
                ensureDisplaysOpeningBalance();
                ensureFilteringTransactionsWorksAsExpected();
                ensureCannotViewPayNotificationHistoryWhenAccountCannotBePaidFrom();
                ensureCannotViewDownloadButtonWhenAccountDoesNotHaveTransactions();
                ensureUserIsNotifiedIfErrorOccurs();
                ensureDisplaysLatestAccountBalanceWhenThereAreNoStatementLines('MONEYMARKET - 26-845-062-5-2', '31 011.00');
                ensureErrorGoesAwayWhenSwitchingToNewAccount();
                ensureYouCanSwitchBetweenStatementTypes();
            });
        });
    }
}