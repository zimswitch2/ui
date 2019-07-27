/**
 * Created by zorodzayi on 2015/07/07.
 */

var MenigaTransactionsPage = function(){
    'use strict';

    var page = this;
    page.baseActions = require('./baseActions.js');
    var helpers      = require('./helpers.js');

    page.loading = function(){
        return element(by.css('.loading-text'));
    };

    page.isLoadingDisplayed = function(){
        return page.loading().isDisplayed();
    };

    page.downloadPDF = function(){
        return element(by.id('download'));
    };

    page.isDownloadPDFDisplayed = function(){
        return page.downloadPDF().isDisplayed();
    };

    page.print = function(){
        return element(by.id('print'));
    };

    page.isPrintDisplayed = function(){
        return page.print().isDisplayed();
    };

    page.transactionsList = function () {
        return element(by.model('menigaTransactionsPageQuery.account'));
    };

    page.isTransactionsListPresent = function(){
        return page.transactionsList().isPresent();
    };


    page.statementType = function(){
        return element(by.model("menigaTransactionsPageQuery.monthsToGoBack"));
    };

    page.isStatementTypePresent = function(){
        return page.statementType().isPresent();
    };

    page.search = function(){
        return element(by.model('searchString'));
    };

    page.isSearchPresent = function(){
      return page.search().isPresent();
    };

    page.noTransactions = function(){
        return element(by.id("noTransactionsInfo"));
    };

    page.isNoTransactionsDisplayed = function(){
       return page.noTransactions().isDisplayed();
    };

    page.typeOnSearchBox = function(textString){
      element(by.model('filterText')).sendKeys(textString);
    };

    page.statementTypes = function(){
        return element.all(by.options("statementType.numberOfMonths as statementType.description for statementType in statementTypes"));
    };

    page.numberOfStatementTypes = function(){
        return page.statementTypes().count();
    };

    page.account = function(){
        return element(by.id("account"));
    };

    page.isAccountPresent = function(){
        return page.account().isPresent();
    };

    page.accountList = function(){
        return element.all(by.options("account as account.name for account in accounts"));
    };

    page.numberOfAccounts = function(){
        return page.accountList().count();
    };

    page.transactions = function () {
        return  element.all(by.repeater('transaction in filteredTransactions'));
    };

    page.selectSecondAccount = function(){
        page.baseActions.textForDropdown(page.account() ,'ACCESSACC');
    };

    page.selectPeriodWithNoTransactions = function () {
        page.selectSecondAccount();
    };

    page.selectToGoBack1Month = function(){
        page.baseActions.textForDropdown(page.statementType(),'30 Days');
    };

    page.transactionDates = function () {
        return element.all(by.binding('transaction.Date'));
    };

    page.transactionCategories = function(){
        return element.all(by.binding('transaction.CategoryName'));
    };

    page.openingBalance = function(){
        return element(by.binding('balances.opening'));
    };

    page.isOpeningBalanceDisplayed = function(){
        return page.openingBalance().isDisplayed();
    };

    page.closingBalance = function(){
        return element(by.binding('balances.closing'));
    };

    page.isClosingBalanceDisplayed = function(){
        return page.closingBalance().isDisplayed();
    };

    page.transactionAmounts = function(){
        return  element.all(by.binding('transaction.Amount'));
    };

    page.transactionBalances = function(){
        return element.all(by.binding('transaction.Balance'));
    };

    page.noMatchesMessage= function(){
        return element(by.id('no-matches-message'));
    };

    page.isNoMatchesMessageDisplayed = function(){
        return page.noMatchesMessage().isDisplayed();
    };

    page.alwaysBackToTop = function(){
        return element(by.css('.always-back-to-top'));
    };

    page.is_alwaysBackToTop_Displayed = function(){
        return page.alwaysBackToTop().isDisplayed();
    };

};

module.exports = new MenigaTransactionsPage();
