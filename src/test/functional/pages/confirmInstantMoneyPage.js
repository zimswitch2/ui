var confirmInstantMoneyPage = function () {
    var self = this;
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var findElementValueForLabel = function (label) {
        element(by.cssContainingText('span', label)).element(by.xpath('following-sibling::span'));
    };

    this.confirm = function () {
        element(by.cssContainingText('button', 'Confirm')).click();
    };

    this.fromAccount = function () {
        return element(by.cssContainingText('span','From Account')).element(by.xpath('following-sibling::span')).getText();
    };

    this.availableBalance = function () {
        return element(by.cssContainingText('span','Available Balance')).element(by.xpath('following-sibling::span')).getText();
    };

    this.cellPhoneNumber = function () {
        return element(by.cssContainingText('span','Cell phone number')).element(by.xpath('following-sibling::span')).getText();
    };

    this.amount = function () {
        return element(by.cssContainingText('span','Amount')).element(by.xpath('following-sibling::span')).getText();
    };
};

module.exports = new confirmInstantMoneyPage();