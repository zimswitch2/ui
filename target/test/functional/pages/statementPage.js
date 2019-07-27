var StatementPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var openingBalanceSelector = by.css('.balance.opening');
    var closingBalanceSelector = by.css('.balance.closing');
    var latestBalanceSelector = by.css('.balance.latest');

    this.getTransactions = function () {
        return element.all(by.css('.transaction'));
    };

    function balanceFor(selector) {
        return element(selector).element(by.css('.information div:nth-child(4)')).getText();
    }

    function descriptionFor(selector) {
        return element(selector).element(by.css('.information div:nth-child(2)')).getText();
    }

    this.openingBalance = function () {
        return balanceFor(openingBalanceSelector);
    };

    this.latestBalance = function () {
        return balanceFor(latestBalanceSelector);
    };

    this.latestBalanceDescription = function () {
        return descriptionFor(latestBalanceSelector);
    };

    this.openingBalanceDisplayed = function () {
        return browser.isElementPresent(openingBalanceSelector);
    };

    this.closingBalanceDisplayed = function () {
        return browser.isElementPresent(closingBalanceSelector);
    };

    this.latestBalanceDisplayed = function () {
        return browser.isElementPresent(latestBalanceSelector);
    };

    this.getNumberOfTransactions = function () {
        return this.getTransactions().then(function (transactions) {
            return transactions.length;
        });
    };

    this.searchBox = function () {
        return element(by.css('form'));
    };

    this.printButton = function () {
        return element(by.css('#print'));
    };

    this.viewDownloadButton = function() {
        return element(by.id('download'));
    };

    this.statementTable = function () {
        return element(by.css('.statement #statement-table'));
    };

    this.selectAccount = function (accountName) {
        return this.baseActions.textForDropdown(element(by.css('#account')), accountName);
    };

    this.getErrorNotification = function () {
        return element(by.css('.error.notification'));
    };

    this.viewPaymentNotificationHistory = function() {
        helpers.scrollThenClick(element(by.id('view-notification-history')));
    };

    this.viewPaymentNotificationHistoryButton = function() {
       return element(by.id('view-notification-history'));
    };

    this.switchToStatementType = function (statementType) {
        this.baseActions.textForDropdown(element(by.css('select#statement-type')), statementType);
    };

    this.getNoMatchesMessage = function () {
        return element(by.id('no-matches-message')).getText();
    };

    this.isDownloadButtonVisible = function () {
        return browser.isElementPresent(by.id('download'));
    };

    this.isDownloadModalVisible = function () {
        return browser.isElementPresent(by.id('download-modal'));
    };

    this.clickDownloadButton = function () {
        element(by.id('download')).click();
    };

};

module.exports = new StatementPage();
