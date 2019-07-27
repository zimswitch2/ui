(function () {
    'use strict';

    var module = angular.module('refresh.instantMoney.limits', [
        'refresh.limits'
    ]);

    module.factory('InstantMoneyLimitsService', function (LimitsService) {
        var InstantMoneyLimitsService = function () {
        };

        InstantMoneyLimitsService.prototype = new LimitsService();


        InstantMoneyLimitsService.prototype.hint = function () {
            return 'Enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5 000</span>';
        };

        InstantMoneyLimitsService.prototype.checks = function () {
            var self = this;
            var checks = LimitsService.prototype.checks.apply(this);
            checks.push(function (values) {
                if (values.amount % 10 > 0) {
                    return self.errorMessage('multipleOfTen', 'Please enter an amount that is a multiple of <span class="rand-amount">R 10</span>');
                }
            });

            checks.push(function (values) {
                if (values.amount < 50) {
                    return self.errorMessage('minimumAmount', 'Please enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5000</span>');
                }
            });

            checks.push(function (values) {
                if (values.amount > 5000) {
                    return self.errorMessage('maximumAmount', 'Please enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5000</span>');
                }
            });

            checks.push(function (values) {
                if (values.amount > values.dailyWithdrawalLimit) {
                    return self.errorMessage('availableDailyLimit', 'The amount exceeds your daily withdrawal limit');
                }
            });

            checks.push(function(values){
                if(values.amount > values.remainingEAP){
                    return self.errorMessage('remainingEAP', 'The amount exceeds your available limit');
                }
            });

            checks.push(function (values){
                if(values.monthlyLimit > 25000){
                    return self.errorMessage('monthlyLimit', 'The amount exceeds your monthly limit of <span class="rand-amount">R 25000</span>');
                }
            });

            return checks;

        };
        return InstantMoneyLimitsService;
    });
}());