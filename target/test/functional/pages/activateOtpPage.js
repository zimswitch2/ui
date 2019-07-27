var caterForInternationalOnActivateOtpFeature = false;

{
    caterForInternationalOnActivateOtpFeature = true;
}

var ActivateOtpPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');
    var confirmButton = element(by.id('proceed'));
    var activateButton = element(by.id('activate'));
    var internationalDialingCode = element(by.id('internationalDialingCode'));
    var captureResidenceCountry = element(by.id('country-input'));
    var residenceCountryResults = element(by.css('#country .items'));
    var cellPhoneNumber = element(by.id('cellPhoneNumber'));
    var countryInput = element(by.id('country-input'));
    var phoneNumber = element(by.id('phone-number'));

    this.setOtpType = function (otpType) {
        if (otpType === "Email") {
            helpers.scrollThenClick(element(by.id('email-otp')));
        } else if (otpType === "SMS") {
            helpers.scrollThenClick(element(by.id('sms-otp')));
        }
    };

    this.setOtpAddress = function (otpType, address) {
        this.setOtpType(otpType);
        if (otpType === 'SMS') {
            this.baseActions.textForInput(caterForInternationalOnActivateOtpFeature ? cellPhoneNumber :  phoneNumber, address);
        }
        else if (otpType === 'Email') {
            this.baseActions.textForInput(element(by.id('email-address')), address);
        }
    };

    this.preferredMethodValue = function() {
        return this.baseActions.textForInput(element(by.css('input[name=preferredMethod]:checked')));
    };

    this.confirmType = function() {
        return element(by.id('confirm-type'));
    };

    this.emailValue = function() {
        return this.baseActions.textForInput(element(by.id('email-address')));
    };

    this.cellPhoneValue = function() {
        return element(by.id('confirm-phone-number-international'));
    };

    this.canProceed = function () {
        return confirmButton.getAttribute('disabled') == null;
    };

    this.proceed = function () {
        helpers.scrollThenClick(confirmButton);
    };

    this.modify = function () {
        helpers.scrollThenClick(element(by.id('modify')));
    };

    this.activate = function () {
        helpers.scrollThenClick(activateButton);
    };

    this.confirmPhoneNumber = function () {
        var id = caterForInternationalOnActivateOtpFeature ?  'confirm-phone-number-international' : 'confirm-phone-number';
        return element(by.id(id)).getText();
    };

    this.confirmEmailAddress = function () {
        return element(by.id('confirm-email-address')).getText();
    };

    this.confirmType = function () {
        return element(by.id('confirm-type')).getText();
    };

    this.startBanking = function() {
        helpers.scrollThenClick(element(by.id('start-banking')));
    };

    this.getInternationalDialingCode = function () {
        return internationalDialingCode;
    };

    this.clickOnInternationalDialingCode = function () {
        helpers.scrollThenClick(internationalDialingCode);
    };

    this.selectCountry = function(value) {
        captureResidenceCountry.clear();
        captureResidenceCountry.sendKeys(value);
        helpers.scrollThenClick(residenceCountryResults.element(by.css('li.item')));
    };
    this.enterDetails = function (_cellPhoneNumber) {
        cellPhoneNumber.clear();
        cellPhoneNumber.sendKeys(_cellPhoneNumber);
    };

    this.getCellPhoneNumber = function () {
        return this.baseActions.textForInput(cellPhoneNumber);
    };

    this.getCountryInput = function () {
        return this.baseActions.textForInput(countryInput);
    };
};

module.exports = new ActivateOtpPage();
