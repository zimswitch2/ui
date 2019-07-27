describe('Account Sharing Edit Operator Permissions Route', function () {
   'use strict';

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    var route,
        editUserPermissionsRoute,
        location,
        rootScope,
        httpBackend;

    beforeEach(inject(function ($route, $location, $rootScope, $httpBackend) {
        route = $route;
        location = $location;
        rootScope = $rootScope;
        httpBackend = $httpBackend;

        editUserPermissionsRoute = route.routes['/account-sharing/users/:id/permissions'];
    }));

    describe('when editing user permissions', function () {
        it ('should user the correct template', function () {
            var expectedPartial = '/features/accountSharing/manageOperator/editOperator/permissions/partials/editOperatorPermissions.html';

            expect(editUserPermissionsRoute.templateUrl).toEqual(expectedPartial);
        });

        it ('should use the correct controller', function () {
            var expectedController = 'EditOperatorPermissionsController';

            expect(editUserPermissionsRoute.controller).toEqual(expectedController);
        });

        it ('should expose controller as vm', function () {
            var expectedControllerAs = 'vm';

            expect(editUserPermissionsRoute.controllerAs).toEqual(expectedControllerAs);
        });
    });

    describe('route parameters', function () {
        function changePath(path) {
            location.path(path);
            rootScope.$digest();
        }

        beforeEach(function () {
            httpBackend.expectGET('/features/accountSharing/manageOperator/editOperator/permissions/partials/editOperatorPermissions.html').respond(200);
        });

        it('should map an id param of 1 to route params', function () {
            changePath('/account-sharing/users/1/permissions');

            expect(route.current.params.id).toEqual('1');
        });

        it('should map an id param of 22 to route params', function () {
            changePath('/account-sharing/users/22/permissions');

            expect(route.current.params.id).toEqual('22');
        });
    });
});