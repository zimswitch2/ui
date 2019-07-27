var newRegisteredPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.actions = {
        clickYes: function () {
            element(by.id('existingSiteYes')).click();
        },
        clickNo: function () {
            element(by.id('existingSiteNo')).click();
        }
    };

    this.openAnAccount = element(by.id('open-an-account'));

    this.linkYourCard = element(by.id('link-your-card'));

    this.startBanking = element(by.id('start-banking'));

    this.copyYourProfile = element(by.xpath("//a[text()='Copy your profile']"));
};

module.exports = new newRegisteredPage();