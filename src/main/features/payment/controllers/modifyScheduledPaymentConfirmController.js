(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/payment/scheduled/modify/confirm', {
            templateUrl: 'features/payment/partials/modifyScheduledPaymentConfirm.html',
            controller: 'ModifyScheduledPaymentConfirmController'
        });
    });

    app.controller('ModifyScheduledPaymentConfirmController', function ($scope, $location, $window, Flow, ViewModel,
                                                                        BeneficiariesListService, Card,
                                                                        ApplicationParameters,
                                                                        ScheduledPaymentsService) {

        var model = ViewModel.current();
        $scope.scheduledPayment = model.scheduledPayment;
        $scope.beneficiary = model.beneficiary;

        $scope.amount = model.amount;
        $scope.paymentDetail = model.paymentDetail;

        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');

        $scope.modify = function () {
            ViewModel.modifying();
            Flow.previous();
            $location.path('/payment/scheduled/modify').replace();
        };

        $scope.confirm = function () {
            var beneficiary = $scope.beneficiary;
            var paymentDetail = $scope.paymentDetail;
            var futureTransaction = {
                amount: {amount: $scope.amount},
                futureDatedInstruction: {
                    fromDate: paymentDetail.fromDate,
                    repeatInterval: paymentDetail.repeatInterval,
                    repeatNumber: paymentDetail.repeatNumber,
                    toDate: paymentDetail.getToDate()
                },
                nextPaymentDate: paymentDetail.fromDate,
                futureDatedId: $scope.scheduledPayment.futureTransaction.futureDatedId
            };

            ScheduledPaymentsService.amend(futureTransaction, Card.current(),
                beneficiary.recipientId).then(function (result) {
                    ViewModel.current(
                        {
                            modifiedFutureDatedId: futureTransaction.futureDatedId
                        }
                    );
                    $window.history.go(-1);
                }, function (error) {
                    ViewModel.error({message: 'Could not schedule' + (error.message ? ' ' + error.message : '')});
                    Flow.previous();
                    $location.path('/payment/scheduled/modify').replace();
                });
        };

        $scope.getPaymentDateLabel = function () {
            return $scope.isRecurringPayment ? 'First payment date' : 'Payment date';
        };

        $scope.getRepeatPaymentDescription = function () {
            return 'Every ' + $scope.intervalName + ' for ' + $scope.repeatNumber + ' ' + $scope.intervalName + 's';
        };
    });
})(angular.module('refresh.payment.future.controllers.modify.confirm', ['ngRoute', 'refresh.payment.future.services']));