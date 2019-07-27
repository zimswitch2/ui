describe('ViewPaymentNotificationHistoryService', function () {
    'use strict';

    var expectedPaymentConfirmationResponse = {"paymentConfirmationItems": [
        {
            "beneficiary": {
                "accountNumber": null,
                "bank": {
                    "branch": {
                        "code": 2442,
                        "name": null
                    },
                    "code": null,
                    "name": null
                },
                "beneficiaryType": "COMPANY",
                "recentPayment": [
                    {
                        "amount": {
                            "amount": 12,
                            "currency": "ZAR"
                        },
                        "date": "2014-06-24T22:00:00.000+0000"
                    }
                ],
                "customerReference": "TEST",
                "favourite": null,
                "name": "911 TRUCK RENTALS",
                "paymentConfirmation": {
                    "address": "Www@qwy.co.za",
                    "confirmationType": "Email",
                    "recipientName": "Wen",
                    "sendFutureDated": null
                },
                "recipientGroup": {
                    "name": "",
                    "oldName": "",
                    "orderIndex": 0
                },
                "recipientId": 901,
                "recipientReference": "TEST"
            },
            "confirmationStatus": "S",
            "transactionNumber": 148054
        },
        {
            "beneficiary": {
                "accountNumber": null,
                "bank": {
                    "branch": {
                        "code": 27,
                        "name": null
                    },
                    "code": null,
                    "name": null
                },
                "beneficiaryType": "COMPANY",
                "recentPayment": [
                    {
                        "amount": {
                            "amount": 1,
                            "currency": "ZAR"
                        },
                        "date": "2014-05-24T22:00:00.000+0000"
                    }
                ],
                "customerReference": "TEST",
                "favourite": null,
                "name": "WAYNE WAS HERE",
                "paymentConfirmation": {
                    "address": "0787477220",
                    "confirmationType": "Fax",
                    "recipientName": "wayne was here",
                    "sendFutureDated": null
                },
                "recipientGroup": {
                    "name": "",
                    "oldName": "",
                    "orderIndex": 0
                },
                "recipientId": 901,
                "recipientReference": "SDHJFGD"
            },
            "confirmationStatus": "S",
            "transactionNumber": 148051
        }
    ]
    };

    beforeEach(module('refresh.paymentNotificationHistory'));
    var viewPaymentNotificationHistoryService, clock, test;
    var account, expectedRequest, actual;

    beforeEach(inject(function (ServiceTest, ViewPaymentNotificationHistoryService) {
        test = ServiceTest;
        viewPaymentNotificationHistoryService = ViewPaymentNotificationHistoryService;
        test.spyOnEndpoint('paymentNotificationHistory');
        account = {number: 12345};

        var now = moment();
        clock = sinon.useFakeTimers(now.toDate().getTime());
        expectedRequest = {
            account: account,
            dateTo: now.format('YYYY-MM-DDTHH:mm:ss'),
            dateFrom: now.subtract('days', 365).format('YYYY-MM-DDTHH:mm:ss')
        };
        actual = null;
    }));

    afterEach(function () {
        clock.restore();
    });

    it('should retrieve payment confirmation history', function () {
        test.stubResponse('paymentNotificationHistory', 200, expectedPaymentConfirmationResponse, {'x-sbg-response-code': '0000', 'x-sbg-response-type': 'SUCCESS'});
        expect(viewPaymentNotificationHistoryService.viewPaymentNotificationHistory(account)).toBeResolvedWith(expectedPaymentConfirmationResponse);
        test.resolvePromise();
    });

    it('should add a warning message when the service responds with a warning', function () {
        test.stubResponse('paymentNotificationHistory', 200, expectedPaymentConfirmationResponse, {'x-sbg-response-code': '0000', 'x-sbg-response-type': 'WARNING'});
        expectedPaymentConfirmationResponse.warningMessage = 'Displaying your 100 most recent notifications';
        expect(viewPaymentNotificationHistoryService.viewPaymentNotificationHistory(account)).toBeResolvedWith(expectedPaymentConfirmationResponse);
        test.resolvePromise();
    });

    it('should reject response if there is an application error', function () {
        test.stubResponse('paymentNotificationHistory', 204, {message: 'OK'},
            {
                'x-sbg-response-code': 'non-zero',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
        expect(viewPaymentNotificationHistoryService.viewPaymentNotificationHistory(account)).toBeRejectedWith({message: 'Something is wrong'});
        test.resolvePromise();
    });

    it('should reject response if there is a server error with message', function () {
        test.stubRejection('paymentNotificationHistory', 200, {'message': 'this is a custom error'});
        expect(viewPaymentNotificationHistoryService.viewPaymentNotificationHistory(account)).toBeRejectedWith({message :'this is a custom error'});
        test.resolvePromise();
    });

    it('should reject response if there is a server error', function () {
        test.stubRejection('paymentNotificationHistory', 500);
        expect(viewPaymentNotificationHistoryService.viewPaymentNotificationHistory(account)).toBeRejectedWith('An error has occurred');
        test.resolvePromise();
    });

});