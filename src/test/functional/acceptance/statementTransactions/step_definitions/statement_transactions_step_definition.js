var statement_transactions_step_definitions = function () {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');
    var statementPage = require('../../../pages/statementPage');


    this.When(/^I click on a specific account in account summary$/, function () {
        return element.all(by.css('.account')).first().click();
    });

    this.Then(/^I should see the "([^"]*)" page heading$/, function (pageName) {
        return expect(element(by.css('h2')).getText()).to.eventually.contain(pageName);
    });

    this.Then(/^"([^"]*)" button should be available for click$/, function (typeOfDownload) {
        return expect(element(by.css('.dropdown-button-link button[type=submit]')).getText()).to.eventually.equal(typeOfDownload);
    });

    this.When(/^"([^"]*)" button should have "([^"]*)" analytics tags$/, function (typeOfDownload, typeOfAnalytics) {
        return expect(element(by.css('.dropdown-button-link button[type=submit]')).getAttribute('data-dtmtext')).to.eventually.equal(typeOfAnalytics);
    });

    this.Then(/^I should see balance of "([^"]*)"$/, function (amount) {
        return expect(element(by.css('.transactions .accountAndAmountPanel .summary-row > span h3')).getText()).to.eventually.equal(amount);
    });

    this.Then(/^I should see four buttons on the screen$/, function () {
        return expect(element.all(by.css('.transactions .dates-panel button')).count()).to.eventually.equal(4);
    });


    this.Then(/^I should see "([^"]*)" as an active button$/, function (buttonText) {
        return expect(element(by.css('.transactions .dates-panel button.active')).getText()).to.eventually.equal(buttonText);
    });

    this.Then(/^I should see the following view transactions$/, function (table) {
        var tableRowsSelector = '.transactions .transaction';
        var propertyToCssMap = {
            "Date": '[data-header*="Date"] > div.narrative',
            "Description": '[data-header*="Description"] > div.narrative',
            "Amount (R)": '[data-header*="Amount (R)"] > div',
            "Balance (R)": '[data-header*="Balance (R)"] > div'
        };
        return tableHelper.expectContentToMatch(tableRowsSelector, propertyToCssMap, table);
    });

    this.When(/^I click on Load more transactions$/, function () {
        return element(by.css('.hide-for-small-only .load-next')).click();
    });

};

module.exports = statement_transactions_step_definitions;