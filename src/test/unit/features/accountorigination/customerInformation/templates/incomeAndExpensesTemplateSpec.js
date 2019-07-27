describe('customer information - income and expenses template', function () {
    'use strict';

    var scope, element, CustomerInformationData;

    beforeEach(module( 'refresh.filters', 'refresh.lookups', 'refresh.rowField', 'refresh.mapFilter', 'refresh.accountOrigination.domain.customer'));

    beforeEach(inject(function (TemplateTest, Fixture, ServiceTest, LookUps, _CustomerInformationData_) {
        ServiceTest.spyOnEndpoint('getIncomeAndExpenseTypes');
        ServiceTest.stubResponse('getIncomeAndExpenseTypes', 200, {
            'inexTypes': [
                {
                    'inextC': 4,
                    'inextSapC': '04',
                    'inextIncomI': 'I',
                    'inextEngX': 'TRAVEL ALLOWANCE',
                    'inextAfrX': 'REISTOELAE',
                    'inextSapbsY': 'N'
                },
                {
                    'inextC': 5,
                    'inextSapC': '05',
                    'inextIncomI': 'I',
                    'inextEngX': 'HOUSING SUBSIDY',
                    'inextAfrX': 'BEHUISINGSTOELAE',
                    'inextSapbsY': 'N'
                },
                {
                    'inextC': 19,
                    'inextSapC': '20',
                    'inextIncomI': 'E',
                    'inextEngX': 'HIRE PURCHASE INSTALMENT',
                    'inextAfrX': 'HIRE PURCHASE INSTALMENT',
                    'inextSapbsY': 'N'
                },
                {
                    'inextC': 1,
                    'inextSapC': '32',
                    'inextIncomI': 'E',
                    'inextEngX': 'GROCERIES',
                    'inextAfrX': 'KRUIDENIERSWARE',
                    'inextSapbsY': 'Y'
                }
            ]
        });

        LookUps.incomeType.values();
        LookUps.expenseType.values();

        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('common/sbform/partials/rowField.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/incomeAndExpenses.html'));
        element = TemplateTest.compileTemplate(html);
        CustomerInformationData = _CustomerInformationData_;
    }));

    describe('income and expenses', function () {
        beforeEach(function () {
            scope.customerInformationData = CustomerInformationData.initialize({
                incomeExpenseItems: [
                    {
                        itemExpenditureIndicator: 'I',
                        itemAmount: 3600.0,
                        itemTypeCode: '04'
                    },
                    {
                        itemExpenditureIndicator: 'I',
                        itemAmount: 12800.0,
                        itemTypeCode: '05'
                    },
                    {
                        itemExpenditureIndicator: 'E',
                        itemAmount: 1048.0,
                        itemTypeCode: '01'
                    },
                    {
                        itemExpenditureIndicator: 'E',
                        itemAmount: 1112.0,
                        itemTypeCode: '99'
                    }
                ]
            });
            scope.$digest();
        });

        it('should show all income', function () {
            expect(element.find('#grossIncome').text()).toMatch(/R 16 400/);

            expect(element.find('#incomeItem0').text()).toMatch(/Travel allowance/);
            expect(element.find('#incomeItem0').text()).toMatch(/R 3 600/);

            expect(element.find('#incomeItem1').text()).toMatch(/Housing subsidy/);
            expect(element.find('#incomeItem1').text()).toMatch(/R 12 800/);

        });

        it('should show all expenses', function () {
            expect(element.find('#totalExpenses').text()).toMatch(/R 1 112/);
        });

        describe ('income and expenses modal', function(){
            it ('should show modal when flag is true', function(){
                scope.showValidationModal = true;
                scope.$digest();

                expect(element.find('#customer-info-validation-modal')).not.toBeHidden();
            });
        });
    });
});
