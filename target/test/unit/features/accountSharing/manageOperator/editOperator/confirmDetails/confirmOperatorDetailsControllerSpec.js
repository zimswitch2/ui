describe('Account Sharing Confirm User Details Controller', function () {
    'use strict';

    var controller,
        cancelDialogServiceCreateDialogSpy,
        locationPathSpy,
        editOperatorCurrentOperatorSpy,
        editOperatorUpdateOperatorSpy,
        resolvePromises,
        addUserService;

    var currentOperator = {
        id: 2,
        firstName: 'Joanna'
    };

    beforeEach(module('refresh.accountSharing.editUserDetails'));

    beforeEach(inject(function ($controller, $location, $rootScope, CancelDialogService, mock, EditOperator, AddUserService) {
        locationPathSpy = spyOn($location, 'path');

        editOperatorCurrentOperatorSpy = spyOn(EditOperator, 'currentOperator').and.returnValue(currentOperator);
        editOperatorUpdateOperatorSpy = spyOn(EditOperator, 'updateOperator').and.returnValue(mock.resolve({}));
        cancelDialogServiceCreateDialogSpy = spyOn(CancelDialogService, 'createDialog').and.returnValue(mock.resolve());
        addUserService = AddUserService;
        resolvePromises = function () {
            $rootScope.$digest();
        };

        controller = $controller('ConfirmOperatorDetailsController');
    }));

    describe('Confirm User Details Controller', function () {
        it ('should exist', function () {
            expect(controller).not.toBeUndefined();
        });

        describe('confirm', function () {
            beforeEach(function () {
                controller.confirm();
                resolvePromises();
            });

            it('should call update operator', function () {
                expect(editOperatorUpdateOperatorSpy).toHaveBeenCalled();
            });

            it('should navigate to the user details page when done', function () {
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2');
            });
        });

        describe('cancel', function() {
            beforeEach(function () {
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

        describe('edit', function() {
            it('should navigate back to edit user details', function() {
                controller.editUserDetails();
                
                expect(locationPathSpy).toHaveBeenCalledWith('/account-sharing/users/2/details');
            });
        });
    });
});
