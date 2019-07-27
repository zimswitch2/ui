(function (app) {
    'use strict';

    app.controller('MonthlyPaymentLimitsController', function ($scope, AccountsService, User, MonthlyPaymentLimits) {
        AccountsService.getEAPLimit(User.userProfile.currentDashboard.card)
            .then(function (accountLimits) {
                $scope.limits = {
                    monthlyEAPLimit: accountLimits.monthlyEAPLimit.amount,
                    usedEAPLimit: accountLimits.usedEAPLimit.amount,
                    availableEAPLimit: accountLimits.remainingEAP.amount
                };
                MonthlyPaymentLimits.setLimits($scope.limits);
            });

        $scope.progressPercentage = function () {
            if ($scope.limits) {
                var percentage = ($scope.limits.usedEAPLimit / $scope.limits.monthlyEAPLimit) * 100;
                return percentage > 100 ? 100 : percentage;
            } else {
                return 0;
            }
        };
    });

    app.factory('MonthlyPaymentLimits', function () {
        var _limits = {};
        return {
            setLimits: function (newLimits) {
                _limits = newLimits;
            },
            setMonthlyLimit: function (monthlyLimit) {
                _limits.monthlyEAPLimit = monthlyLimit;
            },
            setAvailableEAPLimit: function (availableLimit) {
                _limits.availableEAPLimit = availableLimit;
            },
            setUsedEAPLimit: function (usedLimit) {
                _limits.usedEAPLimit = usedLimit;
            }
        };
    });
})(angular.module('refresh.monthlyPaymentLimits', ['refresh.accounts', 'refresh.security.user', 'refresh.filters']));
