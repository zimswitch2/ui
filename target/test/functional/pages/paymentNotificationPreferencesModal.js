var PaymentNotificationPreferencesModal = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.continueButton = function () {
        return element(by.css('#continue'));
    };

    this.cancelButton = function () {
        return element(by.css('#cancel'));
    };

    this.noCheckbox = function () {
        return element(by.css('#no'));
    };

    this.yesCheckbox = function () {
        return element(by.css('#yes'));
    };

    this.emailCheckbox = function () {
        return element(by.css('#emailpayment-confirmation'));
    };

    this.continue = function () {
        helpers.scrollThenClick(this.continueButton());
    };

    this.cancel = function() {
        helpers.scrollThenClick(this.cancelButton());
    };

    this.preferredName = function (name) {
        if (name) {
            this.baseActions.textForInput(element(by.css('#Recipient_Name')), name);
        } else {
            return element(by.css('#Recipient_Name')).getAttribute('value');
        }
    };

    this.preferredAddress = function (address) {
        if (address) {
            this.baseActions.textForInput(element(by.css('#Recipient_Email')), address);
        } else {
            return element(by.css('#Recipient_Email')).getAttribute('value');
        }
    };
};

module.exports = new PaymentNotificationPreferencesModal();
