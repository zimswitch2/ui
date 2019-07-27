describe('Account Sharing Confirm Operator Permissions Route', function () {
   'use strict';

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    var route,
        confirmUserPermissionsRoute,
        location,
        rootScope,
        httpBackend;

    beforeEach(inject(function ($route, $location, $rootScope, $httpBackend) {
        route = $route;
        location = $location;
        rootScope = $rootScope;
        httpBackend = $httpBackend;

        confirmUserPermissionsRoute = route.routes['/account-sharing/users/:id/permissions/confirm'];
    }));

    describe('when editing user details', function () {
        it ('should user the correct template', function () {
            var expectedPartial = '/features/accountSharing/manageOperator/editOperator/confirmPermissions/partials/confirmOperatorPermissions.html';

            expect(confirmUserPermissionsRoute.templateUrl).toEqual(expectedPartial);
        });

        it ('should use the correct controller', function () {
            var expectedController = 'ConfirmOperatorPermissionsController';

            expect(confirmUserPermissionsRoute.controller).toEqual(expectedController);
        });

        it ('should expose controller as vm', function () {
            var expectedControllerAs = 'vm';

            expect(confirmUserPermissionsRoute.controllerAs).toEqual(expectedControllerAs);
        });
    });

    describe('route parameters', function () {
        function changePath(path) {
            location.path(path);
            rootScope.$digest();
        }

        beforeEach(function () {
            httpBackend.expectGET('/features/accountSharing/manageOperator/editOperator/confirmPermissions/partials/confirmOperatorPermissions.html').respond(200);
        });

        it('should map an id param of 1 to route params', function () {
            changePath('/account-sharing/users/1/permissions/confirm');

            expect(route.current.params.id).toEqual('1');
        });

        it('should map an id param of 22 to route params', function () {
            changePath('/account-sharing/users/22/permissions/confirm');

            expect(route.current.params.id).toEqual('22');
        });
    });
});