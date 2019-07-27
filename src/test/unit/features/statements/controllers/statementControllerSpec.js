describe('statements', function () {
    'use strict';
    /*global sinon:false */
    describe('routing', function () {
        var route;

        describe('When menigaTransactionsHistoryFeature is toggled off',function(){
            beforeEach(function(){
                menigaTransactionsHistoryFeature = false;
                module('refresh.statements', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.meniga');
                inject(function ($route) {
                    route = $route;
                });
            });

            describe('when a provisional statement is to be shown', function () {
                it('should use the correct controller ', function () {
                    expect(route.routes['/statements/:formattedNumber?'].controller).toEqual('StatementController');
                });

                it('should use the correct template', function () {
                    expect(route.routes['/statements/:formattedNumber?'].templateUrl).toEqual('features/statements/partials/statement.html');
                });
            });

            afterEach(function(){
                menigaTransactionsHistoryFeature = true;
            });
        });
    });

    describe('StatementController', function () {
        beforeEach(module('refresh.statements', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));
        var scope, mock, controller, accountsService, statementService, card, statementPdfGenerator, windowSpy;

        windowSpy = {navigator: {userAgent: 'Firefox'}};

        beforeEach(inject(function ($rootScope, $controller, _mock_) {
            scope = $rootScope.$new();
            controller = $controller;
            accountsService = jasmine.createSpyObj('accountsService', ['list', 'hasPayFromFeature']);
            statementService = jasmine.createSpyObj('statementService', ['statement', 'getStatementTypesForAccount']);
            card = jasmine.createSpyObj('card', ['current']);
            mock = _mock_;
            viewTransactionsFeature = false;
        }));

        function createController(accountNumber, statement) {
            var routeParams = {formattedNumber: accountNumber};
            if (statement) {
                statementService.statement.and.returnValue(mock.resolve(statement));
            }

            controller('StatementController', {
                $scope: scope,
                $routeParams: routeParams,
                AccountsService: accountsService,
                StatementService: statementService,
                Card: card,
                StatementPdfGenerator: statementPdfGenerator,
                $window: windowSpy
            });
            scope.$digest();
        }

        it('should navigate to transactions when viewTransactionsFeature is toggled on', inject(function ($location) {
            viewTransactionsFeature = true;
            controller('StatementController', {
                $scope: scope
            });
            expect($location.path()).toBe('/transactions');
        }));

        it('should set the statementType from the search params', inject(function ($location) {
            $location.search('statementType', 'someType');
            controller('StatementController', {
                $scope: scope
            });
            expect(scope.statementType).toBe('someType');
        }));

        it('should default the statementType to provisional', inject(function ($location) {
            $location.search('statementType', '');
            controller('StatementController', {
                $scope: scope
            });
            expect(scope.statementType).toBe('Provisional');
        }));

        it('should set statementDate to current date', function () {
            var now = moment('2014-11-22');
            var clock = sinon.useFakeTimers(now.toDate().getTime());
            controller('StatementController', {
                $scope: scope
            });
            expect(scope.statementDate.isSame(now)).toBeTruthy();
            clock.restore();
        });

        describe('when retrieving accounts fails', function () {
            it('should set error message', function () {
                accountsService.list.and.returnValue(mock.reject({message: 'problem'}));

                createController('123');

                expect(scope.errorMessage).toEqual('problem');
            });
        });

        describe('with invalid account number', function () {
            beforeEach(function () {
                accountsService.list.and.returnValue(mock.resolve({
                    accounts: [{formattedNumber: '98765', productName: 'ACCESSACC'}],
                    cardProfile: {holderName: 'blah'}
                }));

                createController('invalid number', {statementLines: [], morePagesIndicator: 'No'});
            });

            it('should default to first account', function () {
                expect(scope.selectedAccount.formattedNumber).toEqual('98765');
            });
        });

        describe('with no account number', function () {
            beforeEach(function () {
                accountsService.list.and.returnValue(mock.resolve({
                    accounts: [{formattedNumber: '98765', productName: 'ACCESSACC'}],
                    cardProfile: {holderName: 'blah'}
                }));

                createController('', {statementLines: [], morePagesIndicator: 'No'});
            });

            it('should default to first account', function () {
                expect(scope.selectedAccount.formattedNumber).toEqual('98765');
            });
        });

        describe('with valid account number', function () {
            var accountsResponse;
            var noStatements;

            beforeEach(function () {
                var account1 = {
                    formattedNumber: '12345',
                    accountType: 'someAccount',
                    name: 'account holder name',
                    accountFeature: [{feature: 'PAYMENTFROM', value: true}],
                    productName: 'ACCESSACC'
                };
                var account2 = {
                    formattedNumber: '67890',
                    accountType: 'someAccount',
                    accountFeature: [{feature: 'PAYMENTFROM', value: false}],
                    productName: 'ACCESSACC'
                };
                var account3 = {
                    formattedNumber: '54321',
                    accountType: 'CREDIT_CARD',
                    accountFeature: [],
                    productName: 'ACCESSACC'
                };
                var account4 = {
                    formattedNumber: '99999',
                    accountType: 'CREDIT_CARD',
                    name: 'Bob McGee',
                    accountFeature: [],
                    productName: 'ACCESSACC'

                };
                accountsResponse = {
                    accounts: [account1, account2, account3, account4],
                    cardProfile: {
                        holderName: 'T TEST'
                    }
                };
                accountsService.list.and.returnValue(mock.resolve(accountsResponse));

                noStatements = {
                    statementLines: [],
                    morePagesIndicator: 'No'
                };
            });

            it('should set accounts', function () {
                createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                expect(scope.accounts).toEqual(accountsResponse.accounts);
            });

            it('should set account holder name if it exists on the account', function () {
                createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                expect(scope.accountHolderName).toEqual(accountsResponse.accounts[0].name);
            });

            it('should set the account holder name to the card profile name if the account holder name does not exist on the account', function () {
                createController(accountsResponse.accounts[1].formattedNumber, noStatements);
                expect(scope.accountHolderName).toEqual(accountsResponse.cardProfile.holderName);
            });

            it('should set selected account', function () {
                createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                expect(scope.selectedAccount).toEqual(accountsResponse.accounts[0]);
            });

            describe('statementTypes', function () {
                it('should get statement types from the statement service', function () {
                    statementService.getStatementTypesForAccount.and.returnValue('some statement types');
                    accountsResponse.accounts[1].accountType = 'some account type';

                    createController(accountsResponse.accounts[1].formattedNumber, noStatements);

                    expect(statementService.getStatementTypesForAccount).toHaveBeenCalledWith('some account type');
                    expect(scope.statementTypes).toBe('some statement types');
                });

            });

            describe('hasPayFromFeature', function () {
                it('should find out whether the selected account has the pay from feature and expose this on the scope', function () {
                    accountsService.hasPayFromFeature.and.returnValue(true);

                    createController(accountsResponse.accounts[1].formattedNumber, noStatements);

                    expect(accountsService.hasPayFromFeature).toHaveBeenCalledWith(accountsResponse.accounts[1]);
                    expect(scope.hasPayFromFeature).toBeTruthy();
                });
            });

            it('should set loading to true before statements have loaded', inject(function ($q) {
                statementService.statement.and.returnValue($q.defer().promise);
                createController(accountsResponse.accounts[0].formattedNumber);
                expect(scope.loading).toBeTruthy();
            }));

            describe('when there are no transactions', function () {
                beforeEach(function () {
                    createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                });

                it('should set has next to false', function () {
                    expect(scope.hasNext).toBeFalsy();
                });

                it('should ask statement service for first page', function () {
                    expect(statementService.statement).toHaveBeenCalledWith('Provisional', accountsResponse.accounts[0],
                        1, undefined);
                });

                it('statement should be undefined', function () {
                    expect(scope.statement).toBeUndefined();
                });

                it('retry should be undefined', function () {
                    expect(scope.retry).toBeUndefined();
                });

                it('opening balance should be undefined', function () {
                    expect(scope.openingBalance).toBeUndefined();
                    expect(scope.showOpeningBalance).toBeFalsy();
                });

                it('closing balance should be undefined', function () {
                    expect(scope.closingBalance).toBeUndefined();
                    expect(scope.showClosingBalance).toBeFalsy();
                });

                it('last transaction date should be undefined', function () {
                    expect(scope.lastTransactionDate).toBeUndefined();
                });

                it('first transaction date should be undefined', function () {
                    expect(scope.firstTransactionDate).toBeUndefined();
                });
            });

            describe('when there is a service error on the first page', function () {
                beforeEach(function () {
                    statementService.statement.and.returnValue(mock.reject({message: 'Oops'}));
                    createController(accountsResponse.accounts[0].formattedNumber);
                });

                it('should set has next to false', function () {
                    expect(scope.hasNext).toBeFalsy();
                });

                it('statement should be undefined', function () {
                    expect(scope.statement).toBeUndefined();
                });

                it('should set the error message', function () {
                    expect(scope.errorMessage).toBe('Oops');
                });

                it('should set the retry function', function () {
                    expect(scope.retry).toBeDefined();
                });

                it('loading should be false', function () {
                    expect(scope.loading).toBeFalsy();
                });

                it('should retry with arguments for first page', function () {
                    statementService.statement.calls.reset();
                    statementService.statement.and.returnValue(mock.resolve(noStatements));
                    scope.retry();
                    scope.$digest();
                    expect(statementService.statement).toHaveBeenCalledWith('Provisional', accountsResponse.accounts[0],
                        1, undefined);
                    expect(scope.retry).toBeUndefined();
                });
            });

            describe('when there is a service error on the second page', function () {
                beforeEach(function () {
                    var page1 = [{
                        runningBalance: {
                            amount: 20
                        },
                        amount: {
                            amount: 10
                        },
                        transactionDate: '2013-02-28T10:00:00.000+0000'
                    }];
                    var page2 = [{
                        runningBalance: {
                            amount: 20
                        },
                        amount: {
                            amount: 10
                        },
                        transactionDate: '2013-03-28T10:00:00.000+0000'
                    }];
                    statementService.statement.calls.reset();
                    var counter = 0;
                    statementService.statement.and.callFake(function (statementType, account, pageNumber) {
                        counter++;
                        if (counter === 1) {
                            return mock.resolve({
                                statementLines: page1,
                                morePagesIndicator: 'Yes',
                                pageNumber: 2,
                                containerName: 'container1'
                            });
                        } else if (counter === 2) {
                            return mock.reject({message: 'Oops'});
                        } else if (counter === 3) {
                            return mock.resolve({
                                statementLines: page2,
                                morePagesIndicator: 'No',
                                pageNumber: 2,
                                containerName: ''
                            });
                        }
                        throw 'Unexpected call to provisionalStatement: Invalid pageNumber ' + pageNumber;
                    });
                    createController(accountsResponse.accounts[0].formattedNumber);
                    scope.loadNext();
                    scope.$digest();
                });

                it('should set has next to false', function () {
                    expect(scope.hasNext).toBeFalsy();
                });

                it('should set the error message', function () {
                    expect(scope.errorMessage).toBe('Oops');
                });

                it('should set the retry function', function () {
                    expect(scope.retry).toBeDefined();
                });

                it('loading should be false', function () {
                    expect(scope.loading).toBeFalsy();
                });

                it('should not set closing balance', function () {
                    expect(scope.closingBalance).toBeUndefined();
                });

                it('should retry with arguments for the second page', function () {
                    statementService.statement.calls.reset();
                    scope.retry();
                    scope.$digest();
                    expect(statementService.statement.calls.mostRecent().args).toEqual(['Provisional',
                        accountsResponse.accounts[0], 2, 'container1']);
                    expect(scope.retry).toBeUndefined();
                });
            });

            describe('when there is one page of transactions', function () {
                var statement;

                beforeEach(function () {
                    var statementLine1 = {
                        amount: {
                            amount: -2000.33
                        },
                        runningBalance: {
                            amount: 3333333.33
                        },
                        transactionDate: '2013-02-28T10:00:00.000+0000'
                    };
                    var statementLine2 = {
                        amount: {
                            amount: 9.99
                        },
                        runningBalance: {
                            amount: -9217.9
                        },
                        transactionDate: '2014-05-21T21:00:00.000+0000'
                    };
                    statement = [statementLine1, statementLine2];

                    createController(accountsResponse.accounts[0].formattedNumber, {
                        statementLines: statement,
                        morePagesIndicator: 'No'
                    });
                });

                it('should set has next to false', function () {
                    expect(scope.hasNext).toBeFalsy();
                });

                it('should only ask the service for one page', function () {
                    expect(statementService.statement.calls.count()).toBe(1);
                });

                it('should set loading to false', function () {
                    expect(scope.loading).toBeFalsy();
                });

                it('should set statement to returned transactions', function () {
                    expect(scope.statement).toEqual(statement);
                });

                it('should calculate opening balance', function () {
                    expect(scope.openingBalance.amount).toEqual(3335333.66);
                });

                it('should calculate closing balance', function () {
                    expect(scope.closingBalance.amount).toEqual(-9217.90);
                });

                it('should set the first day included in a statement', function () {
                    var firstTransactionDate = statement[0].transactionDate;
                    expect(scope.firstTransactionDate).toEqual(firstTransactionDate);
                });

                it('should set the last day included in a statement', function () {
                    var lastTransactionDate = statement[1].transactionDate;
                    expect(scope.lastTransactionDate).toEqual(lastTransactionDate);
                });
            });


            describe('when there is one page of transactions with zero opening and closing balance', function () {
                var statement;

                beforeEach(function () {
                    var statementLine1 = {
                        amount: {
                            amount: 0.00
                        },
                        runningBalance: {
                            amount: 0.00
                        },
                        transactionDate: '2013-02-28T10:00:00.000+0000'
                    };
                    var statementLine2 = {
                        amount: {
                            amount: 0.00
                        },
                        runningBalance: {
                            amount: 0.00
                        },
                        transactionDate: '2014-05-21T21:00:00.000+0000'
                    };
                    statement = [statementLine1, statementLine2];

                    createController(accountsResponse.accounts[0].formattedNumber, {
                        statementLines: statement,
                        morePagesIndicator: 'No'
                    });
                });

                it('should set statement to returned transactions', function () {
                    expect(scope.statement).toEqual(statement);
                });

                it('should calculate opening balance', function () {
                    expect(scope.openingBalance.amount).toEqual(0);
                });

                it('should calculate closing balance', function () {
                    expect(scope.closingBalance.amount).toEqual(0);
                });
            });

            describe('when there are multiple pages of transactions', function () {
                var page1transaction1, page1transaction2, page2transaction1, page2transaction2, page3transaction1, page3transaction2;

                beforeEach(function () {
                    page1transaction1 = {
                        amount: {
                            amount: -100
                        },
                        runningBalance: {
                            amount: 10000
                        },
                        transactionDate: '2014-01-01T21:00:00.000+0000'
                    };
                    page1transaction2 = {
                        amount: {
                            amount: -2000
                        },
                        runningBalance: {
                            amount: 8000
                        },
                        transactionDate: '2014-02-01T10:00:00.000+0000'
                    };
                    page2transaction1 = {
                        amount: {
                            amount: -1000
                        },
                        runningBalance: {
                            amount: 7000
                        },
                        transactionDate: '2014-03-01T21:00:00.000+0000'
                    };
                    page2transaction2 = {
                        amount: {
                            amount: -8000
                        },
                        runningBalance: {
                            amount: -1000
                        },
                        transactionDate: '2014-04-01T10:00:00.000+0000'
                    };
                    page3transaction1 = {
                        amount: {
                            amount: 3000
                        },
                        runningBalance: {
                            amount: 2000
                        },
                        transactionDate: '2014-05-01T21:00:00.000+0000'
                    };
                    page3transaction2 = {
                        amount: {
                            amount: 500
                        },
                        runningBalance: {
                            amount: 2500
                        },
                        transactionDate: '2014-06-01T10:00:00.000+0000'
                    };
                    var page1 = [page1transaction1, page1transaction2];
                    var page2 = [page2transaction1, page2transaction2];
                    var page3 = [page3transaction1, page3transaction2];

                    statementService.statement.and.callFake(function (statementType, account, pageNumber) {
                        if (pageNumber === 1) {
                            return mock.resolve({
                                statementLines: page1,
                                morePagesIndicator: 'Yes',
                                pageNumber: 2,
                                containerName: 'container'
                            });
                        } else if (pageNumber === 2) {
                            return mock.resolve({
                                statementLines: page2,
                                morePagesIndicator: 'Yes',
                                pageNumber: 3,
                                containerName: 'container'
                            });
                        } else if (pageNumber === 3) {
                            return mock.resolve({
                                statementLines: page3,
                                morePagesIndicator: 'No',
                                pageNumber: 3,
                                containerName: ''
                            });
                        }
                        throw 'Unexpected call to provisionalStatement: Invalid pageNumber ' + pageNumber;
                    });
                    createController(accountsResponse.accounts[0].formattedNumber);
                    scope.loadNext();
                    scope.$digest();
                    scope.loadNext();
                    scope.$digest();

                });

                it('should call the service for all pages', function () {
                    expect(statementService.statement).toHaveBeenCalledWith('Provisional', accountsResponse.accounts[0],
                        1, undefined);
                    expect(statementService.statement).toHaveBeenCalledWith('Provisional', accountsResponse.accounts[0],
                        2, 'container');
                    expect(statementService.statement).toHaveBeenCalledWith('Provisional', accountsResponse.accounts[0],
                        3, 'container');
                    expect(statementService.statement.calls.count()).toBe(3);
                });

                it('should set statement to all pages', function () {
                    expect(scope.statement).toEqual([page1transaction1, page1transaction2, page2transaction1,
                        page2transaction2,
                        page3transaction1, page3transaction2]);
                });

                it('should calculate opening balance based on first transaction', function () {
                    expect(scope.openingBalance.amount).toEqual(10100);
                });

                it('should set first transaction date based on first transaction', function () {
                    expect(scope.firstTransactionDate).toEqual('2014-01-01T21:00:00.000+0000');
                });

                it('should calculate closing balance based on last transaction', function () {
                    expect(scope.closingBalance.amount).toEqual(2500);
                });

                it('should set last transaction date based on last transaction', function () {
                    expect(scope.lastTransactionDate).toEqual('2014-06-01T10:00:00.000+0000');
                });
            });

            describe('when more transactions are loaded', function () {
                var page1transaction1, page1transaction2, page2transaction1, page2transaction2, page3transaction1, page3transaction2, deferred1, deferred2, deferred3, page1, page2, page3;

                beforeEach(inject(function ($q) {
                    page1transaction1 = {
                        narrative: 'match the thing',
                        amount: {
                            amount: -100
                        },
                        runningBalance: {
                            amount: 10000
                        },
                        transactionDate: '2014-01-01T21:00:00.000+0000'
                    };
                    page1transaction2 = {
                        amount: {
                            amount: -2000
                        },
                        runningBalance: {
                            amount: 8000
                        },
                        transactionDate: '2014-02-01T10:00:00.000+0000'
                    };
                    page2transaction1 = {
                        amount: {
                            amount: -1000
                        },
                        runningBalance: {
                            amount: 7000
                        },
                        transactionDate: '2014-03-01T21:00:00.000+0000'
                    };
                    page2transaction2 = {
                        narrative: 'match the thing',
                        amount: {
                            amount: -8000
                        },
                        runningBalance: {
                            amount: -1000
                        },
                        transactionDate: '2014-04-01T10:00:00.000+0000'
                    };
                    page3transaction1 = {
                        narrative: 'match the thing',
                        amount: {
                            amount: 3000
                        },
                        runningBalance: {
                            amount: 2000
                        },
                        transactionDate: '2014-05-01T21:00:00.000+0000'
                    };
                    page3transaction2 = {
                        narrative: 'adsasdasdasd',
                        amount: {
                            amount: 500
                        },
                        runningBalance: {
                            amount: 2500
                        },
                        transactionDate: '2014-06-01T10:00:00.000+0000'
                    };
                    page1 = [page1transaction1, page1transaction2];
                    page2 = [page2transaction1, page2transaction2];
                    page3 = [page3transaction1, page3transaction2];

                    deferred1 = $q.defer();
                    deferred2 = $q.defer();
                    deferred3 = $q.defer();

                    statementService.statement.and.callFake(function (statementType, account, pageNumber) {
                        if (pageNumber === 1) {
                            return deferred1.promise;
                        } else if (pageNumber === 2) {
                            return deferred2.promise;
                        } else if (pageNumber === 3) {
                            return deferred3.promise;
                        }
                        throw 'Unexpected call to provisionalStatement: Invalid pageNumber ' + pageNumber;
                    });
                    createController(accountsResponse.accounts[0].formattedNumber);
                }));

                it('should set has next to true when another page of transactions is available', function () {
                    deferred1.resolve({
                        statementLines: page1,
                        morePagesIndicator: 'Yes',
                        pageNumber: 2,
                        containerName: 'container'
                    });
                    scope.$digest();

                    expect(scope.hasNext).toBeTruthy();
                });

                it('should set has next to false when no more pages of transactions are available', function () {
                    deferred1.resolve({
                        statementLines: page1,
                        morePagesIndicator: 'No',
                        pageNumber: 2,
                        containerName: 'container'
                    });
                    scope.$digest();

                    expect(scope.hasNext).toBeFalsy();
                });

                it('should set has next to false when more pages indicator is not present (i.e. credit cards and home loans)',
                    function () {
                        deferred1.resolve({
                            statementLines: page1,
                            pageNumber: 2,
                            containerName: 'container'
                        });
                        scope.$digest();

                        expect(scope.hasNext).toBeFalsy();
                    });

                it('should set the last transaction date each time a page is loaded', function () {

                    deferred1.resolve({
                        statementLines: page1,
                        morePagesIndicator: 'Yes',
                        pageNumber: 2,
                        containerName: 'container'
                    });
                    scope.$digest();

                    expect(scope.lastTransactionDate).toEqual('2014-02-01T10:00:00.000+0000');

                    deferred2.resolve({
                        statementLines: page2,
                        morePagesIndicator: 'Yes',
                        pageNumber: 3,
                        containerName: 'container'
                    });
                    scope.loadNext();
                    scope.$digest();

                    expect(scope.lastTransactionDate).toEqual('2014-04-01T10:00:00.000+0000');

                    deferred3.resolve({
                        statementLines: page3,
                        morePagesIndicator: 'No',
                        pageNumber: 3,
                        containerName: ''
                    });
                    scope.loadNext();
                    scope.$digest();

                    expect(scope.lastTransactionDate).toEqual('2014-06-01T10:00:00.000+0000');
                });

                it('should set the closing balance only after the last page is loaded', function () {

                    deferred1.resolve({
                        statementLines: page1,
                        morePagesIndicator: 'Yes',
                        pageNumber: 2,
                        containerName: 'container'
                    });
                    scope.$digest();

                    expect(scope.closingBalance).toBeUndefined();

                    deferred2.resolve({
                        statementLines: page2,
                        morePagesIndicator: 'Yes',
                        pageNumber: 3,
                        containerName: 'container'
                    });
                    scope.loadNext();
                    scope.$digest();

                    expect(scope.closingBalance).toBeUndefined();

                    deferred3.resolve({
                        statementLines: page3,
                        morePagesIndicator: 'No',
                        pageNumber: 3,
                        containerName: ''
                    });
                    scope.loadNext();
                    scope.$digest();

                    expect(scope.closingBalance.amount).toEqual(2500);
                });

            });

            describe('changeAccountTo', function () {
                it('should change account being viewed upon changing select box', inject(function ($location) {
                    createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                    scope.changeAccountTo('12345-0');
                    expect($location.path()).toEqual('/statements/12345-0');
                }));

                it('should reset the statementType search parameter', inject(function ($location) {
                    createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                    $location.search('statementType', 'someStatementType');
                    scope.changeAccountTo('12345-0');
                    expect($location.search().statementType).toBeUndefined();
                }));
            });

            describe('viewPaymentNotificationHistory', function () {
                it('should redirect to payment confirmation history page for the given account',
                    inject(function ($location) {
                        createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                        scope.viewPaymentNotificationHistory('12345');
                        expect($location.path()).toEqual('/payment-notification/history/12345');
                    }));
            });

            describe('updateStatementType', function () {
                it('should update the search params', inject(function ($location) {
                    createController(accountsResponse.accounts[0].formattedNumber, noStatements);
                    scope.updateStatementType('SomeType');
                    expect($location.search().statementType).toBe('SomeType');
                }));
            });

            describe('downloadPdf', function () {

                beforeEach(function () {
                    statementPdfGenerator = jasmine.createSpyObj('statementPdfGenerator', ['downloadPdf']);
                    scope.lastTransactionDate = '22 November 2014';
                    scope.firstTransactionDate = '22 December 2014';
                    scope.openingBalance = {amount:23};
                    scope.statement = [{
                        transactionDate: '22 December 2014',
                        narrative: 'narrative',
                        amount: {amount: 12},
                        runningBalance: {amount: 2345}
                    }];
                    scope.closingBalance = {amount:2345};
                    scope.query = '22 December 2014';
                });

                describe('non ie and greater than ie 10', function () {
                    beforeEach(function () {
                        windowSpy.navigator.userAgent = 'Firefox';
                    });


                    it('should call the statement pdf generator', function () {
                        createController(accountsResponse.accounts[3].formattedNumber, noStatements);
                        scope.downloadPdf();
                        expect(statementPdfGenerator.downloadPdf).toHaveBeenCalled();
                    });

                    it('should call the statement pdf generator with account holder name, account number, statement start and end date and a query string', function () {
                        createController(accountsResponse.accounts[3].formattedNumber, noStatements);
                        scope.downloadPdf();
                        expect(statementPdfGenerator.downloadPdf).toHaveBeenCalledWith('Bob McGee', 'ACCESSACC 99999', '22 December 2014', '22 December 2014', {amount:23}, [{
                            transactionDate: '22 December 2014',
                            narrative: 'narrative',
                            amount: {amount: 12},
                            runningBalance: {amount: 2345}
                        }], {amount:2345}, '22 December 2014');
                    });

                    it('should call the statement pdf generator with account holder name, account number, statement start and end date and a query string', function () {
                        createController(accountsResponse.accounts[3].formattedNumber, noStatements);
                        scope.downloadPdf();
                        expect(statementPdfGenerator.downloadPdf).toHaveBeenCalledWith('Bob McGee', 'ACCESSACC 99999', '22 December 2014', '22 December 2014', {amount:23}, [{
                            transactionDate: '22 December 2014',
                            narrative: 'narrative',
                            amount: {amount: 12},
                            runningBalance: {amount: 2345}
                        }], {amount:2345}, '22 December 2014');

                    });
                });
            });
        });
    });

    describe('StatementFilter', function () {
        beforeEach(module('refresh.statements', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));
        var statementLines, filter;

        beforeEach(inject(function ($filter) {
            filter = $filter;
            statementLines = [
                {
                    amount: {amount: 9.90},
                    narrative: 'one line IB FUTURE-DATED PAYMENT TO IB REFRESH 2        410004253',
                    runningBalance: {amount: -9217.90},
                    transactionDate: '2014-01-21T21:00:00.000+0000'
                },
                {
                    amount: {amount: -2000.33},
                    narrative: 'another line 9',
                    runningBalance: {amount: 3333333.00},
                    transactionDate: '2014-02-28T10:00:00.000+0000'
                }
            ];
        }));

        it('should filter by narrative stripping extra spaces', function () {
            expect(filter('statementFilter')(statementLines, 'IB FUTURE-DATED PAYMENT TO IB REFRESH 2 410004253')).toEqual([statementLines[0]]);
        });

        it('should filter by narrative', function () {
            expect(filter('statementFilter')(statementLines, 'one line')).toEqual([statementLines[0]]);
        });

        it('should filter by amount', function () {
            expect(filter('statementFilter')(statementLines, '200')).toEqual([statementLines[1]]);
        });

        it('should filter by amount stripping spaces', function () {
            expect(filter('statementFilter')(statementLines, '2 0 0')).toEqual([statementLines[1]]);
        });

        it('should filter by amount including zero padding', function () {
            expect(filter('statementFilter')(statementLines, '9.90')).toEqual([statementLines[0]]);
        });

        it('should filter by running balance', function () {
            expect(filter('statementFilter')(statementLines, '-9')).toEqual([statementLines[0]]);
        });

        it('should filter by running balance stripping spaces', function () {
            expect(filter('statementFilter')(statementLines, '- 9   ')).toEqual([statementLines[0]]);
        });

        it('should filter by running balance including zero padding', function () {
            expect(filter('statementFilter')(statementLines, '3 333.00')).toEqual([statementLines[1]]);
        });

        it('should filter by formatted transaction date', function () {
            expect(filter('statementFilter')(statementLines, 'Feb')).toEqual([statementLines[1]]);
        });

        it('should filter by formatted transaction date case insensitive', function () {
            expect(filter('statementFilter')(statementLines, 'feb')).toEqual([statementLines[1]]);
        });
    });
});