var personalFinanceManagementFeature = false;


(function (app) {
    'use strict';

    app.directive('sbAccountsCashflowsChart', function (MenigaNetIncomeService, accountsCashflowsChartColours) {

        return personalFinanceManagementFeature ? {
            restrict: 'E',
            templateUrl: 'features/accountsummary/partials/accountsCashflowsChart.html',
            replace: true,
            scope: {
                cashflowPropertyMapping: '=',
                parentPageDescription: '@',
                accounts: '=',
                personalFinanceManagementId: '='
            },

            controller: function ($scope) {

                $scope.$watchCollection('accounts',function(){
                    $scope.initialiseAccountsCashflows();
                });

                $scope.errorMessage = "";
                $scope.ErrorOccurred = false;

                $scope.CashFlowColour = $scope.cashflowPropertyMapping === 'Income' ? accountsCashflowsChartColours.cashInColour
                    : ($scope.cashflowPropertyMapping === 'Expenses' ? accountsCashflowsChartColours.cashOutColour : '#000000');

                $scope.CashFlowTextColour = $scope.cashflowPropertyMapping === 'Income' ? accountsCashflowsChartColours.cashInTextColour
                    : ($scope.cashflowPropertyMapping === 'Expenses' ? accountsCashflowsChartColours.cashOutTextColour : '#000000');

                $scope.ChartHeader = $scope.cashflowPropertyMapping === 'Income' ? 'Cash in'
                    : ($scope.cashflowPropertyMapping === 'Expenses' ? 'Cash out' : '');

                $scope.AccountTypesColourPalette = accountsCashflowsChartColours.colours;

                var buildColoursBasedOnAccountsNetIncomeList = function (accountsCashFlowList) {
                    $scope.ChartColours = [];
                    var accountTypes = _.uniq(_.map(accountsCashFlowList, function (accountCashFlow) {
                        return accountCashFlow.accountType;
                    }));
                    for (var i = 0; i < accountTypes.length; i++) {
                        var accountsForType = _.where(accountsCashFlowList, {accountType: accountTypes[i]});
                        var accountTypeColourSet = _.findWhere($scope.AccountTypesColourPalette, {accountType: accountTypes[i]}).colours;
                        var colourIndex = 0;
                        for (var ii = 0; ii < accountsForType.length; ii++) {
                            if (accountTypeColourSet.length <= colourIndex) {
                                colourIndex = 0;
                            }
                            $scope.ChartColours.push(accountTypeColourSet[colourIndex]);
                            colourIndex++;
                        }
                    }
                };

                var absoluteSumOfPropertyValues = function (array, propertyName) {
                    return _.reduce(_.pluck(array, propertyName), function (memo, num) {
                        return memo + Math.abs(num);
                    }, 0);
                };

                var buildChartData = function (accountsCashFlowList) {
                    $scope.ChartData = _.map(accountsCashFlowList, function (accountCashFlow) {
                        return {
                            label: accountCashFlow.name,
                            value: absoluteSumOfPropertyValues(accountCashFlow.netIncome, $scope.cashflowPropertyMapping)
                        };
                    });
                };

                var buildCashflowData = function (accountsCashFlowList) {
                    $scope.CashflowData = [];
                    for (var i = 0; i < accountsCashFlowList.length; i++) {
                        $scope.CashflowData.push({
                            name: accountsCashFlowList[i].name,
                            amount: absoluteSumOfPropertyValues(accountsCashFlowList[i].netIncome, $scope.cashflowPropertyMapping),
                            colour: $scope.ChartColours[i].color
                        });
                    }
                };

                var setFromMonth = function (accountsCashFlowList) {
                    var allNetIncomeObjects = _.flatten(_.map(accountsCashFlowList, function (accountCashflow) {
                        return accountCashflow.netIncome;
                    }));
                    var monthsInNetIncomeObjects = _.map(allNetIncomeObjects, function (netIncome) {
                        return netIncome.Month.MonthOfYear;
                    });
                    $scope.FromMonth = _.isEmpty(monthsInNetIncomeObjects) ? 0 : _.min(monthsInNetIncomeObjects);
                };

                var setCashflowTotal = function (accountsCashFlowList) {
                    $scope.CashflowTotal = _.reduce(_.map(accountsCashFlowList, function (accountCashFlow) {
                        return absoluteSumOfPropertyValues(accountCashFlow.netIncome, $scope.cashflowPropertyMapping);
                    }), function (memo, num) {
                        return memo + Math.abs(num);
                    }, 0);
                };

                $scope.ChartColours = [];
                $scope.FromMonth = 0;
                $scope.ChartData = [];
                $scope.CashflowData = [];
                $scope.CashflowTotal = 0;
                $scope.initialiseAccountsCashflows = function () {
                    $scope.ErrorOccurred = false;
                    MenigaNetIncomeService.getAccountsCashflows($scope.personalFinanceManagementId, $scope.accounts).then(function (response) {
                        var accountCashFlowsSortedByAccountType = _.sortBy(_.filter(response.accountCashFlow, function (accountCashFlow) {
                            return accountCashFlow.netIncome.length > 0;
                        }), 'accountType');
                        buildColoursBasedOnAccountsNetIncomeList(accountCashFlowsSortedByAccountType);
                        buildChartData(accountCashFlowsSortedByAccountType);
                        buildCashflowData(accountCashFlowsSortedByAccountType);
                        setFromMonth(accountCashFlowsSortedByAccountType);
                        setCashflowTotal(accountCashFlowsSortedByAccountType);
                    }, function (error) {
                        $scope.ErrorOccurred = true;
                        $scope.errorMessage = error.message;
                    });
                };
            }
        } : { };
    });
})(angular.module('refresh.accountSummary.accountsCashflowsChart', ['refresh.filters']));