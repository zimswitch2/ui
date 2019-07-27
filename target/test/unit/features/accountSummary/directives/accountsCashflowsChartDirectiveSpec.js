var personalFinanceManagementFeature = false;


if(personalFinanceManagementFeature) {
    describe('Accounts Cashflows Chart Directive', function () {
        'use strict';

        var templateTest, parentScope, menigaNetIncomeService, mock, colourService;
        var stubResponseData = {
            "accountCashFlow" : [{
                "accountType": "CURRENT",
                "name": "ACCESSACC",
                "netIncome": []
            }, {
                "accountType": "CURRENT",
                "name": "ELITE",
                "netIncome": [{
                    "Expenses": -10443.05,
                    "Income": 18000,
                    "Month": {
                        "MonthOfYear": 4,
                        "Year": 2015
                    }
                }, {
                    "Expenses": -10067.35,
                    "Income": 18000,
                    "Month": {
                        "MonthOfYear": 5,
                        "Year": 2015
                    }
                }]
            }, {
                "accountType": "CREDIT_CARD",
                "name": "CREDIT CARD",
                "netIncome": [{
                    "Expenses": -6151.10,
                    "Income": 0,
                    "Month": {
                        "MonthOfYear": 4,
                        "Year": 2015
                    }
                }, {
                    "Expenses": -4967.85,
                    "Income": 0,
                    "Month": {
                        "MonthOfYear": 5,
                        "Year": 2015
                    }
                }]
            }]
        };

        beforeEach(function () {
            module('refresh.accountSummary.accountsCashflowsChart', 'refresh.meniga.netIncomeService', 'refresh.charts.chartColours');
            inject(function (TemplateTest, _MenigaNetIncomeService_, _mock_, _accountsCashflowsChartColours_) {
                templateTest = TemplateTest;
                templateTest.allowTemplate('features/accountsummary/partials/accountsCashflowsChart.html');
                parentScope = templateTest.scope;
                parentScope.menigaProfile = {
                    personalFinanceManagementId: 9,
                    accounts: [
                        {
                            "accountType": "CURRENT",
                            "name": "Joe Smith",
                            "number": "10000358140"
                        },
                        {
                            "accountType": "CURRENT",
                            "name": "ACCESSACC",
                            "number": "10005304182"
                        },
                        {
                            "accountType": "CREDIT_CARD",
                            "name": "CREDIT CARD",
                            "number": "5592007012041578"
                        },
                        {
                            "accountType": "HOME_LOAN",
                            "name": "HOME LOAN",
                            "number": "5592007012041579"
                        },
                        {
                            "accountType": "TERM_LOAN",
                            "name": "TERM LOAN",
                            "number": "5592007012041580"
                        },
                        {
                            "accountType": "RCP",
                            "name": "REVOLVING CREDIT PLAN",
                            "number": "5592007012041590"
                        },
                        {
                            "accountType": "SAVINGS",
                            "name": "SAVINGS",
                            "number": "42144214"
                        },
                        {
                            "accountType": "NOTICE",
                            "name": "NOTICE",
                            "number": "5592007012041560"
                        },
                        {
                            "accountType": "FIXED_TERM_INVESTMENT",
                            "name": "FIXED TERM",
                            "number": "5592007012041511"
                        },
                        {
                            "accountType": "SAVINGS",
                            "name": "MONEYMARKET",
                            "number": "268450625"
                        },
                        {
                            "accountType": "SAVINGS",
                            "name": "MONEYMARKET",
                            "number": "268450625"
                        },
                        {
                            "accountType": "SAVINGS",
                            "name": "MONEYMARKET",
                            "number": "268450625"
                        }
                    ]
                };

                mock = _mock_;
                menigaNetIncomeService = _MenigaNetIncomeService_;
                spyOn(menigaNetIncomeService, 'getAccountsCashflows');
                menigaNetIncomeService.getAccountsCashflows.and.returnValue(mock.resolve(stubResponseData));

                colourService = _accountsCashflowsChartColours_;
            });
        });

        it('should not replace the custom tag when personalFinanceManagement is turned off', function () {
            personalFinanceManagementFeature = false;
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            expect(element[0].tagName).toEqual('SB-ACCOUNTS-CASHFLOWS-CHART');
            personalFinanceManagementFeature = true;
        });

        it('should replace the custom tag', function () {
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            expect(element[0].tagName).not.toEqual('SB-ACCOUNTS-CASHFLOWS-CHART');
        });

        it('should render a div', function () {
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            expect(element[0].tagName).toEqual("DIV");
        });

        it('should have isolated scope with variables set to the values passed to it', function () {
            parentScope.CashflowPropertyMapping = "Whatever";
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart parent-page-description="parent page" cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope).toBeDefined();
            expect(directiveScope.parentPageDescription).toEqual("parent page");
            expect(directiveScope.cashflowPropertyMapping).toEqual("Whatever");
            expect(directiveScope.accounts).toEqual(parentScope.menigaProfile.accounts);
            expect(directiveScope.personalFinanceManagementId).toEqual(parentScope.menigaProfile.personalFinanceManagementId);
        });

        it('should set the cashflow type on the scope to the cashflow type bount to it', function () {
            parentScope.CashflowPropertyMapping = "Income";
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.cashflowPropertyMapping).toEqual("Income");
        });

        it('should set the cashflow colour to red if cashflowPropertyMapping = Expenses', function () {
            parentScope.CashflowPropertyMapping = "Expenses";
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.CashFlowColour).toEqual('rgba(244,115,114,1)');
            expect(directiveScope.CashFlowTextColour).toEqual('rgba(220,24,10,1)');
        });

        it('should set the cashflow colour to black if cashflowPropertyMapping != Expenses or Income', function () {
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="Whatever" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.CashFlowColour).toEqual('#000000');
            expect(directiveScope.CashFlowTextColour).toEqual('#000000');
        });

        it('should set the cashflow colour to green if cashflowPropertyMapping = Income', function () {
            parentScope.CashflowPropertyMapping = "Income";
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.CashFlowColour).toEqual('rgba(159,235,171,1)');
            expect(directiveScope.CashFlowTextColour).toEqual('rgba(36,147,9,1)');
        });

        it('should set the chart header to "Cash in" if cashflowPropertyMapping = Income', function () {
            parentScope.CashflowPropertyMapping = "Income";
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.ChartHeader).toEqual('Cash in');
        });

        it('should set the chart header to "Cash out" if cashflowPropertyMapping = Expenses', function () {
            parentScope.CashflowPropertyMapping = "Expenses";
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.ChartHeader).toEqual('Cash out');
        });

        it('should set the chart header to "" if cashflowPropertyMapping != Expenses or Income', function () {
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="Whatever" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.ChartHeader).toEqual('');
        });

        it('should set account types colour palette', function () {
            var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope.AccountTypesColourPalette).toEqual([{
                accountType: "CURRENT",
                colours: [
                    {color: 'rgba(2,93,140,1)',highlight: 'rgba(2,93,140,0.8)'},
                    {color: 'rgba(16,127,201,1)',highlight: 'rgba(16,127,201,0.8)'},
                    {color: 'rgba(10,147,252,1)',highlight: 'rgba(10,147,252,0.8)'},
                    {color: 'rgba(115,194,255,1)',highlight: 'rgba(115,194,255,0.8)'},
                    {color: 'rgba(0,79,128,1)',highlight: 'rgba(0,79,128,0.8)'},
                    {color: 'rgba(0,97,158,1)',highlight: 'rgba(0,97,158,0.8)'},
                    {color: 'rgba(0,112,181,1)',highlight: 'rgba(0,112,181,0.8)'},
                    {color: 'rgba(0,132,214,1)',highlight: 'rgba(0,132,214,0.8)'},
                    {color: 'rgba(0,142,230,1)',highlight: 'rgba(0,142,230,0.8)'}]
            }, {
                accountType: "CREDIT_CARD",
                colours: [
                    {color: 'rgba(244,141,44,1)',highlight: 'rgba(244,141,44,0.8)'},
                    {color: 'rgba(236,124,25,1)',highlight: 'rgba(236,124,25,0.8)'},
                    {color: 'rgba(253,153,64,1)',highlight: 'rgba(253,153,64,0.8)'},
                    {color: 'rgba(204,91,35,1)',highlight: 'rgba(204,91,35,0.8)'}]
            }]);
        });

        describe('initialiseAccountsCashflows', function () {
            var mock, directiveScope;

            beforeEach(inject(function (_mock_) {
                mock = _mock_;
                parentScope.CashflowPropertyMapping = "Income";

                var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');

                directiveScope = element.isolateScope();
                spyOn(directiveScope, '$emit');
            }));

            describe('successful', function () {
                var getSortedAccountCashflowsFromResponse = function (response) {
                    return _.sortBy(_.filter(response.accountCashFlow, function (accountCashFlow) {
                        return accountCashFlow.netIncome.length > 0;
                    }), 'accountType');
                };

                var getChartColoursForDataInResponse = function (responseData) {
                    var accountsWithCashflows = getSortedAccountCashflowsFromResponse(responseData);
                    var sortedAccountTypes = _.uniq(_.map(accountsWithCashflows, function(acountCashflow) {
                        return acountCashflow.accountType;
                    }));

                    var colours = [];
                    for(var i = 0; i < sortedAccountTypes.length; i++) {
                        var accountsForType = _.where(accountsWithCashflows, {accountType: sortedAccountTypes[i]});
                        var accountTypeColourSet = _.findWhere(directiveScope.AccountTypesColourPalette, {accountType: sortedAccountTypes[i]}).colours;
                        var colourIndex = 0;
                        for (var ii = 0; ii < accountsForType.length; ii++) {
                            if(accountTypeColourSet.length <= colourIndex) {
                                colourIndex = 0;
                            }
                            colours.push(accountTypeColourSet[colourIndex]);
                            colourIndex++;
                        }
                    }
                    return colours;
                };

                describe('with account cashflows data', function () {
                    beforeEach(function () {
                        directiveScope.initialiseAccountsCashflows();
                        directiveScope.$digest();
                    });

                    it('should call getAccountsCashflows on menigaNetIncome service', function () {
                        expect(menigaNetIncomeService.getAccountsCashflows).toHaveBeenCalledWith(parentScope.menigaProfile.personalFinanceManagementId, parentScope.menigaProfile.accounts);
                    });

                    it('should set the chart colours based on the account cashflows returned', function () {
                        var colours = getChartColoursForDataInResponse(stubResponseData);

                        expect(directiveScope.ChartColours).toEqual(colours);
                    });

                    var absoluteSumOfPropertyValues = function(array, propertyName) {
                        return _.reduce(_.pluck(array, propertyName), function (memo, num) {
                            return memo + Math.abs(num);
                        }, 0);
                    };

                    it('should set the chart data based on the income in the account cashflows returned', function () {
                        var sortedAccountCashflows = getSortedAccountCashflowsFromResponse(stubResponseData);

                        expect(directiveScope.ChartData).toEqual(_.map(sortedAccountCashflows, function (accountCashFlow) {
                            return {
                                label: accountCashFlow.name,
                                value: absoluteSumOfPropertyValues(accountCashFlow.netIncome, directiveScope.cashflowPropertyMapping)
                            };
                        }));
                    });

                    it('should set the chart cashflows data based on the income in the account cashflows returned', function () {
                        var colours = getChartColoursForDataInResponse(stubResponseData);
                        var sortedAccountCashflows = getSortedAccountCashflowsFromResponse(stubResponseData);
                        var cashflowsData = [];
                        for(var i = 0; i < sortedAccountCashflows.length; i++) {
                            cashflowsData.push({
                                name: sortedAccountCashflows[i].name,
                                amount: absoluteSumOfPropertyValues(sortedAccountCashflows[i].netIncome, directiveScope.cashflowPropertyMapping),
                                colour: colours[i].color
                            });
                        }

                        expect(angular.copy(directiveScope.CashflowData)).toEqual(cashflowsData);
                    });

                    it('should set from month scope variable to earliest month in data', function () {
                        var sortedAccountCashflows = getSortedAccountCashflowsFromResponse(stubResponseData);

                        expect(directiveScope.FromMonth).toEqual(_.min(_.map(sortedAccountCashflows, function(accountCashflow) {
                            return _.min(_.map(accountCashflow.netIncome, function (netIncome) {
                                return netIncome.Month.MonthOfYear;
                            }));
                        })));
                    });

                    it('should set Cashflow Total scope variable to the absolute sum of the values in the data', function () {
                        var sortedAccountCashflows = getSortedAccountCashflowsFromResponse(stubResponseData);
                        var cashflowValues = _.map(sortedAccountCashflows, function (accountCashFlow) {
                            return absoluteSumOfPropertyValues(accountCashFlow.netIncome, directiveScope.cashflowPropertyMapping);
                        });
                        var cashflowValuesTotal = _.reduce(cashflowValues, function (memo, num) {
                            return memo + Math.abs(num);
                        }, 0);

                        expect(directiveScope.CashflowTotal).toEqual(cashflowValuesTotal);
                    });
                });

                describe('chart segment colouring', function () {
                    beforeEach(function () {
                        menigaNetIncomeService.getAccountsCashflows.and.returnValue(mock.resolve({
                            "accountCashFlow" : [{
                                "accountType": "CURRENT",
                                "name": "ACCESSACC",
                                "netIncome": [{
                                    "Expenses": -10443.05,
                                    "Income": 18000,
                                    "Month": {
                                        "MonthOfYear": 4,
                                        "Year": 2015
                                    }
                                }, {
                                    "Expenses": -10067.35,
                                    "Income": 18000,
                                    "Month": {
                                        "MonthOfYear": 5,
                                        "Year": 2015
                                    }
                                }]
                            }, {
                                "accountType": "CURRENT",
                                "name": "ELITE",
                                "netIncome": [{
                                    "Expenses": -10443.05,
                                    "Income": 18000,
                                    "Month": {
                                        "MonthOfYear": 4,
                                        "Year": 2015
                                    }
                                }, {
                                    "Expenses": -10067.35,
                                    "Income": 18000,
                                    "Month": {
                                        "MonthOfYear": 5,
                                        "Year": 2015
                                    }
                                }]
                            }, {
                                "accountType": "CREDIT_CARD",
                                "name": "CREDIT CARD",
                                "netIncome": [{
                                    "Expenses": -6151.10,
                                    "Income": 0,
                                    "Month": {
                                        "MonthOfYear": 4,
                                        "Year": 2015
                                    }
                                }, {
                                    "Expenses": -4967.85,
                                    "Income": 0,
                                    "Month": {
                                        "MonthOfYear": 5,
                                        "Year": 2015
                                    }
                                }]
                            }]
                        }));

                        directiveScope.AccountTypesColourPalette = [{
                            accountType: "CURRENT",
                            colours: [{
                                color: 'rgba(0,71,149,1)',
                                highlight: 'rgba(0,71,149,0.8)'
                            }]
                        }, {
                            accountType: "CREDIT_CARD",
                            colours: [{
                                color: 'rgba(245,131,32,1)',
                                highlight: 'rgba(245,131,32,0.8)'
                            }]
                        }];
                        directiveScope.initialiseAccountsCashflows();

                        directiveScope.$digest();
                    });

                    it('recycle the chart colours if there is more data than colours', function () {
                        expect(directiveScope.ChartColours).toEqual([{
                            color: 'rgba(245,131,32,1)',
                            highlight: 'rgba(245,131,32,0.8)'
                        }, {
                            color: 'rgba(0,71,149,1)',
                            highlight: 'rgba(0,71,149,0.8)'
                        }, {
                            color: 'rgba(0,71,149,1)',
                            highlight: 'rgba(0,71,149,0.8)'
                        }]);
                    });
                });

                describe('without account cashflows data', function () {
                    beforeEach(function () {
                        menigaNetIncomeService.getAccountsCashflows.and.returnValue(mock.resolve({"accountCashFlow":  []}));

                        directiveScope.initialiseAccountsCashflows();

                        directiveScope.$digest();
                    });

                    it('should set directive properties based on data', function () {
                        expect(directiveScope.FromMonth).toEqual(0);
                        expect(directiveScope.ChartColours).toEqual([]);
                        expect(directiveScope.ChartData).toEqual([]);
                        expect(directiveScope.CashflowData).toEqual([]);
                        expect(directiveScope.CashflowTotal).toEqual(0);
                    });
                });

            });

            describe('unsuccessful', function () {
                beforeEach(function () {
                    directiveScope.FromMonth = 0;
                    directiveScope.ChartColours = [];
                    directiveScope.ChartData = [];
                    directiveScope.CashflowData = [];
                    directiveScope.CashflowTotal = 0;

                    menigaNetIncomeService.getAccountsCashflows.and.returnValue(mock.reject({ message: 'An error has occurred.' }));

                    directiveScope.initialiseAccountsCashflows();

                    directiveScope.$digest();
                });

                it('should set the error message on scope', function () {
                    expect(directiveScope.errorMessage).toEqual('An error has occurred.');
                });

                it('should not set directive scope properties based on any data', function () {
                    expect(directiveScope.FromMonth).toEqual(0);
                    expect(directiveScope.ChartColours).toEqual([]);
                    expect(directiveScope.ChartData).toEqual([]);
                    expect(directiveScope.CashflowData).toEqual([]);
                    expect(directiveScope.CashflowTotal).toEqual(0);
                });
            });
        });

        describe('when accounts array is changed', function () {
            var directiveScope;

            beforeEach(function () {
                var element = templateTest.compileTemplate('<sb-accounts-cashflows-chart cashflow-property-mapping="CashflowPropertyMapping" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-accounts-cashflows-chart>');
                directiveScope = element.isolateScope();
                spyOn(directiveScope, 'initialiseAccountsCashflows');
                parentScope.menigaProfile.accounts.push({description: 'This is a new account that has been added to the user\'s list of accounts'});
                directiveScope.$digest();
            });

            it('should call initialiseAccountsNetIncome', function () {
                expect(directiveScope.initialiseAccountsCashflows).toHaveBeenCalled();
            });
        });
    });
}
