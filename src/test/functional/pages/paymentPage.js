var paymentPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var fromAccountSelect = element(by.id('account'));

    this.changeFromAccount = function () {
        helpers.scrollThenClick(fromAccountSelect.element(by.css('option:nth-child(2)')));
    };

    this.proceed = function () {
        helpers.scrollThenClick(element(by.id('proceed')));
    };

    this.selectRepeatPayment = function () {
        helpers.scrollThenClick(element(by.id('recurringPayment')));
    };

    this.selectFirstRepeatInterval = function () {
        element(by.css('select#repeatInterval option:nth-child(1)')).click();
    };

    this.enterRepeatNumber = function (repeatNumber) {
        return this.baseActions.textForInput(element(by.css('input#repeatNumber')), repeatNumber);
    };

    this.proceed = function () {
        helpers.scrollThenClick(element(by.id('proceed')));
    };

    this.amount = function (amountAsString) {
        return this.baseActions.textForInput(element(by.id('amount')), amountAsString);
    };

    this.getErrorMessage = function () {
        return element(by.css('ng-include:not(.ng-hide) .form-error:not(.ng-hide)')).getText();
    };

    this.getNotificationMessage = function () {
        return element(by.css('ng-include:not(.ng-hide) .text-notification:not(.ng-hide)')).getText();
    };

    this.selectLastDate = function () {
        helpers.scrollThenClick(element(by.css('.datepicker-input')));
        helpers.scrollThenClick(element.all(by.css('.datepicker ul.dates li')).last());
    };

    this.proceedPayment = function (amount) {
        this.amount(amount);
        helpers.scrollThenClick(element(by.id('proceed')));
    };

    this.clickConfirm = function () {
        helpers.scrollThenClick(element(by.id('confirm')));
    };

    this.waitForManagePage = function () {
        helpers.wait(element(by.id('back-button')));
    };

    this.clickCancel = function () {
        helpers.scrollThenClick(element(by.id('cancel')));
    };

    this.clickModify = function () {
        helpers.scrollThenClick(element(by.id('modify')));
    };

    this.clickDone = function () {
        helpers.scrollThenClick(element(by.id('done')));
    };

    this.availableBalance = function () {
        return element(by.id('accountAvailableBalance'));
    };

    this.monthlyLimit = function () {
        return element(by.id('monthlyLimit'));
    };

    this.availableLimit = function () {
        return element(by.id('availableLimit'));
    };

    this.getBeneficiaryLatestPayment = function () {
        return element(by.css('.currency.ng-binding'));
    };

    this.selectedRadioButton = function (radioGroupName){
        return element(by.css("input:checked[name='"+radioGroupName+"']")).getAttribute('value');
    };

    this.setPaymentConfirmation = function (confirmationMethod, confirmationDetails) {
        this.setPaymentConfirmationMethod(confirmationMethod);
        this.baseActions.textForInput(element(by.id('preferredName')), confirmationDetails.recipientName);
        this.baseActions.textForInput(element(by.id('preferredAddress')), confirmationDetails.address);
    };

    this.setPaymentConfirmationMethod = function (confirmationMethod) {
        this.baseActions.selectRadioOption(confirmationMethod);
    };

    this.confirmationDetails = function () {
        return element(by.id('confirmationDetails')).getText();
    };

    this.confirmationAddress = function () {
        return element(by.id('confirmationAddress')).getText();
    };

    this.getDetails = function() {
        return element(by.id('paymentDetailsConfirmation')).getText();
    };

    this.getAmount = function() {
        return element(by.css('div#amount>span.amount')).getText();
    };
};

module.exports = new paymentPage();
