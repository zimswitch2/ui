var rcpPreScreenPage = function () {
    'use strict';
    var helpers = require('./helpers.js');


    this.baseActions = require('./baseActions.js');

    this.actions = {
        acceptFraudCheck: function () {
            return helpers.scrollThenClick(element(by.id('creditAndFraudCheckConsent')));
        },
        proceedNext: function() {
            return helpers.scrollThenClick(element(by.id('next')));
        }

    };

};


module.exports = new rcpPreScreenPage();
