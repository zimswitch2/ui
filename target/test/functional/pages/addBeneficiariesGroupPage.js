var addBeneficiariesGroupPage = function () {

    this.baseActions = require('./baseActions.js');
    var helpers = require('./helpers.js');

    var groupStatus = element(by.css('div.status'));

    this.scrollThenClick = function(element) {
        element.getLocation().then(function (location) {
            browser.executeScript('window.scrollTo(' + location.x + ', ' + location.y + ');');
            element.click();
        });
    };

    this.agree = function () {
        return element(by.css('.li.selected'));
    };

    this.getGroupStatus = function () {
        return groupStatus.getText();
    };

    this.getGroupStatusVisibility = function () {
        return groupStatus.isDisplayed();
    };

    this.getBeneficiaryList = function () {
        return element.all(by.beneficiaries());
    };

    this.getEnabledBeneficiaryList = function () {
        return element.all(by.css('li.ng-scope.enabled')).first();
    };

    this.getBeneficiaryGroups = function () {
        return element.all(by.css('ul.addable li'));
    };

    this.addNewGroup = function (groupName) {
        element(by.model('groupName')).sendKeys(groupName);
        helpers.scrollThenClick(element(by.id('addGroup')));
    };

    this.getSuccessContainer = function () {
        return element(by.css('.notification.success'));
    };

    this.getGroupMembers = function (group) {
        return group.element(by.css('.members')).getText();
    };

    this.groupNames = function () {
        return this.getBeneficiaryGroups().map(function (groupElement) {
            var groupNameElement = groupElement.element(by.css('span.groupName'));
            return groupNameElement.getText().then(function (innerText) {
                return innerText;
            });
        });
    };

    this.getBackToGroupsButton = function(){
        return element(by.css('.back-beneficiaries .secondary'));
    };

    this.getButton = function(id) {
        return element(by.id(id));
    };
};

module.exports = new addBeneficiariesGroupPage();
