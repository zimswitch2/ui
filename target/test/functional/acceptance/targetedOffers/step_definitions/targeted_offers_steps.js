var targeted_offers_step_definitions = function () {
    var expect = require('../../step_definitions/expect');
    var loginPage = require('../../../pages/loginPage.js');
    var callMeBackPage = require('../../../pages/callMeBackPage.js');
    var accountSummaryPage = require('../../../pages/accountSummaryPage.js');
    var preScreeningPage = require('../../../pages/preScreeningPage.js');
    var Promise = require('bluebird');

    this.When(/^I log in with user (.*)$/, function (account) {
        loginPage.loginWith(browser.params.targetedOffer[account]);
    });

    this.Then(/^I should see a (.*) offer/, function (productName) {
        return expect(accountSummaryPage.getOfferProductName()).to.eventually.equal(productName);
    });

    this.Given(/^The targeted offer "([^"]*)" header should be visible$/, function (header_text) {
        return expect(accountSummaryPage.getOfferSubHeading()).to.eventually.equal(header_text);
    });

    this.Then(/^There should a product description with text (.*) and offer description text (.*)$/, function (productDescription, offerDescription) {
        var matchesProductDescription = function () {
            return expect(accountSummaryPage.getOfferDescription()).to.eventually.equal(offerDescription);
        };
        var matchesOfferDescription = function () {
            return expect(accountSummaryPage.getOfferDescription()).to.eventually.equal(offerDescription);
        };
        return matchesProductDescription() && matchesOfferDescription();
    });

    this.Given(/^There should be a more details link with text "([^"]*)"$/, function (linkText) {
        return expect(accountSummaryPage.detailsLink()).to.eventually.equal(linkText);
    });

    this.Given(/^A "([^"]*)" with text "([^"]*)" should be visible$/, function (buttonName, buttonText) {
        return expect(accountSummaryPage.getButtonWithText(buttonText).isDisplayed());
    });

    this.When(/^I accept a (.*) targeted offer$/, function () {
        return accountSummaryPage.acceptOfferButtonClick();
    });

    this.Then(/^I should see the pre\-screen page with title "([^"]*)"$/, function (pageTitle) {
        return expect(preScreeningPage.getPreScreenHeader()).to.eventually.equal(pageTitle);
    });

    this.When(/^I decline a (.*) offer$/, function () {
        return accountSummaryPage.getButtonWithText('No thanks').click();
    });

    this.Then(/^The (.*) targeted offer should not be displayed$/, function () {
        return expect(accountSummaryPage.targetedOffer().isDisplayed()).to.eventually.equal(false);
    });

    this.When(/^I click on the call me back option$/, function () {
        return accountSummaryPage.callBackButtonClick();
    });

    this.Then(/^I should see the call me back page with the following labels$/, function (table) {
        var tableRows = table.rowsHash();
        var tableKeys = Object.keys(tableRows);
        var promises = tableKeys.map(function (label) {
            return expect(element(by.css('[label*="' + label + '"] > div > div.field-value > div > span')).getText()).to.eventually.equal(tableRows[label]);
        });

        return Promise.all(promises);
    });

    this.Then(/^I should see the call me back page with the following inputs$/, function (table) {
        var tableRows = table.rowsHash();
        var tableKeys = Object.keys(tableRows);
        var promises = tableKeys.map(function (label) {
            return expect(element(by.css('[label*="' + label + '"] > div > div.field-value > div > sb-input > div > span > span > input')).getAttribute('value')).to.eventually.equal(tableRows[label]);
        });
        return Promise.all(promises);
    });

    this.When(/^I submit the call me back details$/, function () {
        return callMeBackPage.submitButtonclick();
    });

    this.Then(/^I should see a confirmation dialog with text "([^"]*)"$/, function (dialogText) {
        return expect(callMeBackPage.callbackDescription().getText()).to.eventually.equal(dialogText);
    });

    this.When(/^I close the confirmation dialog$/, function () {
        return callMeBackPage.CloseButtonclick();
    });

    this.Given(/^The "([^"]*)" should be (.*)$/, function (columnText, value) {
        return expect(accountSummaryPage.targetedOfferValueColumnText(columnText)).to.eventually.equal(value);
    });

    this.When(/^I click on the call me back button$/, function () {
        return accountSummaryPage.callBackButtonClick();
    });

    this.Then(/^I should see a popup with the header "([^"]*)"$/, function (headerText) {
        return expect(callMeBackPage.callbackHeader().getText()).to.eventually.equal(headerText);
    });

    this.When(/^I click the close button on the popup$/, function () {
        return callMeBackPage.CloseButtonclick();
    });
};

module.exports = targeted_offers_step_definitions;