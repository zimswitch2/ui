describe('Beneficiary Payment Service', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaryPaymentService','refresh.beneficiaries.beneficiariesListService', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture'));

    var accountsService, listService, paymentService;
    beforeEach(function () {
        accountsService = jasmine.createSpyObj('accounts', ['clear']);
        listService = jasmine.createSpyObj('beneficiariesList', ['clear']);
        paymentService = jasmine.createSpyObj('payment', ['pay']);
        module(function ($provide) {
            $provide.value('AccountsService', accountsService);
            $provide.value('BeneficiariesListService', listService);
            $provide.value('PaymentService', paymentService);
        });
    });

    var successfulResponse = {
        "transactionResults": [
            {
                "responseCode": {
                    "code": "0000",
                    "responseType": "SUCCESS",
                    "message": "Your payment has been completed successfully"
                }
            }
        ]
    };

    var warningResponse = {
        "transactionResults": [
            {
                "responseCode": {
                    "code": "2299",
                    "responseType": "WARNING",
                    "message": "Your payment has been completed successfully, but confirmation was unsuccessful"
                }
            }
        ]
    };

    var errorResponse = {
        "transactionResults": [
            {
                "responseCode": {
                    "code": "2150",
                    "responseType": "ERROR",
                    "message": "Something bad happened"
                }
            }
        ]
    };


    var test, service, url, beneficiary, applicationParams, timeNow, mocker;

    beforeEach(inject(function (ServiceTest, _BeneficiaryPaymentService_, _URL_, ApplicationParameters, mock) {
        test = ServiceTest;
        service = _BeneficiaryPaymentService_;
        url = _URL_;
        beneficiary = {};
        applicationParams = ApplicationParameters;
        timeNow = '2014-05-31T14:59:00.000+0200';
        applicationParams.pushVariable('latestTimestampFromServer', moment(timeNow));
        mocker = mock;
    }));

    describe('when making a payment now', function () {
        var paymentNow = {
            beneficiary: 'beneficiary',
            account: 'account',
            amount: 'amount',
            date: moment('2014-05-31T14:59:00.000+0200')
        };

        afterEach(function () {
            test.resolvePromise();
        });

        it('should invoke the payment service with the specified amount, beneficiary and account', function () {
            paymentService.pay.and.returnValue(mocker.resolve({
                data: successfulResponse
            }));

            service.payBeneficiary(paymentNow);
            expect(accountsService.clear).toHaveBeenCalled();
            expect(listService.clear).toHaveBeenCalled();
            expect(paymentService.pay).toHaveBeenCalled();
        });

        it('should know to make a payment now if the payment date is on the same day as today', function () {
            paymentNow.date = moment('2014-05-31T19:59:00.000+0200');

            paymentService.pay.and.returnValue(mocker.resolve({
                data: successfulResponse
            }));

            var promise = service.payBeneficiary(paymentNow);

            expect(promise).toBeResolvedWith(jasmine.objectContaining({ responseFromServer: { data: successfulResponse}}));

            expect(paymentService.pay.calls.mostRecent().args[1].beneficiaryPayments[0].futureDatedInstruction).toBeUndefined();
        });

        describe('when a response is received from the service', function () {
            it('should respond with a success message when the service call is successful', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: successfulResponse
                }));

                expect(service.payBeneficiary(paymentNow)).toBeResolvedWith(jasmine.objectContaining({
                    responseFromServer: {data: successfulResponse}
                }));
            });

            it('should respond with a success message when the service call is successful and there is a warning message', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: warningResponse
                }));

                expect(service.payBeneficiary(paymentNow)).toBeResolvedWith(jasmine.objectContaining({
                    responseFromServer: {data: warningResponse}
                }));
            });

            it('should return a meaningful success message on success', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: successfulResponse
                }));

                expect(service.payBeneficiary(paymentNow)).toBeResolvedWith(jasmine.objectContaining({
                    successMessage: 'Payment was successful'
                }));
            });

            it('should indicate that the payment affects account balances immediately', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: successfulResponse
                }));

                expect(service.payBeneficiary(paymentNow)).toBeResolvedWith(jasmine.objectContaining({
                    shouldUpdateAccountBalances: true
                }));
            });

            it('should pass on message from paymentService rejection (and clear accounts service)', function () {
                paymentService.pay.and.returnValue(mocker.reject({
                    "message": "Could not make payment"
                }));

                expect(service.payBeneficiary(paymentNow)).toBeRejectedWith(jasmine.objectContaining({
                    message: 'Could not make payment'
                }));

                expect(accountsService.clear).toHaveBeenCalled();
            });

            it('should reject when paymentService returns a non-success transactionResult', function () {
                paymentService.pay.and.returnValue(mocker.resolve({data: errorResponse}));

                expect(service.payBeneficiary(paymentNow)).toBeRejectedWith({message: ': Something bad happened'});
            });

            it('should resolve when paymentService returns a success response code for the first transactionResult', function () {
                var responseWithErrorResponseType = {
                    "transactionResults": [
                        {
                            "responseCode": {
                                "code": "0000",
                                "responseType": "ERROR",
                                "message": "Something bad happened"
                            }
                        }
                    ]
                };
                paymentService.pay.and.returnValue(mocker.resolve({data: responseWithErrorResponseType}));

                expect(service.payBeneficiary(paymentNow)).toBeResolved();
            });

            it('should resolve when paymentService returns a success response type for the first transactionResult', function () {
                var errorWithErrorResponseCode = {
                    "transactionResults": [
                        {
                            "responseCode": {
                                "code": "9999",
                                "responseType": "SUCCESS",
                                "message": "Something bad happened"
                            }
                        }
                    ]
                };
                paymentService.pay.and.returnValue(mocker.resolve({data: errorWithErrorResponseCode}));

                expect(service.payBeneficiary(paymentNow)).toBeResolved();
            });
        });
    });

    describe('when making a future dated payment', function () {
        var paymentInFuture = {
            beneficiary: 'beneficiary',
            account: 'account',
            amount: 'amount',
            date: '2014-06-01T22:00:00.000+0000'
        };

        afterEach(function () {
            test.resolvePromise();
        });

        it('should invoke the payment service with the future payment date', function () {
            paymentService.pay.and.returnValue(mocker.resolve({
                data: successfulResponse
            }));

            expect(service.payBeneficiary(paymentInFuture)).toBeResolvedWith(jasmine.objectContaining({
                responseFromServer: {data: successfulResponse}
            }));

            expect(paymentService.pay.calls.mostRecent().args[1].beneficiaryPayments[0].futureDatedInstruction).not.toBeUndefined();
        });

        it('should return a meaningful success message on success', function () {
            paymentService.pay.and.returnValue(mocker.resolve({
                data: successfulResponse
            }));

            expect(service.payBeneficiary(paymentInFuture)).toBeResolvedWith(jasmine.objectContaining({
                successMessage: 'Payment was successfully scheduled'
            }));
        });

        it('should indicate that the payment does not affect account balances immediately', function () {
            paymentService.pay.and.returnValue(mocker.resolve({
                data: successfulResponse
            }));

            expect(service.payBeneficiary(paymentInFuture)).toBeResolvedWith(jasmine.objectContaining({
                shouldUpdateAccountBalances: false
            }));
        });

        describe('when making a repeat payment', function () {
            var scheduledPayment = {
                beneficiary: 'beneficiary',
                account: 'account',
                amount: 'amount',
                date: '2014-06-01T22:00:00.000+0000',
                repeatInterval: 'Weekly',
                repeatNumber: 5
            };

            it('should invoke the payment service with the payment date, interval and number of repeats', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: successfulResponse
                }));

                expect(service.payBeneficiary(scheduledPayment)).toBeResolvedWith(jasmine.objectContaining({
                    responseFromServer: {data: successfulResponse}
                }));

                var futureDatedInstruction = paymentService.pay.calls.mostRecent().args[1].beneficiaryPayments[0].futureDatedInstruction;
                expect(futureDatedInstruction.fromDate).toBe(scheduledPayment.date);
                expect(futureDatedInstruction.repeatInterval).toBe(scheduledPayment.repeatInterval);
                expect(futureDatedInstruction.repeatNumber).toBe(Number(scheduledPayment.repeatNumber).toString());
            });

            it('should return a meaningful success message on success', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: successfulResponse
                }));

                expect(service.payBeneficiary(scheduledPayment)).toBeResolvedWith(jasmine.objectContaining({
                    successMessage: 'Payments were successfully scheduled'
                }));
            });

            it('should indicate that the payment does not affect account balances immediately', function () {
                paymentService.pay.and.returnValue(mocker.resolve({
                    data: successfulResponse
                }));

                expect(service.payBeneficiary(scheduledPayment)).toBeResolvedWith(jasmine.objectContaining({
                    shouldUpdateAccountBalances: false
                }));
            });
        });
    });
});
