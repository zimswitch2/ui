describe('Account Sharing Add User Cancel Service', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    var cancelDialogService, rootScope;

    beforeEach(inject(function(CancelDialogService, $rootScope) {
        cancelDialogService = CancelDialogService;
        rootScope = $rootScope;
    }));

    function processPromises() {
        rootScope.$digest();
    }

    it('should start with show false', function() {
        expect(cancelDialogService.shouldShow()).toBeFalsy();
    });

    it('should be hidden when hide is called', function() {
        cancelDialogService.createDialog();
        cancelDialogService.hide();
        expect(cancelDialogService.shouldShow()).toBeFalsy();
    });

    it('should show when created', function() {
        cancelDialogService.createDialog();
        expect(cancelDialogService.shouldShow()).toBeTruthy();
    });

    it('should hide when confirming', function() {
        cancelDialogService.createDialog();
        cancelDialogService.confirm();
        expect(cancelDialogService.shouldShow()).toBeFalsy();
    });

    it('should hide when confirming', function() {
        cancelDialogService.createDialog();
        cancelDialogService.confirm();
        expect(cancelDialogService.shouldShow()).toBeFalsy();
    });

    it('should resolve the promise when confirming', function() {
        var test = jasmine.createSpy('success');
        var promise = cancelDialogService.createDialog();

        promise.then(test);
        cancelDialogService.confirm();
        processPromises();

        expect(test).toHaveBeenCalled();
    });

    it('should resolve the promise when cancelling', function() {
        var test = jasmine.createSpy('success');
        var promise = cancelDialogService.createDialog();

        promise.then(function() {}, test);
        cancelDialogService.cancel();
        processPromises();

        expect(test).toHaveBeenCalled();
    });
});
