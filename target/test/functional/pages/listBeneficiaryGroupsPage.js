var ListBeneficiaryGroupsPage = function () {
    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    this.deleteGroup = function (groupName) {
        var names = this.filterByColumn(groupName);
        var index = _.indexOf(names, groupName);

        var deleteButton = element.all(by.css('.delete')).get(index);
        helpers.scrollThenClick(deleteButton);
        var confirmButton = element.all(by.css('.confirm')).get(index);
        helpers.scrollThenClick(confirmButton);
    };

    this.filterByColumn = function (columnSelector) {
        return element.all(by.css(columnSelector)).map(function (columnElement) {
            return columnElement.getText().then(function (text) {
                return text;
            });
        });
    };

    this.getHeaderText = function () {
        return element(by.css('div.page-heading-row h2')).getText();
    };

    this.clickBackButton = function () {
        helpers.scrollThenClick(element(by.buttonText('Back')));
    };

    this.waitPageHeaderText = function (text) {
        return helpers.waitForText(element(by.css('h2')), text).getText();
    };

    by.groups = function () {
        return this.repeater('group in beneficiaryGroups');
    };

    this.getGroupsList = function () {
        return element.all(by.groups());
    };

    this.clickSortByName = function () {
        helpers.scrollThenClick(element(by.css('i.icon.active')));
    };

    this.getGroup = function (groupName) {
        return element(by.id(groupName));
    };

    this.getNoGroupsInformationText = function () {
        return element(by.css('span.information.message')).getText();
    };

    this.getTrashIcon = function () {
        return element.all(by.css('[title=delete]')).first();
    };

    this.getCancelButton = function () {
        return element.all(by.css('li .secondary')).first();
    };

    this.getPayIcon = function () {
        return element.all(by.css('.pay'));
    };

    this.confirm = function () {
        return helpers.scrollThenClick(element.all(by.css('.confirm')).first());
    };

    this.getAddGroupButton = function () {
        return element(by.linkText('Add beneficiary to group'));
    };

};

module.exports = new ListBeneficiaryGroupsPage();
