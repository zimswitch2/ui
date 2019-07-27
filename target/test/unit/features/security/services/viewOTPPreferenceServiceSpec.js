describe('When viewOPTPreference', function () {
    beforeEach(module('refresh.viewOTPPreference', 'refresh.test'));

    describe('service', function () {
        var service, test, cacheFactory;

        beforeEach(inject(function (_ViewOTPPreferenceService_, _ServiceTest_, _DSCacheFactory_) {
            service = _ViewOTPPreferenceService_;
            test = _ServiceTest_;
            test.spyOnEndpoint('getOTPPreference');
            cacheFactory = _DSCacheFactory_;
        }));

        describe('then view otp preference ', function () {
            it('should invoke the get otp preference', function () {
                test.stubResponse('getOTPPreference', 200);
                service.getOTPPreference({number:'number'});
                expect(test.endpoint('getOTPPreference')).toHaveBeenCalledWith({"card": {number: 'number'}});
            });

            it('should return the response upon success', function () {
                test.stubResponse('getOTPPreference', 200, {"data": "here is the response"}, {"x-sbg-response-code": "0000"});
                expect(service.getOTPPreference({"card": {number: 'number'}})).toBeResolvedWith({"data": "here is the response"});
                test.resolvePromise();
            });

            it('should not return the response upon failure', function () {
                var card = {"card": {number: 'number'}};
                test.stubResponse('getOTPPreference', 204, {}, {"x-sbg-response-code": "9999"});
                expect(service.getOTPPreference(card)).toBeRejectedWith({'message': 'An error has occurred', 'model': card, "code": undefined});
                test.resolvePromise();
            });

            it('should not return the response upon generic failure', function () {
                var card = {"card": {number: 'number'}};
                test.stubResponse('getOTPPreference', 500, {}, {"x-sbg-response-code": "9999"});
                expect(service.getOTPPreference(card)).toBeRejectedWith({'message': 'An error has occurred', 'model': card, "code": undefined});
                test.resolvePromise();
            });

        });

    });
});
