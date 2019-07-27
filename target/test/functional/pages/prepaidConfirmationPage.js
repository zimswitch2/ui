var prepaidConfirmationPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.account = function () {
      return element(by.id('account')).getText();
    };

    this.provider = function () {
        return element(by.id('provider')).getText();
    };

    this.rechargeDate = function() {
        return element(by.id('rechargeDate')).getText();
    };

    this.rechargeNumber = function () {
        return element(by.id('cellNumber')).getText();
    };

    this.voucherType = function () {
        return element(by.id('voucherType')).getText();
    };

    this.amount = function () {
        return element(by.id('amount')).getText();
    };

    this.bundleName = function () {
        return element(by.id('bundleName')).getText();
    };

    this.availableBalance = function () {
        return element(by.id('availableBalance')).getText();
    };

    this.modify = function () {
        helpers.scrollThenClick(element(by.buttonText('Back')));
    };

    this.confirm = function () {
        helpers.scrollThenClick(element(by.id('confirm')));
    };

    this.cancel = function () {
        helpers.scrollThenClick(element(by.css('#cancel')));
    };
};

module.exports = new prepaidConfirmationPage();
