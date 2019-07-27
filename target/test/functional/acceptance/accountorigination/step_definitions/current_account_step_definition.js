var currentAccountDefinition = function () {
    var helpers = require('../../../pages/helpers.js');
    var expect = require('../../step_definitions/expect');
    var currentAccount = require('../../../pages/accountOfferPage.js');
    var tableHelper = require('../../step_definitions/table_helper');

    // TODO refactor for generic summary-ao step
    this.Then(/^I should see the following overdraft offer details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch(currentAccount.getCurrentAccountOverdraftOfferDetails(), [table.rowsHash()]);
    });
};
module.exports = currentAccountDefinition;