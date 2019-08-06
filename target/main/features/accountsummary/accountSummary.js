var personalFinanceManagementFeature = false;

var accountSharing = false;
{
    accountSharing = true;
}

var viewTransactionsFeature = false;
{
    viewTransactionsFeature = true;
}

(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/account-summary', {
            templateUrl: 'features/accountsummary/partials/accountSummary.html',
            controller: 'AccountSummaryController'
        });
        $routeProvider.when('/account-summary/:CashflowChartPropertyMapping', {
            templateUrl: 'features/accountsummary/partials/accountSummary.html',
            controller: 'AccountSummaryController'
        });
    });

    app.run(function ($rootScope, Menu, $location) {
        var accountSummaryHighlightedItems =
            [
                '/account-summary',
                '/targetedoffers/callmeback'
            ];
        var accountSummaryMenuItem = {
            title: 'Account Summary',
            url: '/account-summary',
            position: 2,
            showIf: function () {
                var isShown = false;
                accountSummaryHighlightedItems.forEach(function (item) {
                    if ($location.path().indexOf(item) > -1) {
                        isShown = true;
                    }
                });
                return isShown;
            }
        };
        // Menu.add(accountSummaryMenuItem);
    });

    app.controller('AccountSummaryController',
        function ($scope, $location, Card, AccountsService, AccountsValidationService, ApplicationParameters,
                  DigitalId, $routeParams, User, EntitlementsBeneficiaryPaymentService) {

            $scope.initialize = function () {
                $scope.newlyLinkedCardNumber = ApplicationParameters.popVariable('newlyLinkedCardNumber');
                var redirect = ApplicationParameters.getVariable('acceptInvitationRedirect');

                if (redirect) {

                    return $location.path(redirect);
                }


                $scope.CashflowChartPropertyMapping = $routeParams.CashflowChartPropertyMapping === "transactional-cash-in" ? "Income"
                    : ($routeParams.CashflowChartPropertyMapping === "transactional-cash-out" ? "Expenses" : null);
                if ($scope.CashflowChartPropertyMapping) {
                    $.scrollTo('#top', 100);
                }

                $scope.availableAccounts();

            };

            $scope.hasInfo = ApplicationParameters.getVariable('hasInfo');
            $scope.customMessage = ApplicationParameters.popVariable('customMessage');
            $scope.CashflowChartPropertyMapping = null;
            $scope.CashflowChartAnalyticsParentPage = "account summary page";

            $scope.isSuccessful = ApplicationParameters.popVariable('passwordHasChanged');

            $scope.greeting = function () {
                var preferredName = DigitalId.current().preferredName;
                var hasBusinessProfile = ApplicationParameters.popVariable('hasBusinessProfile');

                if ($scope.newlyLinkedCardNumber) {
                    if (hasBusinessProfile) {
                        return "Welcome " + preferredName + ", your business has been successfully linked to your profile";
                    } else {
                        return "Card successfully linked. Your card number is " + $scope.newlyLinkedCardNumber;
                    }
                } else {
                    return "Welcome, " + preferredName;
                }
            };

            $scope.showTransactions = function (accountNumber) {

                if (viewTransactionsFeature) {
                    $location.path('/transactions');
                    ApplicationParameters.pushVariable('transactionalAccountNumber', accountNumber);
                }
                else {
                    $location.path("/statements/" + accountNumber);
                }

            };

            $scope.hasAccounts = function (accountType) {
                if (accountType) {
                    ApplicationParameters.pushVariable('hasInfo', false);
                    return accountType.length > 0;
                }
                return false;
            };

            $scope.isCurrentDashboardCardHolder = function () {
                return User.isCurrentDashboardCardHolder();
            };

            $scope.availableAccounts = function () {
                $scope.transactionAccounts = [];
                $scope.creditCard = [];
                $scope.loans = [];
                $scope.investments = [];
                $scope.unknown = [];

                function updateAccountsArray(accountsArray, accountType, originalAccount) {
                    if (originalAccount.accountType === accountType) {
                        if (originalAccount.customName) {
                            originalAccount.productName = originalAccount.customName;
                        }
                        originalAccount.accountTypeName = AccountsService.accountTypeName(originalAccount.accountType);
                        accountsArray.push(originalAccount);
                    }
                }

                function updateAccountsArrayForMultipleAccountTypes(accountsArray, arrayAccountTypes, originalAccount) {
                    if (arrayAccountTypes.indexOf(originalAccount.accountType) > -1) {
                        if (originalAccount.customName) {
                            originalAccount.productName = originalAccount.customName;
                        }
                        originalAccount.accountTypeName = AccountsService.accountTypeName(originalAccount.accountType);
                        accountsArray.push(originalAccount);
                    }
                }

                function buildMenigaProfile(card) {
                    if (personalFinanceManagementFeature && card) {
                        $scope.menigaProfile = {
                            accounts: $scope.accounts,
                            personalFinanceManagementId: card.personalFinanceManagementId
                        };
                    }
                }

                var selectedCard = Card.current();


                AccountsService.list(selectedCard).then(function (response) {
	            console.log("selectedCard : " + JSON.stringify(selectedCard));
	            console.log("selectedCard : " + selectedCard.cardNumber);
	            console.log("selectedCard : " + selectedCard.number);
                    _.each(response.accounts, function (originalAccount) {
                        var loanTypes = ["HOME_LOAN", "TERM_LOAN", "RCP"];
                        var investmentTypes = ["SAVINGS", "NOTICE", "FIXED_TERM_INVESTMENT"];

                        updateAccountsArray($scope.transactionAccounts, 'CURRENT', originalAccount);
                        updateAccountsArray($scope.creditCard, 'CREDIT_CARD', originalAccount);
                        updateAccountsArray($scope.unknown, 'UNKNOWN', originalAccount);
                        updateAccountsArrayForMultipleAccountTypes($scope.loans, loanTypes, originalAccount);
                        updateAccountsArrayForMultipleAccountTypes($scope.investments, investmentTypes,
                            originalAccount);
                    });

                    if (response.accounts) {
                        $scope.accounts = response.accounts;
                    }
                    buildMenigaProfile(selectedCard, $scope.accounts);

                    var validateResult = AccountsValidationService.validateInfoMessage($scope.accounts);
                    $scope.infoMessage = validateResult.infoMessage;


                }, function () {
                    $scope.errorMessage = 'An error occurred, please try again later';
                    $scope.accounts = [];
                });
            };

            $scope.initialize();

        });
})(angular.module('refresh.accountSummary', ['ngRoute', 'refresh.configuration', 'refresh.login', 'refresh.accounts', 'refresh.parameters',
    'refresh.accountSummary.accountsCashflowsChart']));
