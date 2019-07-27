describe('Account Sharing Finish Add User', function () {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    describe('routes', function () {
        var route, accountSharingFinishAddUserRoute;
        beforeEach(inject(function ($route) {
            route = $route;

            accountSharingFinishAddUserRoute = route.routes['/account-sharing/user/finish'];
        }));

        describe('when confirming new user user details', function () {
            it('should use the correct template', function () {
                var expectedPartial = 'features/accountSharing/manageOperator/addOperator/finish/partials/finishAddUser.html';

                expect(accountSharingFinishAddUserRoute.templateUrl).toEqual(expectedPartial);
            });

            it('should use the correct controller', function () {
                var expectedController = 'FinishAddUserController';
                expect(accountSharingFinishAddUserRoute.controller).toEqual(expectedController);
            });

            it('should expose the controller as vm', function () {
                var expectedControllerName = 'vm';
                expect(accountSharingFinishAddUserRoute.controllerAs).toEqual(expectedControllerName);

            });
        });
    });
});
