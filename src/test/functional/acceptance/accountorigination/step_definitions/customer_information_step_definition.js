var customerInformationStepDefinition = function () {

    var editIncomeExpensesPage = require('../../../pages/editIncomeExpensesPage.js');

    // TODO refactor income steps -- generic for income and contact??
    this.When(/^I select last additional income item as "([^"]*)"$/, function (type) {
        return editIncomeExpensesPage.actions.selectLastAdditionalIncomeItem(type);
    });
};
module.exports = customerInformationStepDefinition;