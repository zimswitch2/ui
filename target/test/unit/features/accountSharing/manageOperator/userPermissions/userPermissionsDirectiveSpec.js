describe('Account Sharing View Permissions Directive', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.userPermissions'));

    var directive;

    beforeEach(inject(function(accountSharingUserPermissionsDirective) {
        directive = _.first(accountSharingUserPermissionsDirective);
    }));

    describe('properties', function() {
        it('should be restricted to elements', function() {
            expect(directive.restrict).toBe('E');
        });

        it('should have the view operator template url', function() {
            expect(directive.templateUrl).toBe('features/accountSharing/manageOperator/userPermissions/userPermissions.html');
        });

        it('should have a permissions bound var in scope', function() {
            expect(directive.scope.permissions).toBe('=');
        });

        it('should have an edit permissions bound function in scope', function() {
            expect(directive.scope.editPermissions).toBe('&');
        });
    });

    describe('link function', function (){
        it('should reduce the hideFields to a map of booleans', function() {
            var scope = {
                hideFields: [ 'edit' ]
            };

            directive.link(scope);

            expect(scope.hide).toEqual({ edit: true });
        });
    });
});
