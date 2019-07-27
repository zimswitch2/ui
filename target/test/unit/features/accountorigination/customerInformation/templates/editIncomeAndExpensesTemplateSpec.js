describe('customer information - edit income and expenses', function () {
    'use strict';

    var scope, element;

    beforeEach(module('refresh.filters', 'refresh.mapFilter', 'refresh.accountOrigination.customerInformation.edit.incomeAndExpense', 'refresh.accountOrigination.domain.customer'));

    beforeEach(inject(function (TemplateTest, Fixture, ServiceTest, CustomerInformationData) {
        ServiceTest.spyOnEndpoint('getIncomeAndExpenseTypes');
        ServiceTest.stubResponse('getIncomeAndExpenseTypes', 200, {'inexTypes': []});

        scope = TemplateTest.scope;
        scope.customerInformationData = CustomerInformationData.initialize({
            incomeExpenseItems: [
                {
                    itemTypeCode: '04',
                    itemAmount: 3600.0,
                    itemExpenditureIndicator: 'I'
                },
                {
                    itemTypeCode: '05',
                    itemAmount: 12800.0,
                    itemExpenditureIndicator: 'I'
                },
                {
                    itemTypeCode: '32',
                    itemAmount: 1000.0,
                    itemExpenditureIndicator: 'E'
                },
                {
                    itemTypeCode: '99',
                    itemAmount: 500.0,
                    itemExpenditureIndicator: 'E'
                }
            ]
        });
        scope.$digest();

        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/editIncomeAndExpenses.html'));
        element = TemplateTest.compileTemplate(html);
    }));

    describe('income', function () {
        it('should show the remove button for each income item', function () {
            expect(element.find('#remove-income0').text()).toContain('Remove');
            expect(element.find('#remove-income1').text()).toContain('Remove');
        });

        it('should show the add additional income link', function () {
            expect(element.find('.editIncomeExpenses a').text()).toContain('Add additional income');
        });
    });

    describe('notification message', function () {

        describe('when message is present', function () {
            var testMessage;

            beforeEach(function () {
                testMessage = 'test message';
                scope.getValidationNotification = function () {
                    return testMessage;
                };
            });

            it('should be visible correct content if income and expenses form is pristine', function () {
                scope.incomeAndExpensesForm = {$pristine: true};
                scope.$digest();

                expect(element.find('#income-notification')).not.toBeHidden();
                expect(element.find('#income-notification').text()).toMatch(testMessage);
            });

            it('should not be visible if income and expenses form is not pristine', function () {
                scope.incomeAndExpensesForm = {$pristine: false};
                scope.$digest();

                expect(element.find('#income-notification')).toBeHidden();
            });
        });

        it('should not be visible if message is not present', function () {
            scope.getValidationNotificationForSection = function () {
                return undefined;
            };
            scope.$digest();

            expect(element.find('#income-notification')).toBeHidden();
        });
    });
});
