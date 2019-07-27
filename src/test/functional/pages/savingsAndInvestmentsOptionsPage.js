var savingsAndInvestmentsOptionsPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    function getProductTile(productType) {
        return element(by.css('savings-product-tile[product-type="' + productType + '"] div.product-container'));
    }

    this.actions = {
        pureSaveDetails: function(){
            return helpers.scrollThenClick(getProductTile("pure-save").element(by.css('div.buttons-container a.btn.secondary')));
        },
        marketLinkDetails: function(){
            return helpers.scrollThenClick(getProductTile("market-link").element(by.css('div.buttons-container a.btn.secondary')));
        },
        taxFreeCallDetails: function(){
            return helpers.scrollThenClick(getProductTile("tax-free-call-account").element(by.css('div.buttons-container a.btn.secondary')));
        },

        CompleteProfileYesClick: function () {
            return helpers.scrollThenClick(element(by.css('#customer-info-validation-yes')));
        },

         CompleteProfileNoClick: function () {
            return helpers.scrollThenClick(element(by.css('#customer-info-validation-no')));
        }
    };

    this.getTitle = function () {
        return element(by.css("h2.savings-and-investments"));
    };

    this.getCompleteProfileModal = function () {
        return element(by.css("#customer-info-validation-modal .modal-container.action-modal"));
    };

    this.getPureSaveProductContainerHeader = function () {
        return getProductTile("pure-save").element(by.css('div.product-content h3')).getText();
    };

    this.getPureSaveProductContainerMessage = function () {
        return getProductTile("pure-save").element(by.css('div.product-content p')).getText();
    };

    this.getSavingInvestmentTitle = function () {
          return element(by.css('h2'));
    };

    this.getMarketLinkProductContainerHeader = function () {
        return getProductTile("market-link").element(by.css('div.product-content h3')).getText();
    };

    this.getMarketLinkProductContainerMessage = function () {
        return getProductTile("market-link").element(by.css('div.product-content p')).getText();
    };
    
    this.getTaxfreeProductContainerHeader = function () {
        return getProductTile("tax-free-call-account").element(by.css('div.product-content h3')).getText();
    };

    this.getTaxfreeProductContainerMessage = function () {
        return getProductTile("tax-free-call-account").element(by.css('div.product-content p')).getText();
    };
};

module.exports = new savingsAndInvestmentsOptionsPage();