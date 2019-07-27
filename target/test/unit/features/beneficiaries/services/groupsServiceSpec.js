describe('Beneficiary Groups Service', function () {
    beforeEach(module('refresh.beneficiaries.groups','refresh.beneficiaries.beneficiariesListService'));

    var $httpBackend, service, Fixture, URL, test, listService;

    var successHeaders = {'x-sbg-response-code': "0000", 'x-sbg-response-type': 'SUCCESS'};

    beforeEach(inject(function (_$httpBackend_, _URL_, GroupsService, _Fixture_, _ServiceTest_, BeneficiariesListService) {
        $httpBackend = _$httpBackend_;
        service = GroupsService;
        Fixture = _Fixture_;
        URL = _URL_;
        test = _ServiceTest_;
        test.spyOnEndpoint('deleteBeneficiaryGroups');
        listService = BeneficiariesListService;
        listService.clear = jasmine.createSpy('clear');
    }));

    describe('list with members', function () {
        it('should aggregate the members of a group', function (done) {
            $httpBackend.expectPOST(URL.beneficiaryGroups).respond(
                Fixture.load('base/test/unit/fixtures/viewGroupsResponse.json'),
                successHeaders
                );
            $httpBackend.expectPOST(URL.beneficiaries).respond(
                Fixture.load('base/test/unit/fixtures/viewResponse.json'),
                successHeaders);
            var result = service.listWithMembers({number: 'number'});
            result.then(function (data) {
                expect(data.beneficiaryGroups.length).toEqual(4);
                expect(data.beneficiaryGroups[0].beneficiaries.length).toEqual(2);
                done();
            });
            $httpBackend.flush();
        });

        it('should handle bad data from groups service', function (done) {
            $httpBackend.expectPOST(URL.beneficiaryGroups).respond({}, successHeaders);
            $httpBackend.expectPOST(URL.beneficiaries).respond({}, successHeaders);
            var result = service.listWithMembers({number: 'number'});
            result.then(function () {
            }, function () {
                done();
            });
            $httpBackend.flush();
        });
    });

    describe('delete', function () {
        beforeEach(inject(function (GroupsService) {
            service = GroupsService;
            service.clear = jasmine.createSpy('clear');
        }));

        it('should remove the groups from the beneficiaries then delete the group', function () {
            var expectedRequest = {groups: [ {name: 'Foo'} ], card: {number: 'ABC123'}};
            test.stubResponse('deleteBeneficiaryGroups', {});
            service.deleteGroup({name: 'Foo'}, {number: 'ABC123'});
            test.resolvePromise();

            expect(test.endpoint('deleteBeneficiaryGroups')).toHaveBeenCalledWith(expectedRequest);
            expect(listService.clear).toHaveBeenCalled();
            expect(service.clear).toHaveBeenCalled();
        });

        it('should reject with an error if deletion was not successful', function (done) {
            var expectedRequest = {groups: [ {name: 'Foo'} ], card: {number: 'ABC123'}};
            test.stubResponse('deleteBeneficiaryGroups', 500, {message: 'error'});
            service.deleteGroup({name: 'Foo'}, {number: 'ABC123'}).then(_.noop,
                function (error) {
                    expect(error.status).toEqual(500);
                    expect(test.endpoint('deleteBeneficiaryGroups')).toHaveBeenCalledWith(expectedRequest);
                    done();
                }
            );
            test.resolvePromise();
        });
    });

    describe('rename', function () {
        var newName = 'New Name';
        var oldName = 'Old Name';
        var http, service, url;

        beforeEach(inject(function (GroupsService, _$httpBackend_, _URL_) {
            http = _$httpBackend_;
            service = GroupsService;
            service.clear = jasmine.createSpy('clear');
            url = _URL_;
        }));

        it('should respond with success message when invoked', function () {
            http.whenPUT(url.beneficiaryGroups).respond(200, {}, successHeaders);
            var promise = service.rename(newName, oldName, {card: {}}), result;
            promise.then(function (response) {
                result = response;
            });
            http.flush();

            expect(result.status).toEqual(200);
            expect(result.headers('x-sbg-response-code')).toEqual("0000");
            expect(result.headers('x-sbg-response-type')).toEqual("SUCCESS");
            expect(listService.clear).toHaveBeenCalled();
            expect(service.clear).toHaveBeenCalled();
        });

        it('should respond with an error message for a duplicate group when invoked', function () {
            http.whenPUT(url.beneficiaryGroups).respond(200, {}, {'x-sbg-response-code': "2700", 'x-sbg-response-type': 'ERROR'});
            var result, promise = service.rename(newName, oldName, {card: {}});
            promise.then(function (response) {
                result = response;
            }, function (rejected) {
                result = rejected;
            });
            http.flush();

            expect(result.message).toEqual('You already have a beneficiary group with this name.');
        });

        it('should respond with an error message for exceeding maximum number of group when invoked', function () {
            http.whenPUT(url.beneficiaryGroups).respond(200, {}, {'x-sbg-response-code': "2702", 'x-sbg-response-type': 'ERROR'});
            var result, promise = service.rename(newName, oldName, {card: {}});
            promise.then(function (response) {
                result = response;
            }, function (rejected) {
                result = rejected;
            });
            http.flush();

            expect(result.message).toEqual('Group cannot be added as you are already at your maximum number of 30 groups.');
        });

        it('should respond with a generic error when invoked', function () {
            http.whenPUT(url.beneficiaryGroups).respond(200, {}, {'x-sbg-response-code': "1234", 'x-sbg-response-type': 'ERROR',
                'x-sbg-response-message': 'Error message received form service'});
            var result, promise = service.rename(newName, oldName, {card: {}});
            promise.then(function (response) {
                result = response;
            }, function (rejected) {
                result = rejected;
            });
            http.flush();

            expect(result.message).toEqual('Error message received form service');
        });

        it('should respond with a generic error when invoked without error message from service', function () {
            http.whenPUT(url.beneficiaryGroups).respond(200, {}, {'x-sbg-response-code': "1234", 'x-sbg-response-type': 'ERROR'});
            var result, promise = service.rename(newName, oldName, {card: {}});
            promise.then(function (response) {
                result = response;
            }, function (rejected) {
                result = rejected;
            });
            http.flush();

            expect(result.message).toEqual('An error has occurred');
        });

        it('should respond with a generic server error when invoked', function () {
            http.whenPUT(url.beneficiaryGroups).respond(500, {}, {});
            var result, promise = service.rename(newName, oldName, {card: {}});
            promise.then(function (response) {
                result = response;
            }, function (rejected) {
                result = rejected;
            });
            http.flush();

            expect(result.message).toEqual('An error has occurred');
        });
    });

    describe('list cache', function(){
        var cacheFactory;
        beforeEach(inject(function(_DSCacheFactory_){
            cacheFactory = _DSCacheFactory_;
            test.spyOnEndpoint('viewBeneficiaryGroup');
            test.spyOnEndpoint('listBeneficiary');
        }));

        it('should not populate the cache with the list of groups if the call fails', function (done) {
            test.stubResponse('viewBeneficiaryGroup', 500, getObjFromJsonFile('base/test/unit/fixtures/viewGroupsResponse.json'));
            test.stubResponse('listBeneficiary', 200, {beneficiaries: []}, successHeaders);
            var listPromise = service.listWithMembers({number: 'number'});
            listPromise.then(function (data) {
            }, function(error) {
                expect(error.status).toEqual(500);
                done();
            });
            test.resolvePromise();
        });

        it('should load data from the cache if we have it', function (done) {
            test.stubResponse('viewBeneficiaryGroup', 200, getObjFromJsonFile('base/test/unit/fixtures/viewGroupsResponse.json'),successHeaders);
            test.stubResponse('listBeneficiary', 200, getObjFromJsonFile('base/test/unit/fixtures/viewResponse.json'), successHeaders);
            service.listWithMembers({number: 'number'}).then(function () {
                var listPromise = service.listWithMembers({number: 'number'});
                listPromise.then(function (data) {
                    expect(data.beneficiaryGroups.length).toEqual(4);
                    expect(data.beneficiaryGroups[0].beneficiaries.length).toEqual(2);
                    expect(test.endpoint('viewBeneficiaryGroup').calls.count()).toEqual(1);
                    done();
                });
            });
            test.resolvePromise();
        });

        it('should load the groups from the service if not in the cache', function (done) {
            test.stubResponse('viewBeneficiaryGroup', 200, getObjFromJsonFile('base/test/unit/fixtures/viewGroupsResponse.json'), successHeaders);
            test.stubResponse('listBeneficiary', 200, getObjFromJsonFile('base/test/unit/fixtures/viewResponse.json'), successHeaders);
            service.listWithMembers({number: 'number'}).then(function() {
                service.clear();
                var listPromise = service.listWithMembers({number: 'number'});
                listPromise.then(function (data) {
                    expect(data.beneficiaryGroups.length).toEqual(4);
                    expect(data.beneficiaryGroups[0].beneficiaries.length).toEqual(2);
                    expect(test.endpoint('viewBeneficiaryGroup').calls.count()).toEqual(2);
                    done();
                });
            });
            test.resolvePromise();
        });

        function getObjFromJsonFile(jsonPath) {
            return JSON.parse(Fixture.load(jsonPath));
        }
    });
});
