var formal_statement_step_definitions = function () {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');
    var formalStatementsPage = require('../../../pages/formalStatementsPage');

    this.Then(/^the following formal statements should be displayed$/, function (table) {
        var tableRowsSelector = '.formal-statements li[ng-repeat*="formalStatement"]';
        var propertyToCssMap = {
            "Statement period": '.period > div',
            "Statement from": '.from > div',
            "File size": '.fileSize > div'
        };
        return tableHelper.expectContentToMatch(tableRowsSelector, propertyToCssMap, table);
    });

    this.When(/^I search for formal statements by "([^"]*)"$/, function (searchTerm) {
        return element(by.css('input[placeholder=Search]')).clear().sendKeys(searchTerm);
    });

    this.Then(/^the Download PDF button should have analytics "([^"]*)"$/, function (trackClickText) {
        return expect(formalStatementsPage.getDownloadTrackClickText()).to.eventually.equal(trackClickText);
    });

    this.Then(/^the Continue button should have analytics "([^"]*)"$/, function (trackClickText) {
        return expect(formalStatementsPage.getEmailTrackClickText()).to.eventually.equal(trackClickText);
    });

    this.Then(/^the search should have analytics "([^"]*)"$/, function (trackClickText) {
        return expect(formalStatementsPage.getSearchTrackClickText()).to.eventually.equal(trackClickText);
    });
};

module.exports = formal_statement_step_definitions;