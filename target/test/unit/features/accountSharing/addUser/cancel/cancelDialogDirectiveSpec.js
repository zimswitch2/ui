describe('Account Sharing Add User Cancel Directive', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.addUser'));

    var directive, hideSpy;

    beforeEach(inject(function(cancelDialogDirective, CancelDialogService) {
        hideSpy = spyOn(CancelDialogService, ['hide']);
        directive = _.first(cancelDialogDirective);
    }));

    describe('properties', function() {
        it('should be restricted to elements', function() {
            expect(directive.restrict).toBe('E');
        });

        it('should have the cancel dialog template url', function() {
            expect(directive.templateUrl).toBe('features/accountSharing/manageOperator/addOperator/cancel/cancelDialogDirective.html');
        });

        it('should have scope set to true', function() {
            expect(directive.scope).toBe(true);
        });

        it('should have CancelDialogController as its controller', function() {
            expect(directive.controller).toBe('CancelDialogController');
        });

        it('should define the controller as cancel', function() {
            expect(directive.controllerAs).toBe('cancel');
        });

        it('should bind to controller', function() {
            expect(directive.bindToController).toBe(true);
        });
    });

    describe('link function', function() {
        it('should hide the dialog by default', function() {
            directive.link();
            expect(hideSpy).toHaveBeenCalled();
        });
    });
});
