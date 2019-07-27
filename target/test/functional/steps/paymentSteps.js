var loginPage = require('../pages/loginPage.js');
var helpers = require('../pages/helpers.js');
var otpPage = require('../pages/otpPage.js');
var landingPage = require('../pages/landingPage.js');
var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
var paymentPage = require('../pages/paymentPage.js');
var listBeneficiaryPage = require('../pages/listBeneficiaryPage.js');
var transactionPage = require('../pages/transactionPage.js');
var onceOffPrivatePaymentPage = require('../pages/onceOffPrivatePaymentPage.js');
var Chance = require('../../lib/chance');

var chance = new Chance();
var correctOtp = browser.params.oneTimePassword;

var beneficiariesSteps = function() {

    this.proceedAndSubmitOtp = function (otpKey) {
        addBeneficiaryPage.proceed();
        confirmBeneficiaryPage.clickConfirm();
        otpPage.submitOtp(otpKey);
    };

    this.payBeneficiary = function (value, name) {
        landingPage.baseActions.navigateToBeneficiaries();
        if (name) {
            listBeneficiaryPage.setFilterQuery(name);
        }
        listBeneficiaryPage.clickOnPay();
        paymentPage.proceedPayment(value);
        paymentPage.clickConfirm();
    };

    this.validPayment = function(_amount) {
        landingPage.baseActions.clickOnTab('Transact');
        transactionPage.clickOnceOffPaymentButton();
        var rands = chance.natural({min: 1, max: 100});
        var cents = chance.natural({min: 1, max: 100});
        var amount = _amount || parseFloat(rands + '.' + cents);
        element(by.css('#amount')).sendKeys(amount);
    };

    this.submitPayment = function() {
        helpers.scrollThenClick(onceOffPrivatePaymentPage.proceedButton());
        helpers.scrollThenClick(onceOffPrivatePaymentPage.confirmButton());
        otpPage.submitOtp(correctOtp);
    };

    this.setPaymentConfirmation = function (confirmationOption,confirmationDetails ){
        onceOffPrivatePaymentPage.setPaymentConfirmation(confirmationOption, confirmationDetails);
    };
};

module.exports = new beneficiariesSteps();
