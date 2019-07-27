(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.rcp.domain.debitOrder', []);

    app.factory('DebitOrder', function () {
        var tableCycleCodeOffset = 100;

        var generalDebitOrder = function (account, repayment, electronicConsent) {
            return {
                account: account,
                repayment: {
                    day: repayment.day,
                    amount: repayment.amount
                },
                electronicConsent: electronicConsent,
                transformToServiceDebitOrder: function () {
                    return {
                        debitOrderRepaymentAmount: repayment.amount,
                        debitOrderAccountNumber: account.number,
                        debitOrderCycleCode: tableCycleCodeOffset + repayment.day,
                        debitOrderElectronicConsentReceived: electronicConsent,
                        debitOrderIbtNumber: account.branch.code,
                        debitOrderAccountIsStandardBank: account.isStandardBank
                    };

                }
            };

        };
        return {
            fromStandardBankAccount: function (account, repayment) {
                return generalDebitOrder(account, repayment, false);
            },
            fromOtherBanksAccount: generalDebitOrder
        };
    });

})();