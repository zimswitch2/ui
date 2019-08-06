var updateBeneficiaryReferencesOnPayFeature = false;
var accountSharing = false;

if (feature.updateBeneficiaryReferencesOnPay) {
    updateBeneficiaryReferencesOnPayFeature = true;
}

if(feature.accountSharing) {
    accountSharing = true;
}

(function () {
    'use strict';

    angular.module('refresh.payment')
        .config(function ($routeProvider) {
            $routeProvider.when('/payment/beneficiary', {
                templateUrl: 'features/payment/partials/payBeneficiary.html',
                controller: 'BeneficiaryPaymentController'
            });
        });

    angular.module('refresh.payment')
        .controller('BeneficiaryPaymentController', function ($scope, $location, AccountsService,
                                                              AccountsValidationService, ApplicationParameters,
                                                              BeneficiaryPaymentService, Card, Flow,
                                                              BeneficiariesState, PaymentLimitsService, OperatorPaymentLimitsService, BeneficiariesService,
                                                              MonthlyPaymentLimits, BeneficiaryPayment, LimitMaintenanceService, User, BeneficiariesListService) {

            $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
            $scope.statementDate = moment();

            $scope.paymentDetail = BeneficiaryPayment.getPaymentDetail();
            $scope.paymentConfirmation = BeneficiaryPayment.getPaymentConfirmation();
            $scope.amount = BeneficiaryPayment.getAmount();
            $scope.isRecurringPayment = BeneficiaryPayment.getPaymentDetail().isRecurringPayment();
            $scope.beneficiary = BeneficiaryPayment.getBeneficiary();
            $scope.errorMessage = BeneficiaryPayment.getErrorMessage();

            var initialPaymentConfirmationSettings = _.cloneDeep($scope.beneficiary.paymentConfirmation);
            var hasPaymentConfirmationSettings = $scope.paymentConfirmation;

            $scope.isNew = true;
            $scope.paySingleBeneficiary = true;

            $scope.showInvalidBeneficiaryModal = false;

            if(accountSharing) {
                $scope.limitsService = User.isSEDOperator() ? new OperatorPaymentLimitsService() : new PaymentLimitsService();
            }

            if(!accountSharing) {
                $scope.limitsService = new PaymentLimitsService();
            }

            var initialReferences = {
                customerReference: $scope.beneficiary.customerReference,
                recipientReference: $scope.beneficiary.recipientReference
            };

            $scope.saveReferences = {
                saveCustomerRef: false,
                saveRecipientRef: false
            };

            var setAccountData = function (accountData) {
		console.log("++++ accountData: " + JSON.stringify(accountData));
                $scope.allAccounts = accountData.accounts;
                $scope.cardProfile = accountData.cardProfile;

                MonthlyPaymentLimits.setAvailableEAPLimit($scope.cardProfile.remainingEAP.amount);
                MonthlyPaymentLimits.setUsedEAPLimit($scope.cardProfile.usedEAPLimit.amount);

                $scope.monthlyEAPLimit = $scope.cardProfile.monthlyEAPLimit.amount;
                $scope.availableEAPLimit = $scope.cardProfile.remainingEAP.amount;
                $scope.usedEAPLimit = $scope.cardProfile.usedEAPLimit.amount;

                $scope.hasZeroEAPLimit = $scope.monthlyEAPLimit === 0;

                $scope.payFromAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);
                var validateResult = AccountsValidationService.validatePaymentFromMessage($scope.payFromAccounts);
                $scope.hasInfo = validateResult.hasInfo;
                $scope.infoMessage = validateResult.infoMessage;

                if (_.isEmpty(updateAccount($scope.account, accountData.accounts))) {
                    $scope.account = $scope.payFromAccounts[0];
                } else {
                    $scope.account = updateAccount($scope.account, accountData.accounts);
                }
            };

            var updateAccount = function (oldAccount, updatedAccounts) {
                return oldAccount ? _.find(updatedAccounts, {formattedNumber: oldAccount.formattedNumber}) : [];
            };


            $scope.isSuccessful = false;
            $scope.state = 'paymentDetails';

            AccountsService.list(Card.current()).then(function (accountData) {
                setAccountData(accountData);
            });

            Flow.create(['Enter details', 'Confirm details'], 'Pay single beneficiary');
            if (BeneficiaryPayment.getState() === 'reviewing') {
                $scope.state = 'reviewing';
                Flow.next();
            }

            $scope.isListedBeneficiary = function () {
                return $scope.beneficiary.beneficiaryType === 'COMPANY';
            };

            $scope.setEmail = function () {
                $scope.beneficiary.paymentConfirmation.confirmationType = 'Email';
            };

            $scope.$watch('paymentConfirmation', function () {
                if ($scope.paymentConfirmation) {
                    if ($scope.beneficiary.paymentConfirmation.confirmationType === 'None') {
                        $scope.setEmail();
                        $scope.beneficiary.paymentConfirmation.recipientName = ($scope.beneficiary.name && !$scope.isListedBeneficiary()) ? $scope.beneficiary.name : null;
                        initialPaymentConfirmationSettings = _.cloneDeep($scope.beneficiary.paymentConfirmation);
                    }
                }
            });


            $scope.highlightBalance = function () {
                return $scope.watcher().type === 'availableBalanceExceeded';
            };

            $scope.enforcer = function (value) {
                return $scope.limitsService.enforce({
                    amount: value,
                    account: $scope.account,
                    cardProfile: $scope.cardProfile,
                    date: $scope.paymentDetail.fromDate
                });
            };

            $scope.watcher = function () {
                return $scope.enforcer($scope.amount.value);
            };

            function updateBeneficiary() {
                var customerRefChanged = $scope.beneficiary.customerReference !== initialReferences.customerReference;
                var recipientRefChanged = $scope.beneficiary.recipientReference !== initialReferences.recipientReference;
                if ($scope.saveReferences.saveCustomerRef && customerRefChanged ||
                    $scope.saveReferences.saveRecipientRef && recipientRefChanged) {
                    BeneficiaryPayment.setState('reviewing');
                    var updatedBeneficiary = _.clone($scope.beneficiary);
                    if (!$scope.saveReferences.saveCustomerRef) {
                        updatedBeneficiary.customerReference = initialReferences.customerReference;
                    }
                    if (!$scope.saveReferences.saveRecipientRef) {
                        updatedBeneficiary.recipientReference = initialReferences.recipientReference;
                    }
                    BeneficiariesService.addOrUpdate(updatedBeneficiary, Card.current()).then(function () {
                        reloadViewWithUpdatedLimits();
                    });
                }
            }

            $scope.proceed = function () {

                if (accountSharing && User.isCurrentDashboardSEDPrincipal()) {
                    BeneficiariesListService
                        .isBeneficiaryValid(Card.current(), $scope.beneficiary.recipientId)
                        .then(function (isValid) {
                            if (isValid) {
                                if (updateBeneficiaryReferencesOnPayFeature) {
                                    updateBeneficiary();
                                }

                                $scope.state = 'reviewing';
                                Flow.next();
                                $scope.flow = Flow.get();
                            } else {
                                showInvalidBeneficiaryModel(true);
                            }
                        });
                } else {
                    if (updateBeneficiaryReferencesOnPayFeature) {
                        updateBeneficiary();
                    }

                    $scope.state = 'reviewing';
                    Flow.next();
                    $scope.flow = Flow.get();
                }
            };

            var showInvalidBeneficiaryModel = function(show) {
                $scope.showInvalidBeneficiaryModal = show;
            };

            $scope.refreshBeneficiaryList = function(){
                showInvalidBeneficiaryModel(false);
                $location.path('/beneficiaries/list');
            };

            $scope.onceOffPayment = function(){
                showInvalidBeneficiaryModel(false);
                $location.path('/payment/onceoff');
            };

            $scope.modify = function () {
                $scope.state = 'paymentDetails';
                Flow.previous();
                $scope.flow = Flow.get();
            };

            $scope.done = function () {
                $location.path('/beneficiaries/list').replace();
            };

            var reloadViewWithUpdatedLimits = function () {
                $location.path('/payment/beneficiary').replace();
            };

            var reloadViewWithUpdatedLimitError = function (error) {
                BeneficiaryPayment.setErrorMessage(error.message);
                $location.path('/payment/beneficiary').replace();
            };

            var requiredMonthlyEapLimit = function () {
                return parseFloat($scope.amount.value || 0) + $scope.cardProfile.usedEAPLimit.amount;
            };

            $scope.increaseEapLimit = function () {
                var request = {
                    "card": {
                        "number": Card.current().number
                    },
                    "newEAPLimit": {
                        "amount": requiredMonthlyEapLimit(),
                        "currency": "ZAR"
                    }
                };

                LimitMaintenanceService.maintain(request).then(function () {
                    AccountsService.clear();
                    reloadViewWithUpdatedLimits();
                }).catch(function (error) {
                    reloadViewWithUpdatedLimitError(error);
                });
            };

            $scope.showIncreaseEapLimitSection = function () {
                return !$scope.isCapture() && ($scope.amount.value > $scope.cardProfile.remainingEAP.amount);
            };

            $scope.confirm = function () {
                if (!$scope.paymentConfirmation) {
                    $scope.beneficiary.originalBeneficiary.paymentConfirmation =
                    {
                        address: null,
                        confirmationType: 'None',
                        recipientName: null,
                        sendFutureDated: null
                    };
                }

                var updateFlowAndState = function (result) {
                    $scope.isSuccessful = true;
                    $scope.state = result.isWarning ? 'successWithWarning' : 'done';

                    Flow.next();
                    $scope.flow = Flow.get();
                };

                var beneficiary = $scope.beneficiary.originalBeneficiary;
                beneficiary.customerReference = $scope.beneficiary.customerReference;
                beneficiary.recipientReference = $scope.beneficiary.recipientReference;

                var payment = {
                    beneficiary: beneficiary,
                    account: $scope.account,
                    amount: $scope.amount.value,
                    date: $scope.paymentDetail.fromDate,
                    repeatInterval: $scope.paymentDetail.repeatInterval,
                    repeatNumber: $scope.paymentDetail.repeatNumber
                };

                BeneficiaryPaymentService.payBeneficiary(payment).then(function (result) {
                    AccountsService.list(Card.current()).then(function (accountData) {
                        setAccountData(accountData);
                    });

                    updateFlowAndState(result);
                    if (result.isWarning) {
                        warning();
                    }
                    $scope.result = result;
                    $scope.successMessage = result.successMessage;
                }, function (error) {
                    failure(error.message);
                });
            };

            $scope.isCapture = function () {
                return !User.isCurrentDashboardCardHolder();
            };

            $scope.submitForApproval = function () {

                if (accountSharing && User.isCurrentDashboardSEDPrincipal()) {
                    BeneficiariesListService
                        .isBeneficiaryValid(Card.current(), $scope.beneficiary.recipientId)
                        .then(function (isValid) {
                            if (isValid) {
                                $scope.isSuccessful = true;
                                $scope.successMessage = "Payment request was successfully sent, it is now waiting for approval";
                                $scope.state = 'done';
                                // TODO: submit for approval call to gateway
                                // TODO: send through reason for payment on capture
                                //beneficiary.reasonForPayment = $scope.beneficiary.reasonForPayment;
                            } else {
                                showInvalidBeneficiaryModel(true);
                            }
                        });
                }
            };

            function warning() {
                $scope.errorMessage = 'Your notification could not be delivered because the email address was invalid';
            }

            function failure(customErrorMessage) {
                $scope.state = 'paymentDetails';
                $scope.errorMessage = customErrorMessage ? 'Could not process payment' + customErrorMessage : undefined;
                Flow.previous();
                $scope.flow = Flow.get();
            }

            var confirmationWatches = ['paymentConfirmation', 'beneficiary.paymentConfirmation.confirmationType', 'beneficiary.paymentConfirmation.recipientName', 'beneficiary.paymentConfirmation.address'];

            _.each(confirmationWatches, function (confirmationSetting) {
                $scope.$watch(confirmationSetting, function () {
                    if (_.isEqual($scope.beneficiary.paymentConfirmation, initialPaymentConfirmationSettings) && ($scope.paymentConfirmation === hasPaymentConfirmationSettings)) {
                        $scope.confirmationTypeNotification = undefined;
                    } else {
                        $scope.confirmationTypeNotification = 'Selected notification method will apply to this payment only';
                    }
                });
            });
        });
})();
