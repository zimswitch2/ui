var linkCardPage = function () {

    var baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var messageField = element(by.id('message'));
    var homeTelephoneField = element(by.id('homeTelephone'));
    var businessTelephoneField = element(by.id('businessTelephone'));

    this.baseActions = baseActions;

    this.homeTelephone = function (homeNumber) {
        if (homeNumber) {
            helpers.scrollThenType(homeTelephoneField, homeNumber);
        } else {
            return homeTelephoneField.getAttribute('value');
        }
    };

    this.businessTelephone = function (businessNumber) {
        if (businessNumber) {
            helpers.scrollThenType(businessTelephoneField, businessNumber);
        } else {
            return businessTelephoneField.getAttribute('value');
        }
    };

    this.message = function (message) {
        if (message) {
            helpers.scrollThenType(messageField, message);
        } else {
            return messageField.getAttribute('value');
        }
    };

    this.accountLabelSelected = function () {
        return element(by.css('#account option[selected]')).getText();
    };

    this.leftCharactersCount = function () {
        return element(by.css('span.characters-left')).getText();
    };

    this.getTextById = function (id) {
        return element(by.id(id)).getText();
    };

    this.clickCancelButton = function () {
        helpers.scrollThenClick(element(by.id('cancel')));
    };

    this.nextButton = function () {
        return element(by.id('next'));
    };

    this.confirmButton = function () {
        return element(by.id('confirm'));
    };

    this.modifyButton = function () {
        return element(by.id('modify'));
    };

    this.printButton = function () {
        return element(by.id('print'));
    };

};

module.exports = new linkCardPage();
