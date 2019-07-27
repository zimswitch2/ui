describe('Account Sharing Widget directive', function() {
    'use strict';

    var directive;

    beforeEach(module('refresh.accountSharing'));

    beforeEach(inject(function(accountSharingWidgetDirective) {
        directive = _.first(accountSharingWidgetDirective);
    }));

    describe('properties', function() {
        it('should be restricted to elements', function() {
            expect(directive.restrict).toBe('E');
        });

        it('should have templateUrl set to accountSharing', function() {
            expect(directive.templateUrl).toBe('features/accountSharing/accountSharingWidget/partials/accountSharing.html');
        });

        it('should have controller set to AccountSharingWidgetController', function() {
            expect(directive.controller).toBe('AccountSharingWidgetController');
        });

        it('should define the controller as vm', function() {
            expect(directive.controllerAs).toBe('vm');
        });

        it('should bind to controller', function() {
            expect(directive.bindToController).toBeTruthy();
        });

        it('should bind scope to true', function() {
            expect(directive.scope).toBeTruthy();
        });
    });
});
