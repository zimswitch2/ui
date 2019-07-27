if (feature.accountSharing) {
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.pendingPayments')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/pendingPayments', {
                    templateUrl: 'features/accountSharing/beneficiaryPayments/pendingPayments/pendingPayments.html',
                    controller: 'PendingPaymentsController',
                    controllerAs: "vm"
                });
            });
    })();
}