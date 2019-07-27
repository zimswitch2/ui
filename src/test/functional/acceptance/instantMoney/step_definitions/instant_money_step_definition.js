var instant_money_step_definitions = function () {
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');

    this.Then(/^the following uncollected vouchers should be displayed$/, function (expectedContent) {
        var tableRowsSelector = '.instant-money-uncollected li[ng-repeat*="instantMoney"]';
        var propertyToCssMap = {
            "Date": '.date > div',
            "From account": '.from-account > div',
            "Voucher number": '.voucher-number > div',
            "Cell phone": '.cell-phone > div',
            "Amount": '.amount > div'
        };
        return tableHelper.expectContentToMatch(tableRowsSelector, propertyToCssMap, expectedContent);
    });

    this.When(/^I search for uncollected vouchers by "([^"]*)"$/, function (searchTerm) {
        return element(by.css('input[placeholder=Search]')).clear().sendKeys(searchTerm);
    });

    this.When(/^I sort the uncollected vouchers by "([^"]*)"$/, function (sortColumn) {
        var sortColumnId = sortColumn.replace(/([ ])/, "-").toLowerCase();

        return element(by.id(sortColumnId)).click();
    });

    this.Then(/^I should see the following send instant money confirm details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch({
            rowSelector: '.summary',
            cssPropertyMap: {
                "From Account": '#fromAccount',
                "Available Balance": '#availableBalance',
                "Cell phone number": '#cellPhoneNumber',
                "Amount": '#amount'
            }
        }, [table.rowsHash()]);
    });

    this.Then(/^I should see the following send instant money successful details$/, function (table) {
        var propertyToCssMap = {
            "From Account": '#fromAccount',
            "Available Balance": '#availableBalance',
            "Cell phone number": '#cellPhoneNumber',
            "Amount": '#amount',
            "Voucher number": '#voucherNumber',
            "Transaction date": '#transactionDate'
        };


        var expectedRows = [table.rowsHash()];
        expectedRows[0]['Transaction date'] = tableHelper.dateFormat(new Date(),'D MMMM YYYY');

        var tableRows = tableHelper.getTableRows('.summary', propertyToCssMap);
        return tableRows.then(function (targetRows) {
            expectedRows.forEach(function (expectedRow, i) {
                tableHelper.expectRowToMatch(targetRows[i], expectedRow);
            });
        });
    });

    this.When(/^I click on "([^"]*)"$/, function (id) {
        return element(by.id(id)).click();
    });

    this.When(/^I click the "([^"]*)" action on the first row$/, function (actionTitle) {
        var row = element.all(by.css('ul.data li')).first();
        return row.element(by.css('a.action[title=' + actionTitle + ']')).click();
    });

    this.When(/^enter "([^"]*)" as the cancel voucher PIN$/, function (pin) {
        return element(by.css('input[type=password]')).sendKeys(pin);
    });
};

module.exports = instant_money_step_definitions;
