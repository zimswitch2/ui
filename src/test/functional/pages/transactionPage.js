var transactionPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var changeEAPLimitMenu = element(by.id('change-eap-limit'));
    var instantMoney = element(by.id('instant-money-history'));

    this.heading = function () {
        return element(by.css('h2')).getText();
    };

    this.waitForHeading = function (text) {
        return helpers.waitForText(element(by.css('h2')), text);
    };

    this.onceOffPaymentButton = function() {
        return element(by.id('once-off-payment'));
    };

    this.payMultipleButton = function() {
        return element(by.id('pay-multiple'));
    };

    this.payGroupButton = function() {
        return element(by.id('pay-beneficiary-group'));
    };

    this.clickOnceOffPaymentButton = function() {
        helpers.scrollThenClick(this.onceOffPaymentButton());
    };

    this.createInterAccountTransfer = function() {
        helpers.scrollThenClick(element(by.id('inter-account-transfer')));
    };

    this.clickPrepaidButton = function() {
        helpers.scrollThenClick(element(by.id('prepaid')));
    };

    this.clickPrepaidHistoryButton = function() {
        helpers.scrollThenClick(element(by.id('prepaid-history')));
    };

    this.clickInstantMoney = function () {
        helpers.scrollThenClick(instantMoney);
    };

    this.getWarningMessage = function(){
        return element(by.css('.error.block.message')).getText();
    };

    this.manageFuturePayments = function() {
        return helpers.scrollThenClick(element(by.id('manage-scheduled-payments')));
    };

    this.waitForTransactPage = function () {
        helpers.wait(element(by.id('prepaid-history')));
    };

    this.clickOnMonthlyEAPLimitMenuItem = function () {
        helpers.scrollThenClick(changeEAPLimitMenu);
    };

    this.monthlyEAPLimitMenuItem = function () {
        return changeEAPLimitMenu;
    };
    this.getInstantMoney = function () {
        return instantMoney;
    };

    this.getCreateInstantMoney = function () {
        return element(by.id('create-instant-money'));
    };

    this.clickOnCreateInstantMoney = function () {
        helpers.scrollThenClick(this.getCreateInstantMoney());
    };

    this.getViewFormalStatement = function () {
        return element(by.id('formal-statements'));
    };

    this.clickViewFormalStatements = function () {
        helpers.scrollThenClick(this.getViewFormalStatement());
    };
};

module.exports = new transactionPage();
