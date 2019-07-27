(function (app) {
    'use strict';

    app.factory('RcpRequestLimitsService', function (LimitsService) {

        var RcpRequestLimitsService = function () {
        };
        RcpRequestLimitsService.prototype = new LimitsService();

        RcpRequestLimitsService.prototype.hint = function () {
            return 'You agree to pay more than the required minimum repayment amount';
        };

        RcpRequestLimitsService.prototype.checks = function () {
            var self = this;

            var checks = LimitsService.prototype.checks.apply(this);
            checks = [
                function (values) {
                    if (!values.amount || values.amount < values.minimumLoanAmount || values.amount > values.maximumLoanAmount) {
                        return self.errorMessage('requestedLoanAmount', 'Please enter an amount between <span class="rand-amount">R ' + values.minimumLoanAmount + '</span> and <span class="rand-amount">R ' + values.maximumLoanAmount + '</span>');
                    }
                },
                checks[1],
                function (values) {
                    if (values.amount % 100 > 0) {
                        return self.errorMessage('requestedLoanAmount', 'Please enter an amount in 100s or 1000s, e.g. <span class="rand-amount">R 600</span>, <span class="rand-amount">R 5700</span>');
                    }
                }

            ];
            return checks;
        };
        return RcpRequestLimitsService;
    });
})(angular.module('refresh.accountOrigination.rcp.services.rcpRequestLimitsService', ['refresh.limits']));