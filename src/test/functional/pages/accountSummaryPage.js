var AccountSummaryPage = function () {
    'use strict';

    var helpers = require('./helpers.js');

    this.baseActions = require('./baseActions.js');

    this.waitForAccountInfo = function () {
        helpers.wait(element(by.css('.accounts')));
    };

    this.getAccountInfo = function (accountType) {
        return element(by.css('div.' + accountType + '.accounts')).getText();
    };

    this.viewFirstTransactionAccountStatement = function () {
        helpers.scrollThenClick(element.all(by.css('.transaction .account')).first());
    };

    this.getOfferSubHeading = function () {
        return element(by.css('.targeted-offer h3.account-offer-header')).getText();
    };

    this.getOfferDescription = function () {
        return element(by.css('.targeted-offer h4')).getText();
    };

    this.getOfferProductName = function () {
        return element(by.css('.product h3')).getText();
    };

    this.acceptOfferButtonClick = function () {
        return element(by.css('.product .actions .primary')).click();
    };

    this.callBackButtonClick = function () {
        return element(by.css('.product .actions .primary')).click();
    };

    this.targetedOfferValueColumnText = function (valueColumnLabel) {
        return element(by.cssContainingText('span', valueColumnLabel)).element(by.xpath('following-sibling::span')).getText();
    };

    this.CancelButtonclick = function () {
        return element.all(by.css('.basic-info .secondary')).click();
    };

    this.detailsLink = function () {
        return element(by.css('a[href*="www.standardbank.co.za"]')).getText();
    };

    this.getButtonWithText = function (buttonText) {
        return element(by.buttonText(buttonText));
    };

    this.submitButtonclick = function () {
        return element.all(by.css('.basic-info .secondary')).click();
    };

    this.waitForAccountSummaryCashflowChart = function () {
        helpers.wait(element(by.id('largeScreenChart')));
    };

    this.targetedOffer = function () {
        return element(by.css('.targeted-offer'));
    };

    this.largeScreenChart = element(by.id('largeScreenChart'));
    this.accountsCashflowsChartCanvas = this.largeScreenChart.element(by.css('.chart-container canvas'));
    this.accountsCashflowsChartLegendHeaderLabel = this.largeScreenChart.element(by.css('.chart-legend-header-label'));
    this.accountsCashflowsChartLegendHeaderValue = this.largeScreenChart.element(by.css('.chart-legend-header-value'));
    this.accountsCashflowsChartLegendItemColourSwabs = this.largeScreenChart.all(by.css('.chart-legend-colour-swab'));
    this.accountsCashflowsChartLegendItemLabels = this.largeScreenChart.all(by.css('.chart-legend-item span'));
    this.accountsCashflowsChartLegendItemValues = this.largeScreenChart.all(by.css('.chart-legend-item span:last-child'));
    this.AccountsCashflowsChartErrorNotification = this.largeScreenChart.element(by.css('.accounts-cashflows-doughnut-chart div.error.notification span'));
    this.AccountsCashflowsChartErrorNotificationCloseButton = this.largeScreenChart.element(by.css('.accounts-cashflows-doughnut-chart div.error.notification i.icon.icon-times-circle'));

};
module.exports = new AccountSummaryPage();
