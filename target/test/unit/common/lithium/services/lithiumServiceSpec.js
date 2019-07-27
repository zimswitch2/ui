describe('Unit Test - LithiumService', function () {
    beforeEach(module('lithium.lithiumService', 'refresh.test'));

    describe('When authenticate() is called', function () {
        var LithiumService, ServiceTest, LithiumEndpoint;
        beforeEach(inject(function (_LithiumService_, _ServiceTest_, $q) {
            LithiumService = _LithiumService_;
            ServiceTest = _ServiceTest_;
            LithiumEndpoint = ServiceTest.spyOnEndpoint('authenticateLithium');
            LithiumEndpoint.and.returnValue($q.when(
                {
                    data: {
                        ssoUrl: 'A magical token that opens a door to a world of excitement ;-)'
                    }
                }));
        }));

        it('it should call the ServiceEndpoint.lithiumAuthenticate.makeRequest()', function () {
            LithiumService.authenticate();
            expect(LithiumEndpoint).toHaveBeenCalled();
        });

        describe('Given lithium authentication was successful ', function () {
            it('it should return a promise with a then clause that contains the token', function () {
                var _ssoUrl;

                LithiumService.authenticate().then(function (ssoUrl) {
                    _ssoUrl = ssoUrl;
                });

                ServiceTest.resolvePromise();

                expect(_ssoUrl).toBeDefined();
            });
        });

    });
});
