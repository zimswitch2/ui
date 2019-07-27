var taxFreeCallAccountProductPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    this.getTitle = function () {
        return element(by.id('taxFreeCallAccountProductsTitle')).getText();
    };

    this.backtoSavingInvestment = function () {
         return element.all(by.css('.secondary'));
    };    

    this.getProductTitle = function () {
        return element(by.css('#productHeader')).getText();
    };

    this.getContentHeaders = function () {
        return element.all(by.css('#taxFreeCallAccountAccountDescription h3')).getText();
    };

    this.getContentHeadersPanelTwo = function () {
        return element.all(by.css('#taxFreeCallAccountAccountDescriptionTwo h3')).getText();
    };

    this.getPricingGuide = function () {
        return element(by.id('pricingGuide')).getText();
    };

    this.getPureSaveProductDescription = function () {
        return element.all(by.css('.application-status-text')).filter(function (elem) {
        return elem.isDisplayed();
        }).first().getText();
    };
};

module.exports = new taxFreeCallAccountProductPage();
