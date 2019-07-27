(function(){
    'use strict';

    angular
        .module('refresh.accountSharing.rejectedPayments')
        .controller('RejectedPaymentsController', function(EntitlementsBeneficiaryPaymentService, $location){
            var vm = this;
            vm.rejectedPayments = {};

            EntitlementsBeneficiaryPaymentService.getRejectedPayments().then(function(rejectedPayments){
                vm.rejectedPayments = rejectedPayments;

                vm.numberOfRejectedTransactions = vm.rejectedPayments !== undefined ? vm.rejectedPayments.length : 0;
            });

            vm.back = function() {
                $location.path('/transaction/dashboard');
            };

            vm.showDetails = function(rejectedPayment){
                EntitlementsBeneficiaryPaymentService.setRejectedPaymentDetails(rejectedPayment);
                $location.path('/account-sharing/rejectedPayments/viewRejectedPayment');
            };

        });
})();