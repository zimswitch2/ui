describe('Account Sharing Add User Cancel Controller', function() {
    'use strict';

    var controller, cancelDialogService;

    beforeEach(module('refresh.accountSharing.addUser'));

    beforeEach(inject(function($controller) {
        cancelDialogService = jasmine.createSpyObj('CancelDialogService', ['confirm', 'cancel', 'shouldShow']);

        controller = $controller('CancelDialogController', {
            CancelDialogService: cancelDialogService
        });
    }));

    it('should call confirm on the add user cancel service when confirming', function() {
        controller.confirm();
        expect(cancelDialogService.confirm).toHaveBeenCalled();
    });

    it('should call cancel on the add user cancel service when going back', function() {
        controller.back();
        expect(cancelDialogService.cancel).toHaveBeenCalled();
    });

    it('should return show from the add user cancel service', function() {
        cancelDialogService.shouldShow.and.returnValue(true);
        expect(controller.shouldShow()).toBeTruthy();
    });
});
