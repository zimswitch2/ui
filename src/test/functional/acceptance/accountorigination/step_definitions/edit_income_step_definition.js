var EditIncomeStepDefinition = function () {
    var expect = require('../../step_definitions/expect');

    this.When(/^I change the (\d+)(?:st|nd|rd|th) income amount to "([^"]*)"$/, function (position, value) {
        var index = position - 1;
        return element(by.css('input[name="Income_amount_' + index + '"]')).clear().sendKeys(value);
    });
};
module.exports = EditIncomeStepDefinition;