var LinkCard = function () {
    'use strict';
    var registerPage = require('../../../pages/registerPage.js');
    var otpPage = require('../../../pages/otpPage.js');
    var linkCardPage = require('../../../pages/linkCardPage.js');
    var loginPage = require('../../../pages/loginPage.js');
    var newRegisteredPage = require('../../../pages/newRegisteredPage.js');
    var callMeBackPage = require('../../../pages/callMeBackPage.js');
    var expect = require('../../step_definitions/expect');

    this.Given(/^I have registered as "([^"]*)"$/, function (registrationDetails) {
        loginPage.load();
        loginPage.clickRegister();
        registerPage.completeForm(browser.params.registrationInformation[registrationDetails]);
        otpPage.submitOtp(browser.params.oneTimePassword);
        newRegisteredPage.linkYourCard.click();
    });

    this.When(/^I enter "([^"]*)" into the card details form$/, function (errorCardDetails) {
        linkCardPage.enterCardDetails(browser.params.cardInformation[errorCardDetails]);
           });
};

module.exports = LinkCard;
