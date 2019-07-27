describe('Once Off Payment Services', function () {
    beforeEach(module('refresh.onceOffPayment'));

    var accountsService, paymentService;
    beforeEach(function () {
        accountsService = jasmine.createSpyObj('accounts', ['clear']);
        paymentService = jasmine.createSpyObj('payment', ['pay']);
        module(function ($provide) {
            $provide.value('AccountsService', accountsService);
            $provide.value('PaymentService', paymentService);
        });
    });

    var service, beneficiary, mocker, test;
    beforeEach(inject(function (ServiceTest, _OnceOffPaymentService_, mock) {
        test = ServiceTest;
        service = _OnceOffPaymentService_;
        beneficiary = {};
        mocker = mock;
    }));

    afterEach(function () {
        test.resolvePromise();
    });

    it('should invoke the payment service and respond with a success', function () {
        paymentService.pay.and.returnValue(mocker.resolve({
            data: {
                "transactionResults": [
                    {
                        "responseCode": {
                            "code": "0",
                            "responseType": "SUCCESS",
                            "message": "Your payment has been completed successfully"
                        }
                    }
                ]
            }
        }));
        expect(service.payPrivateBeneficiaryOnceOff('beneficiary', 'account', 'amount')).toBeResolvedWith(jasmine.objectContaining({
            isWarning: false
        }));

        expect(accountsService.clear).toHaveBeenCalled();
    });

    it('should invoke the payment service and respond with a success', function () {
        paymentService.pay.and.returnValue(mocker.resolve({
            data: {
                "transactionResults": [
                    {
                        "responseCode": {
                            "code": "2299",
                            "responseType": "WARNING",
                            "message": "Your payment has been completed successfully, but confirmation failed"
                        }
                    }
                ]
            }
        }));
        expect(service.payPrivateBeneficiaryOnceOff('beneficiary', 'account', 'amount')).toBeResolvedWith(jasmine.objectContaining({
            isWarning: true
        }));
    });

    it('should reject when paymentService returns a non-success response code and response type for the first transactionResult', function () {
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
        paymentService.pay.and.returnValue(mocker.resolve({data: errorResponse}));

        expect(service.payPrivateBeneficiaryOnceOff('beneficiary', 'account', 'amount')).toBeRejectedWith({message: ': Something bad happened'});
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

        expect(service.payPrivateBeneficiaryOnceOff('beneficiary', 'account', 'amount')).toBeResolved();
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

        expect(service.payPrivateBeneficiaryOnceOff('beneficiary', 'account', 'amount')).toBeResolved();
    });
});
