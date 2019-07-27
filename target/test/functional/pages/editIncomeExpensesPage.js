var editIncomeExpensesPage = function () {
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');

    this.saveButton = element(by.id('save-income-expenses'));

    this.actions = {
        addAdditionalIncome: function () {
            this.helpers.scrollThenClick(element(by.id('add-additional-income')));
        }.bind(this),
        fillFirstAdditionalIncome: function (amount) {
            var firstAdditionalIncome = element(by.css('#incomeItem0 input'));
            firstAdditionalIncome.clear();
            firstAdditionalIncome.sendKeys(amount);
        }.bind(this),
        selectLastAdditionalIncomeItem: function (item) {
            var rows = element.all(by.repeater('incomeItem in customerInformationData.getIncomes()'));
            rows.last().element(by.cssContainingText('option', item)).click();
        }.bind(this),
        fillLastAdditionalIncome: function (amount) {
            var rows = element.all(by.repeater('incomeItem in customerInformationData.getIncomes()'));
            rows.last().element(by.css('input')).sendKeys(amount);
        }.bind(this),
        saveIncomeExpenses: function () {
            this.helpers.scrollThenClick(this.save());
        }.bind(this),
        setTotalExpensesAmount: function (amount) {
            var inputField = this.helpers.wait(element.all(by.css('li#totalExpenses div.information div.field-value div.cell-data input.currency')).last());
            inputField.clear();
            inputField.sendKeys(amount);
        }.bind(this)
    };

    this.save = function() {
        return element(by.id('save-income-expenses'));
    };

};

module.exports = new editIncomeExpensesPage();

