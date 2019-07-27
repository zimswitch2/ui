describe('IncomeAndExpenseValidation', function(){
    'use strict';

    var navigateCallback = jasmine.createSpy('navigateCallback');
    var editCallback = jasmine.createSpy('editCallback');
    var incomeAndExpenseValidation = new IncomeAndExpenseValidation(navigateCallback, editCallback);

    var emptyCustomer = {};

    var doIncomeAndExpenseExist = function(incomeExists, expenseExists) {
        return {
            hasAnyIncome: function(){
                return incomeExists;
            },
            hasOnlyTotalExpense: function(){
                return expenseExists;
            },
            filterExpenses: function(){}
        };
    };

    var customerWithIncomeButNoExpense = doIncomeAndExpenseExist(true, false);
    var customerWithExpenseButNoIncome = doIncomeAndExpenseExist(false, true);
    var customerWithExpenseAndIncome = doIncomeAndExpenseExist(true, true);
    var customerWithNoExpenseAndNoIncome = doIncomeAndExpenseExist(false, false);

    describe ('validateSection', function(){
        it('should return true if customerData is empty', function(){
            var customer = emptyCustomer;

            expect(incomeAndExpenseValidation.validateSection(customer)).toBeTruthy();
        });

        it ('should fail validation if customer has no income', function(){
            var customer = customerWithExpenseButNoIncome;

            expect(incomeAndExpenseValidation.validateSection(customer)).toBeFalsy();
        });

        it ('should fail validation if customer has income but no expense', function(){
            var customer = customerWithIncomeButNoExpense;

            expect(incomeAndExpenseValidation.validateSection(customer)).toBeFalsy();
        });

        it ('should pass validation if customer has income and expense', function(){
            var customer = customerWithExpenseAndIncome;

            expect(incomeAndExpenseValidation.validateSection(customer)).toBeTruthy();
        });
    });

    describe ('getNotificationMessage', function(){

        it('should return message prompting for income when customer has income and no expense', function(){
            var customer = customerWithIncomeButNoExpense;
            var expectedMessage = 'Please enter your expense details';

            expect(incomeAndExpenseValidation.getNotificationMessage(customer)).toEqual(expectedMessage);

        });

        it('should return message prompting for expense when customer has expenses and no income', function(){
            var customer = customerWithExpenseButNoIncome;
            var expectedMessage = 'Please enter your income details';

            expect(incomeAndExpenseValidation.getNotificationMessage(customer)).toEqual(expectedMessage);

        });

        it('should return message prompting for income and expense when customer has no expenses and no income', function(){
            var customer = customerWithNoExpenseAndNoIncome;
            var expectedMessage = 'Please enter your income and expense details';

            expect(incomeAndExpenseValidation.getNotificationMessage(customer)).toEqual(expectedMessage);
        });

        it('should return empty message when customer has expenses and income', function(){
            var customer = customerWithExpenseAndIncome;

            expect(incomeAndExpenseValidation.getNotificationMessage(customer)).toBeFalsy();
        });
    });

    describe('navigateToSection', function () {
       it('should have called nagivateCallback when navigateToSection is called', function(){
           incomeAndExpenseValidation.navigateToSection();

           expect(navigateCallback).toHaveBeenCalled();
       });
    });

    describe('editSection', function () {
        it('should have called editCallback with expenses if customer has income but no expenses', function(){
            var customer = customerWithIncomeButNoExpense;
            incomeAndExpenseValidation.editSection(customer);

            expect(editCallback).toHaveBeenCalledWith('expenses');
        });

        it('should have called editCallback with income if customer has expenses but no income', function(){
            var customer = customerWithExpenseButNoIncome;
            incomeAndExpenseValidation.editSection(customer);

            expect(editCallback).toHaveBeenCalledWith('income');
        });

        it ('should have called editCallback with income if customer has no income and no expenses', function(){
            var customer = customerWithNoExpenseAndNoIncome;
            incomeAndExpenseValidation.editSection(customer);

            expect(editCallback).toHaveBeenCalledWith('income');
        });
    });
});