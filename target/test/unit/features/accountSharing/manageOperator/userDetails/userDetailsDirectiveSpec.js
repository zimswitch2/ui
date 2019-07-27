describe('Account Sharing View User Details Directive', function() {
    'use strict';
    beforeEach(module('refresh.accountSharing.userDetails'));

    var directive;

    beforeEach(inject(function(accountSharingUserDetailsDirective) {
        directive = _.first(accountSharingUserDetailsDirective);
    }));

    describe('properties', function() {
        it('should be restricted to elements', function() {
            expect(directive.restrict).toBe('E');
        });

        it('should have the view operator template url', function() {
            expect(directive.templateUrl).toBe('features/accountSharing/manageOperator/userDetails/userDetails.html');
        });

        it('should have an operator bound var in scope', function() {
            expect(directive.scope.user).toBe('=');
        });

        it('should have an edit operator bound function in scope', function() {
            expect(directive.scope.editUser).toBe('&');
        });


    });

    describe('link function', function (){
        it('should reduce the hideFields to a map of booleans', function() {
            var scope = {
                hideFields: [ 'email' ]
            };

            directive.link(scope);

            expect(scope.hide).toEqual({ email: true });
        });
    });
});
