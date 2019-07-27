describe('bank service', function () {
    'use strict';

    var service, httpBackend, url;
    var successHeaders = {'x-sbg-response-code': '0000'};

    beforeEach(module('refresh.metadata'));
    beforeEach(inject(function (_BankService_, $httpBackend, _URL_) {
        service = _BankService_;
        httpBackend = $httpBackend;
        url = _URL_;
    }));

    describe('list banks', function () {
        it('should populate the cache with the list of banks', function () {
            var expected = [{name: "Standard Bank", code: "051", branch: null}];
            httpBackend.expectGET(url.listBanks).respond({banks: expected});
            var listPromise = service.list();
            listPromise.then(function (data) {
                expect(data).toEqual(expected);
            });
            httpBackend.flush();
        });

        it('should not populate the cache with the list of banks if the call fails', function () {
            httpBackend.expectGET(url.listBanks).respond(500);
            var listPromise = service.list();
            listPromise.then(function (data) {
            }, function (error) {
                expect(error.status).toEqual(500);
            });

            httpBackend.flush();
        });

        it('should load data from the cache if we have it', function (done) {
            var expected = [{name: "Standard Bank", code: "051", branch: null}];
            httpBackend.expectGET(url.listBanks).respond({banks: expected}, successHeaders);
            service.list().then(function () {
                var listPromise = service.list();
                listPromise.then(function (data) {
                    expect(data).toEqual(expected);
                    done();
                });
            });
            httpBackend.flush();
        });

        it('should load the data from the service if a second call lands before the first has the data', function () {
            var expected = [{name: "Standard Bank", code: "051", branch: null}];
            httpBackend.expectGET(url.listBanks).respond({banks: expected}, successHeaders);
            var listPromise = service.list();
            listPromise.then(function (data) {
                expect(data).toEqual(expected);
            });
            httpBackend.flush();
        });
    });

    describe('list branches', function () {
        it('should populate the cache with the list of branches for a bank', function () {
            var expected = [{name: "A bank branch", code: "20003800"}];
            httpBackend.expectPOST(url.searchBranch, {bank: {name: 'bank name'}}).respond({branches: expected},
                successHeaders);
            var listPromise = service.searchBranches('bank name');
            listPromise.then(function (data) {
                expect(data).toEqual(expected);
            });
            httpBackend.flush();
        });

        it('should load data from the cache if we have it', function (done) {
            var expected = [{name: "A bank branch", code: "20003800"}];
            httpBackend.expectPOST(url.searchBranch).respond({branches: expected}, successHeaders);
            service.searchBranches('200').then(function (data) {
                var listPromise = service.searchBranches('200');
                listPromise.then(function (data) {
                    expect(data).toEqual(expected);
                    done();
                });
            });
            httpBackend.flush();
        });

        it('should load the data from the service if a second call lands before the first has the data', function () {
            var expected = [{name: "A bank branch", code: "20003800"}];
            httpBackend.expectPOST(url.searchBranch).respond({branches: expected}, successHeaders);
            var listPromise = service.searchBranches('200');
            listPromise.then(function (data) {
                expect(data).toEqual(expected);
            });
            httpBackend.flush();
        });
    });

    describe('list walk in branches', function () {
        it('should populate the cache with the list of branches', function () {
            var expected = [
                {code: '5541', name: 'Aberdeen', label: jasmine.any(Function)},
                {code: '2171', name: 'Albert Street', label: jasmine.any(Function)}
            ];
            httpBackend.expectGET(url.walkInBranches).respond({branches: expected}, successHeaders);
            expect(service.walkInBranches()).toBeResolvedWith(expected);

            httpBackend.flush();
        });

        it('should set the label in each item', function (done) {
            httpBackend.expectGET(url.walkInBranches).respond({
                branches: [
                    {code: '5541', name: 'Aberdeen', label: jasmine.any(Function)},
                    {code: '2171', name: 'Albert Street', label: jasmine.any(Function)}
                ]
            }, successHeaders);
            service.walkInBranches().then(function (branches) {
                expect(branches[0].label()).toEqual('Aberdeen');
                expect(branches[1].label()).toEqual('Albert Street');
                done();
            });

            httpBackend.flush();
        });

        it('should not populate the cache with the list of banks if the call fails', function () {
            httpBackend.expectGET(url.walkInBranches).respond(500);
            expect(service.walkInBranches()).toBeRejected();

            httpBackend.flush();
        });

        it('should load data from the cache if we have it', function () {
            var expected = [
                {code: '5541', name: 'ABERDEEN'},
                {code: '2171', name: 'ALBERT STREET'}
            ];
            httpBackend.expectGET(url.walkInBranches).respond({branches: expected}, successHeaders);
            expect(service.walkInBranches()).toBeResolved();
            httpBackend.flush();

            expect(service.walkInBranches()).toBeResolved();
            httpBackend.verifyNoOutstandingRequest();
        });
    });
});