(function (app) {
    'use strict';

    app.controller('RechargeDetailsController', function ($scope, $location, AccountsService, AccountsValidationService, Card,
                                                          ViewModel, Flow, ApplicationParameters, RechargeLimitsService,
                                                          $routeParams, RechargeService) {
        Flow.create(['Enter details', 'Confirm details', 'Enter OTP'], 'Buy prepaid', '/prepaid');
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
        $scope.recharge = ViewModel.initial();
        $scope.errorMessage = $scope.recharge.error;

        var limitsService = new RechargeLimitsService();

        if (!$scope.recharge.providers) {
            RechargeService.listProviders().then(function (listOfProviders) {
                $scope.recharge.providers = listOfProviders;
                $scope.recharge.provider = _.find($scope.recharge.providers, {id: $routeParams.providerId});
                if (!$scope.recharge.provider) {
                    return $location.path('/prepaid');
                }
                $scope.recharge.provider.productName = $scope.recharge.provider.products[0].name;

                if ($scope.recharge.provider.infoMessage) {
                    $scope.displayNotification = {type: 'info', message: $scope.recharge.provider.infoMessage, hasInfo: true};
                }
            });
        }

        if (!$scope.recharge.fromAccounts) {
            AccountsService.list(Card.current()).then(function (response) {
                $scope.recharge.dailyWithdrawalLimit = response.cardProfile.dailyWithdrawalLimit.amount;
                $scope.recharge.fromAccounts = AccountsService.validFromPaymentAccounts(response.accounts);
                var validateResult = AccountsValidationService.validatePaymentFromMessage($scope.recharge.fromAccounts);
                if (validateResult.hasInfo) {
                    $scope.displayNotification =
                    {type: 'info', message: validateResult.infoMessage, hasInfo: validateResult.hasInfo};
                }
                $scope.recharge.account = $scope.recharge.fromAccounts[0];
            });
        }

        $scope.proceed = function () {
            ViewModel.current($scope.recharge);
            Flow.next();
            $location.path('/prepaid/recharge/' + $scope.recharge.provider.id + "/confirm");
        };

        $scope.cancel = function () {
            ViewModel.initial();
        };

        $scope.enforcer = function () {
            if ($scope.recharge.provider && $scope.recharge.provider.product) {
                return limitsService.enforce({
                    dailyWithdrawalLimit: $scope.recharge.dailyWithdrawalLimit,
                    account: $scope.recharge.account,
                    prepaidProduct: $scope.recharge.provider.product
                });
            }
            return {};
        };

        var getErrorMessageFor = function (errorType) {
            var errorMessage = $scope.enforcer();
            if (errorMessage.type === errorType) {
                return errorMessage.message;
            }
        };

        $scope.amountExceedsAvailableBalance = function () {
            if (!$scope.recharge.provider || !$scope.recharge.provider.product) {
                return false;
            }
            return getErrorMessageFor('availableBalanceExceeded');
        };

        $scope.amountExceedsDailyWithdrawalLimit = function () {
            if (!$scope.recharge.provider || !$scope.recharge.provider.product) {
                return false;
            }
            return getErrorMessageFor('availableDailyLimit');
        };

        $scope.$watch('recharge.provider', function (newValue) {
            if (!newValue) {
                return;
            }
            $location.path('/prepaid/recharge/' + $scope.recharge.provider.id);
        });

        $scope.$watch('recharge.provider.productName', function (newValue) {
            if (!newValue) {
                return;
            }
            $scope.recharge.provider.product =
                _.find($scope.recharge.provider.products, {name: $scope.recharge.provider.productName});
            if ($scope.recharge.provider.product.bundles && !$scope.recharge.provider.product.bundle) {
                $scope.recharge.provider.product.bundle = $scope.recharge.provider.product.bundles[0];
            }
        });
    });
})(angular.module('refresh.prepaid.recharge.controllers.details', ['ngRoute', 'refresh.accounts',
    'refresh.recharge.limits', 'refresh.prepaid.recharge.services', 'refresh.errorMessages', 'refresh.filters']));
