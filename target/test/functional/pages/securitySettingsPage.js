var SecuritySettingsPage = function() {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var securitySettings = element(by.id('security'));

    this.clickOnSecuritySettings = function() {
        helpers.scrollThenClick(securitySettings);
    };

    this.clickOnInternetBanking= function () {
        var internetBanking = element(by.css("a[href*='internet-banking']"));
        helpers.scrollThenClick(internetBanking);
    };

    this.getSubHeader = function () {
        return element(by.css('.account-preferences h3')).getText();
    };


    this.getOTPPreferences = function () {
        return element(by.id('otp-preferences-delivery-method')).getText();
    };
};

module.exports = new SecuritySettingsPage();
