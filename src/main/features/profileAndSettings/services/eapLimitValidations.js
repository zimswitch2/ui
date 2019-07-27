(function (app) {
    'use strict';
    app.factory('EAPLimitValidations', function (LimitsService) {
        var EAPLimitValidations = function () {
        };
        EAPLimitValidations.prototype = new LimitsService();
        EAPLimitValidations.prototype.checks = function () {
            var self = this;

            var checks = LimitsService.prototype.checks.apply(this);
            checks = _.slice(checks, 0, 2);
            checks.push(function (values) {
                return values.amount > 500000 ?
                    self.errorMessage('maxEAPLimitExceeded',
                        'The amount you entered exceeds the maximum monthly payment limit of <span class="rand-amount">R 500 000</span>. To increase your limit further, call Customer Care on 0860 123 000 or visit your nearest branch') :
                    undefined;
            });

            checks.push(function (values) {
                var amount = parseFloat(values.amount);
                return amount === values.cardProfile.monthlyEAPLimit.amount ?
                    self.errorMessage('sameEAPAmount',
                        'New monthly payment limit cannot be the same as current monthly payment limit') :
                    undefined;
            });
            return checks;
        };
        return EAPLimitValidations;
    });

})
(angular.module('refresh.profileAndSettings.eapLimitValidations', ['refresh.limits']));