describe('MenigaStatement Controller Test', function () {
    'use strict';
    beforeEach(module('refresh.accountsService', 'refresh.menigaTransactionsPage.services', 'refresh.meniga.userCategoriesService', 'refresh.card',
        'refresh.menigaTransactionsPage.controller','refresh.statements.pdfGenerator'));

    describe('MenigaTransactionsPageController', function () {

        var $controller;
        var accountsService;
        var menigaTransactionsPageService;
        var menigaUserCategoriesService;
        var statementPdfGenerator;
        var card;
        var $scope;
        var promiseMocker;
        var usersCard = {number: 'Test Card Number', personalFinanceManagementId: 9};
        var userCategories = {payload: [{Id: 1, Name: 'First Test Category'}, {Id: 2, Name: 'Second Test Category'}]};

        beforeEach(inject(function ($rootScope, _$controller_,MenigaUserCategoriesService,StatementPdfGenerator,AccountsService, MenigaTransactionsPageService, Card, _mock_) {
            $controller = _$controller_;
            accountsService = AccountsService;
            menigaTransactionsPageService = MenigaTransactionsPageService;
            statementPdfGenerator = StatementPdfGenerator;
            menigaUserCategoriesService = MenigaUserCategoriesService;
            card = Card;
            $scope = $rootScope.$new();
            promiseMocker = _mock_;

            spyOn(card, 'current').and.returnValue(usersCard);
            spyOn(accountsService, 'list').and.returnValue(promiseMocker.resolve({accounts: []}));
            spyOn(menigaUserCategoriesService, 'getUserCategories').and.returnValue(promiseMocker.resolve(userCategories));

            $controller('MenigaTransactionsPageController', {
                $scope: $scope
            });
        }));


        it('Should set the 5 statement types on the $scope', function () {
            var statementTypes = [
                {
                    numberOfMonths: 0,
                    description: 'Latest Transactions'
                },
                {
                    numberOfMonths: 1,
                    description: '30 Days'
                },
                {
                    numberOfMonths: 2,
                    description: '60 Days'
                },
                {
                    numberOfMonths: 3,
                    description: '90 Days'
                },
                {
                    numberOfMonths: 6,
                    description: '180 Days'
                }
            ];
            expect($scope.statementTypes).toBeDefined();
            expect($scope.statementTypes.length).toBe(5);
            expect($scope.statementTypes).toEqual(statementTypes);

        });

        it('Should set $scope.loading to true',function(){
            expect($scope.loading).toBe(true);
        });
        it('Should have download pdf statement function defined',function(){
            expect($scope.downloadStatementInPdf).toBeDefined();
        });

        it('Should invoke createPdf on StatementPdfGenerator With the correct parameters.',function(){
            var name = 'Test Account Holder Name';
            var formattedNumber = 'Test Formatted Number';

            $scope.menigaTransactionsPageQuery = {
                account:{
                    formattedNumber:formattedNumber,
                    name:name
                }
            };

            $scope.filteredTransactions = [
                {Date:'1st Statement Date',OriginalText:'1st Original Text',CategoryName:'1st Category Name',Amount:'1st Amount',Balance:'1st Balance'},
                {Date:'2nd Statement Date',OriginalText:'2nd Original Text',CategoryName:'2nd CategoryName',Amount:'2nd Amount',Balance:'2nd Balance'},
                {Date:'Last Statement Date',OriginalText:'Last Original Text',CategoryName:'Last Category Name',Amount:'Last Amount',Balance:'Last Balance'}
            ];

            $scope.balances = {opening:'Test Opening Balance',closing:'Test Closing Balance'};
            $scope.searchString = 'Test Search String';
            var transactionsWithObjectKeysDownloadPdfUnderstands = [
                {transactionDate:$scope.filteredTransactions[0].Date,narrative:$scope.filteredTransactions[0].OriginalText,
                    categoryName:$scope.filteredTransactions[0].CategoryName,
                amount:{amount:$scope.filteredTransactions[0].Amount},runningBalance:{amount:$scope.filteredTransactions[0].Balance}},

                {transactionDate:$scope.filteredTransactions[1].Date,narrative:$scope.filteredTransactions[1].OriginalText,
                    categoryName:$scope.filteredTransactions[1].CategoryName,
                    amount:{amount:$scope.filteredTransactions[1].Amount},runningBalance:{amount:$scope.filteredTransactions[1].Balance}},

                {transactionDate:$scope.filteredTransactions[2].Date,narrative:$scope.filteredTransactions[2].OriginalText,
                    categoryName:$scope.filteredTransactions[2].CategoryName,
                    amount:{amount:$scope.filteredTransactions[2].Amount},runningBalance:{amount:$scope.filteredTransactions[2].Balance}}
            ];
            spyOn(statementPdfGenerator,'downloadPdf');

            $scope.downloadStatementInPdf();

            expect(statementPdfGenerator.downloadPdf).toHaveBeenCalled();
            var callArguments = statementPdfGenerator.downloadPdf.calls.mostRecent().args;
            expect(callArguments[0]).toEqual(name);
            expect(callArguments[1]).toEqual(formattedNumber);
            expect(callArguments[2]).toEqual($scope.filteredTransactions[0].Date);
            expect(callArguments[3]).toEqual($scope.filteredTransactions[2].Date);
            expect(callArguments[4]).toEqual($scope.balances.opening);
            expect(callArguments[5][0]).toEqual(transactionsWithObjectKeysDownloadPdfUnderstands[0]);
            expect(callArguments[5][1]).toEqual(transactionsWithObjectKeysDownloadPdfUnderstands[1]);
            expect(callArguments[5][2]).toEqual(transactionsWithObjectKeysDownloadPdfUnderstands[2]);
            expect(callArguments[6]).toEqual($scope.balances.closing);
            expect(callArguments[7]).toEqual($scope.searchString);

        });


        it('Should have a menigaTransationsPageQuery on the $scope', function () {
            expect($scope.menigaTransactionsPageQuery).toBeDefined();
        });

        it('Should have the user category mappings on the $scope ', function () {
            expect($scope.userCategoryMappings).toBeDefined();
        });


        it('Should Set The personalFinanceManagement Id To The one returned from the card', function () {
            expect($scope.menigaTransactionsPageQuery.personalFinanceManagementId).toBe(usersCard.personalFinanceManagementId);
        });

        it('Should default the pageIndex to 0', function () {
            expect($scope.menigaTransactionsPageQuery.pageIndex).toBe(0);
        });

        it('Should default the months to go back to 0', function () {
            expect($scope.menigaTransactionsPageQuery.monthsToGoBack).toBe(0);
        });

        describe('initialize', function () {
            var usersFirstAccount, transactionsPage;

            beforeEach(function () {
                usersFirstAccount = {number: 'Test Account Number'};
                spyOn(menigaTransactionsPageService, 'getTransactionsPage');
                menigaUserCategoriesService.getUserCategories.and.returnValue(promiseMocker.resolve(userCategories));

            });

            var initializeAndDigest = function () {
                $scope.initialize();
                $scope.$digest();
            };

            describe('when accountsService.list is resolved', function () {
                beforeEach(function () {
                    accountsService.list.and.returnValue(promiseMocker.resolve({accounts: [usersFirstAccount]}));
                    transactionsPage = {payload: {Transactions: ['Test Transactions Page To Be Returned From menigaTransactionsPageService.getTransactionsPage']}};
                    menigaTransactionsPageService.getTransactionsPage.and.returnValue(promiseMocker.resolve(transactionsPage));

                });


                it('Should Set the returned list of accounts on the $scope.accounts', function () {
                    expect($scope.accounts).toBeUndefined();

                    initializeAndDigest();

                    expect($scope.accounts).toBeDefined();
                    expect($scope.accounts).toEqual([usersFirstAccount]);
                });

                it('Should set the selected account to the first one on the account list', function () {
                    initializeAndDigest();
                    expect($scope.menigaTransactionsPageQuery.account).toBe(usersFirstAccount);
                });

                it('Should set the statementType to the first one on the statement type list', function () {
                    initializeAndDigest();
                    expect($scope.menigaTransactionsPageQuery.monthsToGoBack).toBe($scope.statementTypes[0].numberOfMonths);
                });

                it('Should call card.current', function () {
                    $scope.initialize();
                    expect(card.current).toHaveBeenCalled();
                });


                it('Should call list on accountsService with card', function () {
                    $scope.initialize();
                    expect(accountsService.list).toHaveBeenCalledWith(usersCard);
                });


                it('Should set the menigaTransactionPageQuery account to the first account', function () {
                    initializeAndDigest();
                    expect($scope.menigaTransactionsPageQuery.account).toBe(usersFirstAccount);
                });

                it('Should call getTransactionsPage on menigaStatementService with the user\'s first account', function () {
                    initializeAndDigest();

                    var actualArgumentForGetTransactionsPageCall = menigaTransactionsPageService.getTransactionsPage.calls.mostRecent().args;
                    expect(actualArgumentForGetTransactionsPageCall[0].account).toBe(usersFirstAccount);
                });

                it('Should invoke menigaServiceUserCategories with the users Card.', function () {
                    initializeAndDigest();
                    expect(menigaUserCategoriesService.getUserCategories).toHaveBeenCalledWith(usersCard);
                });

                it('Should set the user category mappings on the $scope with the CategoryIds and Category Names returned from menigaServiceUserCategories',
                    function () {
                        initializeAndDigest();

                        expect($scope.userCategoryMappings.length).toBe(2);
                        expect($scope.userCategoryMappings[0].id).toEqual(userCategories.payload[0].Id);
                        expect($scope.userCategoryMappings[0].name).toEqual(userCategories.payload[0].Name);
                        expect($scope.userCategoryMappings[1].id).toEqual(userCategories.payload[1].Id);
                        expect($scope.userCategoryMappings[1].name).toEqual(userCategories.payload[1].Name);

                    });

                it('Given A Category Id should get the corresponding Category Name', function () {
                    $scope.userCategoryMappings = [{id: 1, name: 'Alimony Paid'}, {id: 2, name: 'Alcohol'}];

                    expect($scope.categoryNameForCategoryId(1)).toEqual('Alimony Paid');
                    expect($scope.categoryNameForCategoryId(2)).toEqual('Alcohol');
                });

                it('should set the list of statements returned from getTransactionsPage on the scope', function () {
                    initializeAndDigest();
                    expect($scope.transactions).toBeDefined();
                    expect($scope.transactions[0].Id).toEqual(transactionsPage.payload.Transactions[0].Id);
                });

                it('Should not call getTransactionsPage on menigaTransactionsPageService when user accounts is undefined', function () {
                    accountsService.list.and.returnValue(promiseMocker.resolve(undefined));
                    initializeAndDigest();

                    expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
                });

                it('Should not call getTransactionsPage on menigaTransactionsPageService when user has 0 accounts', function () {
                    accountsService.list.and.returnValue(promiseMocker.resolve({accounts: []}));
                    initializeAndDigest();

                    expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
                });

                it('Should not call getTransactionsPage on menigaTransactionsPageService when accountsService.list returns an empty response', function () {
                    accountsService.list.and.returnValue(promiseMocker.resolve({}));

                    initializeAndDigest();

                    expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
                });

            });

            describe('when accountsService.list is rejected', function () {
                beforeEach(function () {
                    accountsService.list.and.returnValue(promiseMocker.reject({}));
                });

                it('Should not call getTransactionsPage on menigaTransactionsPageService', function () {
                    initializeAndDigest();

                    expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
                });
            });
        });

        describe('On invoking $scope.getTransactions ', function () {

            beforeEach(function () {
                spyOn(menigaTransactionsPageService, 'getTransactionsPage');
                $scope.menigaTransactionsPageQuery = {
                    account: {number: 'Test Account Number'}, monthsToGoBack: 0,
                    pageIndex: 0, personalFinanceManagementId: 'Test Personal Finance Management Id'
                };
            });

            describe('On Returning A List Of Transactions With Transactions', function () {
                var firstTransactionBalance = 90;
                var transactionResponse = {
                    payload: {
                        Transactions: [{
                            CategoryId: 1,
                            Balance: firstTransactionBalance
                        }, {CategoryId: 2, Balance: 900}, {Balance: 9000}]
                    }
                };

                beforeEach(function () {
                    menigaTransactionsPageService.getTransactionsPage.and.returnValue(promiseMocker.resolve(transactionResponse));
                    $scope.filteredTransactions = transactionResponse.payload.Transactions;
                    $scope.getTransactions();
                    expect($scope.loading).toBe(true);
                    $scope.$digest();
                    expect($scope.loading).toBe(false);
                });


                it('Should Set The Closing Balance On The $scope As The First Transaction Balance. This Assumes The Transactions Are ordered in Descending Order ' +
                    'i.e The Latest Transaction First', function () {
                    expect($scope.balances.closing).toBe(firstTransactionBalance);
                });

                it('Should call menigaTransactionsPageService.getTransactions with the account,pageIndex and statement type on the $scope', function () {
                    expect(menigaTransactionsPageService.getTransactionsPage).toHaveBeenCalledWith($scope.menigaTransactionsPageQuery);
                });

                it('Should set the returned transactions on the $scope', function () {

                    expect($scope.transactions.length).toBe(transactionResponse.payload.Transactions.length);
                });

                it('Should Call $scope.getCategoryNameForCategoryId For Each transaction id and set the name on each of the transactions', function () {
                    expect($scope.transactions[0].CategoryName).toBe('First Test Category');
                    expect($scope.transactions[1].CategoryName).toBe('Second Test Category');
                });


                describe('Calculating Opening Balance', function () {

                    beforeEach(function(){
                        $scope.filteredTransactions = [{}, {}, {Balance: lastBalance, Amount: lastAmount}];
                    });

                    var lastAmount = 10, lastBalance = 29;

                    it('Should Calculate The Opening Balance Which Should Be The Last Transaction Minus The Last Transaction Amount. Positive Transaction Amount',
                        function () {
                            assertOpeningBalanceCalculatedAndSetCorrectly();
                        });

                    it('Should Calculate The Opening Balance Which Should Be The Last Transaction Minus The Last Transaction Amount. Negative Transaction Amount',
                        function () {
                            lastAmount = -10;
                            $scope.filteredTransactions[2].Amount = lastAmount;
                            assertOpeningBalanceCalculatedAndSetCorrectly();
                        });

                    function assertOpeningBalanceCalculatedAndSetCorrectly() {
                        $scope.getTransactions();
                        $scope.$digest();
                        expect($scope.balances).toBeDefined();
                        expect($scope.balances.opening).toBe(lastBalance - lastAmount);
                    }
                });
            });

            describe('On Returning An Empty list of transactions', function () {

                beforeEach(function () {
                    menigaTransactionsPageService.getTransactionsPage.and.returnValue(promiseMocker.resolve({payload: {Transactions: []}}));
                    $scope.getTransactions();
                    $scope.$digest();
                });

                it('The $scope.balances to an empty object ', function () {
                    expect($scope.balances).toBeDefined();
                    expect($scope.balances.closing).toBeUndefined();
                });
            });

        });

        describe('When The menigaTransactionsPageQuery is not "well formed" i.e when either the account/monthsToGoBack are NOT set', function () {

            beforeEach(function () {
                spyOn(menigaTransactionsPageService, 'getTransactionsPage');
                $scope.menigaTransactionsPageQuery = {
                    account: {number: 'Account Number'},
                    monthsToGoBack: 'Months To Go Back',
                    pageIndex: 4
                };
            });

            it('Should NOT call menigaTransactionsPageService.getTransactionsPage When menigaTransactionPageQuery is undefined', function () {

                $scope.menigaTransactionsPageQuery = undefined;

                $scope.getTransactions();

                expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
            });

            it('Should NOT call menigaTransactionsPageService.getTransactionsPage When account is undefined', function () {
                $scope.menigaTransactionsPageQuery.account = undefined;

                $scope.getTransactions();

                expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
            });

            it('Should NOT call menigaTransactionsPageService.getTransactionsPage When monthsToGoBack is undefined', function () {
                $scope.menigaTransactionsPageQuery.monthsToGoBack = undefined;

                $scope.getTransactions();

                expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
            });

            it('Should NOT call menigaTransactionsPageService.getTransactionsPage When pageIndex is undefined', function () {
                $scope.menigaTransactionsPageQuery.pageIndex = undefined;

                $scope.getTransactions();

                expect(menigaTransactionsPageService.getTransactionsPage).not.toHaveBeenCalled();
            });

        });


        describe('On Changing The Account / number of months ', function () {

            beforeEach(function () {
                spyOn($scope, 'getTransactions');
            });

            it('Should call $scope.getTransactions on changing the account', function () {

                $scope.menigaTransactionsPageQuery.account = 'New Account Value. This should trigger $scope.getTransactions';
                $scope.$digest();
                expect($scope.getTransactions).toHaveBeenCalled();
            });

            it('Should call $scope.getTransactions on changing the numberOfMonths', function () {

                $scope.menigaTransactionsPageQuery.monthsToGoBack = 'New Number Of Months. This should trigger $scope.getTransactions';
                $scope.$digest();
                expect($scope.getTransactions).toHaveBeenCalled();
            });

            it('Should NOT $scope.getTransactions when the monthsToGoBack are changed to undefined',function(){
                $scope.menigaTransactionsPageQuery.monthsToGoBack = undefined;
                $scope.$digest();
                expect($scope.getTransactions).not.toHaveBeenCalled();
            });
        });
    });

    describe('routing', function () {
        describe('When menigaTransactionsHistoryFeature is toggled on', function () {
            var $route;

            beforeEach(function () {
                module('refresh.statements');
                inject(function (_$route_) {
                    $route = _$route_;
                });
            });

            describe('when a provisional statement is to be shown', function () {
                it('should use the correct controller', function () {
                    expect($route.routes['/statements/:formattedNumber?'].controller).toEqual('MenigaTransactionsPageController');
                });

                it('should use the correct template', function () {
                    expect($route.routes['/statements/:formattedNumber?'].templateUrl).toEqual('features/statements/partials/menigaTransactionsPage.html');
                });
            });
        });
    });

    describe('Transaction Filter',function(){
        var transactionFilter;
        var expectedOnFilteringOnAmount     = {Amount:100};
        var expectedOnFilteringOnBalance    = {Balance:999};
        var expectedOnFilteringOnCategory   = {CategoryName:'Test Category'};
        var expectedOnFilteringOnDate       = {Date:'2015-07-31T21:00:00.000+0000'};
        var toBeNeverFiltered               = {Date:expectedOnFilteringOnDate.Date,Amount:expectedOnFilteringOnAmount.Amount,
            Balance:expectedOnFilteringOnBalance.Balance,CategoryName:expectedOnFilteringOnCategory.CategoryName};
        var toBeNeverMatched                = {Date:'Some Time',Amount:'Some Money',Balance:'Some Credit',CategoryName:'Some Classification'};
        var transactions;
        var filterResults;

        beforeEach(inject(function(transactionFilterFilter){
            transactionFilter = transactionFilterFilter;
            expect(transactionFilter).toBeDefined();

            transactions = [expectedOnFilteringOnDate,expectedOnFilteringOnAmount,expectedOnFilteringOnBalance,expectedOnFilteringOnCategory,toBeNeverFiltered,
                toBeNeverMatched];
        }));


        it('Should Filter On Category Name',function(){
            filterResults = transactionFilter(transactions,expectedOnFilteringOnCategory.CategoryName);
            expect(filterResults).toContain(expectedOnFilteringOnCategory);
        });

        it('Should Filter On Amount',function(){
            filterResults = transactionFilter(transactions,expectedOnFilteringOnAmount.Amount);
            expect(filterResults).toContain(expectedOnFilteringOnAmount);
        });

        it('Should Filter On Balance',function(){
            filterResults = transactionFilter(transactions,expectedOnFilteringOnBalance.Balance);
            expect(filterResults).toContain(expectedOnFilteringOnBalance);
        });

        it('Should Filter On Date',function(){
            filterResults = transactionFilter(transactions,'31 July 2015');
            expect(filterResults).toContain(expectedOnFilteringOnDate);
        });

        afterEach(function(){
            expect(filterResults.length).toBe(2);
            expect(filterResults).toContain(toBeNeverFiltered);
            expect(filterResults).not.toContain(toBeNeverMatched);
        });
    });

});
