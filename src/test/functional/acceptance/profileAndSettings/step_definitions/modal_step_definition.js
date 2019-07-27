var modalStepDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var dateHelper = require('../../step_definitions/date_picker_helper');
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');

    var getActiveModal = function () {
        return element(by.css('div.modal-overlay:not(.ng-hide) div.modal-container'));
    };

    this.When(/^I click on the "([^"]*)" modal button/, function (buttonText) {
         return getActiveModal().element(by.button(buttonText)).click();
    });

    this.Then(/^I should see the "([^"]*)" buttons on the modal/, function(buttonText) {
        return getActiveModal().element(by.button(buttonText)).getText().toEqual(buttonText);
});

this.Then(/^I should see that the "([^"]*)" modal button is enabled$/, function (buttonText) {
        return expect(getActiveModal().element(by.button(buttonText)).isEnabled()).to.eventually.be.true;
    });

    this.Then(/^I should see that the "([^"]*)" modal button is disabled$/, function (buttonText) {
        return expect(getActiveModal().element(by.button(buttonText)).isEnabled()).to.eventually.be.false;
    });
};

module.exports = modalStepDefinition;
