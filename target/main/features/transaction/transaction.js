(function (app) {
    'use strict';

    app.run(function ($rootScope, Menu, $location, Flow) {
        var transactionsHighlightedItems = ['/beneficiaries', 'payment/', 'transfers', 'prepaid', '/statements', '/transactions', '/payment-notification/history', '/instant-money', '/formal-statements', '/international-payment', 'account-sharing/pendingPayments', '/account-sharing/rejectedPayments'];
        var transactionDashboardMenuItem = {
            title: 'Transact',
            url: '/transaction/dashboard',
            position: 3,
            showIf: function () {
                var isShown = false;
                transactionsHighlightedItems.forEach(function (item) {
                    if ($location.path().indexOf(item) > -1 ||
                        ($location.path() === '/otp/verify' && Flow.get() &&
                        (Flow.get().headerName === "Once-off Payment" ||
                        Flow.get().headerName === "Add beneficiary"))) {
                        isShown = true;
                    }
                });
                return isShown;
            }
        };

        Menu.add(transactionDashboardMenuItem);
    });
})(angular.module('refresh.transaction', ['ngRoute', 'refresh.accounts', 'refresh.flow', 'refresh.mcaHttp', 'refresh.filters', 'refresh.login',
    'refresh.transactionDashboard']));
