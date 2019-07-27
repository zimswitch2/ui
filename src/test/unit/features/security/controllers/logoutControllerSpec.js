describe('SignoutController', function () {
    'use strict';

    beforeEach(module('refresh.logout'));

    var digitalId, scope, authenticationService;

    beforeEach(inject(function ($rootScope, $controller) {
        authenticationService = jasmine.createSpyObj('authenticationService', ['logout']);
        digitalId = jasmine.createSpyObj('DigitalId', ['current', 'isAuthenticated']);
        scope = $rootScope.$new();
        $controller('LogoutController', {
            $scope: scope,
            AuthenticationService: authenticationService,
            DigitalId: digitalId
        });
    }));

    describe('and when logout is called', function () {
        it('refreshes the page', function () {
            scope.logout();
            expect(authenticationService.logout).toHaveBeenCalled();
        });
    });

    describe('when shouldDisplayLogoutOption is called', function () {
        it('should check if you are authenticated to determine whether to show the logout option', function () {
            digitalId.isAuthenticated.and.returnValue(true);
            var shouldDisplay = scope.shouldDisplayLogoutOption();
            expect(shouldDisplay).toBeTruthy();
        });
    });
});
