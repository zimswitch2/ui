describe('Login Tests', function () {
    'use strict';

    var token = 'aXNzdWVfdGltZT0iMjAxNS0wNC0xN1QwOTo0ODozOSINCmlzc3Vlcj0iQz1aQSwgU1Q9R2F1dGVuZywgTD1Kb2hhbm5lc2J1cmcsIE89U3RhbmRhcmRCYW5rLCBPVT1Tb2x1dGlvbkRlbGl2ZXJ5SW50ZWdyYXRpb24sIENOPURhdGFQb3dlclRva2VuU2VydmVyLCBlbWFpbEFkZHJlc3M9am9oYW5uZXMuam9yZGFhbkBzdGFuZGFyZGJhbmsuY28uemEiDQpub3RfYWZ0ZXI9IjIwMTUtMDQtMTdUMDk6NTM6MzkiDQpub3RfYmVmb3JlPSIyMDE1LTA0LTE3VDA5OjQ3OjM5Ig0KdXNlcmlkPSJuZXdfY29udHJhY3RfdGVzdEBzYi5jby56YSINCnVuaXF1ZUluZGVudGlmaWVyPSI4MTBkMTFhMi1kZDk0LTQzNGMtYjRlMi0wYTgzYmQ3ZjQzNDciDQpzaWduYXR1cmU9IkExTjh1bzNNQTlOSGFJM0dlWkZZVTIxRXB4cEtCeVB6dzUwSm44cTFDNnVnZnoyWEFrTGU3VHQvMzJaNTZoZzNHSkV3U1hBMkltMUdvQllpOXlxRDJXNkFTeUtwVy9DWWpoQjB1ak5yZTFnMTM4TG05dGljWVpGeEVZcXErTXM4Q1pUbUwvcDc1YjJQQmR0WklzRkFBMXNHNnBkVjAzcVppbHl0dWtwWTIzenBJS3NQMnBMcEpvRm0rNUJxa0NIM2FqTjVrTDNFcXBxU3JqbVZmVzJzZGdDdUZqT2JCUVRtMno0WlBiakNCV21tUjZic3drc3UrTzhhNFRzUDdqdUxHNHlrZW0wUGxHY3FLSTBRd0E4Yjh1dGg5VDVSSEI4aWI3d1M5NERZSG45WG4vUElBeFhxQ0d1U3JmMDRGeHgvak5GRmJseUNBWTh0dGxUSThlUFNaZz09Ig==';
    beforeEach(module('refresh.mcaHttp'));

    beforeEach(module(function ($provide) {
        $provide.value('$cookies', {
            'x-sbg-token': token
        });
    }));

    describe('mcaHttp', function () {

        var location, $httpBackend, $http, applicationParametersService, rootScope, digitalId, card;

        beforeEach(inject(function ($injector, ApplicationParameters, $rootScope, DigitalId, Card) {
            rootScope = $injector.get('$rootScope');
            card = Card;
            digitalId = DigitalId;
            applicationParametersService = ApplicationParameters;
            location = $injector.get('$location');
            $httpBackend = $injector.get('$httpBackend');
            $http = $injector.get('$http');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('timestamp', function () {
            describe('MCA calls', function () {
                it("should store the latest request's timestamp after a successful response", function () {
                    $httpBackend.expect('POST', '/sbg-ib/test').
                        respond(200, {}, {date: 'Wed, 1 Jan 1997 09:17:20 GMT'});

                    $http({method: 'POST', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();

                    expect(applicationParametersService.getVariable('latestTimestampFromServer')).toEqual(moment('Wed, 1 Jan 1997 09:17:20 GMT'));
                });

                it("should store the latest request's timestamp after an unsuccessful response", function () {
                    $httpBackend.expect('POST', '/sbg-ib/test').
                        respond(500, {}, {date: 'Wed, 29 Feb 2012 23:02:11 GMT'});

                    $http({method: 'POST', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();

                    expect(applicationParametersService.getVariable('latestTimestampFromServer')).toEqual(moment('Wed, 29 Feb 2012 23:02:11 GMT'));
                });

                it("should not remove timestamp if latest successful request does not have the header", function () {
                    var previousTimestamp = moment();
                    applicationParametersService.pushVariable('latestTimestampFromServer', previousTimestamp);
                    $httpBackend.expect('POST', '/sbg-ib/test').
                        respond(200, {}, {});

                    $http({method: 'POST', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();

                    expect(applicationParametersService.getVariable('latestTimestampFromServer')).toEqual(previousTimestamp);
                });

                it("should not remove timestamp if latest unsuccessful request does not have the header", function () {
                    var previousTimestamp = moment();
                    applicationParametersService.pushVariable('latestTimestampFromServer', previousTimestamp);

                    $httpBackend.expect('POST', '/sbg-ib/test').
                        respond(500, {}, {});

                    $http({method: 'POST', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();

                    expect(applicationParametersService.getVariable('latestTimestampFromServer')).toEqual(previousTimestamp);
                });
            });

            describe('non-MCA calls', function () {
                it("should not touch timestamp upon a successful response", function () {
                    var previousTimestamp = moment();
                    applicationParametersService.pushVariable('latestTimestampFromServer', previousTimestamp);

                    $httpBackend.expect('POST', '/not-mca').
                        respond(200, {}, {date: 'Wed, 1 Jan 1997 09:17:20 GMT'});

                    $http({method: 'POST', url: '/not-mca', data: {}, headers: {}});
                    $httpBackend.flush();

                    expect(applicationParametersService.getVariable('latestTimestampFromServer')).toEqual(previousTimestamp);
                });

                it("should not touch timestamp upon an unsuccessful response", function () {
                    var previousTimestamp = moment();
                    applicationParametersService.pushVariable('latestTimestampFromServer', previousTimestamp);

                    $httpBackend.expect('POST', '/not-mca').
                        respond(500, {}, {date: 'Wed, 1 Jan 1997 09:17:20 GMT'});

                    $http({method: 'POST', url: '/not-mca', data: {}, headers: {}});
                    $httpBackend.flush();

                    expect(applicationParametersService.getVariable('latestTimestampFromServer')).toEqual(previousTimestamp);
                });
            });
        });

        describe('authorisation', function () {

            it('should add the SBG token to the headers', function () {
                $httpBackend.expect('GET', '/test', {}, function (headers) {
                    return headers['x-sbg-token'] === undefined;
                }).
                    respond(function () {
                        return "";
                    });
                digitalId.authenticate(('token'));

                $http({method: 'GET', url: '/test', data: {}, headers: {}});
                $httpBackend.flush();
            });

            describe('on login', function () {
                beforeEach(function () {
                    $httpBackend.when('GET', 'features/security/partials/login.html').respond(200);

                });

                it('should redirect to login page if user is not logged in and tries to visit otp verify page', function () {
                    location.path('/otp/verify');
                    $httpBackend.expect('GET', '/otp/verify', {}, function (headers) {
                        return headers['x-sbg-token'] === undefined;
                    }).
                        respond(function () {
                            return "";
                        });

                    $http({method: 'GET', url: '/otp/verify', data: {}, headers: {}});
                    $httpBackend.flush();
                    expect(location.path()).toEqual('/login');
                });

                it('should not redirect to login page if user registering and tries to visit otp verify page', function () {
                    location.path('/otp/verify');
                    applicationParametersService.pushVariable('isRegistering', true);
                    $httpBackend.when('GET', 'features/otp/partials/verify.html').respond(200);
                    $httpBackend.expect('GET', '/otp/verify', {}, function (headers) {
                        return headers['x-sbg-token'] === undefined;
                    }).
                        respond(function () {
                            return "";
                        });

                    $http({method: 'GET', url: '/otp/verify', data: {}, headers: {}});
                    $httpBackend.flush();
                    expect(location.path()).toEqual('/otp/verify');
                });

                it('should not redirect to login page if user resetting password and tries to visit otp verify page', function () {
                    location.path('/otp/verify');
                    applicationParametersService.pushVariable('isReSettingPassword', true);
                    $httpBackend.when('GET', 'features/otp/partials/verify.html').respond(200);
                    $httpBackend.expect('GET', '/otp/verify', {}, function (headers) {
                        return headers['x-sbg-token'] === undefined;
                    }).
                        respond(function () {
                            return "";
                        });

                    $http({method: 'GET', url: '/otp/verify', data: {}, headers: {}});
                    $httpBackend.flush();
                    expect(location.path()).toEqual('/otp/verify');
                });

                it('should redirect to login page when a 403 is returned from mca', function () {
                    $httpBackend.expect('GET', '/sbg-ib/test', {}).respond(403);
                    $http({method: 'GET', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();
                    expect(location.path()).toEqual('/login');
                });

                it('should remove DigitalId when a 403 is returned from mca', function () {
                    digitalId.authenticate();
                    $httpBackend.expect('GET', '/sbg-ib/test', {}).respond(403);
                    $http({method: 'GET', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();
                    expect(digitalId.isAuthenticated()).toBeFalsy();
                });

                it('should remove Card when a 403 is returned from mca', function () {
                    card.setCurrent('card', 'personalFinanceManagementId');
                    $httpBackend.expect('GET', '/sbg-ib/test', {}).respond(403);
                    $http({method: 'GET', url: '/sbg-ib/test', data: {}, headers: {}});
                    $httpBackend.flush();
                    expect(card.anySelected()).toBeFalsy();
                });
            });

            it('should redirect to actual page if user is logged in and tries to visit page other than register or login', function () {
                digitalId.authenticate(('token'));
                card.setCurrent('the number of the card', 'the the Personal Finance Management Id');

                location.path('/testing');

                $httpBackend.expect('GET', '/testing', {}, function (headers) {
                    return headers['x-sbg-token'] === undefined;
                }).
                    respond(function () {
                        return "";
                    });

                $http({method: 'GET', url: '/testing', data: {}, headers: {}});
                $httpBackend.flush();
                expect(location.path()).toEqual('/testing');
            });

            it('should allow access to any page that does not require authentication if user is not logged in', function () {
                location.path('/register');
                $httpBackend.expect('GET', '/register', {}, function (headers) {
                    return headers['x-sbg-token'] === undefined;
                }).
                    respond(function () {
                        return "";
                    });
                $http({method: 'GET', url: '/register', data: {}, headers: {}});
                $httpBackend.flush();
                expect(location.path()).toEqual('/register');
            });

            it('should reject response when an error other than 403 nor 500 is returned from mca', function () {
                digitalId.authenticate('token');
                var initialLocation = location.path();

                $httpBackend.expect('GET', '/sbg-ib/test', {}).respond(501);
                $http({method: 'GET', url: '/sbg-ib/test', data: {}, headers: {}});
                $httpBackend.flush();

                expect(location.path()).toEqual(initialLocation);
            });

            it('should not broadcast httpResponseError for a 500 that is not a timeout or not found error', function () {
                spyOn(rootScope, '$broadcast').and.callThrough();

                $httpBackend.expect('PUT', '/sbg-ib/rest/RecipientService/Recipients').
                    respond(500, {}, {});

                $http({method: 'PUT', url: '/sbg-ib/rest/RecipientService/Recipients', data: {}, headers: {}});
                $httpBackend.flush();

                expect(rootScope.$broadcast).not.toHaveBeenCalledWith('connectivityUnavailable');
            });
        });

        describe('OTP', function () {
            var data;
            beforeEach(function () {
                digitalId.authenticate(('token'));

                data = {
                    stepUp: {
                        code: "",
                        contactMethod: "SMS",
                        correlationKey: "MAPPOTP000085941",
                        maskedAddress: "******2300",
                        stepUpType: "OTP"
                    }
                };
            });

            it('should go to OTP input page if a step-up is required', function () {
                var headers = {'x-sbg-response-type': "STEPUP", 'x-sbg-response-code': "0000"};
                $httpBackend.when('GET', 'features/otp/partials/verify.html').respond(200);
                $httpBackend.expect('PUT', '/sbg-ib/somethingThatCanBeAdded', {card: "number"})
                    .respond(200, data, headers);
                $http.put('/sbg-ib/somethingThatCanBeAdded', {card: "number"});
                $httpBackend.flush();
                expect(location.path()).toEqual('/otp/verify');

            });

        });

        describe('httpRequestStarted', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.callThrough();
                $httpBackend.expect('GET', '/sbg-ib/somethingThatCanBeAdded')
                    .respond(200, {});
                $http.get('/sbg-ib/somethingThatCanBeAdded');
            });

            it('should broadcast httpRequestStarted', function () {
                $httpBackend.flush();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('httpRequestStarted');
            });

            it('should not broadcast httpRequestStarted if hash is top', function () {
                location.hash('top');
                $httpBackend.flush();

                expect(rootScope.$broadcast).not.toHaveBeenCalledWith('httpRequestStarted');
            });
        });
    });
});
