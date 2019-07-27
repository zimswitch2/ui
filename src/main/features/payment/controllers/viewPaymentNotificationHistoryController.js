(function () {
    'use strict';

    var module = angular.module('refresh.payment-notification-history',
        [
            'ngRoute',
            'refresh.sorter',
            'refresh.accounts',
            'refresh.filters',
            'refresh.resendConfirmation',
            'refresh.paymentNotificationHistory',
            'refresh.goToAnchorController',
            'refresh.notificationCostService',
            'refresh.customizedFilter'
        ]);
    module.config(function ($routeProvider) {
        $routeProvider.when('/payment-notification/history/:formattedNumber?', {
            templateUrl: 'features/payment/partials/paymentNotificationHistory.html',
            controller: 'ViewPaymentNotificationHistoryController'
        });
    });

    module.filter('paymentNotification', function ($filter, CustomizedFilterService) {
        return CustomizedFilterService.create([
            {path:'paymentDate',type:'date'},
            {path:'amount',type:'randAmount'},
            {path:'beneficiaryName'},
            {path:'beneficiaryReference'},
            {path:'paymentConfirmationMethod'},
            {path:'recipientName'},
            {path:'sentTo'}
        ]);
    });

    module.controller('ViewPaymentNotificationHistoryController',
        function ($scope, $routeParams, AccountsService, ResendConfirmationService,
                  ViewPaymentNotificationHistoryService, Card, $location,
                  $sorter, $filter, ErrorMessages, accountLabelFilter, $q, NotificationCostService) {
            $scope.sortBy = $sorter;
            $scope.sortBy('paymentDate');

            $scope.changeAccountTo = function (formattedNumber) {
                $location.path('/payment-notification/history/' + formattedNumber).replace();
            };

            var formatPaymentNotificationHistory = function (originalHistory) {
                return {
                    paymentDate: originalHistory.beneficiary.recentPayment[0].date,
                    amount: originalHistory.beneficiary.recentPayment[0].amount.amount,
                    beneficiaryName: originalHistory.beneficiary.name,
                    beneficiaryReference: originalHistory.beneficiary.recipientReference,
                    paymentConfirmationMethod: originalHistory.beneficiary.paymentConfirmation.confirmationType,
                    recipientName: originalHistory.beneficiary.paymentConfirmation.recipientName,
                    sentTo: originalHistory.beneficiary.paymentConfirmation.address,
                    originalHistory: originalHistory
                };
            };

            $scope.clearSelection = function () {
                $scope.selectedHistory = undefined;
            };

            $scope.resend = function (paymentNotificationHistoryItem) {
                var deferred = $q.defer();
                ResendConfirmationService.resendConfirmation(Card.current(),
                    paymentNotificationHistoryItem.originalHistory).then(function (response) {
                        if (response.success) {
                            $scope.isSuccessful = true;
                            $scope.successMessage = "Notification resent to " + paymentNotificationHistoryItem.recipientName;
                        } else {
                            $scope.isSuccessful = false;
                            $scope.successMessage = undefined;
                            $scope.errorMessage = response.message;
                            deferred.reject(response);
                        }
                        deferred.resolve();
                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            $scope.isAboutToSend = function (paymentNotificationHistoryItem) {
                return $scope.selectedHistory === paymentNotificationHistoryItem.originalHistory;
            };

            $scope.markForResend = function (paymentNotificationHistoryItem) {
                return $scope.selectedHistory = paymentNotificationHistoryItem.originalHistory;
            };

            $scope.actionMessage = function (paymentConfirmationMethod) {
                var cost = NotificationCostService.getCost(paymentConfirmationMethod).toFixed(2);
                return 'Resend payment notification? Note that you will be charged a fee of <span class="rand-amount">R ' + cost + '</span> for this ' + paymentConfirmationMethod;
            };

            AccountsService.list(Card.current()).then(function (accountData) {
                $scope.payFromAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);

                $scope.selectedAccount = _.find($scope.payFromAccounts, {formattedNumber: $routeParams.formattedNumber});

                if (!$scope.selectedAccount) {
                    $location.path('/payment-notification/history/' + $scope.payFromAccounts[0].formattedNumber).replace();
                    return;
                }

                return ViewPaymentNotificationHistoryService.viewPaymentNotificationHistory($scope.selectedAccount).then(function (paymentNotificationHistory) {
                    $scope.paymentNotificationHistory =
                        _.map(paymentNotificationHistory.paymentConfirmationItems, formatPaymentNotificationHistory);
                    $scope.warningMessage = paymentNotificationHistory.warningMessage;
                });

            }).catch(function (error) {
                $scope.errorMessage = ErrorMessages.messageFor(error);
            });

        });
}());
