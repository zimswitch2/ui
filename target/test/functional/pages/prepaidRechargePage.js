var prepaidRechargePage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var accountElement = element(by.id('account'));
    var providerElement = element(by.id('provider'));
    var bundleElement = element(by.id('bundle'));
    var amountElement = element(by.id('amount'));
    var rechargeNumberElement = element(by.id('rechargeNumber'));
    var availableDailyLimit = element(by.id('availableDailyLimit'));

    this.account = function (accountName) {
        return this.baseActions.textForDropdown(accountElement, accountName);
    };

    this.provider = function (providerName) {
        return this.baseActions.textForDropdown(providerElement, providerName);
    };

    this.selectProduct = function (productName) {
        helpers.scrollThenClick(element(by.id(productName)));
    };

    this.isProductSelected = function (productName) {
        return element(by.id(productName)).isSelected();
    };

    this.availableDailyLimit = function () {
        return availableDailyLimit.getText();
    };

    this.bundle = function (type) {
        return this.baseActions.textForDropdown(bundleElement, type);
    };

    this.amount = function (amount) {
        return this.baseActions.textForInput(amountElement, amount);
    };

    this.rechargeNumber = function (rechargeNumber) {
        return this.baseActions.textForInput(rechargeNumberElement, rechargeNumber);
    };

    this.rechargeDate = function () {
        return element(by.id('rechargeDate')).getText();
    };

    this.getNotificationMessageVisibility = function () {
        return element(by.css('div.notification.info')).isDisplayed();
    };

    this.proceed = function () {
        helpers.scrollThenClick(element(by.css('#proceed')));
    };

    this.cancel = function () {
        helpers.scrollThenClick(element(by.css('#cancel')));
    };

};

module.exports = new prepaidRechargePage();
