var LandingPage = function () {
    'use strict';

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.getWelcomeMessage = element(by.css('.notification.info .ng-scope.ng-binding'));

    this.dashboardsLink = element(by.id('choose-dashboard'));
    this.getApplyButton = element(by.css('#account-application'));

    this.getAccountInfo = function (accountType) {
        return element(by.css('div.' + accountType + '.accounts')).getText();
    };

    this.hasTransactionalPanel = function () {
        return element(by.css('.transaction')).isPresent();
    };

    this.signout = function () {
        element(by.css('#signedinas')).click();
        return element(by.css('#signout')).click();
    };

    this.goToProfileAndSettings = function () {
        helpers.scrollThenClick(element(by.css('#signedinas')));
        helpers.scrollThenClick(element(by.css('#header-profile-settings')));
    };

    this.clickApply = function () {
        return helpers.scrollThenClick(element(by.id('account-application')));
    };
};

module.exports = new LandingPage();
