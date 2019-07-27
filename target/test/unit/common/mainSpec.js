describe('Main', function () {
    'use strict';

    var route, rootScope, mobileService;
    beforeEach(module('refresh'));

    beforeEach(inject(function ($route, $rootScope, MobileService) {
        route = $route;
        rootScope = $rootScope;
        mobileService = MobileService;
    }));

    describe('Routes', function () {

        describe('when a route is not found', function () {
            it('should redirect to home', function () {
                expect(route.routes[null].redirectTo).toEqual('/home');
            });
        });

        describe('home route', function () {
            /*global overviewFeature:true */
            describe('when overview feature enabled', function () {
                it('should redirect to overview page', function () {
                    overviewFeature = true;
                    expect(route.routes['/home'].redirectTo()).toEqual('/overview');
                });
            });

            describe('when overview feature disnabled', function () {

                it('should redirect to account summary page', function () {
                    overviewFeature = false;
                    expect(route.routes['/home'].redirectTo()).toEqual('/account-summary');
                });
            });
        });
    });

    describe('when running the module', function () {
        var runBlock;

        beforeEach(function () {
            runBlock = angular.module('refresh')._runBlocks[0];
        });

        it('should set the is mobile device indicator when on mobile', function () {
            var isMobileDevice = spyOn(mobileService, 'isMobileDevice');
            isMobileDevice.and.returnValue(true);
            runBlock(rootScope, mobileService);
            expect(rootScope.isMobileDevice).toBeTruthy();
        });

        it('should set the is mobile device indicator when not on mobile', function () {
            var isMobileDevice = spyOn(mobileService, 'isMobileDevice');
            isMobileDevice.and.returnValue(false);
            runBlock(rootScope, mobileService);
            expect(rootScope.isMobileDevice).toBeFalsy();
        });
    });
});