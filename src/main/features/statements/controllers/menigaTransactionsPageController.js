/**
 * Created by Zorodzayi on 2015/07/07.
 */
//Polluting the global namespace with menigaTransactionsHistoryFeature so that we have access to it in unit tests and can toggle this feature from there by setting menigaTransactionsHistoryFeature
var menigaTransactionsHistoryFeature = false;
if (feature.menigaTransactionsHistory) {
    menigaTransactionsHistoryFeature = true;
}

(function () {
    'use strict';

    var module = angular.module('refresh.menigaTransactionsPage.controller',
        [
            'ngRoute',
            'refresh.menigaTransactionsPage.services',
            'refresh.card', 'refresh.accountsService',
            'refresh.meniga.userCategoriesService',
            'refresh.customizedFilter',
            'refresh.statements.pdfGenerator'
        ]);

    module.config(function ($routeProvider) {
        if (menigaTransactionsHistoryFeature) {
            $routeProvider.when('/statements/:formattedNumber?', {
                templateUrl: 'features/statements/partials/menigaTransactionsPage.html',
                controller: 'MenigaTransactionsPageController'
            });
        }
    });

    module.controller('MenigaTransactionsPageController', function ($scope,StatementPdfGenerator,AccountsService, Card, MenigaTransactionsPageService,MenigaUserCategoriesService) {
        $scope.loading = true;
        $scope.statementTypes = [
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

        $scope.menigaTransactionsPageQuery = {
            pageIndex: 0,
            monthsToGoBack: 0,
            personalFinanceManagementId: Card.current().personalFinanceManagementId
        };

        $scope.userCategoryMappings = [];

        function calculateBalances(){

            if($scope.filteredTransactions && $scope.filteredTransactions.length){
                $scope.balances = {closing : _.first($scope.filteredTransactions).Balance};

                var lastTransaction = _.last($scope.filteredTransactions);
                $scope.balances.opening = lastTransaction.Balance - lastTransaction.Amount;
            }
        }

        $scope.categoryNameForCategoryId = function (id) {
            var name = '';
            $scope.userCategoryMappings.forEach(function (category) {
                if (id === category.id) {
                    name = category.name;
                }
            });

            return name;

        };

        $scope.initialize = function () {

            MenigaUserCategoriesService.getUserCategories(Card.current()).then(function (userCategoriesResponse) {
                var userCategories = userCategoriesResponse.payload;
                $scope.userCategoryMappings = [];

                _.each(userCategories, function (userCategory) {
                    $scope.userCategoryMappings.push({id: userCategory.Id, name: userCategory.Name});
                });
            });

            AccountsService.list(Card.current()).then(function (cardResponse) {

                if (!cardResponse || !cardResponse.accounts || cardResponse.accounts.length === 0) {
                    return;
                }

                $scope.accounts = cardResponse.accounts;
                $scope.menigaTransactionsPageQuery.account = $scope.accounts[0];
                $scope.menigaTransactionsPageQuery.monthsToGoBack = $scope.statementTypes[0].numberOfMonths;

                $scope.getTransactions();
            });

        };

        $scope.downloadStatementInPdf = function(){
            var transactionsInFormatDownloadPdfExpects = [];
            _.each($scope.filteredTransactions,function(transaction){
                transactionsInFormatDownloadPdfExpects.push({
                    transactionDate:transaction.Date,
                    narrative:transaction.OriginalText,
                    categoryName:transaction.CategoryName,
                    amount:{amount:transaction.Amount},
                    runningBalance:{amount:transaction.Balance}
                });
            });

            calculateBalances();

            StatementPdfGenerator.downloadPdf($scope.menigaTransactionsPageQuery.account.name,$scope.menigaTransactionsPageQuery.account.formattedNumber,
                _.first($scope.filteredTransactions).Date, _.last($scope.filteredTransactions).Date,$scope.balances.opening,transactionsInFormatDownloadPdfExpects,
                $scope.balances.closing,
            $scope.searchString);
        };

        $scope.getTransactions = function () {
            if (!$scope.menigaTransactionsPageQuery || !$scope.menigaTransactionsPageQuery.account ||
                ($scope.menigaTransactionsPageQuery.monthsToGoBack >= 0) === false ||
                ($scope.menigaTransactionsPageQuery.pageIndex >= 0) === false
            ) {

                return;
            }

            MenigaTransactionsPageService.getTransactionsPage($scope.menigaTransactionsPageQuery).then(function (responseTransactions) {
                $scope.loading = false;
                var transactions = responseTransactions.payload.Transactions;
                $scope.transactions = [];
                $scope.balances = {};

                _.each(transactions,function(transaction){
                    var transactionClone = $.extend(true,{},transaction);
                    transactionClone.CategoryName = $scope.categoryNameForCategoryId(transaction.CategoryId);
                    $scope.transactions.push(transactionClone);
                });

                calculateBalances();
            });
        };

        $scope.$watch($scope.menigaTransactionsPageQuery.account, function () {
            if ($scope.menigaTransactionsPageQuery.account === undefined) {
                return;
            }
            $scope.getTransactions();
        });

        $scope.$watch($scope.menigaTransactionsPageQuery.monthsToGoBack, function () {

            if ($scope.menigaTransactionsPageQuery.monthsToGoBack === undefined) {
                return;
            }
            $scope.getTransactions();
        });

        $scope.initialize();
    });

    module.filter('transactionFilter',function(CustomizedFilterService){

        return CustomizedFilterService.create([
            {path: 'CategoryName'},
            {path: 'Balance',type:'amount'},
            {path: 'Amount', type: 'amount'},
            {path: 'Date', type: 'date'}
        ]);
    });
}());