var modalStepDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');

    this.When(/^I assign the "([^"]*)" role to the account "([^"]*)"$/, function (role, accountNumber) {
        return element(by.css('div.permission-radio-col input[type="radio"][name="' + accountNumber + '"][value="' + role + '"]')).click();
    });
};

module.exports = modalStepDefinition;
