(function(){
    'use strict';

    angular
        .module('refresh.accountSharing.pendingPayments')
        .controller('PendingPaymentsController', function(EntitlementsBeneficiaryPaymentService, $location){
            var vm = this;
            vm.pendingPayments = {};

            EntitlementsBeneficiaryPaymentService.getPendingPayments().then(function(pendingPayments){
                vm.pendingPayments = pendingPayments;
                vm.numberOfPendingTransactions = vm.pendingPayments !== undefined ? vm.pendingPayments.length : 0;
            });

            vm.formatDescription = function(yourReference, paymentReason) {
                return yourReference + (paymentReason !== undefined ? " - " + paymentReason : "");
            };

            vm.back = function() {
                $location.path('/transaction/dashboard');
            };

        });
})();