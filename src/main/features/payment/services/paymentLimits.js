(function (app) {
    'use strict';

    app.factory('PaymentLimitsService', function (LimitsService) {
        var PaymentLimitsService = function () {
        };
        PaymentLimitsService.prototype = new LimitsService();
        PaymentLimitsService.prototype.checks = function () {
            var self = this;

            PaymentLimitsService.prototype.withinCurrentMonth = function (date) {
                if (!moment.isMoment(date)) {
                    date = moment(date);
                }
                var paymentMonth = date.startOf('month');
                return moment().startOf('month').isSame(paymentMonth);
            };

            var checks = LimitsService.prototype.checks.apply(this);
            checks.push(function (values) {
                if (values.account) {
                    if (self.paymentDateToday(values.date)) {
                        return values.amount > values.cardProfile.monthlyEAPLimit.amount - values.cardProfile.usedEAPLimit.amount ? self.errorMessage('availableMonthlyLimit', 'The amount exceeds your remaining monthly payment limit') : undefined;
                    } else if (self.withinCurrentMonth(values.date)) {
                        return values.amount > values.cardProfile.monthlyEAPLimit.amount - values.cardProfile.usedEAPLimit.amount ? self.warningMessage('availableMonthlyLimit', 'This amount exceeds your monthly limit. Please call 0860 123 000 for assistance') : undefined;
                    } else {
                        return values.amount > values.cardProfile.monthlyEAPLimit.amount ? self.warningMessage('monthlyLimit', 'This amount exceeds your monthly limit. Please call 0860 123 000 for assistance') : undefined;
                    }
                }
            });
            return checks;
        };
        return PaymentLimitsService;
    });

    app.factory('OperatorPaymentLimitsService', function (LimitsService) {
        var OperatorPaymentLimitsService = function () {
        };
        OperatorPaymentLimitsService.prototype = new LimitsService();
        OperatorPaymentLimitsService.prototype.checks = function () {

            var checks = LimitsService.prototype.checks.apply(this);

            return checks.slice(0, 3);
        };

        return OperatorPaymentLimitsService;
    });
})(angular.module('refresh.payments.limits', ['refresh.limits']));
