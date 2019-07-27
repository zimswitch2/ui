(function (app) {
    'use strict';

    app.controller('MaintainMonthlyEAPLimitController', function ($scope, AccountsService, Card, EAPLimitValidations,
                                                                  LimitMaintenanceService, MonthlyPaymentLimits,
                                                                  ProfilesAndSettingsMenu, Flow, ViewModel, $location) {
        $scope.menuItems = ProfilesAndSettingsMenu.getMenu();
        $scope.eapLimitValidations = new EAPLimitValidations();
        var successInfo = ViewModel.current();
        if (successInfo.isSuccessful) {
            $scope.isSuccessful = successInfo.isSuccessful;
            $scope.successMessage = successInfo.message;
        }

        var viewModel = ViewModel.initial();
        if (viewModel.error) {
            $scope.errorMessage = viewModel.error;
        }

        $scope.newEAPLimit = {amount: undefined};

        var initialize = function () {
            Flow.create(['Monthly Payment Limit', 'Enter OTP'], 'Monthly Payment Limit', '/monthly-payment-limit');
            AccountsService.list(Card.current()).then(function (accountData) {
                $scope.cardProfile = accountData.cardProfile;
                $scope.hasZeroEAPLimit = accountData.cardProfile.monthlyEAPLimit.amount === 0;
            });
        };

        $scope.newEAPLimitChange = function () {
            var newEAPLimit = angular.isString($scope.newEAPLimit.amount) ? parseFloat($scope.newEAPLimit.amount) :
                $scope.newEAPLimit.amount;
            var usedEAPLimit = $scope.cardProfile.usedEAPLimit.amount;
            if (newEAPLimit < usedEAPLimit) {
                $scope.infoMessage =
                    'Decreasing your limit to below the used limit amount will result in you not being able to make any further online payments this month.';
            } else {
                delete $scope.infoMessage;
            }
        };

        $scope.enforcer = function (newEAPLimit) {
            return $scope.eapLimitValidations.enforce({amount: newEAPLimit, cardProfile: $scope.cardProfile});
        };

        $scope.cancel = function () {
            $scope.isDecreasingLimit = false;
            $scope.newEAPLimit.amount = undefined;
        };

        $scope.edit = function () {
            $scope.isDecreasingLimit = true;
        };

        function updateLimits(newLimits) {
            $scope.limits = {
                monthlyEAPLimit: newLimits.monthlyEAPLimit.amount,
                usedEAPLimit: newLimits.usedEAPLimit.amount,
                availableEAPLimit: newLimits.remainingEAP.amount
            };
            $scope.cardProfile.monthlyEAPLimit.amount = newLimits.monthlyEAPLimit.amount;
            $scope.cardProfile.remainingEAP.amount = newLimits.remainingEAP.amount;
            $scope.cardProfile.usedEAPLimit.amount = newLimits.usedEAPLimit.amount;
        }

        $scope.save = function () {
            var request = {
                "card": {
                    "number": Card.current().number
                },
                "newEAPLimit": {
                    "amount": $scope.newEAPLimit.amount,
                    "currency": "ZAR"
                }
            };

            Flow.next();
            LimitMaintenanceService.maintain(request).then(function (newLimits) {
                MonthlyPaymentLimits.setMonthlyLimit(newLimits.monthlyEAPLimit.amount);
                updateLimits(newLimits);
                AccountsService.clear();

                //For decrease the url will not be changed, so we need to set the scope values
                $scope.isSuccessful = true;
                $scope.successMessage = 'Monthly payment limit successfully updated';

                $scope.newEAPLimit.amount = undefined;
                delete $scope.isDecreasingLimit;
                delete $scope.errorMessage;

                //On OTP page
                if ($location.path() !== '/monthly-payment-limit') {
                    ViewModel.current({
                        message: $scope.successMessage,
                        isSuccessful: $scope.isSuccessful
                    });
                    $location.path('/monthly-payment-limit');
                } else {
                    initialize();
                }
            }).catch(function (serviceError) {
                $scope.errorMessage = serviceError.message;
                $scope.isSuccessful = false;
                delete $scope.successMessage;

                if (serviceError.otpError) {
                    ViewModel.error(serviceError);
                    $location.path('/monthly-payment-limit');
                }
            });
        };

        initialize();
    });
})(angular.module('refresh.profileAndSettings.maintainMonthlyEAP.controllers', [
    'refresh.card', 'refresh.limits', 'refresh.accounts',
    'refresh.profileAndSettings.limitMaintenanceService',
    'refresh.monthlyPaymentLimits', 'refresh.accordion', 'refresh.flow'
]));