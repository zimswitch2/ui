var overviewFeature = false;


var baseActions = function () {
    'use strict';

    var helpers = require('./helpers.js');

    var errorNotification = element(by.css('.error.notification:not(.ng-hide)'));
    var visibleSuccessNotification = element(by.css('.success.notification:not(.ng-hide)'));
    var warningNotification = element(by.css('span.information:not(.ng-hide)'));
    var infoNotification = element(by.css('.info.notification:not(.ng-hide)'));
    var changePassword = element(by.id('header-change-password'));
    var profileAndSettings = element(by.id('header-profile-settings'));
    var sendSecureMessage = element(by.id('send-secure-message'));
    var signedInAs = element(by.id('signedinas'));
    var textNotification = element(by.css('.text-notification:not(.ng-hide)'));

    this.getCurrentUrl = function () {
        return browser.getLocationAbsUrl();
    };

    this.isHomePage = function () {
        var homeUrl = overviewFeature ? '/overview' : '/account-summary';
        return this.getCurrentUrl().then(function (url) {
            return url.match(homeUrl);
        });
    };

    this.waitForSignOut = function () {
        // reloading the page (which is how we sign out) confuses protractor so we use webdriver's wait fn
        browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
            return url.indexOf('/login') >= 0;
            });
        }, 10000);
    };

    this.getErrorMessage = function () {
        return errorNotification.getText();
    };

    this.getErrorVisibility = function () {
        return errorNotification.isDisplayed();
    };

    this.getErrorFor = function (key) {
        return element(by.css("label[for='" + key + "'] ~ .form-error:not(.ng-hide), label[for='" + key + "'] ~ ng-messages:not(.ng-hide) ng-message")).getText();
    };

    this.getValidationMessageFor = function (key) {
        return element(by.css("label[for='" + key + "'] ~ ng-messages:not(.ng-hide) ng-message")).getText();
    };

    this.getVisibleSuccessMessage = function () {
        return visibleSuccessNotification.getText();
    };

    this.getSuccessVisibility = function () {
        return visibleSuccessNotification.isPresent().then(function (present) {
        return present && visibleSuccessNotification.isDisplayed();
        });
    };

    this.getWarningMessage = function () {
        return warningNotification.getText();
    };

    this.getInfoMessage = function () {
        return infoNotification.getText();
    };

    this.clickOnTab = function (tabName) {
        helpers.scrollThenClick(element(by.linkText(tabName)));
    };

    this.navigateToTransact = function () {
        this.clickOnTab('Transact');
    };

    this.navigateToBeneficiaries = function () {
        this.clickOnTab('Transact');
        helpers.wait(element(by.id('prepaid-history')));
        helpers.scrollThenClick(element(by.id('manage-beneficiary')));
    };

    this.flow = require('./common/flowWidget.js');

    var selectByVisibleText = function (selectElement, label) {
        helpers.scrollThenClick(selectElement.element(by.xpath("./option[text()[normalize-space()]='" + label + "']")));
    };

    this.textForInput = function (inputElement, value) {
        if (value) {
            helpers.scrollThenType(inputElement, value);
        } else {
            return inputElement.getAttribute('value');
        }
    };

    this.textForDropdown = function (selectElement, value) {
        if (value) {
            selectByVisibleText(selectElement, value);
        } else {
            return selectElement.getAttribute('value').then(function (value) {
                return selectElement.element(by.css('option[value="' + value + '"]')).getText();
            });
        }
    };

    this.textForInputWithId = function (elementId, value) {
        var inputElement = element(by.id(elementId));

        if (value) {
            helpers.scrollThenType(inputElement, value);
        } else {
            return inputElement.getAttribute('value');
        }
    };

    this.textForDropdownWithId = function (elementId, value) {
        var selectElement = element(by.id(elementId));

        if (value) {
            selectByVisibleText(selectElement, value);
        } else {
            return selectElement.getAttribute('value').then(function (value) {
                return selectElement.element(by.css('option[value="' + value + '"]')).getText();
            });
        }
    };

    this.selectItemFromDropdown = function (resultList) {
        helpers.scrollThenClick(resultList.all(by.css('li.item')).first());
    };

    this.selectFromTypeAhead = function (value, input, results) {
        input.clear();
        input.sendKeys(value);
        this.selectItemFromDropdown(results);
    };
    this.selectRadioOption = function (value) {
        helpers.scrollThenClick(element(by.css('input[type="radio"][value="' + value + '"]')));
    };

    this.closeNotificationMessages = function () {
        helpers.scrollThenClick(element.all(by.css('.notification:not(.ng-hide)>i.icon.icon-times-circle')).first());
    };

    this.navigateToChangePassword = function () {
        helpers.scrollThenClick(signedInAs);
        helpers.scrollThenClick(changePassword);
    };

    this.navigateToProfileAndSettings = function () {
        helpers.scrollThenClick(signedInAs);
        helpers.scrollThenClick(profileAndSettings);
    };

    this.navigateToSendSecureMessage = function () {
        helpers.scrollThenClick(sendSecureMessage);
    };

    this.getTextNotification = function () {
        return textNotification.getText();
    };

};

module.exports = new baseActions();

