var AccountSummaryPage = function() {
    'use strict';

    var helpers = require('./helpers.js');

    this.baseActions = require('./baseActions.js'); 

   
    var getValueSpanElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data span.ng-binding')).last();
    };

    var getValueInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-input div.text-input-container span span input')).last();
    };

    this.titleElement = function () {
        return getValueSpanElement("Title");
    };
    this.surnameElement = function () {
        return getValueSpanElement("Surname");
    };
    this.firstNamesElement = function () {
        return getValueSpanElement("First names");
    };
    
    this.idNumberElement = function () {
        return getValueSpanElement("South African ID number");
    };

   this.contectNoElement = function () {
        return getValueSpanElement("Contact number *");
    };

    var getInputElement = function (label) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data sb-input div span span input'));
    };

    this.contactNumber = function () {
        return getInputElement("Contact number *");
    };

    this.targetedOfferValueColumnText = function (valueColumnLabel) {
        return element(by.cssContainingText('strong', valueColumnLabel)).element(by.xpath('following-sibling::span')).getText();
    };

    this.CancelButtonclick = function () {
        return element.all(by.css('.basic-info .secondary')).click();
    };

    this.submitButtonclick = function () {
        return element.all(by.css('.basic-info .primary')).click();
    };

    this.alternativeNoElement = function () {
        return getValueSpanElement("Alternative number");
    };  

    this.callbackHeader = function () {
        return element(by.css('.modal-overlay:not(.ng-hide) .modal-header h3'));
    };

    this.callbackDescription = function () {
        return element(by.css('.modal-overlay:not(.ng-hide) .modal-container .modal-content'));
    };

    this.waitForAccountSummaryCashflowChart = function () {
        helpers.wait(element(by.id('largeScreenChart')));
    };

    this.CloseButtonclick = function () {
        return element.all(by.css('.actions .primary')).click();
    };

    this.getCallMeBackPageTitle = function () {
        return element(by.css('.content h2')).getText();
    };

    this.getLableNames=function(lablenames){
        return element(by.css('li[label="'+ lablenames +'"] .field-label .cell-data')).getText();
    }; 

    this.getContactNumber = function () {
        return element(by.css('.field-value input[required]')).getAttribute('value');
    };

    this.getAlternateContactNumber = function () {
        return element(by.css('.field-value input:not([required])')).getAttribute('value');
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
