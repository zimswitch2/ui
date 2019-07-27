var MyDashboardPage = function () {
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');

    this.addDashboardButton = function () {
        return element(by.id('addDashboard'));
    };

    this.activateOtpLink = function(){
        return element(by.cssContainingText('span', 'Activate OTP'));
    };

    this.profileAndSettingsHeadingText = function () {
        return element(by.css('h2')).getText();
    };
};

module.exports = new MyDashboardPage();
