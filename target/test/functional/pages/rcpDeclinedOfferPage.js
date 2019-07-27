var rcpDeclinedOfferPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    this.actions = {
        backToAccountSummary: function () {
            return helpers.scrollThenClick(element(by.id('backToAccountSummaryButton')));
        }
    };


    this.getTitle = function () {
        return element(by.css('h2')).getText();
    };

};

module.exports = new rcpDeclinedOfferPage();
