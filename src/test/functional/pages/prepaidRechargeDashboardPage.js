var prepaidRechargeDashboardPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.selectMTN = function () {
        helpers.scrollThenClick(element(by.id('mtn')));
    };

    this.selectVodacom = function () {
        helpers.scrollThenClick(element(by.id('vodacom')));
    };

    this.selectTelkomMobile = function () {
        helpers.scrollThenClick(element(by.id('telkom-mobile')));
    };
};

module.exports = new prepaidRechargeDashboardPage();
