var ViewGroupDetailsPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.getHeader = function (headerId) {
        return element(by.id(headerId));
    };

    this.clickBackToGroups = function () {
        helpers.scrollThenClick(element(by.linkText('Back to groups')));
    };

    by.groupBeneficiaries = function () {
        return this.repeater('beneficiary in selectedGroup.beneficiaries');
    };

    this.getBeneficiaryList = function () {
        return element.all(by.css('#group-member'));
    };

    this.getEditIcon = function () {
        return element(by.css('[title=modify]'));
    };

    this.getPayIcon = function () {
        return element(by.css('[title=pay]'));
    };

    this.getButton = function (buttonId) {
        return element(by.id(buttonId));
    };

    this.getInputField = function () {
        return element(by.id('name'));
    };

    this.getGroupName= function () {
        return element(by.id('groupName'));
    };

    this.renameGroupTo = function (newName) {
        var field = this.getInputField();
        field.clear();
        field.sendKeys(newName);
    };

    this.getSuccessContainer = function () {
        return element(by.css('.notification.success'));
    };

    this.getErrorMessage = function () {
      return element(by.css('.form-error:not(.ng-hide)')).getText();
    };

    this.getCheckBox = function () {
        return element(by.css('.group-members:nth-child(1)'));
    };

    this.clickDelete = function () {
        helpers.scrollThenClick(element(by.id('delete-group')));
    };

    this.clickConfirm = function () {
        helpers.scrollThenClick(element(by.css('.danger-confirm')));
    };
};

module.exports = new ViewGroupDetailsPage();
