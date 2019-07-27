var savingsTransferPage = function () {
    'use strict';
    var helpers = require('./helpers.js');
    this.baseActions = require('./baseActions.js');

    this.actions = {
        clickNext: function () {
            return helpers.scrollThenClick(element(by.id('savingsTransferNext')));
        }
    };
};

module.exports = new savingsTransferPage();
