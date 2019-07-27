var Register = function () {
    'use strict';
    var registerPage = require('../../../pages/registerPage.js');

    this.When(/^I complete the register form with "([^"]*)"$/, function (cardDetails) {
        registerPage.completeForm(browser.params.registrationInformation[_.camelCase(cardDetails)]);
    });
};

module.exports = Register;
