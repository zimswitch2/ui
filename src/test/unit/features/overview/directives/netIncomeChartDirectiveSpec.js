var personalFinanceManagementFeature = false;
if (feature.personalFinanceManagement) {
    personalFinanceManagementFeature = true;
}

if(personalFinanceManagementFeature) {
    describe('Net Income Chart Directive', function () {
        'use strict';

        var templateTest, parentScope, menigaNetIncomeService, mock, location, colourService;

        var stubResponseData = {"netIncome":  [{
            "Expenses": -16594.15,
            "Income": 18000,
            "Month": {
                "MonthOfYear": 4,
                "Year": 2015
            }
        }, {
            "Expenses": -15035.20,
            "Income": 18000,
            "Month": {
                "MonthOfYear": 5,
                "Year": 2015
            }
        }]};

        beforeEach(function () {
            module('refresh.overview.netIncomeChart', 'refresh.meniga.netIncomeService', 'refresh.charts.chartColours');
            inject(function (TemplateTest, _MenigaNetIncomeService_, _mock_, _$location_, _netIncomeChartColours_) {
                templateTest = TemplateTest;
                templateTest.allowTemplate('features/overview/partials/netIncomeChart.html');
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
                spyOn(menigaNetIncomeService, 'getAccountsNetIncome');
                menigaNetIncomeService.getAccountsNetIncome.and.returnValue(mock.resolve(stubResponseData));

                location = _$location_;
                spyOn(location, 'path');

                colourService = _netIncomeChartColours_;
            });
        });

        it('should not replace the custom tag when personalFinanceManagement is turned off', function () {
            personalFinanceManagementFeature = false;
            var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');

            expect(element[0].tagName).toEqual('SB-NET-INCOME-CHART');
            personalFinanceManagementFeature = true;
        });

        it('should replace the custom tag', function () {
            var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');

            expect(element[0].tagName).not.toEqual('SB-NET-INCOME-CHART');
        });

        it('should render a div', function () {
            var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');

            expect(element[0].tagName).toEqual("DIV");
        });

        it('should have isolated scope with variables set to the values passed to it from the parent scope', function () {
            var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');

            var directiveScope = element.isolateScope();

            expect(directiveScope).toBeDefined();
            expect(directiveScope.parentPageDescription).toEqual("parent page");
            expect(directiveScope.accounts).toEqual(parentScope.menigaProfile.accounts);
            expect(directiveScope.personalFinanceManagementId).toEqual(parentScope.menigaProfile.personalFinanceManagementId);
        });

        describe('initialiseAccountsNetIncome', function () {
            var mock, directiveScope;

            beforeEach(inject(function (_mock_) {
                mock = _mock_;

                var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');

                directiveScope = element.isolateScope();
                spyOn(directiveScope, '$emit');

            }));

            it('Should not show NO transactional upsell links when transactional or credit card accounts are passed into the directive', function () {
                var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');
                var directiveScope = element.isolateScope();

                expect(directiveScope.ShowNoTransactionalProductsPanel).toBeFalsy();
            });

            describe('successful', function () {
                describe('with net income data', function () {
                    beforeEach(function () {
                        directiveScope.initialiseAccountsNetIncome();
                        directiveScope.$digest();
                    });

                    it('should call getAccountsNetIncome on menigaNetIncome service', function () {
                        expect(menigaNetIncomeService.getAccountsNetIncome).toHaveBeenCalledWith(directiveScope.personalFinanceManagementId, directiveScope.accounts);
                    });

                    var absoluteSumOfPropertyValues = function(array, propertyName) {
                        return _.reduce(_.pluck(array, propertyName), function (memo, num) {
                            return memo + Math.abs(num);
                        }, 0);
                    };

                    it('should set directive properties based on data', function () {
                        var totalIncome = absoluteSumOfPropertyValues(stubResponseData.netIncome, 'Income');
                        var totalExpenses = absoluteSumOfPropertyValues(stubResponseData.netIncome, 'Expenses');

                        expect(directiveScope.FromMonth).toEqual(_.min(_.map(stubResponseData.netIncome, function (netIncome) {
                            return netIncome.Month.MonthOfYear;
                        })));

                        expect(directiveScope.NetIncomeCashIn).toEqual(totalIncome);
                        expect(directiveScope.NetIncomeCashOut).toEqual(totalExpenses);
                        expect(directiveScope.NetIncomeData).toEqual([{
                            label: "Cash in",
                            value: totalIncome
                        }, {
                            label: "Cash out",
                            value: totalExpenses
                        }]);
                    });

                    it('should emit ShowNetIncomeDoughnutChart event', function () {
                        expect(directiveScope.$emit).toHaveBeenCalledWith('ShowNetIncomeDoughnutChart');
                    });
                });

                describe('without net income data', function () {
                    beforeEach(function () {
                        menigaNetIncomeService.getAccountsNetIncome.and.returnValue(mock.resolve({"netIncome":  []}));

                        directiveScope.initialiseAccountsNetIncome();

                        directiveScope.$digest();
                    });

                    it('should call getAccountsCashflows on menigaNetIncome service', function () {
                        expect(menigaNetIncomeService.getAccountsNetIncome).toHaveBeenCalledWith(directiveScope.personalFinanceManagementId, directiveScope.accounts);
                    });

                    it('should set directive properties based on data', function () {
                        expect(directiveScope.FromMonth).toEqual(0);

                        expect(directiveScope.NetIncomeCashIn).toEqual(0);
                        expect(directiveScope.NetIncomeCashOut).toEqual(0);
                        expect(directiveScope.NetIncomeData).toEqual([{
                            label: "Cash in",
                            value: 0
                        }, {
                            label: "Cash out",
                            value: 0
                        }]);
                    });

                    it('should NOT emit ShowNetIncomeDoughnutChart event', function () {
                        expect(directiveScope.$emit).not.toHaveBeenCalledWith('ShowNetIncomeDoughnutChart');
                    });
                });
            });

            describe('unsuccessful', function () {
                beforeEach(function () {
                    directiveScope.FromMonth = 0;

                    directiveScope.NetIncomeCashIn = 0;
                    directiveScope.NetIncomeCashOut = 0;
                    directiveScope.NetIncomeData = [];

                    menigaNetIncomeService.getAccountsNetIncome.and.returnValue(mock.reject({ message: 'An error has occurred.' }));

                    directiveScope.initialiseAccountsNetIncome();

                    directiveScope.$digest();
                });

                it('should set the error message on scope', function () {
                    expect(directiveScope.errorMessage).toEqual('An error has occurred.');
                });

                it('should not set directive scope properties based on any data', function () {
                    expect(directiveScope.FromMonth).toEqual(0);

                    expect(directiveScope.NetIncomeCashIn).toEqual(0);
                    expect(directiveScope.NetIncomeCashOut).toEqual(0);
                    expect(directiveScope.NetIncomeData).toEqual([]);
                });

                it('should emit ShowNetIncomeDoughnutChart event', function () {
                    expect(directiveScope.$emit).toHaveBeenCalledWith('ShowNetIncomeDoughnutChart');
                });
            });

            describe('No current or credit card accounts', function () {
                beforeEach(function () {
                    parentScope.menigaProfile = {
                        personalFinanceManagementId: 9,
                        accounts: [
                            {
                                "accountType": "HOME_LOAN",
                                "name": "HOME LOAN",
                                "number": "5592007012041579"
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
                                "accountType": "FIXED_TERM_INVESTMENT",
                                "name": "FIXED TERM",
                                "number": "5592007012041511"
                            }
                        ]
                    };
                    parentScope.$digest();
                });

                it('Should show no transactional products panel when no transactional or credit card accounts are passed into the directive', function () {
                    expect(directiveScope.ShowNoTransactionalProductsPanel).toBeTruthy();
                    expect(directiveScope.ShowNetIncomeChartContainer).toEqual(false);
                });

                it('should emit ShowNetIncomeDoughnutChart event', function () {
                    expect(directiveScope.$emit).toHaveBeenCalledWith('ShowNetIncomeDoughnutChart');
                });
            });
        });

        describe('click on area in cashflows doughnut chart', function(){
            var directiveScope;

            beforeEach(inject(function () {
                var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');

                directiveScope = element.isolateScope();
                spyOn(directiveScope, '$emit');
            }));

            describe('click on segment', function () {
                it('should route to account-summary/transactional-cash-out when cash out segment is clicked ', function () {
                    directiveScope.onCashInCashOutSegmentClicked("Cash out");
                    directiveScope.$digest();

                    expect(location.path).toHaveBeenCalledWith("/account-summary/transactional-cash-out");
                });


                it('should route to account-summary/transactional-cash-in when cash in segment is clicked ', function () {
                    directiveScope.onCashInCashOutSegmentClicked("Cash in");
                    directiveScope.$digest();

                    expect(location.path).toHaveBeenCalledWith("/account-summary/transactional-cash-in");
                });

                it('should emit a trackButtonClick event when segment is clicked ', function () {
                    directiveScope.onCashInCashOutSegmentClicked("Cash in");
                    expect(directiveScope.$emit).toHaveBeenCalledWith('trackButtonClick', 'parent page net income chart Cash in segment');

                    directiveScope.onCashInCashOutSegmentClicked("Cash out");
                    expect(directiveScope.$emit).toHaveBeenCalledWith('trackButtonClick', 'parent page net income chart Cash out segment');
                });
            });

            describe('click on legend item', function () {
                it('should route to account-summary/transactional-cash-out when cash out legend item is clicked ', function () {
                    directiveScope.onCashInCashOutLegendItemClicked("Cash out");
                    directiveScope.$digest();

                    expect(location.path).toHaveBeenCalledWith("/account-summary/transactional-cash-out");
                });


                it('should route to account-summary/transactional-cash-in when cash in legend item is clicked ', function () {
                    directiveScope.onCashInCashOutSegmentClicked("Cash in");
                    directiveScope.$digest();

                    expect(location.path).toHaveBeenCalledWith("/account-summary/transactional-cash-in");
                });

                it('should emit a trackButtonClick event when segment is clicked ', function () {
                    directiveScope.onCashInCashOutLegendItemClicked("Cash in");
                    expect(directiveScope.$emit).toHaveBeenCalledWith('trackButtonClick', 'parent page net income chart Cash in legend item');

                    directiveScope.onCashInCashOutLegendItemClicked("Cash out");
                    expect(directiveScope.$emit).toHaveBeenCalledWith('trackButtonClick', 'parent page net income chart Cash out legend item');
                });
            });

            describe('click canvas area that isn\'t a segment', function () {
                it('should not call $location.path', function () {
                    directiveScope.onCashInCashOutSegmentClicked();
                    directiveScope.$digest();

                    expect(location.path).not.toHaveBeenCalledWith("/account-summary/transactional-cash-in");
                    expect(location.path).not.toHaveBeenCalledWith("/account-summary/transactional-cash-out");
                });
            });
        });

        describe('when accounts array is changed', function () {
            var directiveScope;

            beforeEach(function () {
                var element = templateTest.compileTemplate('<sb-net-income-chart parent-page-description="parent page" accounts="menigaProfile.accounts" personal-finance-management-id="menigaProfile.personalFinanceManagementId"></sb-net-income-chart>');
                directiveScope = element.isolateScope();
                spyOn(directiveScope, 'initialiseAccountsNetIncome');
                parentScope.menigaProfile.accounts.push({description: 'This is a new account that has been added to the user\'s list of accounts'});
                directiveScope.$digest();
            });

            it('should call initialiseAccountsNetIncome', function () {
                expect(directiveScope.initialiseAccountsNetIncome).toHaveBeenCalled();
            });
        });
    });
}