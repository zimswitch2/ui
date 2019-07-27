var incomeAndExpensePage = function () {
    this.baseActions = require('./baseActions.js');
    this.helpers = require('./helpers.js');
    this.actions = {
        clickConfirmButton:function() {
            this.helpers.scrollThenClick(element(by.id('save-income-expenses')));
        }.bind(this),
        clickEditIncomeExpensesButton:function() {
            this.helpers.scrollThenClick(element(by.id('edit-income-expenses-button')));
        }.bind(this),
        selectMonthlyIncome: function (item) {
            element(by.id('incomeItemList0')).element(by.cssContainingText('option', item)).click();
        }.bind(this),
        setMonthlyIncomeAmount: function (amount) {
            var inputField = this.helpers.wait(element(by.id('incomeAmount0')));
            inputField.clear();
            inputField.sendKeys(amount);
        }.bind(this)
    };
    var getValueSpanElement = function (label, textContainerElementType) {
        return element.all(by.css('li[label="' + label + '"].row-field div.information div.field-value div.cell-data ' + textContainerElementType + '.ng-binding')).last();
    };
    this.salaryReadonlyValueElement = function () {
        return getValueSpanElement('Gross salary', 'span');
    };
    this.totalIncomeReadonlyValueElement = function () {
        return getValueSpanElement('Total income', 'span');
    };
    this.totalExpensesValueElement = function () {
        return getValueSpanElement('Total expenses', 'span');
    };
    this.incomeAndExpensesModifyButton = function () {
        return element(by.id('edit-income-expenses-button'));
    };
    this.monthlyIncomeDropDown = function () {
        return element(by.id('incomeItemList0'));
    };
    this.monthlyIncomeAmountInput = function () {
        return element(by.id('incomeAmount0'));
    };
    this.confirm = function () {
        return element(by.id('save-income-expenses'));
    };
    this.incomeAndExpensesModifyButtonClick = function () {
        return element(by.id('edit-income-expenses-button')).click();
    };
    
};

module.exports = new incomeAndExpensePage();

