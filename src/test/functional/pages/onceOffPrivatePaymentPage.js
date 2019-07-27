var onceOffPrivatePaymentPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var beneficiaryPreferredName = element(by.css('#preferredName'));
    var beneficiaryPreferredAddress = element(by.css('#preferredAddress'));

    this.heading = function() {
       return element(by.css('h2')).getText();
    };

    this.proceedButton = function() {
        return element(by.id('proceed'));
    };

    this.confirmButton = function() {
        return element(by.id('confirm'));
    };

    this.clickBackToTransactionTab = function () {
        helpers.scrollThenClick(element(by.id('done')));
    };

    this.setSetupPaymentConfirmation = function (paymentConfirmation) {
        var cssSelector = paymentConfirmation ? '#yes' : '#no';
        helpers.scrollThenClick(element(by.css(cssSelector)));
    };

    this.setPaymentConfirmation = function (confirmationMethod, confirmationDetails) {
        this.setPaymentConfirmationMethod(confirmationMethod);
        this.baseActions.textForInput(beneficiaryPreferredName, confirmationDetails.recipientName);
        this.baseActions.textForInput(beneficiaryPreferredAddress, confirmationDetails.address);
    };

    this.setPaymentConfirmationMethod = function (confirmationMethod) {
        this.setSetupPaymentConfirmation(true);
        if (confirmationMethod === "Email") {
            helpers.scrollThenClick(element(by.css('#emailpayment-confirmation')));
        } else if (confirmationMethod === "SMS") {
            helpers.scrollThenClick(element(by.css('#smspayment-confirmation')));
        } else if (confirmationMethod === "Fax") {
            helpers.scrollThenClick(element(by.css('#faxpayment-confirmation')));
        }
    };

    this.paymentDetails = function () {
        return element(by.id('paymentDetails')).getText();
    };

    this.setSaveBeneficiary = function(isSaveAsBeneficiary){
        if (isSaveAsBeneficiary) {
            helpers.scrollThenClick(element(by.id('save-as-beneficiary-yes')));
        }else{
            helpers.scrollThenClick(element(by.id('save-as-beneficiary-no')));
        }
    };

    this.getSaveBeneficiary = function (isSaveAsBeneficiary) {
        if (isSaveAsBeneficiary) {
            return element(by.id('save-as-beneficiary-yes'));
        }else{
            return element(by.id('save-as-beneficiary-no'));
        }
    };
    this.getPaymentNotificationLabel = function () {
        return element(by.css('#payment-notification > label')).getText();
    };

    this.getValueOf = function(elementId) {
        return element(by.id(elementId)).getAttribute('value');
    };

};

module.exports = new onceOffPrivatePaymentPage();
