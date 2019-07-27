var changePasswordStepDefinition = function () {
    'use strict';
    var baseActions = require('../../../pages/baseActions.js');

    this.When(/^I click on Change Password$/, function () {
        baseActions.navigateToChangePassword();
    });

};
module.exports = changePasswordStepDefinition;