describe('EndpointDefinition', function () {
    'use strict';

    beforeEach(module('refresh.webServices.endpointDefinition'));

    describe('create', function () {
        it('should store name, url, method and spinnerStyle', inject(function (EndpointDefinition) {
            expect(EndpointDefinition.create('/test', 'GET', 'none')).toEqual(jasmine.objectContaining({
                url: '/test',
                method: 'GET',
                spinnerStyle: 'none'
            }));
        }));

        it('should default spinnerStyle to global', inject(function (EndpointDefinition) {
            expect(EndpointDefinition.create( '/test', 'GET')).toEqual(jasmine.objectContaining({
                url: '/test',
                method: 'GET',
                spinnerStyle: 'global'
            }));
        }));
    });

    describe('makeRequest', function () {
        var httpBackend, definition, rejectFailureDefinition, rootScope;

        var successHeaders = { 'x-sbg-response-code': '0000' };
        var failureHeaders = {
            'x-sbg-response-code': '9999',
            'x-sbg-response-message': 'error message'
        };
        var temporarilyUnavailableHeaders = {
            'x-sbg-response-code': '6001',
            'x-sbg-response-type': 'ERROR',
            'x-sbg-response-message': 'Mobile Banking is not available at present. Please try again later.'
        };

        beforeEach(inject(function ($httpBackend, $rootScope, EndpointDefinition) {
            httpBackend = $httpBackend;
            rootScope = $rootScope;
            spyOn(rootScope,'$broadcast').and.callThrough();
            definition = EndpointDefinition.create('/test', 'GET', 'none');
            var ignoreErrorResponseCodes = false;
            rejectFailureDefinition = EndpointDefinition.create('/testReject', 'POST', 'none', ignoreErrorResponseCodes);
        }));

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should call specified endpoint with empty data if payload not given for POST request', inject(function (EndpointDefinition) {
            definition = EndpointDefinition.create('/test', 'POST', 'none');

            httpBackend.expect('POST', '/test', {}).respond(200, '', successHeaders);

            definition.makeRequest();

            httpBackend.flush();
        }));

        it('should call specified endpoint with given payload for POST request', inject(function (EndpointDefinition) {
            definition = EndpointDefinition.create('/test', 'POST', 'none');

            httpBackend.expect('POST', '/test', {data: true}).respond(200, '', successHeaders);

            definition.makeRequest({data: true});
            httpBackend.flush();
        }));

        it('should call specified endpoint with given payload for PUT request', inject(function (EndpointDefinition) {
            definition = EndpointDefinition.create('/test', 'PUT', 'none');

            httpBackend.expect('PUT', '/test', {data: true}).respond(200, '', successHeaders);

            definition.makeRequest({data: true});
            httpBackend.flush();
        }));

        it('should call specified endpoint with given payload for GET request', inject(function (EndpointDefinition) {
            definition = EndpointDefinition.create('/test', 'GET', 'none');

            httpBackend.expect('GET', '/test?params=true').respond(200, '', successHeaders);

            definition.makeRequest({params: true});
            httpBackend.flush();
        }));

        it('should call specified endpoint with given payload for DELETE request', inject(function (EndpointDefinition) {
            definition = EndpointDefinition.create('/test', 'DELETE', 'none');

            httpBackend.expect('DELETE', '/test?params=true').respond(200, '', successHeaders);

            definition.makeRequest({params: true});
            httpBackend.flush();
        }));

        it('should resolve with response when http call succeeds', function () {
            httpBackend.when('GET', '/test').respond(200, 'response', successHeaders);

            expect(definition.makeRequest()).toBeResolvedWith(jasmine.objectContaining({data: 'response', status: 200}));

            httpBackend.flush();
        });

        it('should reject with response when http call fails', function () {
            httpBackend.when('GET', '/test').respond(404, 'error response');

            expect(definition.makeRequest()).toBeRejectedWith(jasmine.objectContaining({data: 'error response', status: 404}));

            httpBackend.flush();
        });

        it ('should reject with response when rejectAllFailures is on and response code is not 0000', function () {

            httpBackend.expect('POST', '/testReject', {}).respond(200, 'response', failureHeaders);

            expect(rejectFailureDefinition.makeRequest()).toBeRejectedWith(jasmine.objectContaining({data: 'response', status: 200}));

            httpBackend.flush();
        });

        describe('error notifications', function () {
            beforeEach(inject(function () {
                rootScope.notificationTitle = '';
            }));

            it('should display connectivity lost notification when http response status is 0', function () {
                httpBackend.when('GET', '/test', {}).respond(0);

                definition.makeRequest();
                httpBackend.flush();

                expect(rootScope.notificationTitle).toEqual('Connectivity Lost');
            });

            it('should display service error notification when http call fails', function () {
                httpBackend.when('GET', '/test', {}).respond(404);

                definition.makeRequest();
                httpBackend.flush();

                expect(rootScope.notificationTitle).toEqual('Service Error');
            });

            it('should not display service error notification when http call fails but omit flag is specified', function () {
                httpBackend.when('GET', '/test', {}).respond(404);

                definition.makeRequest({}, {
                    omitServiceErrorNotification: true
                });
                httpBackend.flush();

                expect(rootScope.notificationTitle).toEqual('');
            });
        });

        describe('error broadcasting', function () {

            it('should not broadcast unsuccessfulMcaResponse when response code is 0000', function () {
                httpBackend.when('GET', '/test', {}).respond(200, '', successHeaders);

                definition.makeRequest();
                httpBackend.flush();

                expect(rootScope.$broadcast).not.toHaveBeenCalledWith('unsuccessfulMcaResponse', successHeaders['x-sbg-response-message'], successHeaders['x-sbg-response-code'], '/test');
            });

            it('should broadcast unsuccessfulMcaResponse when response code is not 0000', function () {
                httpBackend.when('GET', '/test', {}).respond(200, '', failureHeaders);

                definition.makeRequest();
                httpBackend.flush();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('unsuccessfulMcaResponse', 'error message', '9999', '/test');
            });

            it('should broadcast unsuccessfulMcaResponse when http call fails', function () {
                httpBackend.when('GET', '/test', {}).respond(404, '', failureHeaders);

                definition.makeRequest();
                httpBackend.flush();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('unsuccessfulMcaResponse', 'error message', '9999', '/test');
            });

            it('should broadcast unsuccessfulMcaResponse when http response status is 0', function () {
                httpBackend.when('GET', '/test', {}).respond(0);

                definition.makeRequest();
                httpBackend.flush();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('unsuccessfulMcaResponse', 'Connectivity Lost', '', '/test');
            });
        });

        describe('spinner behavior', function () {
            var Spinner;

            beforeEach(inject(function (_Spinner_) {
                httpBackend.when('GET', '/test', {}).respond(200, 'response', successHeaders);
                Spinner = _Spinner_;
            }));

            it('should set spinner style to endpoint default before making http call', function () {
                definition.makeRequest();

                expect(Spinner.spinnerStyle()).toEqual('none');

                httpBackend.flush();
            });

            it('should reset spinner style to global after http call responds', function () {
                definition.makeRequest();
                httpBackend.flush();

                expect(Spinner.spinnerStyle()).toEqual('global');
            });

            it('should set spinner style to specified one before making http call', function () {
                definition.makeRequest({}, {
                    spinnerStyle: 'inline'
                });

                expect(Spinner.spinnerStyle()).toEqual('inline');

                httpBackend.flush();
            });
        });
    });

    describe('makeFormSubmissionRequest', function() {
        var httpBackend, definition, dtmAnalyticsService;

        var successHeaders = { 'x-sbg-response-code': '0000' };
        var failureHeaders = {
            'x-sbg-response-code': '9999',
            'x-sbg-response-message': 'error message'
        };

        beforeEach(inject(function ($httpBackend, EndpointDefinition, DtmAnalyticsService) {
            dtmAnalyticsService = DtmAnalyticsService;
            httpBackend = $httpBackend;
            definition = EndpointDefinition.create('/test', 'POST', 'none');

        }));

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should record analytics form submission for a request', function() {
            httpBackend.when('POST', '/test').respond(200, '', successHeaders);
            spyOn(dtmAnalyticsService, ['recordFormSubmission']).and.callThrough();

            definition.makeFormSubmissionRequest();
            httpBackend.flush();

            expect(dtmAnalyticsService.recordFormSubmission).toHaveBeenCalled();
        });

        it('should make a request when form is submitted', function() {
            httpBackend.when('POST', '/test').respond(200, '', successHeaders);
            spyOn(definition, ['makeRequest']).and.callThrough();

            definition.makeFormSubmissionRequest();
            httpBackend.flush();

            expect(definition.makeRequest).toHaveBeenCalled();
        });

        it('should make a request when form is submitted with options', function() {
            httpBackend.when('POST', '/test').respond(200, '', successHeaders);
            spyOn(definition, ['makeRequest']).and.callThrough();

            var payload = {
                pay: "load"
                };

            var options = {};

            definition.makeFormSubmissionRequest(payload, options);
            httpBackend.flush();

            expect(definition.makeRequest).toHaveBeenCalledWith(payload, options);
        });

        it('should complete the analytics form submission if the promise is successfully resolved', function() {
            httpBackend.when('POST', '/test').respond(200, '', successHeaders);
            spyOn(dtmAnalyticsService, ['recordFormSubmissionCompletion']).and.callThrough();
            spyOn(dtmAnalyticsService, ['cancelFormSubmissionRecord']).and.callThrough();

            definition.makeFormSubmissionRequest();
            httpBackend.flush();

            expect(dtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
            expect(dtmAnalyticsService.cancelFormSubmissionRecord).not.toHaveBeenCalled();
        });

        it('should cancel analytics form submission if there is an error code in the header of the response', function() {
            spyOn(dtmAnalyticsService, ['cancelFormSubmissionRecord']).and.callThrough();
            spyOn(dtmAnalyticsService, ['recordFormSubmissionCompletion']).and.callThrough();
            httpBackend.when('POST', '/test').respond(200, '', failureHeaders);

            definition.makeFormSubmissionRequest();
            httpBackend.flush();

            expect(dtmAnalyticsService.cancelFormSubmissionRecord).toHaveBeenCalled();
            expect(dtmAnalyticsService.recordFormSubmissionCompletion).not.toHaveBeenCalled();
        });

        it('should cancel analytics form submission for rejection', function() {
            spyOn(dtmAnalyticsService, ['cancelFormSubmissionRecord']).and.callThrough();
            spyOn(dtmAnalyticsService, ['recordFormSubmissionCompletion']).and.callThrough();
            httpBackend.when('POST', '/test').respond(404, 'error response');

            definition.makeFormSubmissionRequest();
            httpBackend.flush();

            expect(dtmAnalyticsService.cancelFormSubmissionRecord).toHaveBeenCalled();
            expect(dtmAnalyticsService.recordFormSubmissionCompletion).not.toHaveBeenCalled();
        });
    });
});