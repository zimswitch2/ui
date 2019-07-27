var menigaTransactionsHistoryFeature = false;


var viewTransactionsFeature = false;
{
    viewTransactionsFeature = true;
}

(function (app) {
    'use strict';
    app.config(function ($routeProvider) {
        if (!menigaTransactionsHistoryFeature) {
            $routeProvider.when('/statements/:formattedNumber?', {
                templateUrl: 'features/statements/partials/statement.html',
                controller: 'StatementController'
            });
        }
    }).controller('StatementController', function ($scope, $location, $routeParams, $filter, $window, AccountsService,
                                                   StatementService, Card, ErrorMessages, StatementPdfGenerator) {
        if (viewTransactionsFeature){
            $location.path('/transactions');
        }

        $scope.statementType = $location.search().statementType || 'Provisional';
        $scope.statementDate = moment();

        AccountsService.list(Card.current())
            .then(function (response) {
                $scope.selectedAccount =
                    _.find(response.accounts, {formattedNumber: $routeParams.formattedNumber}) || response.accounts[0];

                $scope.accounts = response.accounts;
                $scope.accountHolderName = $scope.selectedAccount.name || response.cardProfile.holderName;
                $scope.hasPayFromFeature = AccountsService.hasPayFromFeature($scope.selectedAccount);
                $scope.statementTypes = StatementService.getStatementTypesForAccount($scope.selectedAccount.accountType);

                return populateStatementData();
            })
            .catch(function (error) {
                $scope.hasInfo = true;
                $scope.errorMessage = ErrorMessages.messageFor(error);
            });

        function populateStatementData(pageNumber, containerName) {
            pageNumber = pageNumber || 1;
            $scope.loading = true;

            return StatementService.statement($scope.statementType, $scope.selectedAccount, pageNumber,
                containerName).then(function (statementResponse) {

                    if (pageNumber === 1 && statementResponse.statementLines.length > 0) {
                        $scope.statement = statementResponse.statementLines;

                        var firstTransaction = _.first($scope.statement);
                        $scope.openingBalance =
                        {amount: firstTransaction.runningBalance.amount - firstTransaction.amount.amount};
                        $scope.firstTransactionDate = firstTransaction.transactionDate;
                    } else if (pageNumber > 1) {
                        $scope.statement = $scope.statement.concat(statementResponse.statementLines);
                    }

                    if ($scope.statement) {
                        $scope.lastTransactionDate = _.last($scope.statement).transactionDate;
                    }

                    $scope.loading = false;

                    if (!statementResponse.morePagesIndicator || statementResponse.morePagesIndicator === 'No') {
                        $scope.retry = undefined;
                        if ($scope.statement) {
                            $scope.closingBalance = {amount: _.last($scope.statement).runningBalance.amount};
                        }
                    } else {
                        $scope.pageNumber = statementResponse.pageNumber;
                        $scope.containerName = statementResponse.containerName;
                        $scope.hasNext = true;
                    }
                }).catch(function (error) {
                    $scope.loading = false;
                    $scope.errorMessage = error.message;
                    $scope.hasInfo = true;
                    $scope.retry = function () {
                        populateStatementData(pageNumber, containerName);
                    };
                });
        }

        $scope.loadNext = function () {
            $scope.loading = true;
            $scope.hasNext = undefined;
            populateStatementData($scope.pageNumber, $scope.containerName);
        };

        $scope.viewPaymentNotificationHistory = function (formattedNumber) {
            $location.path('/payment-notification/history/' + formattedNumber);
        };

        $scope.changeAccountTo = function (formattedNumber) {
            $location.search('statementType', undefined);
            $location.path('/statements/' + formattedNumber).replace();
        };

        $scope.updateStatementType = function (statementType) {
            $location.search('statementType', statementType).replace();
        };

        $scope.downloadPdf = function () {
            var statementForPdf = $filter('statementFilter')($scope.statement, $scope.query);
            StatementPdfGenerator.downloadPdf($scope.accountHolderName,
                $scope.selectedAccount.productName + ' ' + $scope.selectedAccount.formattedNumber, $scope.firstTransactionDate,
                $scope.lastTransactionDate, $scope.openingBalance, statementForPdf, $scope.closingBalance, $scope.query);
        };
    }).filter('statementFilter', function ($filter, CustomizedFilterService) {
        return CustomizedFilterService.create([
            {path: 'narrative'},
            {path: 'runningBalance.amount', type: 'amount'},
            {path: 'amount.amount', type: 'amount'},
            {path: 'transactionDate', type: 'date'}
        ]);
    });
})(angular.module('refresh.statements', ['ngRoute', 'refresh.accounts', 'refresh.statements.services', 'refresh.errorMessages', 'refresh.filters', 'refresh.statements.pdfGenerator', 'refresh.customizedFilter']));