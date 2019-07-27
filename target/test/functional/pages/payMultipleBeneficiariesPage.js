var PayMultipleBeneficiariesPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var accountSelectBox = element(by.css('#fromAccountSelect'));
    var filterBox = element(by.css('#filter'));

    by.beneficiariesList = function () {
        return this.repeater('currentBeneficiary in beneficiaryList()');
    };

    this.getBeneficiaryList = function () {
        return element.all(by.beneficiariesList());
    };

    this.amountField = function (number) {
        return element.all(by.css('input.amount')).get(number);
    };

    this.amount = function (number) {
        return element.all(by.css('.payment-amount')).get(number);
    };

    this.beneficiaryAt = function (number) {
        var trs = element.all(by.css('ul.data li'));

        return trs.get(number);
    };

    this.beneficiaryNameAt = function (number) {
        return element(by.repeater('currentBeneficiary in beneficiaryList()').row(number).column('currentBeneficiary.name')).getText();
    };

    this.yourReferenceOnConfirm = function (number) {
        return this.beneficiaryAt(number).element(by.css('div:nth-child(2)'));
    };

    this.beneficiaryReferenceOnConfirm = function (number) {
        return this.beneficiaryAt(number).element(by.css('div:nth-child(3)'));
    };

    this.recipientNameOnConfirm = function (number) {
        return this.beneficiaryAt(number).element(by.css('div:nth-child(4)'));
    };

    this.paymentNotificationOnConfirm = function (number) {
        return this.beneficiaryAt(number).element(by.css('div:nth-child(5)'));
    };

    this.paymentNotificationOnResult = function (number) {
        return this.beneficiaryAt(number).element(by.css('#notification-warning'));
    };

    this.yourReferenceIsReady = function () {
        return browser.wait(function () {
            return element(by.model('currentBeneficiary.customerReference')).isPresent();
        }, 3000);
    };

    this.yourReference = function (number) {
        return element.all(by.model('currentBeneficiary.customerReference')).get(number);
    };

    this.beneficiaryReference = function (number) {
        return element.all(by.model('currentBeneficiary.recipientReference')).get(number);
    };

    this.notificationPreferenceLink = function (number) {
        return element.all(by.css('.notification-preference')).get(number);
    };

    this.getFirstErrorFor = function (fieldName) {
        return element.all(by.css('input[name="' + fieldName + '"] +ng-messages ng-message.form-error:not(.ng-hide)'))
            .first().getText();
    };

    this.availableBalance = function () {
        return element(by.css('#balance'));
    };

    this.monthlyLimit = function () {
        return element(by.css('#limit'));
    };

    this.availableLimit = function () {
        return element(by.css('#transfer'));
    };

    this.totalAmount = function () {
        return element(by.css('.total-amount'));
    };

    this.nextButton = function () {
        return element(by.css('button#next'));
    };

    this.modifyButton = function () {
        return element(by.css('button.secondary#modify'));
    };

    this.getBeneficiaryInputBox = function (name) {
        return element(by.id(name));
    };

    this.confirmButton = function () {
        return element(by.css('button#confirm'));
    };

    this.morePaymentsButton = function () {
        return element(by.buttonText('Back'));
    };

    this.notification = function (number) {
        return element.all(by.css('.text-notification.multiple')).get(number);
    };

    this.account = function (accountName) {
        return this.baseActions.textForDropdown(accountSelectBox, accountName);
    };

    this.filter = function (search) {
        return this.baseActions.textForInput(filterBox, search);
    };

    this.next = function () {
        helpers.scrollThenClick(this.nextButton());
    };

    this.modify = function () {
        helpers.scrollThenClick(this.modifyButton());
    };
};

module.exports = new PayMultipleBeneficiariesPage();
