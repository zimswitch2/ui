describe('CDI service', function () {
    'use strict';

    beforeEach(module('refresh.metadata'));

    var woolies, duplicateWoolies, edgars, cdiList;
    var service, cacheFactory, test;

    beforeEach(inject(function (_CdiService_, _DSCacheFactory_, ServiceTest) {
        test = ServiceTest;

        service = _CdiService_;
        cacheFactory = _DSCacheFactory_;

        woolies = {"name": "Woolies", "number": "73530089178"};
        duplicateWoolies = {"name": "Woolies", "number": "1111111111"};
        edgars = {"name": "Edgars", "number": "49150060507"};
        cdiList = [woolies, edgars];
    }));

    describe('list companies in directory', function () {
        beforeEach(function() {
            test.spyOnEndpoint('listCDI');
        });

        it('should populate the cache with the companies listed in the CDI', function (done) {
            test.stubResponse('listCDI', 200, {cDIs: cdiList});
            var listPromise = service.list();
            listPromise.then(function (data) {
                expect(data).toEqual(cdiList);
                done();
            });
            expect(test.endpoint('listCDI')).toHaveBeenCalled();
            test.resolvePromise();
        });

        it('should load list of CDIs from the cache if we have it', function (done) {
            test.stubResponse('listCDI', 200, {cDIs: cdiList});
            service.list().then(function () {
                var secondCall = service.list();
                secondCall.then(function (data) {
                    expect(data).toEqual(cdiList);
                    expect(test.endpoint('listCDI')).toHaveBeenCalled();
                    done();
                });
            });
            test.resolvePromise();
        });

        it('should load the data from the service if a second call lands before the first has the data', function (done) {
            cacheFactory('cdi');
            test.stubResponse('listCDI', 200, {cDIs: cdiList});
            var secondCall = service.list();
            secondCall.then(function (data) {
                expect(data).toEqual(cdiList);
                done();
            });
            expect(test.endpoint('listCDI')).toHaveBeenCalled();
            test.resolvePromise();
        });

        it('should not allow duplicate names', function (done) {
            test.stubResponse('listCDI', 200, {cDIs: _.union(cdiList, [duplicateWoolies])});
            var listPromise = service.list();
            listPromise.then(function (data) {
                expect(data).toEqual(cdiList);
                done();
            });
            expect(test.endpoint('listCDI')).toHaveBeenCalled();
            test.resolvePromise();
        });
    });

    describe('find company', function() {
        beforeEach(function() {
            test.spyOnEndpoint('findCompany');
        });

        it('should return null when searching for a company', function() {
            test.stubResponse('findCompany', 200, { company: null }, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'});

            expect(service.findCompany('32141234')).toBeResolvedWith(null);
            test.resolvePromise();
        });

        it('should return the company that has been found', function() {

            var testCompany = { company: { name: "Test Company", number: "3234"} };
            test.stubResponse('findCompany', 200, testCompany, {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'});

            expect(service.findCompany('32141234')).toBeResolvedWith({ name: "Test Company", number: "3234"});
            test.resolvePromise();
        });
    });
});
