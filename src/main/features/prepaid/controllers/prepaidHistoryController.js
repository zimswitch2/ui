(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/prepaid/history', {
            templateUrl: 'features/prepaid/partials/prepaidHistory.html',
            controller: 'PrepaidHistoryController',
            controllerAs: 'ctrl'
        });
    });

    app.controller('PrepaidHistoryController', function ($window, $timeout, PrepaidHistoryService, PrepaidHistoryRequest,
                                                         ErrorMessages, User, ApplicationParameters) {
        var vm = this;

        function getLatestTimestampFomServer() {
            return moment(ApplicationParameters.getVariable('latestTimestampFromServer')).format('D MMMM YYYY');
        }

        function callServiceAndLoadPrepadHistory() {
            var formattedDateFrom = moment(vm.dateFrom).format("YYYY-MM-DD");
            var formattedDateTo = moment(vm.dateTo).endOf('day').format("YYYY-MM-DD");

            PrepaidHistoryService.history(formattedDateFrom, formattedDateTo).then(function (prepaidHistoryData) {
                vm.transactions = prepaidHistoryData;
            }).catch(function (error) {
                if (error.id) {
                    vm.informationMessage = error.message;
                } else {
                    vm.errorMessage = ErrorMessages.messageFor(new Error('An error has occurred'));
                }
            });
        }

        vm.getPrepaidForTheLast = function(numberOfDays){
            vm.dateTo = getLatestTimestampFomServer();
            vm.dateFrom = moment(vm.dateTo).subtract(numberOfDays, 'days').format('D MMMM YYYY');
            callServiceAndLoadPrepadHistory();
        };

        vm.informationMessage = undefined;
        vm.printDate = new Date();
        vm.maskedCardNumber = User.userProfile.currentDashboard.maskedCardNumber;

        vm.print = function(invoiceNumber) {
            vm.printInvoiceNumber = invoiceNumber;
            vm.printHasInvoiceTransactionType = true;

            if (invoiceNumber) {
                vm.selectedTransaction = _.find(vm.transactions, {'invoiceNumber': invoiceNumber});
                vm.printHasInvoiceTransactionType = vm.selectedTransaction.rechargeType;
            }

            $timeout(function () {
                $window.print();
                vm.selectedTransaction = undefined;
            });
        };

        vm.getPrepaidForTheLast(30);
    });
})(angular.module('refresh.prepaid.history.controller',
    ['ngRoute', 'refresh.prepaid.history.services.service', 'refresh.prepaid.history.services.request',
        'refresh.security.user', 'refresh.errorMessages']));
