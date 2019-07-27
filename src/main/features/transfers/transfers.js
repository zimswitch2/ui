(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/transfers',
            {templateUrl: 'features/transfers/partials/transfer.html', controller: 'TransfersController'});
    });

    app.factory('TransferService', function ($q, ServiceEndpoint, AccountsService, Card) {
        return {
            transferPossible: function () {
                return AccountsService.list(Card.current()).then(function (accountsData) {
                    var accounts = accountsData.accounts;
                    var transferFromAccounts = AccountsService.validTransferFromAccounts(accounts);
                    var transferToAccounts = AccountsService.validTransferToAccounts(accounts);

                    return transferFromAccounts.length > 0 && transferToAccounts.length > 0 && !(transferFromAccounts.length === 1 && transferToAccounts.length === 1 &&
                        transferFromAccounts[0] === transferToAccounts[0]);
                });
            },

            transfer: function (transferObject) {
                AccountsService.clear();
                var deferred = $q.defer();
                ServiceEndpoint.transferBetweenAccounts.makeRequest(
                    {
                        "account": transferObject.from,
                        "transactions": {
                            "transfers": [
                                {
                                    "amount": {
                                        'amount': transferObject.amount,
                                        "currency": "ZAR"
                                    },
                                    "transactionId": transferObject.reference,
                                    "toAccount": transferObject.to
                                }
                            ]
                        }
                    }).then(function (response) {
                        if (response.headers('x-sbg-response-type') === "ERROR") {
                            deferred.reject({message: response.headers('x-sbg-response-message')});
                        } else {
                            deferred.resolve(response);
                        }
                        return deferred.promise;
                    },
                    function (error) {
                        deferred.reject({message: 'An error has occurred'});
                    });
                return deferred.promise;
            }
        };
    });

    app.controller('TransfersController', function ($scope, Flow, AccountsService, accountLabelFilter, Card,
                                                    TransferService, ApplicationParameters, TransferLimitsService,
                                                    ErrorMessages) {
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
        $scope.limitsService = new TransferLimitsService();
        $scope.transferPossible = false;
        $scope.initialize = function () {
            AccountsService.list(Card.current())
                .then(function (accountsData) {
                    $scope.cardProfile = accountsData.cardProfile;
                    $scope.accounts = _.map(accountsData.accounts, function (account) {
                        account.label = function () {
                            return accountLabelFilter(account);
                        };
                        return account;
                    });
                    $scope.transfer.from = $scope.transferFromAccounts()[0];
                    $scope.transfer.to = $scope.transferToAccounts()[1];
                });
            TransferService.transferPossible().then(function (value) {
                $scope.transferPossible = value;
            });
            $scope.flow = Flow.create(['Capture details', 'Confirm details'], 'Transfer between accounts');
        };

        $scope.editing = function () {
            return $scope.flow.currentStep().name === 'Capture details';
        };

        $scope.confirming = function () {
            var currentStep = $scope.flow.currentStep();
            return currentStep.name === 'Confirm details' && !currentStep.complete;
        };

        $scope.finished = function () {
            var currentStep = $scope.flow.currentStep();
            return currentStep.name === 'Confirm details' && currentStep.complete;
        };

        $scope.transfer = function () {
            TransferService.transfer($scope.transfer).then(function () {
                $scope.errorMessage = undefined;
                $scope.isSuccessful = true;
                $scope.flow.next();
            }).catch(function (error) {
                $scope.isSuccessful = false;
                $scope.errorMessage = ErrorMessages.messageFor(error);
                $scope.flow.next();
            });
        };

        $scope.$watch('transfer.from', function () {
            if (typeof($scope.transfer.from) !== 'undefined') {
                $scope.fromAvailableBalance = $scope.transfer.from.availableBalance.amount;
            }
            $scope.sameAccountChosen();
        });

        $scope.$watch('transfer.to', function () {
            if (typeof($scope.transfer.to) !== 'undefined') {
                $scope.toAvailableBalance = $scope.transfer.to.availableBalance.amount;
            }
            $scope.sameAccountChosen();
        });

        $scope.$watch('isSuccessful', function () {
            if ($scope.isSuccessful) {
                AccountsService.list(Card.current()).then(function (listAccountsResponse) {
                    $scope.fromAvailableBalance = AccountsService.availableBalanceFor(listAccountsResponse.accounts,
                        $scope.transfer.from.number);
                    $scope.toAvailableBalance = AccountsService.availableBalanceFor(listAccountsResponse.accounts,
                        $scope.transfer.to.number);
                });
            }
        });

        $scope.transferFromAccounts = function () {
            return AccountsService.validTransferFromAccounts($scope.accounts);
        };

        $scope.transferToAccounts = function () {
            return AccountsService.validTransferToAccounts($scope.accounts);
        };

        $scope.sameAccountChosen = function () {
            var fromAndToTheSame = $scope.transfer.to && $scope.transfer.from &&
                $scope.transfer.to.formattedNumber === $scope.transfer.from.formattedNumber;
            $scope.sameAccountChosenMessage = fromAndToTheSame ? 'Cannot transfer to the same account.' : '';
            return fromAndToTheSame;
        };

        $scope.proceed = function () {
            $scope.flow.next();
        };

        $scope.modify = function () {
            $scope.flow.previous();
        };

        $scope.highlightBalance = function () {
            return $scope.enforcer($scope.transfer.amount).type === 'availableBalanceExceeded';
        };

        $scope.enforcer = function (value) {
            return $scope.limitsService.enforce({
                cardProfile: $scope.cardProfile,
                account: $scope.transfer.from,
                fromAccount: $scope.transfer.from,
                amount: value,
                toAccount: $scope.transfer.to
            });
        };

        $scope.hinter = function () {
            return $scope.limitsService.hint($scope.transfer.from, $scope.transfer.to);
        };

        $scope.hintWatcher = function () {
            return {
                'elements': ['transfer.amount', 'transfer.from', 'transfer.to'],
                'scope': $scope
            };
        };
    });
})(angular.module('refresh.transfers',
    ['refresh.typeahead', 'ngRoute', 'refresh.configuration', 'refresh.parameters', 'refresh.filters', 'refresh.navigation',
        'refresh.sorter', 'refresh.mcaHttp', 'refresh.transfers.limits', 'refresh.accounts', 'refresh.errorMessages']));
