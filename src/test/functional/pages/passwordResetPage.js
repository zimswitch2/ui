var passwordResetPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var cardNumber = element(by.css('input#cardnumber'));
    var atmPin = element(by.css('input#atmpin'));
    var username = element(by.css('input#username'));
    var password = element(by.css('input#newPassword'));
    var confirmPassword = element(by.css('input#confirmPassword'));
    var emailAddress = element(by.css('input#username'));

    this.enterEmailAddress = function (value) {
        emailAddress.sendKeys(value);
    };

    this.clickNext = function () {
        helpers.scrollThenClick(element(by.id('next')));
    };

    this.enterDetailsWithCard = function (details) {
        cardNumber.sendKeys(details.cardNumber);
        atmPin.sendKeys(details.atmPin);
        password.sendKeys(details.password);
        confirmPassword.sendKeys(details.confirmPassword);
    };

    this.enterDetailsWithoutCard = function (details) {
        password.sendKeys(details.password);
        confirmPassword.sendKeys(details.confirmPassword);
    };
};

module.exports = new passwordResetPage();