var ViewPaymentConfirmationPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var getContent = function (listElement, headerText) {
        return listElement.element(by.css('div[data-header="' + headerText + '"]')).getText();
    };

    this.getPayments = function () {
        return element.all(by.css('#payment-line li')).map(function (listElement) {
            return {
                paymentDate : getContent(listElement, 'Payment date'),
                beneficiaryName : getContent(listElement, 'Beneficiary name'),
                beneficiaryReference : getContent(listElement, 'Beneficiary reference'),
                recipientName : getContent(listElement, 'Recipient name'),
                sentTo : getContent(listElement, 'Sent to'),
                amount : getContent(listElement, 'Amount')
            };
        });
    };

    this.getNumberOfPayments = function () {
        return this.getPayments().then(function (transactions) {
            return transactions.length;
        });
    };

    this.selectAccount = function(accountName){
        return this.baseActions.textForDropdown(element(by.css('#account')), accountName);
    };

    this.getWarningMessage = function(){
      return element(by.css('.information.message')).getText();
    };

    this.clickOnResendButton = function () {
        helpers.scrollThenClick(element.all(by.css('.resend')).first());
    };

    this.resendConfirmButton = function () {
        return element.all(by.css('.confirm')).first();
    };

    this.resendCancelButton = function () {
        return element.all(by.css('.cancel')).first();
    };

    this.getResendMessage = function () {
        return element.all(by.css('#resendMessage')).first().getText();
    };
};

module.exports = new ViewPaymentConfirmationPage();
