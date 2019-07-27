describe('Unit Test - Instant Moola History Service', function () {
    beforeEach(module('refresh.InstantMoneyService', 'refresh.test'));

    var endpointRequest = {
        account: "account",
        "transactions": {
            "voucherPurchases": [
                {
                    "amount": {
                        "amount": 60
                    },
                    "voucherPin": "1639",
                    "contact": {
                        "name": "0832190005",
                        "address": "0832190005",
                        "contactMethod": "SMS",
                        favourite: true,
                        "recipientGroup":{
                            "name":"Group name",
                            "orderIndex":1
                        }
                    }
                }
            ]
        }
    };

    var mock, test, instantMoneyService;
    beforeEach(inject(function (ServiceTest, _mock_, InstantMoneyService) {
        mock = _mock_;
        test = ServiceTest;
        instantMoneyService = InstantMoneyService;

        test.spyOnEndpoint('getUncollectedInstantMoneyVouchers');
        test.spyOnEndpoint('pay');
        test.spyOnEndpoint('cancelInstantMoneyVouchers');
        test.spyOnEndpoint('changeInstantMoneyVoucherPin');
    }));

    var vouchers = [
        {
            date: '25 Nov 2015',
            fromAccount: '101010',
            voucherNumber: '12345',
            cellPhone: '011',
            amount: '100'
        },
        {
            date: '25 Dec 2015',
            fromAccount: '101010',
            voucherNumber: '12345',
            cellPhone: '011',
            amount: '1000'
        }
    ];

    var card = {
        number: '12345'
    };

    describe('instant money history', function () {
        var expectedCard = {"card": {"number": "12345"}};

        it('should resolve with data from service endpoint', function() {
            test.stubResponse('getUncollectedInstantMoneyVouchers', 200, {message: 'OK', vouchers: vouchers}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(instantMoneyService.getUncollectedVouchers(card)).toBeResolvedWith(vouchers);
            test.resolvePromise();
            expect(test.endpoint('getUncollectedInstantMoneyVouchers')).toHaveBeenCalledWith(expectedCard);
        });

        it('should resolve with undefined from service endpoint when there is not data', function() {
            test.stubResponse('getUncollectedInstantMoneyVouchers', 200, {}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(instantMoneyService.getUncollectedVouchers(card)).toBeResolvedWith(undefined);
            test.resolvePromise();
            expect(test.endpoint('getUncollectedInstantMoneyVouchers')).toHaveBeenCalledWith(expectedCard);
        });

        it('should reject with message from service endpoint when with error in header', function () {
            test.stubResponse('getUncollectedInstantMoneyVouchers', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(instantMoneyService.getUncollectedVouchers(card)).toBeRejectedWith('Something is wrong');
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('getUncollectedInstantMoneyVouchers', 404);
            expect(instantMoneyService.getUncollectedVouchers(card)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });
    });

    describe('send Instant Money', function () {

        var serviceRequest = {
            account: "account",
            amount: 60,
            voucherPin: "1639",
            cellNumber: "0832190005"
        };

        var serviceResponse = {
            dontCareForNow: "who cares"
        };

        it('should resolve with data from service endpoint', function() {
            test.stubResponse('pay', 200, serviceResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(instantMoneyService.sendInstantMoney(serviceRequest)).toBeResolvedWith(serviceResponse);
            test.resolvePromise();
            expect(test.endpoint('pay')).toHaveBeenCalledWith(endpointRequest);
        });

        it('should reject with message from service endpoint when with error in header and error code is unknown', function () {
            test.stubResponse('pay', 200, {message: 'OK'}, {
                'x-sbg-response-code': '1111',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'We should not should this message'
            });
            expect(instantMoneyService.sendInstantMoney(serviceRequest))
                .toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });

        it('should reject with message from service endpoint when with error in header and error code is known', function () {
            test.stubResponse('pay', 200, {message: 'OK'}, {
                'x-sbg-response-code': '6006',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'we should show this message'
            });
            expect(instantMoneyService.sendInstantMoney(serviceRequest))
                .toBeRejectedWith('The account payment transaction is not available at present. Please try again later');
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('pay', 404);
            expect(instantMoneyService.sendInstantMoney(serviceRequest)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });
    });

    describe('cancel Instant Money', function(){
        var voucherToCancel = {
            accNo: '12345',
            voucherNumber: '54321',
            voucherPin: '1357',
            amount: {
                amount: 100
            },
            contact: {
                address: '0821234567'
            },
            transactionReference: 'ASD12345'
        };

        it('should successfully call cancel', function(){
            test.stubResponse('cancelInstantMoneyVouchers', 200, {message: 'OK', vouchers: vouchers}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            expect(instantMoneyService.cancelVoucher(card, voucherToCancel)).toBeResolved();
            test.resolvePromise();
            expect(test.endpoint('cancelInstantMoneyVouchers')).toHaveBeenCalledWith({
                "cardNumber": '12345',
                "voucherPin": '1357',
                "accountNumber":'12345',
                "amount": 100,
                "cellphoneNumber": '0821234567',
                "voucherNumber": '54321',
                "transactionReference": 'ASD12345'
            });
        });

        it ('should handle the cancel service returning any failure', function(){
            test.stubResponse('cancelInstantMoneyVouchers', 204, {}, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR'
            });

            expect(instantMoneyService.cancelVoucher(card, voucherToCancel)).toBeRejected();
            test.resolvePromise();
        });

        it ('should handle and show a specific message if an incorrect PIN is entered', function(){
            test.stubResponse('cancelInstantMoneyVouchers', 204, {}, {
                'x-sbg-response-code': '2813',
                'x-sbg-response-type': 'ERROR'
            });

            expect(instantMoneyService.cancelVoucher(card, voucherToCancel)).toBeRejectedWith('The PIN that was entered is incorrect.');
            test.resolvePromise();
        });
    });

    describe('changeInstantMoneyVoucherPin', function(){
        var serviceRequest = {
            accNo: 12345678,
            amount: {amount:60},
            voucherPin: "1639",
            contact: {address:"0832190005"},
            voucherNumber: '123445541'
        };

        var serviceResponse = {
            dontCareForNow: "who cares"
        };

        var card = {
            number: '12345'
        };

        var endpointRequest = {
            "voucherPin": '1639',
            "voucherNumber": '123445541',
            "amount": 60,
            "cellphoneNumber": "0832190005",
            "accountNumber": 12345678,
            "cardNumber": card.number
        };

        it('should resolve with data from service endpoint', function() {
            test.stubResponse('changeInstantMoneyVoucherPin', 200, serviceResponse, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            instantMoneyService.changeInstantMoneyVoucherPin(serviceRequest, card);
            test.resolvePromise();
            expect(test.endpoint('changeInstantMoneyVoucherPin')).toHaveBeenCalledWith(endpointRequest);
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('changeInstantMoneyVoucherPin', 204);
            expect(instantMoneyService.changeInstantMoneyVoucherPin(serviceRequest, card)).toBeRejectedWith('We are experiencing technical problems. Please try again later');
            test.resolvePromise();
        });
    });
});
