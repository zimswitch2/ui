var LoginPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.load = function () {
        browser.get(browser.loginUrl);
        browser.waitForAngular();
    };

    function enterUsername(username) {
        element(by.css('#username')).sendKeys(username);
    }

    function enterPassword(password) {
        element(by.css('#password')).sendKeys(password);
    }

    this.enterUserCredentials = function (username, password) {
        enterUsername(username);
        enterPassword(password);
        helpers.scrollThenClick(element(by.id('login')));
    };

    this.clickRegister = function () {
        helpers.scrollThenClick(element(by.cssContainingText('a.button', 'Register')));
    };

    this.clickResetPassword = function () {
        helpers.scrollThenClick(element(by.id('resetPassword')));
    };

    this.getTitle = function () {
        return browser.getTitle();
    };

    this.canLogin = function () {
        return element.all(by.css('.actions button')).first().getAttribute('disabled') == null;
    };

    this.enableButton = function (buttonText) {
        helpers.forceEnable(element(by.buttonText(buttonText)));
    };

    this.loginWith = function (credentials) {
        this.load();
        this.enterUserCredentials(credentials.username, credentials.password);

        browser.waitForAngular();
    };

    this.getResetPasswordMessage = function () {
        return element(by.css('div[ng-show="isSuccessful"]')).getText();
    };
};

module.exports = new LoginPage();
