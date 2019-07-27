(function (app) {
    'use strict';
    app.factory('TransferLimitsService', function (LimitsService) {
        var TransferLimitsService = function () {};
        TransferLimitsService.prototype = new LimitsService();
        TransferLimitsService.prototype.enforce = function (values) {
            var messages = _.map(this.checks(), function (check) {
                return check(values);
            });
            return _.find(messages, function (message) {
                    return message !== undefined;
                }) || {};
        };

        TransferLimitsService.prototype.hint = function (fromAccount, toAccount) {
            var rule = _.find(rules, {fromAccount: [fromAccount.accountType], toAccount: [toAccount.accountType]});
            if (rule) {
                return rule.infoMessage;
            }
        };

        var allFromAccountTypes = ['RCP', 'HOME_LOAN', 'CURRENT', 'SAVINGS', 'FIXED_TERM_INVESTMENT', 'CREDIT_CARD'];
        var allToAccountTypes =   ['RCP', 'HOME_LOAN', 'CURRENT', 'SAVINGS', 'FIXED_TERM_INVESTMENT', 'CREDIT_CARD', 'NOTICE'];
        var allToAccountTypesWithoutNotice = _.without(allToAccountTypes, 'NOTICE');

        var rules = [
            {
                fromAccount: ['RCP'], toAccount: ['NOTICE'],
                denominations: 100,
                min: 300,
                infoMessage: 'Enter an amount of at least <span class="rand-amount">R 300</span>, in denominations of <span class="rand-amount">R 100</span>'
            },
            {
                fromAccount: ['RCP'], toAccount: allToAccountTypesWithoutNotice,
                denominations: 100,
                infoMessage: 'Enter amount in denominations of <span class="rand-amount">R 100</span>'
            },
            {
                fromAccount: ['SAVINGS'], toAccount: allToAccountTypesWithoutNotice,
                min: 100,
                infoMessage: 'Enter an amount of at least <span class="rand-amount">R 100</span>'
            },
            {
                fromAccount: ['HOME_LOAN'], toAccount: allToAccountTypes,
                denominations: 1000,
                infoMessage: 'Enter amount in denominations of <span class="rand-amount">R 1000</span>'
            },
            {
                fromAccount: allFromAccountTypes, toAccount: ['NOTICE'],
                min: 250,
                infoMessage: 'Enter an amount of at least <span class="rand-amount">R 250</span>'
            }
        ];

        TransferLimitsService.prototype.checks = function () {
            var self = this;
            var checks = LimitsService.prototype.checks.apply(this);

            checks.push(function (values) {
                var rule = _.find(rules, { fromAccount: [values.fromAccount.accountType], toAccount: [values.toAccount.accountType] });
                if (rule && ((rule.min && values.amount < rule.min) || (rule.denominations && values.amount % rule.denominations !== 0))) {
                    return self.errorMessage('invalidTransferAmount', 'Please enter a valid amount as per guidelines below');
                }
            });

            checks.push(function (values) {
                if (values.amount < values.minimumAmount) {
                    return self.errorMessage('minimumLimit', 'Enter an amount of at least R' + values.minimumAmount);
                }
            });

            checks.push(function (values) {
                if (values.maximumAmount && values.amount > values.maximumAmount) {
                    return self.errorMessage('maximumLimit', values.maximumAmountExceededMessage || 'Enter an amount less than R' + (values.maximumAmount + 0.01));
                }
            });

            checks.push(function (values) {
                if(values.amountHints) {
                    var validAmountHints = _.filter(values.amountHints, function (findAmountHint) {
                        return values.amount > findAmountHint.amount;
                    });
                    if(validAmountHints.length > 0) {
                        return self.warningMessage('amountHint', _.sortByOrder(validAmountHints, ['amount'], ['desc'])[0].hint);
                    }
                }
            });
            return checks;
        };

        return TransferLimitsService;
    });
})(angular.module('refresh.transfers.limits', ['refresh.limits']));