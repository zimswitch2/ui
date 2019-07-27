var ManageScheduledPaymentsPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.heading = function () {
        return element(by.css('h2')).getText();
    };

    this.getCellContent = function (columnSelector, rowIndex) {
        return element.all(by.css(columnSelector)).get(rowIndex).getText();
    };

    this.getHighLightedBeneficiaryName = function () {
        var path = "//*[contains(@class, 'highlight')]//div[@class='beneficiary-name']/div[contains(@class,'cell-data')]";
        return element.all(by.xpath(path)).get(0).getText();
    };

    this.filterByBeneficiaryName = function (beneficiaryName) {
        return this.filterByColumn('.beneficiary-name').then(function (names) {
            var filteredNames = _.filter(names, function (name) {
                return name.toUpperCase() === beneficiaryName.toUpperCase();
            });
            return filteredNames;
        });
    };

    this.filterByColumn = function (columnSelector) {
        return element.all(by.css(columnSelector)).map(function (columnElement) {
            return columnElement.getText().then(function (text) {
                return text;
            });
        });
    };

    this.clearFilter = function () {
        element(by.id('filter')).clear();
    };

    this.scheduledPaymentCount = function () {
        this.clearFilter();
        return element.all(by.css('.data li')).count();
    };

    this.delete = function () {
        helpers.scrollThenClick(element(by.css('.delete')));
    };

    this.modify = function () {
        helpers.scrollThenClick(element(by.css('.modify')));
    };

    this.confirm = function () {
        helpers.scrollThenClick(element(by.css('.confirm')));
    };

    this.errorMessage = function () {
        return element(by.css('.action-failure')).getText();
    };

    this.cancel = function () {
        helpers.scrollThenClick(element(by.css('.cancel')));
    };

    this.filter = function (text) {
        this.baseActions.textForInput(element(by.id('filter')), text);
    };

    this.manageFuturePaymentsDisabled = function () {
        return element(by.id('manage-scheduled-payments')).getAttribute('class');
    };

    this.manageFuturePaymentsUrl = function () {
        return element(by.id('manage-scheduled-payments')).getAttribute('href');
    };

    this.back = function () {
        helpers.scrollThenClick(element(by.id('back-button')));
    };
};

module.exports = new ManageScheduledPaymentsPage();
