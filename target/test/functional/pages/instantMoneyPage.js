var instantMoneyPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.availableDailyLimit = function () {
        var accountAvailableBalance = element(by.id('accountAvailableBalance'));
        return accountAvailableBalance.getText();
    };

    this.fromAccount = function () {
        return this.baseActions.textForDropdownWithId('account');
    };

    this.contactNumber = function(contactNumber) {
        return this.baseActions.textForInputWithId('CellNumber', contactNumber);
    };

    this.cashCollectionPin = function(cashCollectionPin) {
        return this.baseActions.textForInputWithId('VoucherPin', cashCollectionPin);
    };

    this.confirmCashCollectionPin = function(confirmPIN) {
        return this.baseActions.textForInputWithId('ConfirmVoucherPin', confirmPIN);
    };

    this.amount = function(amount) {
        return this.baseActions.textForInputWithId('amount', amount);
    };

    this.agreeToTermsAndConditions = function() {
        var termsCheckbox = element(by.id('instant-money-terms'));
        helpers.scrollThenClick(termsCheckbox);
    };

    this.proceed = function () {
        element(by.cssContainingText('button', 'Next')).click();
    };
};

module.exports = new instantMoneyPage();