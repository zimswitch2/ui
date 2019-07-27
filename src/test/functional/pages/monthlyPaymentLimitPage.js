var MonthlyPaymentLimitPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.clickOnMonthlyPaymentLimit = function(url) {
        element(by.css('a[href="#' + url + '"]')).click();
    };

    this.getMonthlyLimit = function () {
        return element(by.id('monthlyLimit')).getText();
    };

    this.getUsedEAPLimit = function () {
        return element(by.id('usedEAPLimit')).getText();
    };

    this.getAvailableLimit = function () {
        return element(by.id('availableLimit')).getText();
    };

    this.clickMaintainLimitButton= function () {
        element(by.id('maintainLimitButton')).click();
    };

    this.isAmountVisible = function () {
        return browser.isElementPresent(by.id('amount'));
    };

    this.getAmountText = function () {
        return element(by.id('amount')).getText();
    };

    this.typeAmount = function (value) {
        element(by.id('amount')).clear().sendKeys(value);
    };

    this.clickSaveButton = function () {
        element(by.id('saveButton')).click();
    };

    this.saveButton = function () {
        return element(by.id('saveButton'));
    };

    this.successMessage = function () {
        return element(by.css('div[success][notification]'));
    };

    this.errorMessage = function () {
        return element(by.css('div[error][notification]'));
    };

    this.infoMessage = function () {
        return element(by.id('infoMessage'));
    };

};

module.exports = new MonthlyPaymentLimitPage();
