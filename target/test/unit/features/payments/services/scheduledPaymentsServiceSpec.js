describe('scheduled beneficiary payments', function () {
    'use strict';
    beforeEach(module('refresh.payment.future.services'));

    var accountsService;
    beforeEach(function () {
        accountsService = jasmine.createSpyObj('accounts', ['clear']);
        module(function ($provide) {
            $provide.value('AccountsService', accountsService);
        });
    });

    var successHeaders = {
        'x-sbg-response-code': '0000',
        'x-sbg-response-type': 'SUCCESS'
    };

    var http, service, url;
    var futureTransaction, recipientId, card;
    var beneficiaryFutureTransactions = [
        {
            "beneficiary": {
                "accountNumber": "5104333800177114",
                "bank": {
                    "branch": null,
                    "code": null,
                    "name": null
                },
                "beneficiaryType": "COMPANY",
                "recentPayment": [],
                "customerReference": null,
                "favourite": false,
                "name": "911 TRUCK RENTALS",
                "paymentConfirmation": null,
                "recipientGroup": null,
                "recipientId": 56,
                "recipientReference": "3613387054411"
            },
            "futureTransactions": [
                {
                    "amount": {
                        "amount": 11,
                        "currency": "ZAR"
                    },
                    "futureDatedId": "3613387054411",
                    "futureDatedInstruction": {
                        "fromDate": "2014-07-17T00:00:00.000+0000",
                        "repeatInterval": "Single",
                        "repeatNumber": 1,
                        "toDate": "2014-07-17T00:00:00.000+0000"
                    },
                    "futureDatedItems": [
                        {
                            "amount": {
                                "amount": 11,
                                "currency": "ZAR"
                            },
                            "index": 1,
                            "nextPaymentDate": "2014-07-17T00:00:00.000+0000"
                        }
                    ],
                    "nextPaymentDate": "2014-07-17T00:00:00.000+0000"
                }
            ]
        },
        {
            "beneficiary": {
                "accountNumber": "81444621",
                "bank": {
                    "branch": null,
                    "code": null,
                    "name": null
                },
                "beneficiaryType": "PRIVATE",
                "recentPayment": [],
                "customerReference": null,
                "favourite": false,
                "name": "DEMO",
                "paymentConfirmation": null,
                "recipientGroup": null,
                "recipientId": 12,
                "recipientReference": "3612248739724"
            },
            "futureTransactions": [
                {
                    "amount": {
                        "amount": 10,
                        "currency": "ZAR"
                    },
                    "futureDatedId": "3612248739724",
                    "futureDatedInstruction": {
                        "fromDate": "2014-06-19T00:00:00.000+0000",
                        "repeatInterval": "Weekly",
                        "repeatNumber": 3,
                        "toDate": "2014-07-03T00:00:00.000+0000"
                    },
                    "futureDatedItems": [
                        {
                            "amount": {
                                "amount": 10,
                                "currency": "ZAR"
                            },
                            "index": 1,
                            "nextPaymentDate": "2014-06-26T00:00:00.000+0000"
                        },
                        {
                            "amount": {
                                "amount": 10,
                                "currency": "ZAR"
                            },
                            "index": 1,
                            "nextPaymentDate": "2014-07-03T00:00:00.000+0000"
                        }
                    ],
                    "nextPaymentDate": "2014-06-26T00:00:00.000+0000"
                }
            ]
        }
    ];

    var expectedFormattedPaymentsList = [
        {
            beneficiaryName: "911 TRUCK RENTALS",
            amount: 11,
            nextPaymentDate: "2014-07-17T00:00:00.000+0000",
            finalPaymentDate: '2014-07-17T00:00:00.000+0000',
            frequency: 'Single',
            remainingPayments: 1,
            recipientId: 56,
            futureTransaction: {
                amount: {
                    amount: 11,
                    currency: "ZAR"
                },
                futureDatedId: "3613387054411",
                futureDatedInstruction: {
                    fromDate: "2014-07-17T00:00:00.000+0000",
                    repeatInterval: "Single",
                    repeatNumber: 1,
                    toDate: "2014-07-17T00:00:00.000+0000"
                },
                futureDatedItems: [
                    {
                        amount: {
                            amount: 11,
                            currency: "ZAR"
                        },
                        index: 1,
                        nextPaymentDate: "2014-07-17T00:00:00.000+0000"
                    }
                ],
                nextPaymentDate: "2014-07-17T00:00:00.000+0000"
            }
        },

        {
            beneficiaryName: 'DEMO',
            amount: 10,
            nextPaymentDate: "2014-06-26T00:00:00.000+0000",
            finalPaymentDate: '2014-07-03T00:00:00.000+0000',
            frequency: 'Weekly',
            remainingPayments: 2,
            recipientId: 12,
            futureTransaction: {
                "amount": {
                    "amount": 10,
                    "currency": "ZAR"
                },
                futureDatedId: "3612248739724",
                futureDatedInstruction: {
                    fromDate: "2014-06-19T00:00:00.000+0000",
                    repeatInterval: "Weekly",
                    repeatNumber: 3,
                    toDate: "2014-07-03T00:00:00.000+0000"
                },
                futureDatedItems: [
                    {
                        amount: {
                            amount: 10,
                            currency: "ZAR"
                        },
                        index: 1,
                        nextPaymentDate: "2014-06-26T00:00:00.000+0000"
                    },
                    {
                        amount: {
                            amount: 10,
                            currency: "ZAR"
                        },
                        index: 1,
                        nextPaymentDate: "2014-07-03T00:00:00.000+0000"
                    }
                ],
                nextPaymentDate: "2014-06-26T00:00:00.000+0000"
            }
        }
    ];

    describe('list scheduled beneficiary payments', function () {

        beforeEach(inject(function (_ScheduledPaymentsService_, $httpBackend, _URL_) {
            http = $httpBackend;
            service = _ScheduledPaymentsService_;
            url = _URL_;
        }));

        it('should invoke the view future beneficiary payments service', function () {
            card = {number: '123123'};
            http.expectPOST(url.futureTransactions, {card: card}).respond(200,
                {beneficiaryFutureTransactions: beneficiaryFutureTransactions},
                successHeaders);
            service.list(card).then(function (formattedPaymentsList) {
                expect(formattedPaymentsList).toEqual(expectedFormattedPaymentsList);
            });
            http.flush();
        });
    });

    describe('delete scheduled payments', function () {
        beforeEach(inject(function (_ScheduledPaymentsService_, $httpBackend, _URL_) {
            http = $httpBackend;
            futureTransaction = beneficiaryFutureTransactions[0];
            service = _ScheduledPaymentsService_;
            url = _URL_;
            card = {number: '123123'};
            recipientId = futureTransaction.beneficiary.recipientId;
        }));

        it('should invoke the delete service with valid parameters', function () {
            http.expectPOST(url.deleteFutureTransactions,
                {futureTransaction: futureTransaction, card: card, recipientId: recipientId}).respond(200, {},
                successHeaders);
            service.delete(futureTransaction, card, recipientId).then(function (deleteResponse) {
                expect(deleteResponse.success).toBeTruthy();
            });
            expect(accountsService.clear).toHaveBeenCalled();
            http.flush();
        });

        it('should invoke the delete service with invalid parameters', function () {

            http.expectPOST(url.deleteFuturePayment,
                {futureTransaction: futureTransaction, card: card, recipientId: recipientId}).respond(200, {},
                {'x-sbg-response-code': '1234', 'x-sbg-response-message': 'An error has occurred'});
            service.delete(futureTransaction, card, recipientId).then(function (deleteResponse) {
                expect(deleteResponse.success).toBeFalsy();
                expect(deleteResponse.message).toEqual('An error has occurred');
            });
            expect(accountsService.clear).toHaveBeenCalled();
            http.flush();
        });

        it('should have an error when the http request is not resolved', function () {
            http.expectPOST(url.deleteFuturePayment,
                {futureTransaction: futureTransaction, card: card, recipientId: recipientId}).respond(500, {},
                {'x-sbg-response-code': '1234', 'x-sbg-response-message': 'An error has occurred'});
            service.delete(futureTransaction, card, recipientId).catch(function (deleteResponse) {
                expect(deleteResponse.success).toBeFalsy();
            });
            http.flush();
        });
    });

    describe('amend scheduled payments', function () {
        beforeEach(inject(function (_ScheduledPaymentsService_, $httpBackend, _URL_) {
            http = $httpBackend;
            futureTransaction = beneficiaryFutureTransactions[0];
            service = _ScheduledPaymentsService_;
            url = _URL_;
            card = {number: '123123'};
            recipientId = futureTransaction.beneficiary.recipientId;
        }));

        it('should invoke the amend service with valid parameters', function () {
            http.expectPUT(url.amendFutureTransactions,
                {futureTransaction: futureTransaction, card: card, recipientId: recipientId}).respond(200, {},
                successHeaders);
            service.amend(futureTransaction, card, recipientId).then(function (amendResponse) {
                expect(amendResponse.success).toBeTruthy();
            });
            expect(accountsService.clear).toHaveBeenCalled();
            http.flush();
        });
    });
});


