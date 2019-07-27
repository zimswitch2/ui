(function (app) {
    'use strict';

    app.factory('LimitsService', function () {
        var LimitsService = function () {

        };
        //TODO Revisit why we are using prototype here and everywhere that 'inherits' from this service
        LimitsService.prototype = {
            errorMessage: function (type, message) {
                return _.merge({error: true}, {type: type, message: message});
            },
            warningMessage: function (type, message) {
                return _.merge({error: false}, {type: type, message: message});
            },

            enforce: function (values) {
                var messages = _.map(this.checks(), function (check) {
                    return check(values);
                });
                return _.find(messages, function (message) {
                        return message !== undefined;
                    }) || {};
            }
        };

        LimitsService.prototype.paymentDateToday = function (date) {
            date = date || moment().format("DD MMMM YYYY");
            if (!moment.isMoment(date)) {
                date = moment(date);
            }
            return date.isSame(moment().format("DD MMMM YYYY"));
        };

        LimitsService.prototype.checks = function () {
            var self = this;
            return [
                function (values) {
                    return (values.amount <= 0 || values.amount === undefined) ? self.errorMessage('amountValue', 'Please enter an amount greater than zero') : undefined;
                },
                function (values) {
                    return !/^[0-9]*\.?[0-9]{1,2}$/.test(values.amount) ? self.errorMessage('currencyFormat', 'Please enter the amount in a valid format') : undefined;
                },
                function (values) {
                    return values.amount > 4999999.99 ? self.errorMessage('maximumPaymentLimit', 'The amount cannot exceed <span class="rand-amount">R 4 999 999.99</span>') : undefined;
                },
                function (values) {
                    if (values.account && self.paymentDateToday(values.date)) {
                        return values.amount > values.account.availableBalance.amount ? self.errorMessage('availableBalanceExceeded', 'The amount exceeds your available balance') : undefined;
                    }
                }
            ];
        };

        return LimitsService;
    });
})(angular.module('refresh.limits', []));
