var DeLinkDashboard = function () {
    'use strict';
    var baseActions = require('../../../pages/baseActions.js');
    var myDashboardPage = require('../../../pages/myDashboardPage.js');
    var expect = require('../../step_definitions/expect');

    this.When(/^I click on Profile and Settings$/, function () {
        baseActions.navigateToProfileAndSettings();
    });

    this.Then(/^I should see "([^"]*)" heading$/, function (headingText) {
        return expect(myDashboardPage.profileAndSettingsHeadingText()).to.eventually.equal(headingText);
    });

    this.When(/^I click delete My Personal Dashboard$/, function () {
        return element.all(by.css('a[title="delete"]')).last().click();
    });

    this.Then(/^A modal saying "([^"]*)" should display$/, function (modalMessage) {
        return expect(element.all(by.id('deleteMessage')).last().getText()).to.eventually.equal(modalMessage);
    });

    this.When(/^I click confirm button$/, function () {
        return element.all(by.css('div button.confirm')).last().click();
    });

    this.Then(/^The dashboard should be removed$/, function () {
        return expect(element.all(by.css('.data > li')).count()).to.eventually.equal(4);
    });


    this.When(/^I click cancel button$/, function () {
        return element.all(by.id('cancelButton')).last().click();
    });

    this.Then(/^The dashboard is not deleted$/, function () {
        return expect(element.all(by.css('ul.data li')).count()).to.eventually.equal(5);
    });

    this.Then(/^I should see success text notification header with "([^"]*)"$/, function (notification) {
        return expect (element(by.id("deletedNotification")).getText()).to.eventually.equal(notification);
    });
};

module.exports = DeLinkDashboard;
