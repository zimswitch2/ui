describe('Statement Transactions Controller', function () {
    'use strict';
    var scope, AccountsService, StatementService, Card, mock, applicationParameters, controller, window, userService, filter;
    var currentCard = { number: 'Some returned value'};
    var accounts = [
        {formattedNumber: '12345', number: 'account number 1'},
        {formattedNumber: '67890', number: 'account number 2'},
        {formattedNumber: '12345', number: 'account number 1', accountType: 'UNKNOWN'},
        {formattedNumber: '12345', number: 'account number 1', accountType: 'CREDIT_CARD'}
    ];
    var listAccountsResponse = {accounts: accounts};
    var $route, transactionRequest;
    var transactionsResponse = {
        statementLines: ['Some Statement Lines'],
        pageNumber: 1,
        containerName: 'Some Container From Response',
        morePagesIndicator: 'some indicator',
        numberOfDaysForReturnedTransactions: 30
    };

    beforeEach(module('refresh.statementTransactions'));

    function initializeController() {
        controller('StatementTransactionsController', {
            $scope: scope,
            AccountsService: AccountsService,
            Card: Card,
            StatementService: StatementService,
            ApplicationParameters: applicationParameters
        });
    }

    beforeEach(inject(function ($rootScope, _mock_, User, _$route_, $window, ApplicationParameters, $controller, $filter) {
        mock = _mock_;
        $route = _$route_;
        controller = $controller;
        scope = $rootScope.$new();
        applicationParameters = ApplicationParameters;
        userService = User;
        window = $window;
        filter = $filter;
        AccountsService = jasmine.createSpyObj('AccountsService', ['list']);
        AccountsService.list.and.returnValue(mock.resolve(listAccountsResponse));
        StatementService = jasmine.createSpyObj('StatementService', ['getTransactions']);
        StatementService.getTransactions.and.returnValue(mock.resolve(transactionsResponse));
        spyOn(userService, 'principalForCurrentDashboard');

        userService.principalForCurrentDashboard.and.returnValue({
            systemPrincipalIdentifier: {
                systemPrincipalId: 1
            }});
        Card = jasmine.createSpyObj('Card', ['current']);

        Card.current.and.returnValue(currentCard);
        initializeController();

        transactionRequest = {
            account: accounts[0], statementType: "Provisional", pageNumber: 1, containerName: 'PA04004693344621',
            morePagesIndicator: 'Yes', firstLoad: true, transactionHistoryToggle: true
        };

        scope.numberOfDays = transactionRequest.statementType;
        scope.containerName = transactionRequest.containerName;
        scope.pageNumber = transactionRequest.pageNumber;
        scope.morePagesIndicator = transactionRequest.morePagesIndicator;
        scope.firstLoad = transactionRequest.firstLoad;
        scope.transactionHistoryToggle = transactionRequest.transactionHistoryToggle;

        scope.$digest();
    }));

    [{className: 'currency negative', amount: -1}, {
        className: 'currency positive',
        amount: 1
    }].forEach(function (classAmount) {
        describe('', function () {

            it('should return the correct class for a given amount', function () {
                var clazz = scope.amountClass(classAmount.amount);
                expect(clazz).toEqual(classAmount.className);
            });
        });
    });

    describe('on initialisation', function () {
        it('first load and seletedNumberOfDays should be set', function () {
            initializeController();
            expect(scope.firstLoad).toBeTruthy();
            scope.$digest();
            expect(scope.firstLoad).toBeFalsy();
        });

        it('the selected number of days should be 30', function () {
            expect(scope.selectedNumberOfDays).toBe(30);
        });

        it('$scope.pageNumber should have a default value of 1', function () {
            expect(scope.pageNumber).toBe(1);
        });

        it('should set current date to $scope.statementDate', function () {
            applicationParameters.pushVariable('latestTimestampFromServer',  moment('12 May 2016'));
            initializeController();
            expect(scope.statementDate).toEqual('12 May 2016');
        });

        it('should call account service list with the card and call getTransactions setting the first load to false', function () {
            expect(AccountsService.list).toHaveBeenCalledWith(currentCard);
            scope.$digest();
            expect(StatementService.getTransactions).toHaveBeenCalled();
            expect(scope.firstLoad).toBe(false);
        });

        it('should populate scope.accounts with the retrieved accounts', function () {
            expect(scope.accounts).toEqual([accounts[0], accounts[1], accounts[3]]);
        });

        describe('when we call getTransactions', function () {
            it('should get transactions for the first account when the transactionalAccountNumber is not set in the ApplicationParameters',
                function () {

                    scope.getTransactions();
                    var request = {
                        numberOfDays: transactionRequest.statementType,
                        account: accounts[0],
                        pageNumber: transactionRequest.pageNumber,
                        containerName: transactionRequest.containerName,
                        firstLoad: true,
                        pagingRequired: true,
                        morePagesIndicator: transactionRequest.morePagesIndicator,
                        dateFrom: undefined,
                        dateTo: undefined,
                        currentDate: 2016
                    };
                    expect(StatementService.getTransactions).toHaveBeenCalledWith(request);
                    expect(scope.selectedAccount).toEqual(scope.accounts[0]);
                });

            it('should get transactions for the specified account number in the ApplicationParameters and make it the selected account number', function () {
                var accountNumber = accounts[1].formattedNumber;
                applicationParameters.pushVariable('transactionalAccountNumber', accountNumber);
                scope.numberOfDays = 'Provisional';

                initializeController();

                scope.getTransactions();

                var request = {
                    numberOfDays: transactionRequest.statementType,
                    account: accounts[1],
                    pageNumber: transactionRequest.pageNumber,
                    containerName: 'Some Container From Response',
                    firstLoad: true,
                    pagingRequired: true,
                    morePagesIndicator: 'some indicator',
                    dateFrom: undefined,
                    dateTo: undefined,
                    currentDate: 2016
                };
                expect(StatementService.getTransactions.calls.mostRecent().args[0]).toEqual(request);
                expect(scope.selectedAccount).toEqual(accounts[1]);
            });

            it('should get transactions for the first account when the account number on the $routeParams is not in the list of user accounts',
                function () {
                    applicationParameters.pushVariable('transactionalAccountNumber', 'Some Non Existent Account number');
                    initializeController();
                    scope.getTransactions();
                    var request = {
                        numberOfDays: transactionRequest.statementType,
                        account: accounts[0],
                        pageNumber: transactionRequest.pageNumber,
                        containerName: transactionRequest.containerName,
                        firstLoad: true,
                        pagingRequired: true,
                        morePagesIndicator: transactionRequest.morePagesIndicator,
                        dateFrom: undefined,
                        dateTo: undefined,
                        currentDate: 2016
                    };

                    expect(StatementService.getTransactions).toHaveBeenCalledWith(request);
                });

        });

        it('should set the retrieved transactions among other things from getTransactions on the scope', function () {
            scope.getTransactions();
            scope.$digest();
            expect(scope.transactions).toBe(transactionsResponse.statementLines);
            expect(scope.morePagesIndicator).toEqual(transactionsResponse.morePagesIndicator);
            expect(scope.containerName).toEqual(transactionsResponse.containerName);
            expect(scope.pageNumber).toEqual(transactionsResponse.pageNumber);

        });


        [30, 60, 90, 180, undefined, null].forEach(function (numberOfDays) {
            it('should set the number of days on the scope from the transactions response', function () {
                transactionsResponse.numberOfDaysForReturnedTransactions = numberOfDays;
                scope.firstLoad = true;
                scope.getTransactions();
                scope.$digest();
                expect(scope.selectedNumberOfDays).toEqual(numberOfDays);

            });
        });


        [null, undefined, []].forEach(function (statementLines) {
            it('should have a message that says there is no transactions for the period when there are no statement lines on the response',
                function () {
                    transactionsResponse.statementLines = statementLines;
                    scope.getTransactions();
                    scope.$digest();
                    expect(scope.message).toEqual('No transactions during this period');
                });
        });

        it('should set the error message and other variables if there is an error when calling the service', function () {
            StatementService.getTransactions.and.returnValue(mock.reject('error'));
            scope.getTransactions();
            scope.$digest();
            expect(scope.errorMessage).toEqual('error');
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.loadMore).toBeFalsy();
            expect(scope.loadingPaginated).toBeFalsy();
            expect(scope.transactions).toEqual([]);
            expect(scope.retryToLoadTransaction).toBeTruthy();
            expect(scope.retry).toBeTruthy();
        });

        it('should retry when there is a service error', function () {
            StatementService.getTransactions.calls.reset();
            StatementService.getTransactions.and.returnValue(mock.resolve({
                pageNumber: 2,
                statementLines: 'Some Statement Lines'
            }));
            initializeController();
            scope.retry();
            expect(scope.errorMessage).toBeUndefined();
            expect(scope.retryToLoadTransaction).toBeFalsy();
            expect(scope.spinnerActive).toBeTruthy();
            scope.$digest();
            expect(StatementService.getTransactions.calls.mostRecent().args).toEqual([{
                numberOfDays: 'Provisional', firstLoad: true, pageNumber: 1, containerName: 'Some Container From Response',
                account: { formattedNumber: '12345', number: 'account number 1' },
                pagingRequired: true, morePagesIndicator: 'some indicator', dateFrom: undefined, dateTo: undefined, currentDate: 2016 }]);
        });
    });

    describe('get transactions for last', function () {
        it('should set values on getting transactions', function () {
            scope.getTransactionForTheLast(90);
            expect(scope.firstLoad).toBeFalsy();
            expect(scope.transactions.length).toEqual(0);
            expect(scope.selectedNumberOfDays).toEqual(90);
            expect(scope.numberOfDays).toEqual('Ninety');
            expect(scope.spinnerActive).toBe(true);
            expect(scope.pageNumber).toBe(1);
            expect(scope.loadMore).toBeFalsy();
        });

        it('should set selected number of day on credit card and first load', function () {
            initializeController();
            scope.selectedAccount = {formattedNumber: '12345', number: 'account number 1', accountType: 'CREDIT_CARD'};
            scope.getTransactionForTheLast(30);
            expect(scope.selectedNumberOfDays).toBe(30);
        });
    });

    describe('Calling is active ', function () {
        it('whichever number of days passed should be active', function () {
            scope.selectedNumberOfDays = 'To be some number';
            expect(scope.isActive('To be some number')).toBe(true);
        });
    });

    describe('When calling getTransactions', function () {
        beforeEach(function () {
            scope.transactions = ['1'];
        });

        it('should concatenate the list of transactions if it is not the first page', function () {
            StatementService.getTransactions.and.returnValue(mock.resolve({
                pageNumber: 2,
                statementLines: 'Some Statement Lines'
            }));
            scope.getTransactions();
            scope.$digest();
            expect(scope.transactions).toEqual(['1', 'Some Statement Lines']);

        });

        it('should show a message for having more than 2500 transactions if we are on page 10 and the morePagesIndicator is true', function () {
            StatementService.getTransactions.and.returnValue(mock.resolve({pageNumber: 10, morePagesIndicator: 'Yes'}));
            scope.getTransactions();
            scope.$digest();
            expect(scope.message).toEqual('You have reached the maximum number of transactions that can be displayed.');
        });


        it('should set loadMore to true on the scope if morePagesIndicator is Yes and pageNumber is not 10', function () {
            StatementService.getTransactions.and.returnValue(mock.resolve({pageNumber: 3, morePagesIndicator: 'Yes'}));
            scope.getTransactions();
            scope.$digest();
            expect(scope.loadMore).toEqual(true);
        });

        it('should set loadMore to false on the scope if morePagesIndicator is No', function () {
            StatementService.getTransactions.and.returnValue(mock.resolve({morePagesIndicator: 'No'}));
            scope.getTransactions();
            scope.$digest();
            expect(scope.loadMore).toEqual(false);
        });

        it('should set loadMore to false on the scope if the pageNumber is greater than or equal to 10', function () {
            StatementService.getTransactions.and.returnValue(mock.resolve({pageNumber: 10}));
            scope.getTransactions();
            scope.$digest();
            expect(scope.loadMore).toEqual(false);
        });
    });

    describe('on print', function () {
        it('should call $window.print on printing', function () {
            spyOn(window, 'print');
            scope.print();
            expect(window.print).toHaveBeenCalled();
        });
    });

    describe('on load more transactions', function(){
        beforeEach(function () {
            scope.transactions = [{transactionDate: "2016-01-01T22:15:00.000+0000"}, {'transactionDate': "2016-01-02T22:15:00.000+0000"}];
        });


        it('should load more transactions', function(){
            StatementService.getTransactions.and.returnValue(mock.resolve({
                pageNumber: 2,
                statementLines: [{transactionDate: "2016-01-04T22:15:00.000+0000"},{transactionDate: "2016-01-05T22:15:00.000+0000"}]
            }));

            scope.loadMoreTransactions();
            expect(scope.loadingPaginated).toBeTruthy();
            expect(scope.loadMore).toBeFalsy();
            scope.$digest();
            expect(scope.transactions).toEqual([
                {transactionDate: "2016-01-01T22:15:00.000+0000"},
                {'transactionDate': "2016-01-02T22:15:00.000+0000"},
                {transactionDate: "2016-01-04T22:15:00.000+0000"},
                {transactionDate: "2016-01-05T22:15:00.000+0000"}]);
        });
    });

    describe('service error on retrieving accounts', function () {
        it('should set error message', function () {
            AccountsService.list.and.returnValue(mock.reject("error"));
            initializeController();
            scope.$digest();
            expect(scope.errorMessage).toEqual('We are experiencing technical problems. Please try again later');
            expect(scope.spinnerActive).toBeFalsy();
        });
    });

    describe('on changing an account or statement type ', function () {
        it('should update the transactions by calling Statement.getTransactions with the selected account', function () {
            scope.selectedAccount = accounts[1];
            scope.updateTransactions();
            expect(scope.firstLoad).toBeFalsy();
            expect(scope.transactions.length).toEqual(0);
            expect(scope.selectedNumberOfDays).toBe(30);
            expect(scope.numberOfDays).toEqual('Thirty');
            expect(scope.pageNumber).toBe(1);
            expect(scope.spinnerActive).toBeTruthy();
            expect(scope.hasInfo).toBeFalsy();
            expect(scope.errorMessage).toBeUndefined();
            expect(scope.retryToLoadTransaction).toBeFalsy();
            scope.$digest();
            expect(StatementService.getTransactions.calls.mostRecent().args[0].account).toEqual(scope.selectedAccount);
            expect(scope.spinnerActive).toBeFalsy();
            expect(scope.loadingPaginated).toBeFalsy();
            expect(scope.errorMessage).toBeUndefined();
            expect(scope.selectedNumberOfDays).toBe(30);
        });
    });

    describe('on changing an account to credit card or home', function () {
        it('should update transactions and set selected account to 30 for credit card', function () {
            scope.selectedAccount = {formattedNumber: '12345', number: 'account number 1', accountType: 'CREDIT_CARD'};
            scope.updateTransactions();
            expect(scope.isCreditCardOrHomeLoan).toBeTruthy();
            expect(scope.firstLoad).toBeFalsy();
            scope.$digest();
            expect(scope.selectedNumberOfDays).toBe(30);
        });

        it('should update transactions and set selected account to 30 for home loan when on first load', function () {
            scope.selectedAccount = {formattedNumber: '12345', number: 'account number 1', accountType: 'HOME_LOAN'};
            scope.updateTransactions();
            expect(scope.isCreditCardOrHomeLoan).toBeTruthy();
            scope.$digest();
            expect(scope.selectedNumberOfDays).toBe(30);
        });
    });

    describe('config', function () {
        describe('config', function () {
            it('should have the correct template and correct controller name', function () {
                expect($route.routes['/transactions'].templateUrl).toEqual('features/statementTransactions/partials/statementTransactions.html');
                expect($route.routes['/transactions'].controller).toEqual('StatementTransactionsController');
            });

            it('should load the correct modules to inject the  required services',
                inject(function (StatementService, Card, AccountsService) {
                    expect(StatementService).toBeDefined();
                    expect(Card).toBeDefined();
                    expect(AccountsService).toBeDefined();
                }));
        });
    });


    describe('transaction filter', function () {
        var statementLines;
        beforeEach(function () {
            statementLines = [
                {
                    amount: {amount: 9.90},
                    transactionStatementNarrative: 'one line transaction',
                    runningBalance: {amount: -9217.90}
                },
                {
                    amount: {amount: -2000.33},
                    narrative: 'another line 9',
                    runningBalance: {amount: 3333333.00}
                }
            ];
        });
        it('should filter transactions by statement narrative ', function () {
            expect(filter('statementTransactionFilter')(statementLines, 'one line transaction')).toEqual([statementLines[0]]);
        });

        it('should filter transactions by statement amount', function () {
            expect(filter('statementTransactionFilter')(statementLines, '9.90')).toEqual([statementLines[0]]);
            expect(filter('statementTransactionFilter')(statementLines, '2000')).toEqual([statementLines[1]]);
        });

        it('should filter transactions by running balance', function () {
            expect(filter('statementTransactionFilter')(statementLines, '921')).toEqual([statementLines[0]]);
            expect(filter('statementTransactionFilter')(statementLines, '333')).toEqual([statementLines[1]]);
        });
    });

    describe('download', function () {

        describe('when calling setDownload', function () {
            beforeEach(function () {
                scope.selectedNumberOfDays = 30;
                scope.setDownload();
                scope.$digest();
            });
            
            it('should set the download url', function () {
                expect(scope.downloadUrl).toEqual('/sbg-ib/rest/StatementService/DownloadInformalStatementInCsv');
            });

            it('should set showDropdown to true', function () {
                expect(scope.dropDown.showDropdown).toBeTruthy();
            });

            it('should set download options', function () {
                expect(scope.downloadStatementTransactionOptions).toBeDefined();
            });

            it('should set card number as the first download transaction statement option', function () {
                expect(scope.downloadStatementTransactionOptions[0]).toEqual({
                    name: 'cardNumber',
                    value: currentCard.number
                });
            });

            it('should set account number as the second download transaction statement option', function () {
                expect(scope.downloadStatementTransactionOptions[1]).toEqual({
                    name: 'formattedNumber',
                    value: accounts[0].formattedNumber
                });
            });
            
            it('should set informalStatementType as the third download transaction statement option', function () {
                expect(scope.downloadStatementTransactionOptions[2]).toEqual({
                    name: 'informalStatementType',
                    value: 'Thirty'
                });
            });
            
            it('should set dateFrom as the fourth download transaction statement option', function () {
                expect(scope.downloadStatementTransactionOptions[3]).toEqual({
                    name: 'dateFrom',
                    value: ''
                });
            });

            it('should set dateTo as the firth download transaction statement option', function () {
                expect(scope.downloadStatementTransactionOptions[4]).toEqual({
                    name: 'dateTo',
                    value: ''
                });
            });


            it('should set system principal id', function () {
                expect(scope.downloadStatementTransactionOptions[5]).toEqual({
                    name: 'systemPrincipalId',
                    value: 1
                });
            });
        });

        describe('when calling setDownload without selectedNumberOfDays set', function () {
            beforeEach(function () {
                scope.selectedNumberOfDays = null;
                scope.setDownload();
                scope.$digest();
            });

            it('should set informalStatementType to Thirty when selectedNumberOfDays is null', function () {
                expect(scope.downloadStatementTransactionOptions[2]).toEqual({
                    name: 'informalStatementType',
                    value: 'Thirty'
                });
            });

            it('should set showDropdown to true', function () {
                scope.setDownload();
                scope.$digest();
                expect(scope.dropDown.showDropdown).toBeTruthy();
            });
        });
    });
});