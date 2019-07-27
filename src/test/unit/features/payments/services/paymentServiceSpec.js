'use strict';

describe('Payment Service', function () {
    beforeEach(module('refresh.paymentService'));

    var preferredName = "Jannie";
    var digitalId, http, url, paymentService;

    beforeEach(inject(function (PaymentService, _$httpBackend_, _URL_, DigitalId) {
        paymentService = PaymentService;
        http = _$httpBackend_;
        url = _URL_;
        digitalId = DigitalId;
        digitalId.authenticate(null, preferredName);
    }));

    describe('pay', function () {
        var expectedResponse = {
            "transactionResults": [
                {
                    "responseCode": {
                        "code": "0",
                        "responseType": "SUCCESS",
                        "message": "Your payment has been completed successfully"
                    }
                }
            ]
        };
        var account = 'someaccount';
        var transactions = 'sometransactions';

        it('should contain the account and transactions provided to the payload then get the response', function () {
            http.expectPUT(url.transactions, function (payloadText) {
                var payload = JSON.parse(payloadText);
                return payload.account === account && payload.transactions === transactions;
            }).respond(expectedResponse);

            paymentService.pay(account, transactions).then(function (response) {
                expect(response.data).toEqual(expectedResponse);
            });

            http.flush();
        });

        it("should contain preferred name in the keyValueMetadata", function () {
            var expectedMetadata = [{
                key: "PreferredName",
                value: preferredName
            }];

            http.expectPUT(url.transactions, function (payloadText) {
                var payload = JSON.parse(payloadText);
                return _.isEqual(payload.keyValueMetadata, expectedMetadata);
            }).respond(expectedResponse);

            paymentService.pay(account, transactions).then(function (response) {
                expect(response.data).toEqual(expectedResponse);
            });

            http.flush();
        });

        it('should invoke the payment service and respond with an error', function () {
            http.expectPUT(url.transactions).respond({
                "transactionResults": [
                    {
                        "responseCode": {
                            "code": "1234",
                            "responseType": "ERROR",
                            "message": "Could not make payment"
                        }
                    }
                ]
            });
            paymentService.pay(account, transactions)
                .catch(function (error) {
                    expect(error.message).toEqual(': Could not make payment');
                });
            http.flush();
        });

        it('should invoke the payment service and respond with account number invalid error', function () {
            http.expectPUT(url.transactions).respond(204, "", {
                "x-sbg-messagetraceid": "520f19c6-10d7-466d-ba5c-a5cfa19992c1",
                "x-sbg-response-code": "2316",
                "x-sbg-response-message": "The account number you have entered for this beneficiary is invalid. Please re-enter and try again.",
                "x-sbg-response-type": "ERROR"
            });
            paymentService.pay(account, transactions)
                .catch(function (error) {
                    expect(error.message).toEqual(': The account number you have entered for this beneficiary is invalid. Please re-enter and try again.');
                });
            http.flush();
        });

        it('should return an undefined error message on a 500 response', function () {
            http.expectPUT(url.transactions).respond(500, {
                "transactionResults": [
                    {
                        "responseCode": {
                            "code": "1234",
                            "responseType": "ERROR",
                            "message": "some error"
                        }
                    }
                ]
            });
            paymentService.pay(account, transactions)
                .catch(function (error) {
                    expect(error.message).toEqual(undefined);
                });
            http.flush();
        });

        it('should return the generic otp locked error message when otp locked error occurs', function () {
            http.expectPUT(url.transactions).respond(200, {}, {
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-code': '1020'
            });

            paymentService.pay(account, transactions).catch(function (response) {
                expect(response).toEqual({message: ': Your OTP service has been locked. Please call Customer Care on 0860 123 000'});
            });
            http.flush();
        });
    });

    describe('when getting history', function () {

        var expectedResponse = {
            "paymentHistoryItems": [
                {
                    "account": {
                        "type": "CURRENT",
                        "name": "ELITE",
                        "number": "70456941"
                    },
                    "recipient": {
                        "name": "0234151677          ",
                        "accountNumber": "0000000009738614"
                    },
                    "yourReference": "000000000000171035  ",
                    "recipientReference": "127700764644690278       ",
                    "amount": 2000,
                    "date": "2016-03-23T14:54:28.000+0000"
                }],
            nextPaymentHistoryPageDetails: {
                referenceNumber: 'refNumber',
                atmdbtsqName: 'whatwhat'
            }
        };
        var cardNumber = '2353245';
        var cardType = "VISA";

        beforeEach(inject(function (_Card_, _User_) {
            spyOn(_Card_, 'current');
            _Card_.current.and.returnValue({number: cardNumber, "type": cardType, "countryCode": "ZA"});

            spyOn(_User_, 'principal');
            _User_.principal.and.returnValue({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '9',
                    systemPrincipalKey: 'SBSA_BANKING'
                }
            });
        }));

        it('should return the payment history list', function () {
            var dateFrom = moment('13 May 2015').format("YYYY-MM-DDTHH:mm");
            var dateTo = moment('21 April 2016').format("YYYY-MM-DDTHH:mm");
            var accountNumber = '234234';

            var fullUrl = url.paymentHistory +
                '?accountNumber=' + accountNumber +
                '&cardCountryCode=ZA' +
                '&cardNumber=' + cardNumber +
                '&cardType=' + cardType +
                '&dateFrom=' + '2015-05-13T00%253A00' +
                '&dateTo=' + '2016-04-21T00%253A00' +
                '&systemPrincipalId=9';


            http.expectGET(fullUrl).respond(200, expectedResponse);

            paymentService.getHistory(dateFrom, dateTo, accountNumber, null, null).then(function (list) {

                expect(list).toEqual({
                    "paymentHistoryItems": [
                        {
                            "account": {
                                "type": "CURRENT",
                                "name": "ELITE",
                                "number": "70456941"
                            },
                            "recipient": {
                                "name": "0234151677          ",
                                "accountNumber": "0000000009738614"
                            },
                            "yourReference": "000000000000171035  ",
                            "recipientReference": "127700764644690278       ",
                            "amount": 2000,
                            "date": "2016-03-23T14:54:28.000+0000"
                        }],
                    nextPaymentHistoryPageDetails: {
                        referenceNumber: 'refNumber',
                        atmdbtsqName: 'whatwhat'
                    }
                });

            });

            http.flush();
        });

        it('should call the payment history list endpoint with the references if specified', function () {
            var dateFrom = moment('13 May 2015').format("YYYY-MM-DDTHH:mm");
            var dateTo = moment('21 April 2016').format("YYYY-MM-DDTHH:mm");
            var accountNumber = '234234';
            var nextPageReference = "nextWhatWhat";
            var atmdbtsqName = "notSureWhatThisNameMeanse";

            var fullUrl = url.paymentHistory +

                '?accountNumber=' + accountNumber +
                "&atmdbtsqName=" + atmdbtsqName +
                '&cardCountryCode=ZA' +
                '&cardNumber=' + cardNumber +
                '&cardType=' + cardType +
                '&dateFrom=' + '2015-05-13T00%253A00' +
                '&dateTo=' + '2016-04-21T00%253A00' +
                "&nextPageReference=" + nextPageReference +
                '&systemPrincipalId=9';

            http.expectGET(fullUrl).respond(200, expectedResponse);

            paymentService.getHistory(dateFrom, dateTo, accountNumber, nextPageReference, atmdbtsqName).then(function (list) {

                expect(list).toEqual({
                    "paymentHistoryItems": [
                        {
                            "account": {
                                "type": "CURRENT",
                                "name": "ELITE",
                                "number": "70456941"
                            },
                            "recipient": {
                                "name": "0234151677          ",
                                "accountNumber": "0000000009738614"
                            },
                            "yourReference": "000000000000171035  ",
                            "recipientReference": "127700764644690278       ",
                            "amount": 2000,
                            "date": "2016-03-23T14:54:28.000+0000"
                        }],
                    nextPaymentHistoryPageDetails: {
                        referenceNumber: 'refNumber',
                        atmdbtsqName: 'whatwhat'
                    }
                });

            });

            http.flush();
        });

    });
});
