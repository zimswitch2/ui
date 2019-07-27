angular.module('refresh.statementTransactions',
    [
        'refresh.statements.services',
        'refresh.accounts',
        'refresh.security.user',
        'refresh.customizedFilter'
    ])
    .controller('StatementTransactionsController', function ($scope, $window, AccountsService, Card, StatementService,
                                                             ApplicationParameters, URL, User) {

        $scope.searchFilter = {
            filterText: ''
        };

        var otherAccountTypes = ['HOME_LOAN', 'CREDIT_CARD'];
        var statementTypes = [
            {value: 'Thirty', description: '30'},
            {value: 'Sixty', description: '60'},
            {value: 'Ninety', description: '90'},
            {value: 'OneHundredEighty', description: '180'}
        ];

        var accountNumberFromAccountSummary = ApplicationParameters.popVariable('transactionalAccountNumber');
        var latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');

        $scope.retryToLoadTransaction = false;
        $scope.spinnerActive = true;
        $scope.pageNumber = 1;
        $scope.firstLoad = true;
        $scope.statementDate = latestTimestampFromServer && latestTimestampFromServer.format('D MMMM YYYY');
        $scope.dropDown = {
            showDropdown : false
        };

        $scope.isActive = function (numberOfDays) {
            return numberOfDays === $scope.selectedNumberOfDays;
        };

        $scope.amountClass = function (amount) {
            if (amount < 0.0) {
                return 'currency negative';
            }
            return 'currency positive';
        };

        AccountsService.list(Card.current()).then(function (response) {
            $scope.accounts = _.filter(response.accounts, function (account) {
                return !_.isEqual(account.accountType, "UNKNOWN");
            });
            $scope.getTransactions();
        }).catch(function () {
            $scope.errorMessage = 'We are experiencing technical problems. Please try again later';
            $scope.spinnerActive = false;
        });

        function findAccountForAccountNumber(accountNumber) {
            return (_.find($scope.accounts, {formattedNumber: accountNumber}));
        }

        function getYearFromLastTransaction(){
            var lastStatementLine = _.last($scope.transactions);
            if (lastStatementLine && lastStatementLine.transactionDate){
                return moment(lastStatementLine.transactionDate).year();
            }
            return moment(latestTimestampFromServer).year();
        }

        $scope.updateTransactions = function () {
            updateViewWithCorrectValues();
            $scope.firstLoad = false;
            $scope.numberOfDays = _.find(statementTypes, {description: $scope.selectedNumberOfDays.toString()}).value;
            $scope.retryToLoadTransaction = false;
            $scope.errorMessage = undefined;
            populateTransactions($scope.selectedAccount);
        };

        $scope.getTransactions = function () {
            if (!accountNumberFromAccountSummary || !findAccountForAccountNumber(accountNumberFromAccountSummary)) {
                $scope.selectedAccount = $scope.accounts[0];
                populateTransactions($scope.accounts[0]);
            }
            else {
                $scope.selectedAccount = findAccountForAccountNumber(accountNumberFromAccountSummary);
                populateTransactions(findAccountForAccountNumber(accountNumberFromAccountSummary));
            }
        };


        $scope.getTransactionForTheLast = function (number) {
            updateViewWithCorrectValues(number);
            $scope.loadMore = false;
            $scope.numberOfDays = _.find(statementTypes, {description: number.toString()}).value;
            populateTransactions($scope.selectedAccount);
        };
        function populateTransactions(account) {
            var transactionRequest = {
                numberOfDays: $scope.numberOfDays,
                firstLoad: $scope.firstLoad,
                pageNumber: $scope.pageNumber,
                containerName: $scope.containerName,
                account: account,
                pagingRequired: true,
                morePagesIndicator: $scope.morePagesIndicator,
                dateFrom: $scope.dateFrom,
                dateTo: $scope.dateTo,
                currentDate: getYearFromLastTransaction()
            };

            $scope.accountHolderName = account.name;
            $scope.isCreditCardOrHomeLoan = _.indexOf(otherAccountTypes, account.accountType) !== -1;

            if($scope.isCreditCardOrHomeLoan && $scope.firstLoad) {
                $scope.selectedNumberOfDays = 30;
            }

            return StatementService.getTransactions(transactionRequest)
                .then(function (transactionResponse) {
                    if ($scope.transactions && transactionResponse.pageNumber > 1) {
                        $scope.transactions = $scope.transactions.concat(transactionResponse.statementLines);
                    }
                    else {
                        $scope.transactions = transactionResponse.statementLines;
                    }

                    setScope(transactionResponse);
                    $scope.spinnerActive = false;
                    $scope.loadingPaginated = false;
                    $scope.errorMessage = undefined;
                    $scope.retryToLoadTransaction = false;

                    if(_.first($scope.transactions) && _.last($scope.transactions)) {
                        $scope.firstTransactionDate =_.last($scope.transactions).transactionDate;
                        $scope.lastTransactionDate =_.first($scope.transactions).transactionDate;
                    }
                }).catch(function (error) {
                    $scope.spinnerActive = false;
                    $scope.loadMore = false;
                    $scope.loadingPaginated = false;
                    $scope.transactions = [];
                    $scope.errorMessage = error;
                    $scope.retryToLoadTransaction = true;
                });
        }

        $scope.retry = function () {
            $scope.errorMessage = undefined;
            $scope.retryToLoadTransaction = false;
            $scope.spinnerActive = true;
            populateTransactions($scope.selectedAccount);
        };

        $scope.loadMoreTransactions = function() {
            $scope.loadingPaginated = true;
            $scope.loadMore = false;
            populateTransactions($scope.selectedAccount);
        };

        $scope.print = function () {
            $window.print();
        };

        function updateViewWithCorrectValues(number) {
            $scope.selectedNumberOfDays = number || 30;
            $scope.transactions = [];
            $scope.spinnerActive = true;
            $scope.pageNumber = 1;
            $scope.hasInfo = false;
        }

        function setScope(transactionResponse) {
            $scope.morePagesIndicator = transactionResponse.morePagesIndicator;
            $scope.containerName = transactionResponse.containerName;
            $scope.pageNumber = transactionResponse.pageNumber;
            if ($scope.firstLoad && !$scope.isCreditCardOrHomeLoan) {
                $scope.selectedNumberOfDays = transactionResponse.numberOfDaysForReturnedTransactions;
            }

            $scope.firstLoad = false;

            if (transactionResponse.pageNumber !== 10 && transactionResponse.morePagesIndicator === 'Yes') {
                $scope.loadMore = true;
            }
            else {
                $scope.loadMore = false;
            }

            if (!transactionResponse.statementLines || transactionResponse.statementLines.length === 0) {
                $scope.message = 'No transactions during this period';
            }

            if ($scope.morePagesIndicator && $scope.pageNumber === 10) {
                $scope.hasInfo = true;
                $scope.message = 'You have reached the maximum number of transactions that can be displayed.';
            }
        }

        $scope.setDownload = function () {
            var selectedNumberOfDays =
                ($scope.selectedNumberOfDays) ? $scope.selectedNumberOfDays.toString() : '30';
            $scope.dropDown.showDropdown = true;
            $scope.downloadUrl = URL.downloadInformalStatementInCsv;
            $scope.downloadStatementTransactionOptions = [
                {
                    name: 'cardNumber',
                    value: Card.current().number
                },
                {
                    name: 'formattedNumber',
                    value: $scope.selectedAccount.formattedNumber
                },
                {
                    name: 'informalStatementType',
                    value: _.find(statementTypes, {description: selectedNumberOfDays }).value
                },
                {
                    name: 'dateFrom',
                    value: ''
                },
                {
                    name: 'dateTo',
                    value: ''
                },
                {
                    name: 'systemPrincipalId',
                    value: User.principalForCurrentDashboard().systemPrincipalIdentifier.systemPrincipalId
                }
            ];
            
        };

    }).filter('statementTransactionFilter', function ($filter, CustomizedFilterService) {
        return CustomizedFilterService.create([
            {path: 'transactionStatementNarrative'},
            {path: 'runningBalance.amount', type: 'amount'},
            {path: 'amount.amount', type: 'amount'}
        ]);
        
    }).config(function ($routeProvider) {
    $routeProvider.when('/transactions', {
        templateUrl: 'features/statementTransactions/partials/statementTransactions.html',
        controller: 'StatementTransactionsController'
    });
});