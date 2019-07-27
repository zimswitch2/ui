var registerPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var username = element(by.css('input#username'));
    var password = element(by.css('input#newPassword'));
    var confirmPassword = element(by.css('input#confirmPassword'));

    this.load = function () {
        browser.get(browser.resetPasswordUrl);
        browser.waitForAngular();
    };

    this.cancel = function () {
      helpers.scrollThenClick(element(by.id('cancel')));
    };

    this.next = function () {
        helpers.scrollThenClick(element(by.id('next')));
    };

    this.nextEnabled = function () {
        return element(by.id('next'));
    };

    this.getButton = function (buttonId) {
        return element(by.id(buttonId));
    };

    this.getHeaderText = function(){
        return element(by.css('headerMessage')).getText();
    };

    this.enterResetPasswordDetails = function (information) {
        username.sendKeys(information.username);
        password.sendKeys(information.password);
        confirmPassword.sendKeys(information.confirmPassword);
    };
};

module.exports = new registerPage();
