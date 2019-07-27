describe('Account Sharing Add User Route Listener', function() {
    'use strict';

    var rootScope, route, location, addUserServiceOriginSpy, addUserService;
    var flowPrefix = '/account-sharing/user/';

    beforeEach(module('refresh.accountSharing.addUser', function($routeProvider) {
        $routeProvider
            .when('/', {})
            .when('/somewhere-not-really-significant', {})
            .when('/account-sharing/user/in-the-flow', {})
            .when('/otp/verify', {})
            .when('/account-sharing/user/some-more-flow', {});
    }));

    beforeEach(inject(function($rootScope, $route, $location, AddUserService) {
        rootScope = $rootScope;
        route = $route;
        location = $location;
        addUserService = AddUserService;
        addUserServiceOriginSpy = spyOn(AddUserService, 'setFlowOrigin').and.callThrough();
    }));

    it('should save the url if the current url is outside the flow and the next url is in the flow', function() {
        var currentUrl = '/somewhere-not-really-significant';
        location.path(currentUrl);
        rootScope.$digest();

        location.path('/account-sharing/user/in-the-flow');
        rootScope.$digest();

        expect(addUserServiceOriginSpy).toHaveBeenCalledWith(currentUrl);
    });

    it('should keep the url if the first url is outside the flow and we navigate through the flow', function() {
        var currentUrl = '/somewhere-not-really-significant';
        location.path(currentUrl);
        rootScope.$digest();
        location.path('/account-sharing/user/in-the-flow');
        rootScope.$digest();
        location.path('/account-sharing/user/some-more-flow');
        rootScope.$digest();
        expect(addUserServiceOriginSpy).toHaveBeenCalledWith(currentUrl);
        expect(addUserService.originUrl()).toEqual(currentUrl);
    });

    it('should keep the url if the first url is outside the flow and we navigate through the flow and hit an OTP step', function() {
        var currentUrl = '/somewhere-not-really-significant';
        location.path(currentUrl);
        rootScope.$digest();
        location.path('/account-sharing/user/in-the-flow');
        rootScope.$digest();
        location.path('/otp/verify');
        rootScope.$digest();
        location.path('/account-sharing/user/in-the-flow');
        rootScope.$digest();
        expect(addUserServiceOriginSpy).toHaveBeenCalledWith(currentUrl);
        expect(addUserService.originUrl()).toEqual(currentUrl);
    });

    it('when changing routes the previous route should be tracked on the $route object', function () {
        var currentUrl = '/somewhere-not-really-significant';
        location.path(currentUrl);
        rootScope.$digest();
        location.path('/account-sharing/user/in-the-flow');
        rootScope.$digest();
        expect(route.previous.originalPath).toEqual('/somewhere-not-really-significant');
    });
});
