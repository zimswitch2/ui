var formValidationStepDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var dateHelper = require('../../step_definitions/date_picker_helper');
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');

    var getInputErrorNotificationText = function (inputErrorNotificationText) {
        return element(by.css('span.form-error', inputErrorNotificationText));
    };

    //The "First name" field should have a validation message of "Please enter a first name which is at least 2 characters in length"
    this.Then(/^The "([^"]*)" field should have a validation message of "([^"]*)"$/, function(label, expectedValidationText) {
        //get label containing fieldName text
        var input = element(by.inputLabel(label));

        // get parent
        var parent = input.element(by.xpath('..'));

        //get sibling span of input then get child span that is not hidden
        var validationMessage = parent.element(by.css('span span:not(.ng-hide)'));
        // get validation message text - validation text. should not have ng-hide class
        var actualValidationText = validationMessage.getText();

        return expect(actualValidationText).to.eventually.equal(expectedValidationText);
    });

    //Specifically for sb input validation messages
    this.Then(/^The "([^"]*)" input field should have a validation message of "([^"]*)"$/, function(label, expectedValidationText) {
        //get label containing fieldName text
        var input = element(by.inputLabel(label));

        // get parent
        var parent = input.element(by.xpath('..')).element(by.xpath('..')).element(by.xpath('..'));

        //get sibling span of input then get child span that is not hidden
        var validationMessage = parent.element(by.css('ng-message.form-error, span.form-error:not(.ng-hide)'));
        // get validation message text - validation text. should not have ng-hide class
        var actualValidationText = validationMessage.getText();
        return expect(actualValidationText).to.eventually.equal(expectedValidationText);
    });

    //Specifically for ng-messages
    this.Then(/^"([^"]*)" should have a validation message of "([^"]*)"$/, function(label, expectedValidationText) {
        //get label containing fieldName text
        var input = element(by.inputLabel(label));

        // get parent
        var parent = input.element(by.xpath('..'));

        //get sibling span of input then get child span that is not hidden
        var validationMessage = parent.element(by.css('ng-messages:not(.ng-hide) ng-message.form-error'));
        // get validation message text - validation text. should not have ng-hide class
        var actualValidationText = validationMessage.getText();
        return expect(actualValidationText).to.eventually.equal(expectedValidationText);
    });

    this.Then(/^I should see "([^"]*)" error notification$/, function (inputErrorNotificationText) {
        return expect(getInputErrorNotificationText(inputErrorNotificationText).getText()).to.eventually.contain(inputErrorNotificationText);
    });
};

module.exports = formValidationStepDefinition;
