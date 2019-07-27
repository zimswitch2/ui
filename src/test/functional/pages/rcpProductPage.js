var rcpProductPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    this.actions = {
        apply: function () {
            return helpers.scrollThenClick(element(by.css('.apply')));
        }
    };

    this.getTitle = function () {
        return element(by.id('rcpProductsTitle')).getText();
    };

    this.getNotification = function () {
        return element(by.id('hasRcpAccountMessage')).getText();
    };
};

module.exports = new rcpProductPage();
