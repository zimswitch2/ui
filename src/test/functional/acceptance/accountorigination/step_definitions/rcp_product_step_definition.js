var rcpProductStepDefinition = function () {
    var rcpOfferPage = require('../../../pages/rcpOfferPage.js');
    var rcpConfirmOfferPage = require('../../../pages/rcpConfirmOfferPage.js');
    var rcpProductPage = require('../../../pages/rcpProductPage.js');
    var rcpFinishedPage = require('../../../pages/rcpFinishOfferPage.js');
    var expect = require('../../step_definitions/expect');
    var tableHelper = require('../../step_definitions/table_helper');

    this.When(/^I click on the close quote icon$/, function () {
        return rcpOfferPage.actions.closeQuote();
    });

    this.Then(/^I should see the rcp quote "([^"]*)"$/, function (displayed) {
        if (displayed === 'displayed') {
            return expect(rcpOfferPage.isQuotePopupVisible()).to.eventually.be.true;
        }
        else {
            return expect(rcpOfferPage.isQuotePopupVisible()).to.eventually.be.false;
        }
    });

    // TODO move to helper for better reuse
    var disableAnimation = function (selector) {
        var scriptToExecute = '$("' + selector +
            '").attr("style", "animation: none !important; -webkit-animation: none !important;")';
        return browser.executeScript(scriptToExecute);
    };

    this.When(/^I update the loan amount to "([^"]*)"$/, function (loanAmount) {
        return disableAnimation('.minimum-repayment')
            .then(function () {
                return element.all(by.id('amount')).first().clear().sendKeys(loanAmount);
            });
    });

    this.Then(/^the minimum monthly repayment should be "([^"]*)"$/, function (minimumMonthlyRepayment) {
        return expect(element(by.id('minimumRepayment')).getText()).to.eventually.equal(minimumMonthlyRepayment);
    });

    // TODO refactor following steps to be one generic step on summary-ao component
    this.Then(/^I should see the following rcp offer details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch(rcpOfferPage.getRcpOfferSelectorDetails(), [table.rowsHash()]);
    });

    this.Then(/^I should see the following rcp confirmed offer details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch(rcpConfirmOfferPage.getAcceptedOfferSelectorDetails(), [table.rowsHash()]);
    });

    this.Then(/^I should see the following rcp finish offer details$/, function (table) {
        return tableHelper.getAndExpectRowsToMatch(rcpFinishedPage.getConfirmedOfferSelectorDetails(), [table.rowsHash()]);
    });

    // TODO generalize and move to flow_steps (or component?)
    this.Then(/I should see "([^"]*)" steps/, function(numberOfSteps){
        numberOfSteps = Number.parseInt(numberOfSteps);
       return expect(rcpOfferPage.baseActions.flow.numberOfSteps()).to.eventually.equal(numberOfSteps);
    });

    // TODO generalize and move to flow_steps (or component?)
    this.Then(/I should see the current step as "([^"]*)"/, function(text){
        return expect(rcpOfferPage.baseActions.flow.currentStep()).to.eventually.equal(text);
    });
};
module.exports = rcpProductStepDefinition;