var accountSharingPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var firstName = element(by.css('#firstName'));
    var surname = element(by.css('#surname'));
    var idNumber = element(by.css('#idnumber'));
    var email = element(by.css('#email'));
    var cellPhoneNumber = element(by.css('#cellPhone'));
    var nextButton = element(by.css('#next-basic'));
    var cancelButton = element(by.linkText('cancel-basic'));
    var chooseDefaultDashboard = element(by.id('choose-dashboard'));

    this.helpers = require('./helpers.js');


     this.clickDefaultDashboard = function(){
            helpers.scrollThenClick(chooseDefaultDashboard);
            };

    this.load = function () {
        browser.get('index.html#/account-sharing/user/details');
        browser.waitForAngular();
    };

    this.enterUserWithSaId = function (information) {
        this.enterFirstName(information.firstName);
        this.enterSurname(information.surname);
        this.enterCellPhoneNumber(information.cellPhoneNumber);
    };

    this.migrationLabel = function () {
        return element(by.css('#migrateLabel')).getText();
    };

    this.enterFirstName = function (_firstName) {
        firstName.clear();
        firstName.sendKeys(_firstName);
    };

    this.enterSurname = function (_surname) {
        surname.clear();
        surname.sendKeys(_surname);
    };


    this.enterIdNumber = function (_idNumber) {
        idNumber.clear();
        idNumber.sendKeys(_idNumber);
    };

    this.enterEmail = function (_email) {
            email.clear();
            email.sendKeys(_email);
        };

    this.next = function () {
        helpers.scrollThenClick(nextButton);
    };


    this.cancel = function () {
            helpers.scrollThenClick(cancelButton);
        };

    /*this.linkCard = function (information) {
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
    };*/
};

module.exports = new accountSharingPage();
