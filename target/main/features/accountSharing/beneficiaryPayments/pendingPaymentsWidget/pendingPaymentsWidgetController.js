var accountSharingEnabled = false;
{
    accountSharingEnabled = true;
}
(function () {

    'use strict';

    angular.module('refresh.accountSharing.beneficiaryPayments')
        .controller('PendingPaymentsWidgetController', function ($scope, EntitlementsBeneficiaryPaymentService, User) {
            $scope.numberOfPendingTransactions = 0;
            $scope.pendingTransactions = [];
            $scope.onlyOnePendingTransaction = false;

            $scope.viewName = function () {

                if ($scope.onlyOnePendingTransaction) {
                    var pendingTransaction = $scope.pendingTransactions[0];
                    if (pendingTransaction.transactionType === "interAccountPayment") {
                        return "interAccountPayment";
                    }
                    if (pendingTransaction.transactionType === "repeatPayment") {
                        return "repeatPayment";
                    }

                    return "beneficiaryPayment";
                }

            };

            $scope.availablePendingTransactions = function () {
                if (accountSharingEnabled) {
                    if (User.isCurrentDashboardSEDPrincipal()) {
                        EntitlementsBeneficiaryPaymentService.getPendingPayments().then(function (pendingTransactions) {
                            $scope.pendingTransactions = pendingTransactions || [];
                            $scope.numberOfPendingTransactions = $scope.pendingTransactions.length;
                            $scope.onlyOnePendingTransaction = $scope.pendingTransactions.length === 1 ? true : false;
                        });
                    }
                }
            };

            $scope.hasPendingTransactions = function () {

                    return $scope.pendingTransactions.length >= 1;

            };

            $scope.hasOnlyOnePendingTransaction = function () {
                return $scope.onlyOnePendingTransaction;
            };

            $scope.initialize = function () {
                $scope.availablePendingTransactions();
            };

            $scope.initialize();
        });

})();