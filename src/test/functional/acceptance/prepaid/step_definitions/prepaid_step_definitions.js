var myStepDefinitionsWrapper = function () {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');

    function getBaseCssPropertyMap() {
        return {
            "From account": '#account',
            "Available balance": '#availableBalance',
            "Provider": '#provider',
            "Voucher type": '#voucherType',
            "Transaction date": '#rechargeDate'
        };
    }
    function getCellphoneBaseCssPropertyMap() {
        var cssPropertyMap = getBaseCssPropertyMap();
        cssPropertyMap["Cell phone number"] = '#cellNumber';
        return cssPropertyMap;
    }

    function getCurrentDate() {
        return tableHelper.dateFormat(new Date(), 'D MMMM YYYY');
    }

    function expectTableToMatch(cssPropertyMap, expectedRows) {
        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: cssPropertyMap
        }, expectedRows);
    }

    this.Then(/^the MTN tile should be visible$/, function () {
        return expect(element(by.id("mtn")).isPresent()).to.eventually.be.true;
    });

    this.When(/^I click on the MTN tile$/, function () {
        return element(by.id("mtn")).click();
    });

    this.Then(/^the Vodacom tile should be visible$/, function () {
        return expect(element(by.id("vodacom")).isPresent()).to.eventually.be.true;
    });

    this.When(/^I click on the Vodacom tile$/, function () {
        return element(by.id("vodacom")).click();
    });

    this.Then(/^I should see "([^"]*)" as the Available daily withdrawal limit$/, function (limit) {
        return expect(element(by.id("availableDailyLimit")).getText()).to.eventually.equal(limit);
    });

    this.Then(/^I should see the following airtime recharge confirmation details:$/, function (table) {
        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = getCurrentDate();
        var cssPropertyMap = getCellphoneBaseCssPropertyMap();
        cssPropertyMap["Recharge amount"] = '#amount';
        return expectTableToMatch(cssPropertyMap, expectedRows);
    });

    this.Then(/^I should see the following airtime recharge details:$/, function (table) {
        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = getCurrentDate();
        var cssPropertyMap = getCellphoneBaseCssPropertyMap();
        cssPropertyMap["Recharge amount"] = '#amount';
        return expectTableToMatch(cssPropertyMap, expectedRows);
    });

    this.Then(/^I should see "([^"]*)" selected for the Data bundle Amount$/, function (expectedText) {
        return expect(element(by.id('bundle')).$('option:checked').getText()).to.eventually.equal(expectedText);
    });

    this.When(/^I select "([^"]*)" for Data bundle Amount$/, function (option) {
        return element(by.id('bundle'))
            .element(by.cssContainingText('option', option))
            .click();
    });

    this.Then(/^I should see the following data bundle recharge confirmation details:$/, function (table) {
        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = getCurrentDate();
        var cssPropertyMap = getCellphoneBaseCssPropertyMap();
        cssPropertyMap["Recharge amount"] = '#bundleName';
        return expectTableToMatch(cssPropertyMap, expectedRows);
    });

    this.Then(/^I should see the following data bundle recharge details:$/, function (table) {
        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = getCurrentDate();
        var cssPropertyMap = getCellphoneBaseCssPropertyMap();
        cssPropertyMap["Recharge amount"] = '#bundleName';
        return expectTableToMatch(cssPropertyMap, expectedRows);
    });

    this.Then(/^the Prepaid Electricity tile should be visible$/, function () {
        return expect(element(by.id("electricity")).isPresent()).to.eventually.be.true;
    });

    this.When(/^I click on the Prepaid Electricity tile$/, function () {
        return element(by.id("electricity")).click();
    });

    this.Then(/^I should see that the Transaction date is the current date$/, function () {
        return expect(element(by.id("rechargeDate")).getText()).to.eventually.equal(getCurrentDate());
    });

    this.Then(/^I should see the following electricity recharge confirmation details:$/, function (table) {
        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = getCurrentDate();
        var cssPropertyMap = getBaseCssPropertyMap();
        cssPropertyMap["Meter number"] = '#meterNumber';
        cssPropertyMap["Recharge amount"] = '#amount';
        return expectTableToMatch(cssPropertyMap, expectedRows);
    });

    this.Then(/^I should see the following electricity recharge details:$/, function (table) {
        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = getCurrentDate();

        var cssPropertyMap = getBaseCssPropertyMap();
        cssPropertyMap["Recharge amount (incl. VAT)"] = '#amount';
        cssPropertyMap["Meter number"] = '#meterNumber';
        cssPropertyMap["Reference number"] = '#referenceNumber';
        cssPropertyMap["Voucher number"] = '#voucherNumber';
        cssPropertyMap["Quantity purchased"] = '#quantityPurchased';
        cssPropertyMap["VAT registration number"] = '#vatRegistrationNumber';

        return expectTableToMatch(cssPropertyMap, expectedRows);
    });
};
module.exports = myStepDefinitionsWrapper;