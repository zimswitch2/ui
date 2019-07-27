(function (app) {
    'use strict';

    app.factory('MultiplePaymentsService', function (PaymentService, $q, AccountsService, BeneficiariesListService) {
        var selectedPayments = [];
        var _amounts = {};
        var paymentResults = [];
        var fromAccount = null;

        var messagesArray = {
            '1016': 'Insufficient funds',
            '0000': 'Successful',
            '2299': 'Successful'
        };

        var typeArray = {
            'SUCCESS': 'SUCCESS',
            'WARNING': 'SUCCESS'
        };

        return {
            paymentServiceData: function () {
                return _.map(selectedPayments, function (selectedPayment) {
                    return {
                        transactionId: selectedPayment.beneficiary.recipientId,
                        amount: {amount: selectedPayment.amount, currency: "ZAR"},
                        beneficiary: {
                            recipientId: selectedPayment.beneficiary.recipientId,
                            name: selectedPayment.beneficiary.name,
                            accountNumber: selectedPayment.beneficiary.accountNumber,
                            recipientReference: selectedPayment.beneficiary.recipientReference,
                            customerReference: selectedPayment.beneficiary.customerReference,
                            recentPayment: selectedPayment.beneficiary.recentPayment,
                            bank: selectedPayment.beneficiary.bank,
                            paymentConfirmation: selectedPayment.beneficiary.paymentConfirmation,
                            beneficiaryType: "PRIVATE"
                        }
                    };
                });
            },
            payMultipleBeneficiaries: function (account) {
                AccountsService.clear();
                BeneficiariesListService.clear();
                return PaymentService.pay(account, {"beneficiaryPayments": this.paymentServiceData()});
            },
            updatePayments: function (beneficiary, amounts) {
                _amounts = amounts;
                var currentAmount = parseFloat(amounts[beneficiary.recipientId]);
                if (currentAmount > 0) {
                    var selectedBeneficiary = _.find(selectedPayments, {beneficiary: {recipientId: beneficiary.recipientId}});
                    if (selectedBeneficiary) {
                        selectedBeneficiary.amount = currentAmount;
                        selectedBeneficiary.beneficiary = beneficiary;
                    }
                    else {
                        selectedPayments.push({beneficiary: beneficiary, amount: currentAmount});
                    }
                } else {
                    _.remove(selectedPayments, function (selectedPayment) {
                        return selectedPayment.beneficiary.recipientId === beneficiary.recipientId;
                    });
                }
            },
            totalAmount: function () {
                if (_.isEmpty(_amounts)) {
                    return 0;
                } else {
                    return _.reduce(_amounts, function (sum, num) {
                        return parseFloat(sum) + parseFloat(num);
                    });
                }
            },
            updateFromAccount: function (_fromAccount) {
                fromAccount = _fromAccount;
                return fromAccount;
            },
            getFromAccount: function (allAccounts) {
                return fromAccount || allAccounts[0];
            },
            selectedPayments: function () {
                return selectedPayments;
            },

            amounts: function () {
                return _amounts;
            },
            paymentResults: function () {
                return paymentResults;
            },
            reset: function () {
                selectedPayments = [];
                paymentResults = [];
                _amounts = {};
                fromAccount = null;
            },
            confirm: function (transactionResults) {
                selectedPayments.forEach(function (selectedPayment) {
                    var paymentResult = selectedPayment;
                    var transaction = _.find(transactionResults, {transactionId: selectedPayment.beneficiary.recipientId.toString()});
                    paymentResult.responseType = typeArray[transaction.responseCode.responseType] || transaction.responseCode.responseType;
                    paymentResult.responseMessage = messagesArray[transaction.responseCode.code] ||
                        transaction.responseCode.message;
                    paymentResults.push(paymentResult);

                    paymentResult.hasConfirmationWarning = (transaction.responseCode.code === '2299');
                    paymentResult.confirmationWarningMessage = paymentResult.hasConfirmationWarning ? 'Invalid email entered' : undefined;
                });
            }
        };
    });
})
(angular.module('refresh.multiplePaymentsService', ['refresh.accounts', 'refresh.beneficiaries', 'refresh.paymentService']));
