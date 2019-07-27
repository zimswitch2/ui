(function () {
    var module = angular.module('refresh.InstantMoneyService', [
        'refresh.configuration'
    ]);

    var possibleErrors = [
        {
            code: '6006',
            message: 'The account payment transaction is not available at present. Please try again later'
        },
        {
            code: '2016',
            message: 'You have insufficient funds in this account to make the requested payments'
        }
    ];
    module.factory('InstantMoneyService', function (ServiceEndpoint, $q, NotificationService) {
        var errorMessage = 'We are experiencing technical problems. Please try again later';

        var checkResponseForErrors = function (response) {
            if (response.headers('x-sbg-response-type') === 'SUCCESS' && response.headers('x-sbg-response-code') === '0000') {
                return response.data && response.data.vouchers;
            } else {
                return $q.reject({
                    code: response.headers('x-sbg-response-code'),
                    message: response.headers('x-sbg-response-message')
                });
            }
        };

        var handleErrors = function (error) {
            var message = error.message || errorMessage;
            var options = {showLogoutAction: true, actions: {'Reload': '#/transaction/dashboard/'}};
            NotificationService.displayPopup('Service Error', message, options);

            return $q.reject(message);
        };

        return {
            getUncollectedVouchers: function (card) {
                var request = {
                    "card": {
                        "number": card.number
                    }
                };
                return ServiceEndpoint.getUncollectedInstantMoneyVouchers.makeRequest(request)
                    .then(checkResponseForErrors)
                    .catch(handleErrors);
            },
            sendInstantMoney: function (voucher) {
                var request = {
                    account: voucher.account,
                    "transactions": {
                        "voucherPurchases": [
                            {
                                "amount": {
                                    "amount": voucher.amount
                                },
                                "voucherPin": voucher.voucherPin,
                                "contact": {
                                    "name": voucher.cellNumber,
                                    "address": voucher.cellNumber,
                                    "contactMethod": "SMS",
                                    "favourite": true,
                                    "recipientGroup": {
                                        "name": "Group name",
                                        "orderIndex": 1
                                    }
                                }
                            }
                        ]
                    }
                };
                return ServiceEndpoint.pay.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'SUCCESS' && response.headers('x-sbg-response-code') === '0000') {
                        return response.data;
                    } else {
                        var message = _.find(possibleErrors, function (error) {
                            if (error.code === response.headers('x-sbg-response-code')) {
                                return error.message;
                            }
                        });

                        return $q.reject(message || {message: errorMessage});
                    }
                }).catch(function (error) {
                    return $q.reject(error.message || errorMessage);
                });
            },

            cancelVoucher: function (card, voucher) {
                var request = {
                    "cardNumber": card.number,
                    "voucherPin": voucher.voucherPin,
                    "accountNumber": voucher.accNo,
                    "amount": voucher.amount.amount,
                    "cellphoneNumber": voucher.contact.address,
                    "voucherNumber": voucher.voucherNumber,
                    "transactionReference": voucher.transactionReference
                };

                return ServiceEndpoint.cancelInstantMoneyVouchers.makeRequest(request)
                    .then(checkResponseForErrors)
                    .catch(function (error) {
                        switch (error.code){
                            case '2813':
                                error.message = 'The PIN that was entered is incorrect.';
                                break;
                        }

                        return $q.reject(error.message);
                    });
            },

            changeInstantMoneyVoucherPin: function(voucher, card){
                var request = {
                    "voucherPin": voucher.voucherPin,
                    "voucherNumber": voucher.voucherNumber,
                    "amount": voucher.amount.amount,
                    "cellphoneNumber": voucher.contact.address,
                    "accountNumber": voucher.accNo,
                    "cardNumber": card.number
                };
                return ServiceEndpoint.changeInstantMoneyVoucherPin.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'SUCCESS' && response.headers('x-sbg-response-code') === '0000') {
                        return response;
                    } else {
                        return $q.reject({
                            message: response.headers('x-sbg-response-message')
                        });
                    }
                }).catch(function (error) {
                    return $q.reject(error.message || errorMessage);
                });
            }
        };
    });
}());
