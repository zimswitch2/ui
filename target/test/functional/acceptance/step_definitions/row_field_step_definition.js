var rowFieldStepDefinition = function () {

    var expect = require('./expect');
    var rowFieldHelper = require('./rowFieldHelper');

    this.Then(/^I should see the following details in "([^"]*)" section:$/, function (sectionTitle, expectedRows) {
        var rowFields = rowFieldHelper.getRowFields(element(by.sectionTitle(sectionTitle)));
        return expect(rowFields).to.eventually.deep.include.members(expectedRows.hashes());
    });

    this.Then(/^I should see the following exact details in "([^"]*)" section:$/, function (sectionTitle, expectedRows) {
        var rowFields = rowFieldHelper.getRowFields(element(by.sectionTitle(sectionTitle)));
        return expect(rowFields).to.eventually.deep.equal(expectedRows.hashes());
    });
};
module.exports = rowFieldStepDefinition;