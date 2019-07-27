var pureSaveStepDefinition = function () {
    var expect = require('../../step_definitions/expect.js');
    var helpers = require('../../../pages/helpers.js');

    this.Then(/^I should see the product description as "([^"]*)" on the pureSave page$/, function (productDescription) {
        var productDescriptionElementText = element.all(by.css('.application-status-text')).filter(function (elem) {
            return elem.isDisplayed();
        }).first().getText();

        return expect(productDescriptionElementText).to.eventually.equal(productDescription);
    });

    this.Then(/^I should see the "([^"]*)" heading on the pureSave page$/, function (contentHeader) {
        return expect(element.all(by.css('#puresaveAccountDescription h3')).getText()).to.eventually.contain(contentHeader);
    });

    this.Then(/^I should see the "([^"]*)" panel heading on the pureSave page$/, function (contentHeader) {
        return expect(element.all(by.css('#pureSaveAccountDescriptionTwo h3')).getText()).to.eventually.contain(contentHeader);
    });

    this.Then(/^I should see that the "([^"]*)" is "([^"]*)"$/, function (label, value) {
        return expect(element(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data span.ng-binding')).getText()).to.eventually.contains(value);
    });

    this.Then(/^I should see that the "([^"]*)" is "([^"]*)"$/, function (label, value) {

        return expect(element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data span.ng-binding')).getText()).to.eventually.contains(value);
    });

    this.Then(/^I should see the "([^"]*)" sub heading$/, function (header) {
        return expect(element(by.css('ng-form h3')).getText()).to.eventually.equal(header);
    });

    this.Then(/^I should see the "([^"]*)" label$/, function (label) {
        return expect(element.all(by.css('.summary-ao-label')).getText()).to.eventually.contains(label);
    });

    this.Then(/^I should see the value "([^"]*)"$/, function (value) {
        return expect(element.all(by.css('.summary-ao-value')).getText()).to.eventually.contains(value);
    });
    return element(by.id('openingAccountLable'));
};

module.exports = pureSaveStepDefinition;
