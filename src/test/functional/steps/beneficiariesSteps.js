var loginPage = require('../pages/loginPage.js');
var anyPage = require('../pages/anyPage.js');
var helpers = require('../pages/helpers.js');
var otpPage = require('../pages/otpPage.js');
var landingPage = require('../pages/landingPage.js');
var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
var paymentPage = require('../pages/paymentPage.js');
var listBeneficiaryPage = require('../pages/listBeneficiaryPage.js');
var Chance = require('../../lib/chance');

var chance = new Chance();
var correctOtp = browser.params.oneTimePassword;

var beneficiariesSteps = function() {

    function enterBeneficiaryDetails(details) {
        details.name = chance.name();
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.clickAddBeneficiary();
        addBeneficiaryPage.enterPrivateBeneficiaryDetails(details);
    }

    this.proceedAndSubmitOtp = function (otpKey) {
        addBeneficiaryPage.proceed();
        confirmBeneficiaryPage.clickConfirm();
        otpPage.submitOtp(otpKey);
    };

    this.addPrivateBeneficiary = function (details) {
        enterBeneficiaryDetails(details);
        this.proceedAndSubmitOtp(correctOtp);
        return details.name;
    };

    this.addListedBeneficiary = function (details) {
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.clickAddBeneficiary();
        addBeneficiaryPage.enterListedBeneficiaryDetails(details.name, details.myReference, details.beneficiaryReference);
        this.proceedAndSubmitOtp(correctOtp);
        return details.name;
    };

    this.addBeneficiaryWithConfirmationPayment = function (details, confirmationType) {
        enterBeneficiaryDetails(details);
        addBeneficiaryPage.setPaymentConfirmation(confirmationType, browser.params.emailPaymentConfirmation.successInformation);
        this.proceedAndSubmitOtp(correctOtp);
    };

    this.deleteBeneficiary = function(beneficiaryName) {
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.setFilterQuery(beneficiaryName);
        listBeneficiaryPage.delete();
        listBeneficiaryPage.confirm();
    };

    this.editBeneficiary = function (beneficiaryName) {
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.setFilterQuery(beneficiaryName);
        helpers.scrollThenClick(listBeneficiaryPage.getEditIcon());
    };

    this.addBeneficiary = function (details) {
        details.name = chance.name();
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.clickAddBeneficiary();
        addBeneficiaryPage.enterPrivateBeneficiaryDetails(details);
        this.proceedAndSubmitOtp(correctOtp);
    };
};

module.exports = new beneficiariesSteps();
