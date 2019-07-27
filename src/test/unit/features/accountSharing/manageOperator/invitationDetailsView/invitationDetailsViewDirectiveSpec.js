describe('Account Sharing Invitation Details View Directive', function(){
    'use strict';

    beforeEach(module('refresh.accountSharing.invitationDetailsView'));

    var directive;

    beforeEach(inject(function(accountSharingInvitationDetailsViewDirective) {
        directive = _.first(accountSharingInvitationDetailsViewDirective);
    }));

    describe('properties', function(){
        it('should be restricted to elements', function(){
            expect(directive.restrict).toBe('E');
        });

        it('should have the view invitation template url', function(){
            expect(directive.templateUrl).toBe('features/accountSharing/manageOperator/invitationDetailsView/invitationDetailsView.html');
        });

        it('should have an operator detail bound variable in scope', function(){
            expect(directive.scope.operatorDetails).toBe('=');
        });

        it('should have a reference no bound variable in scope', function(){
            expect(directive.scope.referenceNo).toBe('=');
        });

        it('should have an edit operator details bound function in scope', function(){
            expect(directive.scope.editOperator).toBe('&');
        });
    });

    describe('link function', function(){
        it('should reduce the hideFiles to a map of booleans', function(){
            var scope = {
                hideFields: [ 'email' ]
            };

            directive.link(scope);

            expect(scope.hide).toEqual({email: true});
        });
    });
});