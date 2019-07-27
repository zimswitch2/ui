(function (app) {
    'use strict';

    app.factory('RechargeLimitsService', function (LimitsService) {
        var RechargeLimitsService = function () {};

        RechargeLimitsService.prototype = new LimitsService();

        RechargeLimitsService.prototype.enforce = function (values) {
            values.amount = values.prepaidProduct.bundle ? values.prepaidProduct.bundle.amount.amount : values.prepaidProduct.amount;
            var messages = _.map(this.checks(), function (check) {
                return check(values);
            });
            return _.find(messages, function (message) {
                return message !== undefined;
            }) || {};
        };

        RechargeLimitsService.prototype.checks = function () {
            var self = this;
            var checks = LimitsService.prototype.checks.apply(this);
            var availableBalanceCheck = checks.pop();
            var currencyFormat = checks.pop();

            checks.push(function (values) {
                var range = values.prepaidProduct.range;
                if (range && (values.amount < range.min || values.amount > range.max)) {
                    return self.errorMessage('invalidRechargeAmount', 'Please enter an amount within the specified range');
                }
            });
            checks.push(function (values) {
                if (values.amount > values.dailyWithdrawalLimit) {
                    return self.errorMessage('availableDailyLimit', 'The amount exceeds your daily withdrawal limit');
                }
            });

            checks.push(function (values) {
                if (!values.prepaidProduct.bundle && !/^\d+$/.test(values.amount)) {
                    return self.errorMessage('currencyFormat', 'Please enter the amount in rands only');
                }
            });

            checks.push(availableBalanceCheck);
            return checks;
        };

        return RechargeLimitsService;
    });
})(angular.module('refresh.recharge.limits', ['refresh.limits']));
