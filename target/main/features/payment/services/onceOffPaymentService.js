(function (app) {
    'use strict';

    app.factory('OnceOffPaymentService', function (PaymentService, AccountsService, $q) {
        function sendRequest(account, amount, beneficiary) {
            var transactions = {
                "onceOffPayments": [
                    {
                        "amount": {
                            'amount': amount,
                            "currency": "ZAR"
                        },
                        "transactionId": "1234567890",
                        "beneficiary": beneficiary
                    }
                ]
            };
            return PaymentService.pay(account, transactions);
        }

        return {
            payPrivateBeneficiaryOnceOff: function (beneficiary, account, amount) {
                AccountsService.clear();
                var successfulResponse = {'0000':'0000','2299':'2299'};
                return sendRequest(account, amount, beneficiary).then(function(response) {
                    if (response.data.transactionResults[0].responseCode.responseType !== "SUCCESS" &&
                        !successfulResponse[response.data.transactionResults[0].responseCode.code]) {
                        return $q.reject({message: ": " + response.data.transactionResults[0].responseCode.message});
                    }
                    return {isWarning: response.data.transactionResults[0].responseCode.code === '2299'};
                });
            }
        };
    });
})
(angular.module('refresh.onceOffPayment'));
