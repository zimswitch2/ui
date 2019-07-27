/*(function(){
    'use strict';

    angular
        .module('refresh.messenger.suggestionBox')
        .controller('SuggestionBoxController', function(ApplicationParameters, PaymentService, AccountsService, Card){
            var vm = this;

*/

            (function () {
                'use strict';

                angular
                    .module('refresh.accountSharing.operatorDetails')
                    .controller('SuggestionBoxController', function(MessagingService, $routeParams, $location) {

                        var vm = this;

                        MessagingService.getPeerList().then(function(peers){
                            vm.peers = peers.peers;
                            console.log("getPeerList results:");
                            console.log(peers);
                            console.log(peers.peers);
                            console.log(peers.peers[0].id.lastMessageText);
                            // console.log(peers.peers.data.peers);
                            // console.log(peers.peers.data.peers[0]);
                            // console.log(peers.peers.data.peers[0].peer);
                            // console.log(peers.peers[1].peer.lastMessageText);
                            //console.log("count : " + vm.peers.length);

                            vm.messages = vm.peers[0].messages;
                            console.log("text : " + vm.messages[0].text);
                            return vm.numberOfPeers = vm.peers.length;
                        });

                        /*
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
                        */

                    });
            }());
