describe('Account Sharing Confirm User Permissions Controller', function () {
    'use strict';

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    var invokeController,
        controller,
        editOperatorPermissionsService,
        cancelDialogServiceCreateDialogSpy,
        locationPathSpy,
        resolvePromises;

    var operator = {
        id: 2,
        permissions: [{},{}]
    };

    beforeEach(inject(function ($controller, $route, $rootScope, $location, CancelDialogService, mock) {
        editOperatorPermissionsService = jasmine.createSpyObj('editOperatorPermissionsService', ['current', 'updateOperatorPermissions']);
        editOperatorPermissionsService.current.and.returnValue(operator);
        editOperatorPermissionsService.updateOperatorPermissions.and.returnValue(mock.resolve({}));
        cancelDialogServiceCreateDialogSpy = spyOn(CancelDialogService, 'createDialog').and.returnValue(mock.resolve({}));
        locationPathSpy = spyOn($location, 'path');

        invokeController = function () {
            return $controller('ConfirmOperatorPermissionsController', {
                EditOperatorPermissions: editOperatorPermissionsService
            });
        };

        resolvePromises = function () {
            $rootScope.$digest();
        };
    }));

    describe('Confirm User Permissions Controller', function () {
        it('should get the user from the edit permissions service and expose it on the controller', function () {
            controller = invokeController();

            expect(controller.operator).toEqual(operator);
        });

        describe('editPermissions', function () {
            beforeEach(function () {
                controller = invokeController();

                controller.editPermissions();
            });

            it('should navigate back to the edit permissions screen', function () {
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2/permissions');
            });
        });

        describe('confirm', function () {
            beforeEach(function () {
                controller = invokeController();

                controller.confirm();
                resolvePromises();
            });

            it('should call update operator permissions on update operator permissions service', function () {
                expect(editOperatorPermissionsService.updateOperatorPermissions).toHaveBeenCalled();
            });

            it('should navigate to the user details screen', function () {
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2');
            });
        });

        describe('cancel', function() {
            beforeEach(function () {
                editOperatorPermissionsService.current.and.returnValue(operator);
                controller = invokeController();

                controller.cancel();
            });

            it('should call the createDialog service', function () {
                expect(cancelDialogServiceCreateDialogSpy).toHaveBeenCalled();
            });

            describe('on dialog resolved', function () {
                beforeEach(function () {
                    resolvePromises();
                });

                it('should navigate back to the user details page', function() {
                    expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2');
                });
            });
        });
    });
});