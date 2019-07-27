describe('secure message service', function() {

    beforeEach(module('refresh.secure.message.service', 'refresh.test'));

    var account = {
        "branch": {code: 27},
        "accountFeature": [
            {
                "feature": "PAYMENTFROM",
                "value": true
            }
        ],
        "formattedNumber": "12-34-567-890-0",
        "availableBalance": {"amount": 9000.0},
        name: "CURRENT",
        number: 'accountBeingUsed'
    };
    var businessPhoneNumber = '0111234567';
    var homePhoneNumber = '0111234567';
    var message = 'Please help';
    var preferredBranch = {code: 27};

    var secureMessage = {
        account: account,
        businessTelephone: businessPhoneNumber,
        homeTelephone: homePhoneNumber,
        content: message
    };

    var aCard = {};

    var secureMessageService, test, _mock_;

    beforeEach(inject(function(ServiceTest, SecureMessageService, mock, Card) {
        test = ServiceTest;
        _mock_ = mock;
        secureMessageService = SecureMessageService;
        spyOn(Card, 'current').and.returnValue(aCard);
        test.spyOnEndpoint('sendSecureMessage');
    }));

    describe('secure message', function() {

        var expectedSecureMessageData = {
            card:aCard,
            account: account,
            businessPhoneNumber: businessPhoneNumber,
            homePhoneNumber: homePhoneNumber,
            message: message,
            preferredBranch: preferredBranch
        };

        it('should resolve with success and data from service endpoint', function() {
            test.stubResponse('sendSecureMessage', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });
            expect(secureMessageService.sendSecureMessage(secureMessage)).toBeResolved();
            test.resolvePromise();
            expect(test.endpoint('sendSecureMessage')).toHaveBeenCalledWith(expectedSecureMessageData);
        });

        it('should reject with message from service endpoint when with error in header', function () {
            test.stubResponse('sendSecureMessage', 200, {message: 'OK'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Something is wrong'
            });
            expect(secureMessageService.sendSecureMessage(secureMessage)).toBeRejectedWith('Something is wrong');
            test.resolvePromise();
        });

        it('should reject with error and message when the status is not success and no error message', function () {
            test.stubResponse('sendSecureMessage', 404);
            expect(secureMessageService.sendSecureMessage(secureMessage)).toBeRejectedWith('An error has occurred');
            test.resolvePromise();
        });

        it('should reject with error message when the http call is rejected', function () {
            test.stubRejection('sendSecureMessage', 200, {message: 'this is a custom error'});
            expect(secureMessageService.sendSecureMessage(secureMessage)).toBeRejectedWith('this is a custom error');
            test.resolvePromise();
        });
    });
});