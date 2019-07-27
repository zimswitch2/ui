(function(){
    'use strict';

    angular
        .module('refresh.accountSharing.rejectedPayments')
        .controller('ViewRejectedPaymentsController', function($scope, ApplicationParameters, Card, AccountsService, EntitlementsBeneficiaryPaymentService, $location){
            var vm = this;

            $scope.payment = EntitlementsBeneficiaryPaymentService.getRejectedPaymentsDetails();

            $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');

            vm.setPaymentNotificationAddress = function(){
                if($scope.payment.paymentNotification){
                    if($scope.payment.paymentNotificationMethod.toUpperCase() === "EMAIL"){
                        $scope.payment.paymentNotificationAddress = $scope.payment.beneficiaryEmail;
                    }else if($scope.payment.paymentNotificationMethod.toUpperCase() === "SMS"){
                        $scope.payment.paymentNotificationAddress = $scope.payment.beneficiaryCell;
                    }else if($scope.payment.paymentNotificationMethod.toUpperCase() === "FAX"){
                        $scope.payment.paymentNotificationAddress = $scope.payment.beneficiaryFax;
                    }else{
                        $scope.payment.paymentNotification = false;
                    }
                }
            };

            vm.setPaymentNotificationAddress();

            vm.setAccountData = function (accountData) {
                $scope.account = _.cloneDeep(_.find(accountData.accounts, { number: $scope.payment.accountNumber}));
            };

            AccountsService.list(Card.current()).then(function (accountData) {
                vm.setAccountData(accountData);
            });

        });
})();