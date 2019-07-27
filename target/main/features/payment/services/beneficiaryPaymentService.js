(function (app) {
    'use strict';

    app.factory('BeneficiaryPaymentService', function (PaymentService, $q, DateHelper, AccountsService, BeneficiariesListService) {
        var defaultSuccessMessage = 'Payment was successful';
        var recurringPaymentSuccessMessage = 'Payments were successfully scheduled';
        var singlePaymentSuccessMessage = 'Payment was successfully scheduled';
        var successfulResponse = {'0000': '0000', '2299': '2299'};

        var buildRequest = function (account, amount, beneficiary) {
            return {
                account: account,
                transactions: {
                    beneficiaryPayments: [
                        {
                            amount: {
                                amount: amount,
                                currency: "ZAR"
                            },
                            transactionId: "1234567890",
                            beneficiary: beneficiary
                        }
                    ]
                }
            };
        };

        return {
            payBeneficiary: function (payment) {
                AccountsService.clear();
                BeneficiariesListService.clear();
                var isFutureDatedPayment = DateHelper.isDateInTheFuture(payment.date);
                var request = buildRequest(payment.account, payment.amount, payment.beneficiary);
                if (isFutureDatedPayment) {
                    request.transactions.beneficiaryPayments[0].futureDatedInstruction = {
                        fromDate: payment.date,
                        repeatInterval: payment.repeatInterval || 'Single',
                        repeatNumber: Number(payment.repeatNumber || 1).toString()
                    };
                }

                return PaymentService.pay(request.account, request.transactions).then(function (response) {
                    if (response.data.transactionResults[0].responseCode.responseType !== "SUCCESS" && !successfulResponse[response.data.transactionResults[0].responseCode.code]) {
                        return $q.reject({message: ": " + response.data.transactionResults[0].responseCode.message});
                    }

                    var result = {
                        responseFromServer: response,
                        shouldUpdateAccountBalances: !isFutureDatedPayment,
                        successMessage: defaultSuccessMessage,
                        isFutureDatedPayment: isFutureDatedPayment,
                        isWarning: response.data.transactionResults[0].responseCode.code === '2299'
                    };
                    if (isFutureDatedPayment) {
                        result.successMessage = !payment.repeatInterval || payment.repeatInterval === 'Single' ? singlePaymentSuccessMessage : recurringPaymentSuccessMessage;
                    }
                    return result;
                });
            }
        };
    });
})
(angular.module('refresh.beneficiaryPaymentService', ['refresh.dateHelper', 'refresh.accounts', 'refresh.beneficiaries', 'refresh.paymentService']));
