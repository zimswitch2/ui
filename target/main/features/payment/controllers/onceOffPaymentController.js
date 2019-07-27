(function (app) {
    'use strict';
    app.config(function ($routeProvider) {
        $routeProvider.when('/payment/onceoff',
            {
                templateUrl: 'features/payment/partials/payBeneficiaryOnceOff.html',
                controller: 'OnceOffPaymentController'
            });
    });
    app.controller('OnceOffPaymentController',
        function ($scope, $location, AccountsService, AccountsValidationService,
                  OnceOffPaymentService, Card, Flow, BankService, CdiService, PaymentLimitsService, $window,
                  BranchLazyLoadingService, OnceOffPaymentModel, ApplicationParameters) {

            function setup() {
                Flow.create(['Enter details', 'Confirm details', 'OTP'], 'Once-off Payment');
                $scope.onceOffPaymentModel = OnceOffPaymentModel.getOnceOffPaymentModel();
                $scope.limitsService = new PaymentLimitsService();
                $scope.branches = {undefined: []};
                $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');

                BankService.list().then(function (banks) {
                    $scope.banks = _.map(banks, function (bank) {
                        bank.label = function () {
                            return bank.name;
                        };
                        return bank;
                    });
                });

                CdiService.list()
                    .then(function (cdi) {
                        $scope.cdi = _.map(cdi, function (listedBeneficiary) {
                            listedBeneficiary.label = function () {
                                return listedBeneficiary.name;
                            };
                            return listedBeneficiary;
                        });
                    });

                AccountsService.list(Card.current()).then(function (accountData) {

                    $scope.allAccounts = accountData.accounts;
                    OnceOffPaymentModel.setCardProfile(accountData.cardProfile);

                    $scope.payFromAccounts = AccountsService.validFromPaymentAccounts(accountData.accounts);
                    var validateResult = AccountsValidationService.validatePaymentFromMessage($scope.payFromAccounts);
                    $scope.hasInfo = validateResult.hasInfo;
                    $scope.infoMessage = validateResult.infoMessage;
                    if (!$scope.onceOffPaymentModel.account) {
                        OnceOffPaymentModel.setAccount($scope.payFromAccounts[0]);
                    }
                });
            }

            $scope.selectedBankBranches = function () {
                if ($scope.onceOffPaymentModel.beneficiary.bank) {
                    return $scope.branches[$scope.onceOffPaymentModel.beneficiary.bank.code];
                } else {
                    return $scope.branches[undefined];
                }
            };

            $scope.proceed = function () {

                Flow.next();
                $scope.flow = Flow.get();
                $location.path('/payment/onceoff/confirm');
            };

            $scope.highlightBalance = function () {
                return $scope.watcher().type === 'availableBalanceExceeded';
            };

            $scope.enforcer = function (value) {
                return $scope.limitsService.enforce({
                    amount: value,
                    account: $scope.account,
                    cardProfile: $scope.onceOffPaymentModel.cardProfile
                });
            };

            $scope.watcher = function () {
                return $scope.enforcer($scope.onceOffPaymentModel.amount);
            };

            $scope.changeBank = function () {
                BranchLazyLoadingService.bankUpdate($scope.branches, $scope.onceOffPaymentModel.beneficiary, $scope.onceOffPaymentModel.beneficiary.bank, $scope.onceOffPaymentModel.beneficiary.oldBank);
                OnceOffPaymentModel.setBeneficiary($scope.onceOffPaymentModel.beneficiary);
            };

            $scope.changeListedBeneficiary = function () {
                OnceOffPaymentModel.setListedBeneficiary($scope.onceOffPaymentModel.listedBeneficiary);
            };

            $scope.changePaymentConfirmation = function (newPaymentConfirmationValue) {
                OnceOffPaymentModel.setPaymentConfirmation(newPaymentConfirmationValue);
            };

            $scope.changeBeneficiaryName = function () {
                OnceOffPaymentModel.setBeneficiary($scope.onceOffPaymentModel.beneficiary);
            };

            $scope.changeConfirmationType = function (confirmationType) {
                OnceOffPaymentModel.setBeneficiaryPaymentConfirmationConfirmationType(confirmationType);
            };

            setup();
        });

})
(angular.module('refresh.onceOffPayment'));
