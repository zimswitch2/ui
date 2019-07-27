{

    describe('routing', function () {
        'use strict';

        var location, rootScope, DigitalId, route;

        function injectDependencies() {
            return inject(function (_$route_, _$location_, _$rootScope_, _DigitalId_) {
                location = _$location_;
                rootScope = _$rootScope_;
                DigitalId = _DigitalId_;
                route = _$route_;
            });
        }

        describe('for allowedFrom', function () {
            beforeEach(function () {
                module('routing.forAllowedFrom', function ($routeProvider) {
                    $routeProvider
                        .when('/', {unauthenticated: true})
                        .when('/do-nothing', {unauthenticated: true})
                        .when('/authenticated', {unauthenticated: false})
                        .when('/disallow', {allowedFrom: ['/somewhere-specific'], unauthenticated: true})
                        .when('/disallow-path-new-format', {
                            allowedFrom: [{
                                path: '/somewhere-specific',
                                condition: function () {
                                    return true;
                                }
                            }],
                            unauthenticated: true
                        })
                        .when('/disallow-condition-new-format', {
                            allowedFrom: [{
                                path: '/somewhere-specific',
                                condition: function () {
                                    return false;
                                }
                            }],
                            unauthenticated: true
                        })
                        .when('/disallow-and-redirect', {
                            allowedFrom: ['/somewhere-specific'],
                            safeReturn: '/safe',
                            unauthenticated: true
                        })
                        .when('/safe', {unauthenticated: true})
                        .when('/allow', {allowedFrom: ['/'], unauthenticated: true})
                        .when('/allow-new-format', {
                            allowedFrom: [{
                                path: '/', condition: function () {
                                    return true;
                                }
                            }],
                            unauthenticated: true
                        })
                        .when('/valid-original-location/14', {unauthenticated: true})
                        .when('/invalid-original-location/14', {unauthenticated: true})
                        .when('/simple-regex', {
                            allowedFrom: [new RegExp('/valid-original-location/.*')],
                            safeReturn: '/safe',
                            unauthenticated: true
                        })
                        .when('/complex-regex', {
                            allowedFrom: [{
                                path: new RegExp('/valid-original-location/1.*'), condition: function () {
                                    return true;
                                }
                            }],
                            safeReturn: '/safe', unauthenticated: true
                        });
                });

                injectDependencies();

                route.current = {};
                location.path('/').replace();

                rootScope.$digest();

                spyOn(rootScope, '$broadcast').and.callThrough();
            });

            describe('when the next route has no allowedFrom property specified', function () {
                it('should do nothing', function () {
                    location.path('/do-nothing').replace();
                    rootScope.$digest();
                    expect(location.path()).toBe('/do-nothing');
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/do-nothing', 'http://server/#/', null, null);
                });
            });

            describe('route change parameters', function () {
                it('should go to login when current is undefined ', function () {
                    route.current = undefined;
                    location.path('/allow');
                    rootScope.$digest();
                    expect(location.path()).toBe('/login');
                });

                it('should go to route when current is defined ', function () {
                    route.current = {};
                    location.path('/allow');
                    rootScope.$digest();
                    expect(location.path()).toBe('/allow');
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/allow', 'http://server/#/', null, null);
                });

                it('should not handle any route change when next is undefined ', function () {
                    route.current = {};
                    location.path(undefined);
                    expect(location.path()).toBe('/');
                    expect(rootScope.$broadcast).not.toHaveBeenCalled();
                });

                it('should set path to login if next is an authenticated route and user is not authenticated', function () {
                    route.current = {};
                    DigitalId.remove();
                    location.path('/authenticated');
                    rootScope.$digest();
                    expect(location.path()).toBe('/login');
                });
            });

            describe('when the next route is disallowed', function () {
                it('should not change location', function () {
                    location.path('/disallow').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/disallow', 'http://server/#/', null, null);
                    expect(location.path()).toBe('/');
                });

                it('should navigate back to a safe return path, if one is provided', function () {
                    location.path('/disallow-and-redirect').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/disallow-and-redirect', 'http://server/#/', null, null);
                    expect(location.path()).toBe('/safe');
                });
            });

            describe('when the next route is disallowed with new format', function () {
                it('should allow the user to navigate', function () {
                    location.path('/disallow-path-new-format').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/disallow-path-new-format', 'http://server/#/', null, null);
                    expect(location.path()).toBe('/');
                });
            });

            describe('when the next route has a disallowed condition', function () {
                it('should allow the user to navigate', function () {
                    location.path('/disallow-condition-new-format').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/disallow-condition-new-format', 'http://server/#/', null, null);
                    expect(location.path()).toBe('/');
                });
            });

            describe('when the next route is allowed', function () {
                it('should allow the user to navigate', function () {
                    location.path('/allow').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/allow', 'http://server/#/', null, null);
                    expect(location.path()).toBe('/allow');
                });
            });

            describe('when the next route has an allowed condition', function () {
                it('should allow the user to navigate', function () {
                    location.path('/allow-new-format').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/allow-new-format', 'http://server/#/', null, null);
                    expect(location.path()).toBe('/allow-new-format');
                });
            });

            describe('when the from route is a simple regex', function () {
                it('should allow from a path that matches', function () {
                    location.path('/valid-original-location/14').replace();
                    rootScope.$digest();

                    location.path('/simple-regex').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/simple-regex', 'http://server/#/valid-original-location/14', null, null);
                    expect(location.path()).toBe('/simple-regex');
                });

                it('should not allow from a path that does not match', function () {
                    location.path('/invalid-original-location/14').replace();
                    rootScope.$digest();

                    location.path('/simple-regex').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/simple-regex', 'http://server/#/invalid-original-location/14', null, null);
                    expect(location.path()).toBe('/safe');
                });
            });

            describe('when the from route is a complex regex', function () {
                it('should allow from a path that matches', function () {
                    location.path('/valid-original-location/14').replace();
                    rootScope.$digest();

                    location.path('/complex-regex').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/complex-regex', 'http://server/#/valid-original-location/14', null, null);
                    expect(location.path()).toBe('/complex-regex');
                });

                it('should not allow from a path that does not match', function () {
                    location.path('/invalid-original-location/14').replace();
                    rootScope.$digest();

                    location.path('/complex-regex').replace();
                    rootScope.$digest();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('$locationChangeStart', 'http://server/#/complex-regex', 'http://server/#/invalid-original-location/14', null, null);
                    expect(location.path()).toBe('/safe');
                });
            });
        });

        describe('for unauthenticated', function () {
            beforeEach(function () {
                module('routing.forAllowedFrom', function ($routeProvider) {
                    $routeProvider
                        .when('/', {})
                        .when('/login', {unauthenticated: true})
                        .when('/register', {unauthenticated: true})
                        .when('/reset-password', {unauthenticated: true})
                        .when('/reset-password/details', {unauthenticated: true})
                        .when('/account-summary', {})
                        .when('/otp/verify', {})
                        .when('/change-password', {unauthenticated: false})
                    ;
                });

                injectDependencies();
            });

            describe('when not logged in', function () {
                using(['/account-summary', '/change-password'], function (path) {
                    it('should redirect to /login when changing route to path that requires authentication, e.g. ' + path, function () {
                        location.path(path).replace();
                        rootScope.$digest();
                        expect(location.path()).toEqual('/login');
                    });
                });

                it('should allow to access any page that does not require authentication', function () {
                    location.path('/login').replace();
                    rootScope.$digest();

                    location.path('/register').replace();
                    rootScope.$digest();
                    expect(location.path()).toEqual('/register');
                });

                it('should not handle any routing to \'/otp/verify\'', function () {
                    location.path('/otp/verify');
                    rootScope.$digest();
                    expect(location.path()).not.toEqual('/otp/verify');
                });
            });

            describe('when logged in', function () {
                beforeEach(function () {
                    location.path('/login').replace();
                    rootScope.$digest();
                    DigitalId.authenticate('test', 'Test');
                });

                using(['/account-summary', '/change-password', '/otp/verify'], function (path) {
                    it('should allow to change to any page that requires authentication, e.g. ' + path, function () {
                        location.path(path);
                        rootScope.$digest();
                        expect(location.path()).toEqual(path);
                    });
                });

                using(['/login', '/reset-password', '/reset-password/details', '/register'], function (path) {
                    it('should not allow change to unauthenticated page, e.g. ' + path, function () {
                        location.path('/account-summary');
                        rootScope.$digest();

                        location.path(path);
                        rootScope.$digest();
                        expect(location.path()).toEqual('/account-summary');
                    });

                    it('should redirect to login if requiring access for first time ' + path, function () {
                        location.path(path);
                        rootScope.$digest();
                        expect(location.path()).toEqual('/login');
                    });
                });

                it('should not handle any routing to \'/otp/verify\'', function () {
                    location.path('/otp/verify');
                    rootScope.$digest();
                    expect(location.path()).toEqual('/otp/verify');
                });
            });

        });
    });
}
