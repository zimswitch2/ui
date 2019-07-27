var componentStepDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var dateHelper = require('../../step_definitions/date_picker_helper');
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');

    var rowInputFieldSelector = function (labelText, inputTag, sectionSelector) {
        sectionSelector = sectionSelector || '';
        return sectionSelector + ' li[label*="' + labelText + '"] ' + inputTag;
    };

    this.When(/^I click on the "([^"]*)" button$/, function (buttonText) {
        var buttonFinder = element(by.button(buttonText));
        return buttonFinder.isEnabled().then(function (isButtonEnabled) {
            if (isButtonEnabled) {
                return buttonFinder.click();
            }
            else {
                throw new Error('Cannot click disabled button');
            }
        });
    });

    this.When(/^I click on the "([^"]*)" button in "([^"]*)" section$/, function (buttonText, sectionTitle) {
        return element(by.sectionTitle(sectionTitle)).element(by.button(buttonText)).click();
    });

    this.When(/^I select "([^"]*)" for "([^"]*)"$/, function (option, label) {
        return element(by.inputLabel(label))
            .element(by.cssContainingText('option', option))
            .click();
    });

    this.When(/^I select "([^"]*)" for "([^"]*)" in "([^"]*)" section$/, function (option, label, sectionTitle) {
        return element(by.sectionTitle(sectionTitle))
            .element(by.inputLabel(label))
            .element(by.cssContainingText('option', option))
            .click();
    });

    this.When(/^I complete "([^"]*)" with "(.*?)"$/, function (label, value) {
        return element(by.inputLabel(label)).clear().sendKeys(value);
    });

    this.When(/^I complete "([^"]*)" in "([^"]*)" section with "([^"]*)"$/, function (label, sectionTitle, value) {
        return element(by.sectionTitle(sectionTitle)).element(by.inputLabel(label)).clear().sendKeys(value);
    });

    this.When(/^I select the "([^"]*)" option of the "([^"]*)" dropdown$/, function(option, dropDownLabel){
       return element(by.inputLabel(dropDownLabel)).element(by.cssContainingText('option',option)).click();
    });

    this.When(/^I click on the "([^"]*)" dropdown$/,function(dropDownLabel){
        return element(by.inputLabel(dropDownLabel)).click();
    });

    this.When(/I select the "([^"]*)" menu option/, function (menuItem) {
        //click on menu button to expand the menu
        return element(by.id('signedinas')).click()
        //then click on the menu item
        .then(function () {
            return element(by.css('.dropdown-menu')).element(by.cssContainingText('a', menuItem)).click();
        });
    });

    this.Given(/^I click on the "([^"]*)" link$/, function (text) {
        return element(by.linkText(text)).click();
    });

    this.When(/^I click on the "([^"]*)" link on the "([^"]*)" panel$/, function (linkText, panelHeading) {
        return element(by.cssContainingText('h3', panelHeading))
            .element(by.xpath('..'))
            .element(by.linkText(linkText))
            .click();
    });

    this.When(/^I click on the link containing "([^"]*)" text$/, function (text) {
        return element(by.partialLinkText(text)).click();
    });

    this.Given(/^I accept "([^"]*)"$/, function (label) {
        return element(by.cssContainingText('label', label)).click();
    });

    this.Then(/^I should see the "([^"]*)" title$/, function (title) {
        return expect(element.all(by.title(title)).isDisplayed()).to.eventually.contain(true);
    });

    this.Then(/^I should not see the "([^"]*)" title$/, function (title) {
        return expect(element(by.title(title)).isDisplayed()).to.eventually.be.false;
    });

    this.Then(/^I should see an amount error displaying "([^"]*)"$/, function (text) {
        return expect(
            element(by.css('sb-amount > div > span[class="small form-error"]')).getText()).to.eventually.equal(text);
    });

    this.Then(/^I should not see an amount error displaying$/, function () {
        return expect(
            element.all(by.css('sb-amount > div > span[class="small form-error"]')).count()).to.eventually.equal(0);
    });

    this.Then(/^the "([^"]*)" input field should be "([^"]*)"$/, function (label, expectedValue) {
        return expect(element(by.inputLabel(label)).getAttribute('value')).to.eventually.equal(expectedValue);
    });

    this.Then(/^the "([^"]*)" checkbox should be checked$/, function (label) {
        var checkbox = element(by.cssContainingText('label', label)).element(by.css('input'));
        return expect(checkbox.isSelected()).to.eventually.equal(true);
    });

    this.Then(/^the "([^"]*)" radio button should be checked$/, function (label) {
        var radioButton = element(by.inputLabel(label));
        return expect(radioButton.isSelected()).to.eventually.equal(true);
    });

    this.Then(/^the "([^"]*)" checkbox should be disabled$/, function (label) {
        var checkbox = element(by.cssContainingText('label', label)).element(by.css('input'));
        return expect(checkbox.isEnabled()).to.eventually.equal(false);
    });

    this.Then(/^I should see "([^"]*)" error message at the "([^"]*)" input field$/, function (errorMessage, label) {
        var message = element(by.css('sb-input[label="' + label + '"] .form-error:not(.ng-hide)'));
        return expect(message.getText()).to.eventually.equal(errorMessage);
    });

    this.Then(/^I should not see an error message at the "([^"]*)" input field$/, function ( label) {
        var message = element(by.css('sb-input[label="' + label + '"] .form-error:not(.ng-hide)'));
        return expect(message.isPresent()).to.eventually.be.false;
    });

    this.Then(/^I should see "([^"]*)" error message at the "([^"]*)" confirmation input field$/,
        function (errorMessage, label) {
            var message = element(
                by.css('sb-input[label="' + label + '"] ng-message.input-confirm-error'));
            return expect(message.getText()).to.eventually.equal(errorMessage);
        });

    this.When(/^I click on the "([^"]*)" button of row "([^"]*)" from the "([^"]*)" table$/,
        function (title, rowNum, ngRepeatData) {
            var actionButton = element(by.css('.action-table')).element(
                by.repeater(ngRepeatData).row(rowNum - 1)).element(by.css('a[title="' + title + '"]'));
            return actionButton.click();
        });

    var getModal = function (modalWindowTitle) {
        return element(by.cssContainingText('div.modal-header h3', modalWindowTitle));
    };

    this.Then(/^I should see the "([^"]*)" modal window$/, function (modalWindowTitle) {
        return expect(getModal(modalWindowTitle).isDisplayed()).to.eventually.be.true;
    });

    this.Then(/^I should not see the "([^"]*)" modal window$/, function (modalWindowTitle) {
        return expect(getModal(modalWindowTitle).isPresent()).to.eventually.be.false;
    });

    this.Then(/^I click on the "([^"]*)" icon$/, function (iconTitle) {
        return element.all(by.css('a[title="' + iconTitle + '"]')).first().click();
    });

    this.Then(/^I should see "([^"]*)" in "([^"]*)" textbox$/, function (value, textBoxLabel) {
        var textbox = element(by.css('sb-input[label="' + textBoxLabel + '"] input'));
        return expect(textbox.getAttribute('value')).to.eventually.equal(value);
    });

    this.Then(/^I should see that the "([^"]*)" button is enabled$/, function (buttonText) {
        return expect(element(by.button(buttonText)).isEnabled()).to.eventually.be.true;
    });

    this.Then(/^I should see that the "([^"]*)" button is disabled$/, function (buttonText) {
        return expect(element(by.button(buttonText)).isEnabled()).to.eventually.be.false;
    });

    this.Then(/^I select "([^"]*)" as my "([^"]*)" from the list$/, function (value, property) {
        var label = element(by.cssContainingText('label', property));
        var idForInput = label.getAttribute('for');

        return idForInput.then(function (id) {
            var input = element(by.id(id));
            var typeAheadList = element(by.css('ul[data-results-for="' + id + '"]'));

            return input.clear().then(function () {
                return input.sendKeys(value);
            }).then(function () {
                return typeAheadList.all(by.css('li.item')).first().click();
            });
        });
    });

    // TODO duplicate
    this.Then(/^I should see "([^"]*)" as the current step in the breadcrumb$/, function (step) {
        return expect(element(by.css('li.step-current')).getText()).to.eventually.contain(step);

    });

    this.When(/^I enter the following details$/, function (datatable) {
        var tableRows = datatable.rowsHash();
        var tableKeys = Object.keys(tableRows);
        var promises = tableKeys.map(function (label) {
            return element(by.inputLabel(label)).clear().sendKeys(tableRows[label]);
        });

        return Promise.all(promises);
    });

    this.When(/^I enter the following details in "([^"]*)" section:$/, function (sectionTitle, formInputs) {
        var tableRows = formInputs.rowsHash();
        var tableKeys = Object.keys(tableRows);
        var promises = tableKeys.map(function (label) {
            return element(by.sectionTitle(sectionTitle))
                    .element(by.inputLabel(label))
                    .clear()
                    .sendKeys(tableRows[label]);
        });

        return Promise.all(promises);
    });

    this.When(/^I select the date "([^"]*)" as my "([^"]*)"$/, function (date, label) {
        return dateHelper.setDate(date, rowInputFieldSelector(label, 'sb-datepicker'));
    });

    this.When(/^I select a date (\d+) "([^"]*)" in the "([^"]*)" as my "([^"]*)"$/,
        function (value, unit, tense, label) {

            value = Number.parseInt(value);

            if (tense === 'past') {
                value *= -1;
            }

            dateHelper.setDynamicDate(value, unit, rowInputFieldSelector(label, 'sb-datepicker'));

        });

    this.When(/^I select a date (\d+) "([^"]*)" in the "([^"]*)" as my "([^"]*)" "([^"]*)"$/,
        function (value, unit, tense, section, label) {
            value = Number.parseInt(value);
            if (tense === 'past') {
                value *= -1;
            }
            dateHelper.setDynamicDate(value, unit, rowInputFieldSelector(label, 'sb-datepicker', '.' + _.kebabCase(section)));
        });

    this.When(/^I select the date "([^"]*)" as my "([^"]*)" "([^"]*)"$/, function (date, section, label) {
        var labelSelector = '.' + _.kebabCase(section);

        return dateHelper.setDate(date, rowInputFieldSelector(label, 'sb-datepicker', labelSelector));
    });

    this.When(/^I choose "([^"]*)" for "([^"]*)"$/, function (answer, question) {
        return element(by.cssContainingText('section, li', question))
            .element(by.cssContainingText('label', answer))
            .click();
    });

    this.Then(/^I should not see "([^"]*)" link$/, function (linkText) {
        return expect(element(by.partialLinkText(linkText)).isPresent()).to.eventually.be.false;
    });

    this.Then(/^I should see "([^"]*)" link$/, function (linkText) {
        return expect(element(by.partialLinkText(linkText)).isPresent()).to.eventually.be.true;
    });

    this.Then(/^I should see "([^"]*)" in the "([^"]*)" section$/, function (expectedText, sectionTitle) {
        return expect(element(by.sectionTitle(sectionTitle)).getText()).to.eventually.contain(expectedText);
    });

    this.Then(/^I should not see "([^"]*)" in the "([^"]*)" section$/, function (label, sectionTitle) {
        return expect(element(by.sectionTitle(sectionTitle)).getText()).to.eventually.not.contain(label);
    });

    this.Then(/^I should not see "([^"]*)"$/, function (text) {
        return expect(element(by.css('body')).getText()).to.eventually.not.contain(text);
    });

    this.Then(/^I should see the "([^"]*)" section$/, function (section) {
        return expect(element(by.sectionTitle(section)).isDisplayed()).to.eventually.be.true;
    });

    this.Then(/^I should not see the "([^"]*)" section$/, function (section) {
        return expect(element(by.sectionTitle(section)).isDisplayed()).to.eventually.be.false;
    });

    this.Then(/^I click on the "([^"]*)" checkbox$/, function (label) {
        return element(by.cssContainingText('label', label)).click();
    });

    this.Then(/^I should see "([^"]*)" checkbox$/, function (checkBoxLabel) {
        return expect(element(by.cssContainingText('label', checkBoxLabel)).isPresent()).to.eventually.be.true;
    });

    this.Then(/^I should see (\d+)(?:st|nd|rd|th) "([^"]*)" checkbox$/, function (position, checkBoxLabel) {
        var zeroOrderIndex = position - 1;
        var checkBox = element.all(by.cssContainingText('label', checkBoxLabel)).get(zeroOrderIndex);
        return expect(checkBox.isPresent()).to.eventually.be.true;
    });

    this.Then(/^I should not see the "([^"]*)" input field$/, function(label) {
         return expect(element(by.inputLabel(label)).isDisplayed()).to.eventually.be.false;
    });

    this.Then(/^I should see that the "([^"]*)" dropdown has "([^"]*)" selected$/, function(label, selectedOption) {
        return expect(element(by.inputLabel(label)).$('option:checked').getText()).to.eventually.contain(selectedOption);
    });

    this.Then(/^I should see a waring message saying "([^"]*)"$/, function(message){
       return expect(element(by.css('span.information:not(.ng-hide)')).getText()).to.eventually.equal(message);
    });

    

   
};

module.exports = componentStepDefinition;
