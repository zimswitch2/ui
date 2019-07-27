var SwitchDashboardPage = function () {
    'use strict';
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');

    this.getDashboardByName = function (name) {
        return element(by.cssContainingText('.cards .card h2', name));
    };

    this.addDashboardButton = function () {
        return element(by.id('addDashboard'));
    };

    this.getLinkButton = function () {
        return element(by.id('linkCard'));
    };

};

module.exports = new SwitchDashboardPage();
