var accountWidgetStepDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var dateHelper = require('../../step_definitions/date_picker_helper');
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');

    var getWidget = function (widgetWindowTitle) {
        return element(by.css('div.account-sharing-widget')).element(by.cssContainingText('h3', widgetWindowTitle));
    };

    this.Then(/^I should see the "([^"]*)" widget$/, function (widgetWindowTitle) {
        return expect(getWidget(widgetWindowTitle).getText()).to.eventually.contain(widgetWindowTitle);
    });

    var getWidgetText = function (widgetText) {
        return element(by.css('div.account-sharing-widget')).element(by.cssContainingText('span', widgetText));
    };

    this.Then(/^I should see "([^"]*)" on the widget$/, function (widgetText) {
        return expect(getWidgetText(widgetText).getText()).to.eventually.contain(widgetText);
    });

    var getPanelText = function (panelText) {
        return element(by.css('#user-details-form')).element(by.cssContainingText('h3', panelText));
    };

    this.Then(/^I should see "([^"]*)" on the panel$/, function (panelText) {
        return expect(getPanelText(panelText).getText()).to.eventually.contain(panelText);
    });

    var getPermissionsTable = function (permissionsTableText) {
            return element(by.css('div.panel')).element(by.cssContainingText('h3', permissionsTableText));
        };

        this.Then(/^I should see "([^"]*)" on the permissions panel$/, function (permissionsTableText) {
            return expect(getPermissionsTable(permissionsTableText).getText()).to.eventually.contain(permissionsTableText);
        });

    var getAcceptDeclineText = function (acceptDeclineText) {
        return element(by.css('#AddInvitationDetails', acceptDeclineText));
    };

    this.Then(/^I should see "([^"]*)" as the page heading$/, function (acceptDeclineText) {
        return expect(getAcceptDeclineText(acceptDeclineText).getText()).to.eventually.contain(acceptDeclineText);
    });


};

module.exports = accountWidgetStepDefinition;