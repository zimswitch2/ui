describe('HomeService', function () {
    'use strict';
    /*global overviewFeature:true */

    var location, homeService, user;

    beforeEach(module('refresh.common.homeService'));

    beforeEach(inject(function ($location, HomeService, User) {
        location = $location;
        homeService = HomeService;
        user = User;
    }));

    it('should go to /overview when overview feature is enabled', function () {
        overviewFeature = true;
        homeService.goHome();
        expect(location.path()).toEqual('/overview');
    });

    describe('overview feature not enabled', function () {
        beforeEach(function () {
            overviewFeature = false;
            spyOn(user, ['hasDashboards']);
        });

        it('should go to /account-summary when existing customer with current dashboard', function () {
            user.hasDashboards.and.returnValue(true);

            homeService.goHome();
            expect(location.path()).toEqual('/account-summary');
        });

        it('should go to /new-registered when new to bank customer', function () {
            user.hasDashboards.and.returnValue(false);

            homeService.goHome();
            expect(location.path()).toEqual('/new-registered');
        });
    });
});