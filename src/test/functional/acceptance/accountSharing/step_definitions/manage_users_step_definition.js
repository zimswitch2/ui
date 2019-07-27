var manageUsersStepDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var dateHelper = require('../../step_definitions/date_picker_helper');
    var expect = require('../../step_definitions/expect');
    var Promise = require('bluebird');


    this.When(/I click "([^"]*)" on the list of added users$/, function (listOfAddedUsers) {
            //click on menu button to expand the menu
            return element(by.cssContainingText("ul > li > a", listOfAddedUsers)).click();
        });

};

module.exports = manageUsersStepDefinition;