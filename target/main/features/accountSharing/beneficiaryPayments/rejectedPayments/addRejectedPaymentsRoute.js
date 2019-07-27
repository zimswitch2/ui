{
    (function () {
        'use strict';

        angular
            .module('refresh.accountSharing.rejectedPayments')
            .config(function ($routeProvider) {
                $routeProvider.when('/account-sharing/rejectedPayments', {
                    templateUrl: 'features/accountSharing/beneficiaryPayments/rejectedPayments/rejectedPayments.html',
                    controller: 'RejectedPaymentsController',
                    controllerAs: "vm"
                });
                $routeProvider.when('/account-sharing/rejectedPayments/viewRejectedPayment', {
                    templateUrl: 'features/accountSharing/beneficiaryPayments/viewPaymentsDetails.html',
                    controller: 'ViewRejectedPaymentsController',
                    controllerAs: "vm"
                });
            });
    })();
}