var migrateCardPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var cardNumber = element(by.css('#cardnumber'));
    var cspNumber = element(by.css('#csp'));
    var password = element(by.css('#password'));
    var migrateButton = element(by.css('#migrate'));
    var backButton = element(by.css('#back'));


    this.load = function() {
        browser.location('index.html#/migrate');
        browser.waitForAngular();
    };

    this.enterCardDetails = function (information) {
        this.enterCardNumber(information.cardNumber);
        this.enterCSP(information.csp);
        this.enterPassword(information.password);
    };

    this.enterCardNumber = function(_cardNumber) {
        cardNumber.clear();
        cardNumber.sendKeys(_cardNumber);
    };

    this.enterCSP = function(_cspNumber) {
        cspNumber.clear();
        cspNumber.sendKeys(_cspNumber);
    };

    this.enterPassword = function(_password) {
        password.clear();
        password.sendKeys(_password);
    };

    this.continue = function () {
      helpers.scrollThenClick(migrateButton);
    };

    this.back = function () {
      helpers.scrollThenClick(backButton);
    };

    this.proceedButtonDisabled = function () {
        return migrateButton.getAttribute('disabled');
    };

    this.migrate = function (information) {
        this.enterCardDetails(information);
        this.continue();
    };

    this.enterCardNumberWithSpecificCardLength = function(length) {
        this.enterCardNumber(_.repeat('0', length));
    };
};

module.exports = new migrateCardPage();
