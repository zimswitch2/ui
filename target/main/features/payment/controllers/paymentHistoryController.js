(function () {
    'use strict';

    var app = angular.module('refresh.payment');

    app.config(function ($routeProvider) {
        $routeProvider.when('/payment/history', {
            controller: 'PaymentHistoryController',
            templateUrl: 'features/payment/partials/paymentHistory.html',
            controllerAs: 'ctrl'
        });
    });

    app.controller('PaymentHistoryController', function (ApplicationParameters, PaymentService, AccountsService, Card) {
        var vm = this;

        function getLatestTimestampFomServer() {
            return moment(ApplicationParameters.getVariable('latestTimestampFromServer')).format('D MMMM YYYY');
        }

        function addDateDetailsToHistoryListItems(historyList) {
            return _.map(historyList, function (item) {
                var paymentDate = moment(item.date);
                item.monthName = paymentDate.format('MMM');
                item.dayOfPayment = paymentDate.format('DD');
                return item;
            });
        }

        function callServiceAndLoadPayments(nextPaymentHistoryPageDetails, onCompletion) {
            var formattedDateFrom = moment(vm.dateFrom).format("YYYY-MM-DDTHH:mm");
            var formattedDateTo = moment(vm.dateTo).endOf('day').format("YYYY-MM-DDTHH:mm");

            var nextPageReference = null;
            var atmdbtsqName = null;

            if (nextPaymentHistoryPageDetails) {
                nextPageReference = nextPaymentHistoryPageDetails.referenceNumber;
                atmdbtsqName = nextPaymentHistoryPageDetails.atmdbtsqName;
            }

            PaymentService.getHistory(formattedDateFrom, formattedDateTo, vm.selectedAccount.number, nextPageReference, atmdbtsqName).then(function (historyResponse) {
                vm.historyList = vm.historyList.concat(addDateDetailsToHistoryListItems(historyResponse.paymentHistoryItems));
                vm.nextPaymentHistoryPageDetails = historyResponse.nextPaymentHistoryPageDetails;

                if(onCompletion) {
                    onCompletion();
                }
            });
        }

        vm.loadHistoryList = function() {
            vm.historyList = [];
            callServiceAndLoadPayments();
        };

        vm.loadMorePayments = function() {
            function onCompletion() {
                vm.loadingPaginated = false;
            }

            vm.loadingPaginated = true;
            callServiceAndLoadPayments(vm.nextPaymentHistoryPageDetails, onCompletion);
        };

        vm.isNumberOfDaysSelected = function(numberOfDays) {
            var differenceInDays = moment(vm.dateTo).diff(moment(vm.dateFrom), 'days');
            return numberOfDays === differenceInDays;
        };

        vm.updateFromDate = function(date){
            vm.dateFrom = date.format('D MMMM YYYY');
            vm.loadHistoryList();

        };

        vm.updateToDate = function(date){
            vm.dateTo = date.format('D MMMM YYYY');
            vm.loadHistoryList();
        };

        vm.getPaymentsForTheLast = function(numberOfDays){
            vm.dateTo = getLatestTimestampFomServer();
            vm.dateFrom = moment(vm.dateTo).subtract(numberOfDays, 'days').format('D MMMM YYYY');
            vm.loadHistoryList();
        };

        vm.earliestSelectableDate = function(){
            return moment(vm.dateTo).subtract(180, 'days').format('D MMMM YYYY');
        };

        vm.switchSortOrder = function() {
            vm.isReverseSortOrder = !vm.isReverseSortOrder;
        };

        AccountsService.list(Card.current()).then(function(response) {
            vm.accounts = _.filter(response.accounts, function (account) {
                return !_.isEqual(account.accountType, "UNKNOWN");
            });

            vm.selectedAccount = vm.accounts[0];
            vm.getPaymentsForTheLast(30);
        });

        vm.currentDate = getLatestTimestampFomServer();
        vm.isReverseSortOrder = true;
    });
})();
