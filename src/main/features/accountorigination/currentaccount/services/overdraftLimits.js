(function (app) {
    'use strict';
    app.factory('OverdraftLimitsService', function (LimitsService) {

        var OverdraftLimitsService = function () {};
        
        OverdraftLimitsService.prototype = new LimitsService();

        OverdraftLimitsService.prototype.hint = function () {
            return 'Enter in 100s or 1000s, e.g. <span class="rand-amount">R 600, R 5700</span>';
        };

        OverdraftLimitsService.prototype.checks = function () {
            var self = this;

            var checks = LimitsService.prototype.checks.apply(this);
            checks = _.slice(checks, 0, 2);
            checks.push(function(values) {
                if (values.amount > values.limit) {
                    return self.errorMessage('overdraftLimit', 'Please enter an amount up to <span class="rand-amount">R ' + values.limit + '</span>');
                }
            });
            checks.push(function(values) {
                if (values.amount % 100) {
                    return self.errorMessage('multiples','Please enter a valid amount as per guidelines below');
                }
            });
            // todo: reuse this check with prepaidlimits
            checks.push(function (values) {
                if (!/^\d+$/.test(values.amount)) {
                    return self.errorMessage('decimalError', 'Please enter the amount in rands only');
                }
            });
            return checks;
        };
        return OverdraftLimitsService;
    });
})(angular.module('refresh.accountOrigination.currentAccount.services.overdraftLimits', ['refresh.limits']));