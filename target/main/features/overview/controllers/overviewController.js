(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/overview',
            {templateUrl: 'features/overview/partials/overview.html', controller: 'OverviewController'});
    });

    app.controller('OverviewController',
        function ($scope, ApplicationParameters, DigitalId, AccountsService, Card, HomeService, AccountsValidationService, $location) {

            $scope.ActivitySince = null;
            $scope.ShowNetIncomeChart = false;
            $scope.menigaProfile = {};

            $scope.initialize = function () {
                // hasInfo is seems not required for the same purpose with newlyLinkedCardNumber
                $scope.hasInfo = ApplicationParameters.popVariable('hasInfo');
                $scope.newlyLinkedCardNumber = ApplicationParameters.popVariable('newlyLinkedCardNumber');
                var date = new Date();
                date.setDate(1);
                date.setMonth(date.getMonth() - 1);
                $scope.ActivitySince = date;
                $scope.availableProducts();
            };

            $scope.greeting = function () {
                var preferredName = DigitalId.current().preferredName;
                if ($scope.newlyLinkedCardNumber) {
                    return "Card successfully linked. Your card number is " + $scope.newlyLinkedCardNumber;
                } else {
                    return "Welcome, " + preferredName;
                }
            };

            $scope.availableProducts = function () {
                AccountsService.list(Card.current()).then(function (response) {
                    var transactionalBalance = {amount:0, hasAmount:false}, creditBalance = {amount:0, hasAmount:false},
                        loanBalance = {amount:0, hasAmount:false}, investmentBalance = {amount:0, hasAmount:false};
                    var loanTypes = ["HOME_LOAN", "TERM_LOAN", "RCP"];
                    var investmentTypes = ["SAVINGS", "NOTICE", "FIXED_TERM_INVESTMENT"];
                    _.each(response.accounts, function (originalAccount) {
                        if ('CURRENT'.indexOf(originalAccount.accountType) > -1) {
                            transactionalBalance.amount += originalAccount.availableBalance.amount;
                            transactionalBalance.hasAmount = true;
                        }
                        if ('CREDIT_CARD'.indexOf(originalAccount.accountType) > -1) {
                            creditBalance.amount += originalAccount.availableBalance.amount;
                            creditBalance.hasAmount = true;
                        }
                        if (loanTypes.indexOf(originalAccount.accountType) > -1) {
                            loanBalance.amount += originalAccount.availableBalance.amount;
                            loanBalance.hasAmount = true;
                        }
                        if (investmentTypes.indexOf(originalAccount.accountType) > -1) {
                            investmentBalance.amount += originalAccount.availableBalance.amount;
                            investmentBalance.hasAmount = true;
                        }
                    });

                    $scope.creditBalance = creditBalance;
                    $scope.transactionalBalance = transactionalBalance;
                    $scope.loanBalance = loanBalance;
                    $scope.investmentBalance = investmentBalance;

                    var validateResult = AccountsValidationService.validateInfoMessage(response.accounts);
                    $scope.infoMessage = validateResult.infoMessage;

                    $scope.menigaProfile = {
                        personalFinanceManagementId: Card.current().personalFinanceManagementId,
                        accounts: response.accounts
                    };
                }, function () {
                    $scope.errorMessage = 'An error occurred, please try again later';
                    $scope.transactionalBalance = 0;
                });
            };

            $scope.navigateToAccountSummary = function () {
                HomeService.goHome();
            };

            $scope.$on('ShowNetIncomeDoughnutChart', function () {
                $scope.ShowNetIncomeChart = true;
            });
        });
})(angular.module('refresh.overview.controller', ['refresh.accounts', 'refresh.overview', 'refresh.overview.netIncomeChart', 'refresh.common.homeService']));
