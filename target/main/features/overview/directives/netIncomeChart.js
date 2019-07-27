var personalFinanceManagementFeature = false;


(function (app) {
    'use strict';

    app.directive('sbNetIncomeChart', function(MenigaNetIncomeService, $location, netIncomeChartColours) {

        return personalFinanceManagementFeature ? {
            restrict: 'E',
            templateUrl: 'features/overview/partials/netIncomeChart.html',
            replace: true,
            scope: {
                parentPageDescription: '@',
                accounts: '=',
                personalFinanceManagementId: '='
            },
            controller: function ($scope) {
                $scope.errorMessage = "";
                $scope.ErrorOccurred = false;

                $scope.FromMonth = 0;
                $scope.CashInColour = netIncomeChartColours.cashIn.color;
                $scope.CashInTextColour = netIncomeChartColours.cashInText.color;
                $scope.CashInHighlightColour = netIncomeChartColours.cashIn.highlight;
                $scope.CashOutColour = netIncomeChartColours.cashOut.color;
                $scope.CashOutTextColour = netIncomeChartColours.cashOutText.color;
                $scope.CashOutHighlightColour = netIncomeChartColours.cashOut.highlight;
                $scope.ChartColours = netIncomeChartColours.colours;

                var absoluteSumOfPropertyValues = function(array, propertyName) {
                    return _.reduce(_.pluck(array, propertyName), function (memo, num) {
                        return memo + Math.abs(num);
                    }, 0);
                };

                $scope.ShowNoTransactionalProductsPanel = false;
                $scope.ShowNetIncomeChartContainer = true;
                $scope.NetIncomeCashIn = 0;
                $scope.NetIncomeCashOut = 0;
                $scope.NetIncomeData = [];
                function currentOrCreditCardAccountsExist() {
                    return _.some($scope.accounts, function (account) {
                        return account.accountType === 'CURRENT' || account.accountType === 'CREDIT_CARD';
                    });
                }

                function getEarliestMonthNumber(netIncome) {
                    return netIncome.length === 0 ? 0 : _.min(_.map(netIncome, function (netIncome) {
                        return netIncome.Month.MonthOfYear;
                    }));
                }

                function setDisplayDataForLegend(netIncome) {
                    $scope.NetIncomeCashIn = absoluteSumOfPropertyValues(netIncome, 'Income');
                    $scope.NetIncomeCashOut = absoluteSumOfPropertyValues(netIncome, 'Expenses');
                    $scope.NetIncomeData = [{
                        label: "Cash in",
                        value: $scope.NetIncomeCashIn
                    }, {
                        label: "Cash out",
                        value: $scope.NetIncomeCashOut
                    }];
                    $scope.FromMonth = getEarliestMonthNumber(netIncome);
                }

                $scope.initialiseAccountsNetIncome = function() {
                    var relevantAccountsExist = currentOrCreditCardAccountsExist();
                    $scope.ShowNoTransactionalProductsPanel = !relevantAccountsExist;
                    $scope.ShowNetIncomeChartContainer = relevantAccountsExist;
                    if(relevantAccountsExist) {
                        $scope.ErrorOccurred = false;
                        MenigaNetIncomeService.getAccountsNetIncome($scope.personalFinanceManagementId, $scope.accounts).then(function (response) {
                            var netIncome = response.netIncome;
                            if(netIncome.length > 0) {
                                $scope.$emit('ShowNetIncomeDoughnutChart');
                            }
                            setDisplayDataForLegend(netIncome);
                        }, function (error) {
                            $scope.$emit('ShowNetIncomeDoughnutChart');
                            $scope.ErrorOccurred = true;
                            $scope.errorMessage = error.message;
                        });
                    } else {
                        $scope.$emit('ShowNetIncomeDoughnutChart');
                    }
                };

                var makeLabelUrlFriendly = function (label) {
                    return label.toLowerCase().replace(/ /g,"-");
                };

                var onCashInCashOutItemClicked = function(label){
                    if (label) {
                        $location.path('/account-summary/transactional-' + makeLabelUrlFriendly(label));
                    }
                };

                $scope.onCashInCashOutSegmentClicked = function(label){
                    $scope.$emit('trackButtonClick', $scope.parentPageDescription + ' net income chart ' + label + ' segment');
                    onCashInCashOutItemClicked(label);
                };

                $scope.onCashInCashOutLegendItemClicked = function(label){
                    $scope.$emit('trackButtonClick', $scope.parentPageDescription + ' net income chart ' + label + ' legend item');
                    onCashInCashOutItemClicked(label);
                };

                $scope.$watchCollection('accounts', function () {
                   $scope.initialiseAccountsNetIncome();
                });
            }
        } : { };
    });
})(angular.module('refresh.overview.netIncomeChart', ['refresh.filters']));