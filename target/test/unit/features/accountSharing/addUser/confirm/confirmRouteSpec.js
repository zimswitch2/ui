describe('Account Sharing Confirm User Details', function () {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    describe('routes', function () {
        var route, accountSharingConfirmUserDetailsRoute;
        beforeEach(inject(function ($route) {
            route = $route;

            accountSharingConfirmUserDetailsRoute = route.routes['/account-sharing/user/confirm'];
        }));

        describe('when confirming new user user details', function () {
            it('should use the correct template', function () {
                var expectedPartial = 'features/accountSharing/manageOperator/addOperator/confirm/partials/confirmUserDetails.html';

                expect(accountSharingConfirmUserDetailsRoute.templateUrl).toEqual(expectedPartial);
            });

            it('should use the correct controller', function () {
                var expectedController = 'ConfirmUserDetailsController';
                expect(accountSharingConfirmUserDetailsRoute.controller).toEqual(expectedController);
            });

            it('should expose the controller as vm', function () {
                var expectedControllerName = 'vm';
                expect(accountSharingConfirmUserDetailsRoute.controllerAs).toEqual(expectedControllerName);

            });
        });
    });
});
