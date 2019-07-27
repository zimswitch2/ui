(function (app) {
    'use strict';

    app.factory('BaseMultipleBeneficiaries',
        function ($window, $location, BeneficiariesListService, Card, AccountsService,
                  AccountsValidationService, MultiplePaymentsService, ApplicationParameters, $timeout) {
            return {
                setupScope: function ($scope) {
                    $scope.printId = undefined;
                    $scope.showDetailsId = undefined;
                    $scope.payMultiple = true;
                    $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
                    $scope.printDate = new Date();
                    $scope.printSelectedTransaction = undefined;

                    $scope.$on('$locationChangeStart', function (scope, next) {
                        if (!next.match('/beneficiaries/pay-multiple') && !next.match('/beneficiaries/pay-group')) {
                            $scope.amounts = [];
                            MultiplePaymentsService.reset();
                        }
                    });

                    function wantsNotificationAndDoesNotHaveOneYet() {
                        return $scope.paymentConfirmation &&
                            $scope.beneficiary.paymentConfirmation.confirmationType === "None";
                    }

                    function doesNotWantNotifications() {
                        return !$scope.paymentConfirmation;
                    }

                    $scope.print = function (resultID) {
                        $scope.printSelectedTransaction = _.find($scope.paymentResults, {beneficiary:{recipientId: resultID}});

                        $timeout(function () {
                            $window.print();
                            $scope.printSelectedTransaction = undefined;
                        });
                    };

                    $scope.$watch("paymentConfirmation", function () {
                        if ($scope.beneficiary) {
                            if (wantsNotificationAndDoesNotHaveOneYet()) {
                                $scope.setEmail();
                            } else if (doesNotWantNotifications()) {
                                $scope.clearFields();
                            }
                        }
                    });

                    $scope.clearFields = function () {
                        $scope.beneficiary.paymentConfirmation.address = null;
                        $scope.beneficiary.paymentConfirmation.recipientName = null;
                        $scope.beneficiary.paymentConfirmation.confirmationType = "None";
                    };

                    $scope.setEmail = function () {
                        $scope.beneficiary.paymentConfirmation.confirmationType = "Email";
                    };

                    $scope.editNotificationPreferences = function (currentBeneficiary) {
                        $scope.beneficiary = currentBeneficiary;

                        var originalBeneficiaryIndex = _.findIndex($scope.beneficiaries,
                            {recipientId: currentBeneficiary.recipientId});
                        $scope.originalBeneficiary =
                        {index: originalBeneficiaryIndex, beneficiary: _.cloneDeep(currentBeneficiary)};

                        $scope.paymentConfirmation =
                            (currentBeneficiary.paymentConfirmation.confirmationType !== 'None');
                    };

                    $scope.closeNotificationPreferences = function () {
                        $scope.beneficiary = undefined;
                    };

                    $scope.cancel = function () {
                        $scope.beneficiaries[$scope.originalBeneficiary.index] =
                            _.cloneDeep($scope.originalBeneficiary.beneficiary);
                        $scope.beneficiary = undefined;
                        $scope.originalBeneficiary = undefined;
                    };

                    $scope.initialize = function () {
                        $scope.query = '';
                        getAccounts().then(function () {
                            BeneficiariesListService.formattedBeneficiaryList(Card.current()).then(function (beneficiaryList) {
                                var beneficiariesBeingPaid = _.map(MultiplePaymentsService.selectedPayments(),
                                    function (payment) {
                                        return payment.beneficiary;
                                    });
                                _.each(beneficiariesBeingPaid, function (beneficiaryBeingPaid) {
                                    var beneficiaryIndex = _.findIndex(beneficiaryList, function (beneficiary) {
                                        return beneficiary.recipientId === beneficiaryBeingPaid.recipientId;
                                    });
                                    beneficiaryList[beneficiaryIndex] = beneficiaryBeingPaid;
                                });
                                $scope.beneficiaries = beneficiaryList;
                                $scope.amounts = MultiplePaymentsService.amounts();
                            });
                        });
                    };

                    $scope.confirmation = function () {
                        getAccounts().then(function () {
                            $scope.selectedPayments = MultiplePaymentsService.selectedPayments();
                        });
                    };

                    function cleanAmounts() {
                        _.forEach(_.keys($scope.amounts), function (key) {
                            if ($scope.amounts[key] === '') {
                                delete $scope.amounts[key];
                            }
                        });
                    }

                    $scope.setDetailsId = function (beneficiaryId) {
                        if ($scope.showDetailsId === beneficiaryId) {
                            $scope.showDetailsId = undefined;
                        } else {
                            $scope.showDetailsId = beneficiaryId;
                        }
                    };

                    $scope.toggleDetails = function (beneficiaryId) {
                        return $scope.showDetailsId === beneficiaryId;
                    };

                    $scope.updateSelectedBeneficiaries = function (beneficiary) {
                        cleanAmounts();
                        MultiplePaymentsService.updatePayments(beneficiary, $scope.amounts);
                        $scope.totalAmount = MultiplePaymentsService.totalAmount();
                        validateTotalAmount();
                    };

                    $scope.confirmAndRedirectTo = function (path) {
                        ApplicationParameters.pushVariable('canDelay', true);
                        MultiplePaymentsService.payMultipleBeneficiaries($scope.account).then(function (response) {
                            $scope.account.availableBalance.amount = response.data.account[0].availableBalance.amount;
                            MultiplePaymentsService.confirm(response.data.transactionResults);
                            $location.path(path);
                        });
                    };

                    $scope.isCompanyBeneficiary = function (paymentResult) {
                        return paymentResult && paymentResult.beneficiary.beneficiaryType === "COMPANY";
                    };

                    $scope.results = function () {
                        $scope.paymentResults = MultiplePaymentsService.paymentResults();
                        getAccounts().then(function () {
                            MultiplePaymentsService.reset();
                        });
                    };

                    $scope.updateFromAccount = function (account) {
                        MultiplePaymentsService.updateFromAccount(account);
                        validateTotalAmount();
                    };

                    $scope.invalid = function () {
                        return $scope.invalidAvailableTransferLimit ||
                            $scope.invalidAvailableBalance ||
                            $scope.totalAmount <= 0 ||
                            $scope.payFromAccounts === undefined ||
                            $scope.payFromAccounts.length === 0;
                    };

                    $scope.findBeneficiariesWithAmount = function () {
                        var beneficiariesWithAmounts = [];
                        _.forEach(_.keys($scope.amounts), function (key) {
                            if ($scope.amounts[key] > 0) {
                                var beneficiary = _.where($scope.beneficiaries, {recipientId: Number(key)});
                                beneficiariesWithAmounts = _.union(beneficiariesWithAmounts, beneficiary);
                            }
                        });
                        return beneficiariesWithAmounts;
                    };

                    $scope.isNonEmptySearchQuery = function () {
                        return $scope.query !== '' && $scope.query !== undefined;
                    };

                    function getAccounts() {
                        return AccountsService.list(Card.current()).then(function (accountData) {
                            var cardProfile = accountData.cardProfile;
                            var monthlyEAPLimit = cardProfile.monthlyEAPLimit.amount;
                            var usedEAPLimit = cardProfile.usedEAPLimit.amount;

                            $scope.monthlyEAPLimit = monthlyEAPLimit;
                            $scope.hasZeroEAPLimit = $scope.monthlyEAPLimit === 0;
                            $scope.availableEAPLimit = monthlyEAPLimit - usedEAPLimit;

                            $scope.payFromAccounts =
                                angular.copy(AccountsService.validFromPaymentAccounts(accountData.accounts));
                            var validateResult = AccountsValidationService.validatePaymentFromMessage($scope.payFromAccounts);
                            $scope.hasInfo = validateResult.hasInfo;
                            $scope.infoMessage = validateResult.infoMessage;
                            $scope.account =
                                angular.copy(MultiplePaymentsService.getFromAccount($scope.payFromAccounts));

                            $scope.totalAmount = MultiplePaymentsService.totalAmount();
                        });
                    }

                    var validateTotalAmount = function () {
                        $scope.invalidAvailableTransferLimit =
                            $scope.totalAmount > 0 && ($scope.totalAmount > $scope.availableEAPLimit);
                        if ($scope.account) {
                            $scope.invalidAvailableBalance =
                                $scope.totalAmount > 0 && ($scope.totalAmount > $scope.account.availableBalance.amount);
                        }
                    };

                    $scope.isCompany = function (currentBeneficiary) {
                        return currentBeneficiary.beneficiaryType === 'COMPANY';
                    };
                }
            };
        });

})(angular.module('refresh.beneficiaries.base.multiple.beneficiaries',
    ['refresh.accounts', 'refresh.login', 'refresh.payment', 'refresh.notifications']));
