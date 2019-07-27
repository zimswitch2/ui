describe('Cacher', function () {
    'use strict';

    var cacheFactory, Cacher, serviceTest;

    beforeEach(module('refresh.cache'));

    beforeEach(inject(function (_DSCacheFactory_, _Cacher_, ServiceTest) {
        cacheFactory = _DSCacheFactory_;
        Cacher = _Cacher_;

        serviceTest = ServiceTest;
        serviceTest.spyOnEndpoint('listAccounts');
        serviceTest.stubResponse('listAccounts', 200, {data: true});
    }));

    describe('caches', function () {
        it('should have an aggressive expiring cache', function () {
            expect(cacheFactory.get('shortLived').info()).toEqual(jasmine.objectContaining({
                maxAge: 60000,
                deleteOnExpire: 'aggressive'
            }));
        });

        it('should have a perennial cache', function () {
            expect(cacheFactory.get('perennial').info()).toEqual(jasmine.objectContaining({
                maxAge: Number.MAX_VALUE,
                deleteOnExpire: 'none'
            }));
        });
    });

    describe('for short lived cache', function () {
        describe('fetch', function () {
            it('should call the endpoint', function () {
                Cacher.shortLived.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();

                expect(serviceTest.endpoint('listAccounts')).toHaveBeenCalledWith({card: 1});
            });

            it('should resolve with response', function () {
                expect(Cacher.shortLived.fetch('listAccounts', {card: 1})).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
            });

            it('should not call the service if the cache is set', function () {
                Cacher.shortLived.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();

                expect(Cacher.shortLived.fetch('listAccounts', {card: 1})).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(1);
            });

            it('should clone the cache object to avoid modification', function (done) {
                Cacher.shortLived.fetch('listAccounts', {card: 1}).then(function (response) {
                    response.data = {modified: true};
                    return Cacher.shortLived.fetch('listAccounts', {card: 1});
                }).then(function (secondResponse) {
                    expect(secondResponse.data).toEqual({data: true});
                    done();
                });
                serviceTest.resolvePromise();
            });

            describe('on service rejection', function () {
                beforeEach(function () {
                    serviceTest.stubResponse('listAccounts', 500, {message: 'Error'});
                });

                it('should reject with the response error', function () {
                    expect(Cacher.shortLived.fetch('listAccounts', {card: 1})).toBeRejectedWith({
                        data: {message: 'Error'},
                        status: 500,
                        headers: jasmine.any(Function)
                    });
                    serviceTest.resolvePromise();
                });

                it('should not cache', function () {
                    Cacher.shortLived.fetch('listAccounts', {card: 1});
                    serviceTest.resolvePromise();

                    expect(Cacher.shortLived.fetch('listAccounts', {card: 1})).toBeRejectedWith({
                        data: {message: 'Error'},
                        status: 500,
                        headers: jasmine.any(Function)
                    });
                    serviceTest.resolvePromise();
                    expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
                });
            });
        });

        describe('flushEndpoint', function () {
            it('should call the service again when the cache is flushed', function () {
                Cacher.shortLived.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();
                Cacher.shortLived.flushEndpoint('listAccounts');

                expect(Cacher.shortLived.fetch('listAccounts', {card: 1})).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
            });

            it('should flush specific cache keys', function () {
                Cacher.shortLived.fetch('listAccounts', {card: 1}, 'list-1-1');
                serviceTest.resolvePromise();
                Cacher.shortLived.flushEndpoint('list-1-1');

                expect(Cacher.shortLived.fetch('listAccounts', {card: 1}, 'list-1-1')).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
            });
        });

        describe('flush', function () {
            beforeEach(function () {
                serviceTest.spyOnEndpoint('listBeneficiary');
                serviceTest.stubResponse('listBeneficiary', 200, {data: true});
            });

            it('should remove all cached endpoints', function () {
                Cacher.shortLived.fetch('listAccounts', {card: 1});
                Cacher.shortLived.fetch('listBeneficiary', {card: 1});
                serviceTest.resolvePromise();

                Cacher.shortLived.flush();

                Cacher.shortLived.fetch('listAccounts', {card: 1});
                Cacher.shortLived.fetch('listBeneficiary', {card: 1});
                serviceTest.resolvePromise();

                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
                expect(serviceTest.endpoint('listBeneficiary').calls.count()).toEqual(2);
            });
        });
    });

    describe('for perennial cache', function () {
        describe('fetch', function () {
            it('should load the data from the service if a second call lands before the first has the data', function () {
                Cacher.perennial.fetch('listAccounts', {card: 1});
                Cacher.perennial.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();

                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
            });

            it('should call the endpoint', function () {
                Cacher.perennial.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();

                expect(serviceTest.endpoint('listAccounts')).toHaveBeenCalledWith({card: 1});
            });

            it('should resolve with response', function () {
                expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
            });

            it('should not call the service if the cache is set', function () {
                Cacher.perennial.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();

                expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(1);
            });

            it('should clone the cache object to avoid modification', function (done) {
                Cacher.perennial.fetch('listAccounts', {card: 1}).then(function (response) {
                    response.data = {modified: true};
                    return Cacher.perennial.fetch('listAccounts', {card: 1});
                }).then(function (secondResponse) {
                    expect(secondResponse.data).toEqual({data: true});
                    done();
                });
                serviceTest.resolvePromise();
            });

            describe('on service rejection', function () {
                beforeEach(function () {
                    serviceTest.stubResponse('listAccounts', 500, {message: 'Error'});
                });

                it('should reject with the response error', function () {
                    expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeRejectedWith({
                        data: {message: 'Error'},
                        status: 500,
                        headers: jasmine.any(Function)
                    });
                    serviceTest.resolvePromise();
                });

                it('should not cache', function () {
                    Cacher.perennial.fetch('listAccounts', {card: 1});
                    serviceTest.resolvePromise();

                    expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeRejectedWith({
                        data: {message: 'Error'},
                        status: 500,
                        headers: jasmine.any(Function)
                    });
                    serviceTest.resolvePromise();
                    expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
                });
            });

            describe('on service header errors', function () {
                beforeEach(function () {
                    serviceTest.stubResponse('listAccounts', 200, {message: 'Error'}, {'x-sbg-response-type': 'ERROR'});
                });

                it('should reject with the response error', function () {
                    expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeRejectedWith({
                        data: {message: 'Error'},
                        status: 200,
                        headers: jasmine.any(Function)
                    });
                    serviceTest.resolvePromise();
                });

                it('should not cache', function () {
                    Cacher.perennial.fetch('listAccounts', {card: 1});
                    serviceTest.resolvePromise();

                    expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeRejectedWith({
                        data: {message: 'Error'},
                        status: 200,
                        headers: jasmine.any(Function)
                    });
                    serviceTest.resolvePromise();
                    expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
                });
            });
        });

        describe('flushEndpoint', function () {
            it('should call the service again when the cache is flushed', function () {
                Cacher.perennial.fetch('listAccounts', {card: 1});
                serviceTest.resolvePromise();
                Cacher.perennial.flushEndpoint('listAccounts');

                expect(Cacher.perennial.fetch('listAccounts', {card: 1})).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
            });

            it('should flush specific cache keys', function () {
                Cacher.perennial.fetch('listAccounts', {card: 1}, 'list-1-1');
                serviceTest.resolvePromise();
                Cacher.perennial.flushEndpoint('list-1-1');

                expect(Cacher.perennial.fetch('listAccounts', {card: 1}, 'list-1-1')).toBeResolvedWith({
                    data: {data: true},
                    status: 200,
                    headers: jasmine.any(Function)
                });
                serviceTest.resolvePromise();
                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
            });
        });

        describe('flush', function () {
            beforeEach(function () {
                serviceTest.spyOnEndpoint('listBeneficiary');
                serviceTest.stubResponse('listBeneficiary', 200, {data: true});
            });

            it('should remove all cached endpoints', function () {
                Cacher.perennial.fetch('listAccounts', {card: 1});
                Cacher.perennial.fetch('listBeneficiary', {card: 1});
                serviceTest.resolvePromise();

                Cacher.perennial.flush();

                Cacher.perennial.fetch('listAccounts', {card: 1});
                Cacher.perennial.fetch('listBeneficiary', {card: 1});
                serviceTest.resolvePromise();

                expect(serviceTest.endpoint('listAccounts').calls.count()).toEqual(2);
                expect(serviceTest.endpoint('listBeneficiary').calls.count()).toEqual(2);
            });
        });
    });
});
