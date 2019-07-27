var registerPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var username = element(by.css('#username'));
    var password = element(by.css('#password'));
    var confirmPassword = element(by.css('#confirmPassword'));
    var preferredName = element(by.css('#preferredName'));
    var continueButton = element(by.css('#continue'));
    var agreeCheckBox = element(by.model('user.agree'));

    var clearFields = function () {
        username.clear();
        password.clear();
        confirmPassword.clear();
        preferredName.clear();
    };

    this.load = function () {
        browser.get(browser.registerUrl);
        browser.waitForAngular();
    };

    this.enterRegistrationDetails = function (information) {
        username.sendKeys(information.username);
        password.sendKeys(information.password);
        confirmPassword.sendKeys(information.confirmPassword);
        preferredName.sendKeys(information.preferredName);
    };

    this.agree = function () {
        helpers.scrollThenClick(agreeCheckBox);
    };

    this.completeForm = function (beneficiaryDetails) {
        clearFields();
        this.enterRegistrationDetails(beneficiaryDetails);
        this.agree();
        helpers.scrollThenClick(continueButton);
    };
};

module.exports = new registerPage();
