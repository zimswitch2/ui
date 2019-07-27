var otpPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.setOtp = function (key) {
        var otpInput = element(by.css('#otp'));
        helpers.wait(otpInput);
        otpInput.sendKeys(key);
    };

    this.getSendButton = function () {
        return element(by.css('#submit-otp'));
    };

    this.getVerificationHeaderText = function () {
        return element(by.id('verificationHeader')).getText();
    };

    this.getSpamOrJunkFolderText = function () {
        return element(by.id('spam-or-junk-folder')).getText();
    };

    this.getEmailVerificationLabelText = function () {
        return element(by.id('email-verification-label')).getText();
    };

    this.getResendButton = function () {
        return element(by.css('#resend-otp'));
    };

    this.submitOtp = function (key) {
        this.setOtp(key);
        helpers.scrollThenClick(this.getSendButton());
    };

    this.getNotification = function () {
        return element(by.css('.notification'));
    };

    this.resend = function () {
        helpers.scrollThenClick(this.getResendButton());
    };

    this.clickCancel = function () {
        return helpers.scrollThenClick(element(by.id("cancel")));
    };

    this.clickSignOut = function () {
        return element(by.id("signout-otp")).click();
    };

    this.getMessageAddress = function () {
        return element(by.id('messageAddress')).getText();
    };
};

module.exports = new otpPage();
