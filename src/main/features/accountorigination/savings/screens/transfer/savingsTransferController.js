(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.savings.screens.transfer',
        ['refresh.accountOrigination.savings.domain.savingsAccountApplication', 'refresh.flow']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/apply/:productName/transfer', {
                templateUrl: 'features/accountorigination/savings/screens/transfer/partials/savingsTransfer.html',
                controller: 'SavingsTransferController',
                safeReturn: '/apply/savings-and-investments'
            });
    });

    app.controller('SavingsTransferController', function ($scope, $routeParams, Flow, $location, accountLabelFilter, Card, AccountsService,
                                                          ErrorMessages, TransferLimitsService, SavingsAccountApplication) {
        $scope.ProductName = SavingsAccountApplication.productName();
        $scope.AdditionalInformation = SavingsAccountApplication.transferPageAdditionalInformation();
        $scope.transfer = {
            amount: SavingsAccountApplication.initialDepositAmount() || SavingsAccountApplication.minimumInitialDeposit(),
            minimumAmount: SavingsAccountApplication.minimumInitialDeposit(),
            amountHints: SavingsAccountApplication.initialDepositAmountHints(),
            maximumAmount: SavingsAccountApplication.maximumInitialDeposit(),
            maximumAmountExceededMessage: SavingsAccountApplication.maximumInitialDepositExceededMessage()
        };
        $scope.errorMessage = undefined;
        $scope.limitsService = new TransferLimitsService();

        AccountsService.list(Card.current())
            .then(function (accountsData) {
                $scope.cardProfile = accountsData.cardProfile;
                $scope.accounts = _.map(accountsData.accounts, function (account) {
                    account.label = function () {
                        return accountLabelFilter(account);
                    };
                    return account;
                });

                var availableAccounts = $scope.transferFromAccounts();
                var selectedAccount = SavingsAccountApplication.transferFromAccount();
                if(selectedAccount) {
                    selectedAccount = _.find(availableAccounts, function(account) {
                        return account.formattedNumber === selectedAccount.formattedNumber;
                    });
                }
                $scope.transfer.from = selectedAccount || availableAccounts[0];

                $scope.enforcer = function (value) {
                    return $scope.limitsService.enforce({
                        cardProfile: $scope.cardProfile,
                        account: $scope.transfer.from,
                        fromAccount: $scope.transfer.from,
                        amount: value,
                        minimumAmount: $scope.transfer.minimumAmount,
                        amountHints: $scope.transfer.amountHints,
                        maximumAmount: $scope.transfer.maximumAmount,
                        maximumAmountExceededMessage: $scope.transfer.maximumAmountExceededMessage,
                        toAccount: {}
                    });
                };
                $scope.highlightBalance = function () {
                    return $scope.enforcer($scope.transfer.amount).type === 'minimumLimit';
                };
            });

        $scope.proceed = function () {
            SavingsAccountApplication.setInitialDeposit({
                transferFromAccount: $scope.transfer.from,
                initialDepositAmount: $scope.transfer.amount
            });
            Flow.next();
            $location.path('/apply/' + $routeParams.productName + '/accept').replace();
        };

        $scope.depositPossible = function () {
            var min = $scope.transfer.minimumAmount;

            if ($scope.transferFromAccounts().length === 0) {
                return false;
            }

            if ($scope.transfer.from.availableBalance.amount < min) {
                return false;
            }

            if ($scope.transfer.amount < min) {
                return false;
            }

            return true;
        };

        $scope.transferFromAccounts = function () {
            var accounts = AccountsService.validTransferFromAccounts($scope.accounts);

            if (accounts.length === 0) {
                $scope.errorMessage = 'You need a current account before you can open a savings or investment account. Please visit your nearest branch';
            }

            return accounts;
        };

        $scope.$watch('transfer.from', function () {
            if (typeof($scope.transfer.from) !== 'undefined') {
                $scope.fromAvailableBalance = $scope.transfer.from.availableBalance.amount;
            }
        });

        $scope.hintWatcher = function () {
            return {
                'elements': ['transfer.amount', 'transfer.from'],
                'scope': $scope
            };
        };
    });

}());