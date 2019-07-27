(function (app) {
    'use strict';

    app.factory('RcpDebitOrderLimitsService', function (LimitsService) {

        var RcpDebitOrderLimitService = function () {
        };
        
        RcpDebitOrderLimitService.prototype = new LimitsService();

        RcpDebitOrderLimitService.prototype.hint = function () {
            return 'You agree to pay more than the required minimum repayment amount';
        };

        RcpDebitOrderLimitService.prototype.checks = function () {
            var self = this;

            var checks = LimitsService.prototype.checks.apply(this);
            checks = _.slice(checks, 0, 2);
            checks.push(function (values) {
                if (values.amount < values.limit) {
                    return self.errorMessage('debitOrderLimit', 'Please enter the minimum amount of <span class="rand-amount">R ' + values.limit + '</span> or higher');
                }
            });
            return checks;
        };
        return RcpDebitOrderLimitService;
    });
})(angular.module('refresh.accountOrigination.rcp.services.rcpDebitOrderLimits', ['refresh.limits']));