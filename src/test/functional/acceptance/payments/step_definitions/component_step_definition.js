var myStepDefinitionsWrapper = function () {
    var expect = require('../../step_definitions/expect');

    this.Then(/^I should see "([^"]*)" in the "([^"]*)" input$/, function (inputValue, inputLabel) {
        return expect(element(by.inputLabel(inputLabel)).getAttribute('value')).to.eventually.equal(inputValue);
    });

    this.Then(/^I should see "([^"]*)" selected from the "([^"]*)" input$/, function (inputValue, inputLabel) {
        return expect(element(by.inputLabel(inputLabel)).$('option:checked').getText()).to.eventually.equal(inputValue);
    });
};
module.exports = myStepDefinitionsWrapper;