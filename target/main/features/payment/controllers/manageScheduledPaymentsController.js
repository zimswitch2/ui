(function () {
    'use strict';

    var module = angular.module('refresh.payment.future.controllers',
        [
            'ngRoute',
            'refresh.payment.future.services',
            'refresh.sorter',
            'refresh.filters',
            'refresh.customizedFilter'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/payment/scheduled/manage', {
            templateUrl: 'features/payment/partials/manageScheduledPayments.html',
            controller: 'ManageScheduledPaymentsController'
        });
    });

    module.filter('scheduledPaymentFilter', function (CustomizedFilterService) {
        return CustomizedFilterService.create([
            {path: 'beneficiaryName'},
            {path: 'nextPaymentDate', type: 'date'},
            {path: 'finalPaymentDate', type: 'date'},
            {path: 'amount', type: 'randAmount'},
            {path: 'frequency'},
            {path: 'remainingPayments'}
        ]);
    });

    module.controller('ManageScheduledPaymentsController',
        function ($scope, $sorter, $q, $location, randAmountFilter, dateFormatFilter, ScheduledPaymentsService, Card,
                  ViewModel) {
            $scope.sortBy = $sorter;
            $scope.sortBy('beneficiaryName');

            ScheduledPaymentsService.list(Card.current()).then(function (response) {
                $scope.scheduledPayments = response;
                var latestScheduledPaymentFutureDatedId = ViewModel.current().modifiedFutureDatedId;
                if (latestScheduledPaymentFutureDatedId) {
                    ViewModel.initial();
                    var latestScheduledPayment = _.remove($scope.scheduledPayments, function (scheduledPayment) {
                        return scheduledPayment.futureTransaction.futureDatedId === latestScheduledPaymentFutureDatedId;
                    })[0];
                    latestScheduledPayment.highlightClass = 'highlight';
                    $scope.scheduledPayments.splice(0, 0, latestScheduledPayment);
                    $scope.sortBy('');
                }
            });

            $scope.sortArrowClass = function (criteria) {
                return "icon icon-sort" + (this.sort.criteria === criteria ? ' active' : '');
            };

            $scope.noScheduledPayments = function () {
                return !$scope.scheduledPayments || $scope.scheduledPayments.length === 0;
            };

            $scope.modify = function (scheduledPayment) {
                ViewModel.current(
                    {
                        scheduledPayment: scheduledPayment,
                        paymentDetail: new PaymentDetail(_.extend(scheduledPayment.futureTransaction.futureDatedInstruction,
                            {
                                minimumRepeatNumber: 1,
                                fromDate: scheduledPayment.futureTransaction.nextPaymentDate
                            }))
                    }
                );
                ViewModel.modifying();
                $location.path('/payment/scheduled/modify');
            };

            $scope.confirmDeleteMessage = function () {
                return 'Are you sure you want to delete this scheduled payment?';
            };

            $scope.errorDeleteMessage = function () {
                return 'Could not delete this scheduled payment, try again later.';
            };

            $scope.markForDeletion = function (scheduledPayment) {
                $scope.currentDeletingId = scheduledPayment.futureTransaction.futureDatedId;
            };

            $scope.isBeingDeleted = function (scheduledPayment) {
                return $scope.currentDeletingId === scheduledPayment.futureTransaction.futureDatedId;
            };
            $scope.$watch('query', function () {
                $scope.currentDeletingId = undefined;
            });

            $scope.delete = function (scheduledPayment) {
                var card = Card.current();
                var futureTransaction = scheduledPayment.futureTransaction;
                var recipientId = scheduledPayment.recipientId;
                var futureDatedId = scheduledPayment.futureTransaction.futureDatedId;

                return ScheduledPaymentsService.delete(futureTransaction, card, recipientId).then(function (response) {
                    if (response.success) {
                        _.remove($scope.scheduledPayments, function (scheduledPaymentItem) {
                            return scheduledPaymentItem.futureTransaction.futureDatedId === futureDatedId;
                        });
                    } else {
                        $q.reject(response);
                    }
                }).catch(function (error) {
                    return $q.reject(error);
                });
            };
        });
})();