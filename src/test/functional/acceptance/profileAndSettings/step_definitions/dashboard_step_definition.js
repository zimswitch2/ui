var dashboardStepDefinition = function () {
    var accountSharingPage = require('../../../pages/accountSharingPage.js');
    var helpers = require('../../../pages/helpers.js');
    var expect = require('../../step_definitions/expect');

    this.When(/^I click on the "([^"]*)" dashboard$/, function (dashboardName) {
        return element(by.cssContainingText("li.cards h2", dashboardName)).click();
    });

    var getAccountSummaryTab = function (accountSummaryTitle) {
            return element(by.css('div.row-account-summary.wide-content.ng-scope > div.account-summary')).element(by.cssContainingText('h3', accountSummaryTitle));
        };

        this.Then(/^I should see the "([^"]*)" widget on the Account Summary page$/, function (accountSummaryTitle) {
            return expect(getAccountSummaryTab(accountSummaryTitle).getText()).to.eventually.contain(accountSummaryTitle);
        });
};

module.exports = dashboardStepDefinition;