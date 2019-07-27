var loginPage = require('../pages/loginPage.js');
var helpers = require('../pages/helpers.js');
var otpPage = require('../pages/otpPage.js');
var landingPage = require('../pages/landingPage.js');
var addBeneficiaryPage = require('../pages/addBeneficiaryPage.js');
var confirmBeneficiaryPage = require('../pages/confirmBeneficiaryPage.js');
var paymentPage = require('../pages/paymentPage.js');
var listBeneficiaryPage = require('../pages/listBeneficiaryPage.js');
var transactionPage = require('../pages/transactionPage.js');
var listBeneficiaryGroupPage = require('../pages/listBeneficiaryGroupsPage.js');
var addBeneficiaryGroupPage = require('../pages/addBeneficiariesGroupPage.js');
var Chance = require('../../lib/chance');

var chance = new Chance();
var correctOtp = browser.params.oneTimePassword;

var beneficiariesSteps = function() {

    this.enterBeneficiaryDetails = function(details) {
        details.name = chance.name();
        landingPage.baseActions.navigateToBeneficiaries();
        listBeneficiaryPage.clickAddBeneficiary();
        addBeneficiaryPage.enterPrivateBeneficiaryDetails(details);
    };

    this.proceedAndSubmitOtp = function (otpKey) {
        addBeneficiaryPage.proceed();
        confirmBeneficiaryPage.clickConfirm();
        otpPage.submitOtp(otpKey);
    };

    this.addGroup = function (groupName) {
        landingPage.baseActions.navigateToTransact();
        helpers.scrollThenClick(transactionPage.payGroupButton());
        helpers.scrollThenClick(listBeneficiaryGroupPage.getAddGroupButton());
        addBeneficiaryGroupPage.addNewGroup(groupName);
    };

    this.deleteGroup = function(groupName) {
        landingPage.baseActions.navigateToTransact();
        helpers.scrollThenClick(transactionPage.payGroupButton());
        listBeneficiaryGroupPage.deleteGroup(groupName);
    };

    this.addBeneficiaryToGroup = function () {
        helpers.scrollThenClick(addBeneficiaryGroupPage.getEnabledBeneficiaryList());
        helpers.scrollThenClick(addBeneficiaryGroupPage.getBeneficiaryGroups().first());
    };
};

module.exports = new beneficiariesSteps();
