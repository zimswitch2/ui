var EditContactInformationStepDefinition = function () {
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');

    this.When(/^I change the (\d+)(?:st|nd|rd|th) contact detail to "([^"]*)"$/, function (position, value) {
        var index = position - 1;
        return element(by.css('input[name="Contact_detail_' + index + '"]')).clear().sendKeys(value);
    });

    this.When(/^I change the (\d+)(?:st|nd|rd|th) contact type to "([^"]*)"$/, function (position, value) {
        var index = position - 1;
        return element(by.css('select[name="Contact_type_' + index + '"]'))
            .element(by.cssContainingText('option', value))
            .click();
    });

    this.When(/^I remove the (\d+)(?:st|nd|rd|th) contact detail$/, function (position) {
        var index = position - 1;
        return element(by.css('sb-input[name="Contact_detail_' + index + '"] button')).click();
    });

    this.Then(/^I should see the following details in the edit contact information section:$/, function (contactDetails) {
        var actualRows = element.all(by.repeater('contact in customerInformationData.communicationInformation')).then(function (rows) {
            return Promise.all(rows.map(function (row) {
                var typePromise = row.element(by.css('select')).getAttribute('value').then(function (optionValue) {
                    return row.element(by.css('option[value="' + optionValue + '"]')).getText();
                });
                var detailPromise = row.element(by.css('input')).getAttribute('value');
                var errorPromise = row.all(by.css('sb-input .form-error:not(.ng-hide)')).getText();

                return Promise.all([typePromise, detailPromise, errorPromise]).then(function (results) {
                    var error = results[2].length === 0 ? '' : results[2][0];
                    return {type: results[0], detail: results[1], error: error};
                });
            }));
        });
        return expect(actualRows).to.eventually.deep.equal(contactDetails.hashes());
    });
};
module.exports = EditContactInformationStepDefinition;