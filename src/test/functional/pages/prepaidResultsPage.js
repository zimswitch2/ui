var prepaidResultsPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.account = function () {
      return element(by.id('account')).getText();
    };

    this.rechargeDate = function() {
        return element(by.id('rechargeDate')).getText();
    };

    this.provider = function () {
        return element(by.id('provider')).getText();
    };

    this.amount = function () {
        return element(by.id('amount')).getText();
    };

    this.makeAnotherRecharge = function () {
        helpers.scrollThenClick(element(by.id('makeAnotherRecharge')));
    };

    this.notificationText = function () {
        browser.wait(function(){
            return element(by.css('div.notification')).isPresent();
        });
        return element(by.css('div.notification')).getText();
    };

    this.rechargeNumber = function () {
        return element(by.id('cellNumber')).getText();
    };
};

module.exports = new prepaidResultsPage();
