var availableProductsPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    var findProductTile = function (productType) {
        return element(by.css('product-tile[product-type="' + productType + '"]'));
    };

    var findProductTileDetailsLink = function (productType) {
        return findProductTile(productType).element(by.css('a.btn.secondary'));
    };

    this.actions = {
        currentAccountDetails: function () {
            return helpers.scrollThenClick(findProductTileDetailsLink('current-account'));
        },

        clickOnBrowseSavingsAndInvestments: function () {
            return helpers.scrollThenClick(element(by.id('savingsAndInvestmentsOptions')));
        }
    };

    this.getTitle = function () {
        return element(by.id('availableProductsTitle')).getText();
    };

    this.getCurrentAccountApplyNow = function () {
        return element(by.id('current-account-apply-now'));
    };
};

module.exports = new availableProductsPage();