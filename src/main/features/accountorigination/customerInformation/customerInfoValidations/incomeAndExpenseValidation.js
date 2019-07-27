function IncomeAndExpenseValidation(navigateCallback, editCallback){
    'use strict';

    this.validateSection = function (customer) {
        if (_.isEmpty(customer)) {
            return true;
        }
        customer.filterExpenses();
        return (customer.hasAnyIncome() && customer.hasOnlyTotalExpense());
    };

    this.getNotificationMessage = function(customer){
        var promptMessage = !customer.hasAnyIncome() ? 'income' : '';

        if (!customer.hasOnlyTotalExpense()) {
            promptMessage = promptMessage ? promptMessage + ' and expense' : 'expense';
        }

        return promptMessage ? 'Please enter your ' + promptMessage + ' details' : undefined;
    };

    this.navigateToSection = function () {
        navigateCallback();
    };

    this.editSection = function (customer) {
        if (customer.hasAnyIncome()) {
            editCallback('expenses');
        }
        else {
            editCallback('income');
        }
    };
}