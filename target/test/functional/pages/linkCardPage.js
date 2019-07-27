var linkCardPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var cardNumber = element(by.css('#cardnumber'));
    var atmPIN = element(by.css('#atmpin'));
    var cellPhoneNumber = element(by.css('#cellPhoneNumber'));
    var continueButton = element(by.css('#continue'));
    var backButton = element(by.linkText('Back'));

    var captureResidenceCountry = element(by.id('country-input'));
    var residenceCountryResults = element(by.css('#country .items'));

    this.helpers = require('./helpers.js');

    this.load = function () {
        browser.get('index.html#/linkcard');
        browser.waitForAngular();
    };

    this.enterCardDetails = function (information) {
        this.enterCardNumber(information.cardNumber);
        this.enterAtmPIN(information.atmPIN);
        this.enterCellPhoneNumber(information.cellPhoneNumber);
    };

    this.enterCardNumber = function (_cardNumber) {
        cardNumber.clear();
        cardNumber.sendKeys(_cardNumber);
    };

    this.enterAtmPIN = function (_atmPIN) {
        atmPIN.clear();
        atmPIN.sendKeys(_atmPIN);
    };

    this.enterCellPhoneNumber = function (_cellPhoneNumber) {
        cellPhoneNumber.clear();
        cellPhoneNumber.sendKeys(_cellPhoneNumber);
    };

    this.continue = function () {
        helpers.scrollThenClick(continueButton);
    };

    this.back = function () {
        helpers.scrollThenClick(backButton);
    };

    this.linkCard = function (information) {
        this.enterCardDetails(information);
        this.continue();
    };

    this.internationalDialingCode = function () {
        return element(by.css('#internationalDialingCode'));
    };

    this.selectCountry = function (value) {
        captureResidenceCountry.clear();
        captureResidenceCountry.sendKeys(value);
        helpers.scrollThenClick(residenceCountryResults.element(by.css('li.item')));
    };

    this.getEntryMessage = function () {
        return element(by.css('#messageAddress')).getText();
    };

    this.getWarningMessage = function () {
        return element(by.css('#warningMessage')).getText();
    };

    this.getErrorForCellPhoneNumber = function () {
        return element(by.css("ng-messages[for='form.cellPhoneNumber.$error']:not(.ng-hide) ng-message")).getText();
    };
};

module.exports = new linkCardPage();
