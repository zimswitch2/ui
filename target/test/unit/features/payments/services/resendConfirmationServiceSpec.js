describe('Unit test - Resend confirmation service ', function () {

    beforeEach(module('refresh.resendConfirmation', 'refresh.test'));

    var preferredName = "Shingirai";
    var digitalId, test, resendConfirmationService, _mock_;

    beforeEach(inject(function(ServiceTest, ResendConfirmationService, mock, DigitalId) {
        test = ServiceTest;
        resendConfirmationService = ResendConfirmationService;
        _mock_ = mock;
        digitalId = DigitalId;
        digitalId.authenticate(null, preferredName);
        test.spyOnEndpoint('resendPaymentConfirmation');
    }));

    describe('Resend confirmation', function () {
        var card = {number:  "123456789"};
        var beneficiary = {};
        var paymentConfirmationHistory = {
            beneficiary : beneficiary,
            confirmationStatus: "S",
            transactionNumber: "12345"
        };
        var keyValueMetadata = [
            {
                'key':'PreferredName',
                'value': preferredName
            }
        ];
        var expectedData = {
            card : card,
            paymentConfirmationHistory : paymentConfirmationHistory,
            keyValueMetadata : keyValueMetadata
        };

        it('should resolve with success', function() {
            test.stubResponse('resendPaymentConfirmation', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

            expect(resendConfirmationService.resendConfirmation(card, paymentConfirmationHistory)).toBeResolvedWith({
                success: true
            });

            expect(test.endpoint('resendPaymentConfirmation')).toHaveBeenCalledWith(expectedData);
            test.resolvePromise();
        });

        it('should resolve with an error', function () {
            test.stubResponse('resendPaymentConfirmation', 200, {message: 'OK'}, {
                'x-sbg-response-code': '9999',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(resendConfirmationService.resendConfirmation(card, paymentConfirmationHistory)).toBeResolvedWith({
                success: false,
                message: 'Something is wrong'
            });
            test.resolvePromise();
        });

        it('should resolve with error and message when service is unavailable', function () {
            test.stubResponse('resendPaymentConfirmation', 404);

            expect(resendConfirmationService.resendConfirmation(card, paymentConfirmationHistory)).toBeResolvedWith({
                success: false,
                message: "An error has occurred"
            });
            test.resolvePromise();
        });
    });
});