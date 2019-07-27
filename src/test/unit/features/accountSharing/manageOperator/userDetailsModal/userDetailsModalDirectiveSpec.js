describe('Account Sharing Operator Details Directive', function () {
    'use strict';
    beforeEach(module('refresh.accountSharing.operatorDetails'));

    var directive;

    beforeEach(inject(function(userDetailsModalDirective){
        directive = _.first(userDetailsModalDirective);
    }));

    describe('properties', function(){
        it('should be restricted to elements', function(){
            expect(directive.restrict).toBe('E');
        });

        it('should have the view operator template url', function(){
            expect(directive.templateUrl).toBe('features/accountSharing/manageOperator/userDetailsModal/userDetailsModal.html');
        });

        it('should have a title bound var in scope', function(){
            expect(directive.scope.title).toBe('@');
        });

        it('should have a ShowModal bound var in scope', function(){
            expect(directive.scope.showModal).toBe('=');
        });

        it('should have a confirm bound function in scope',function(){
            expect(directive.scope.onConfirm).toBe('&');
        });

        it('should have a cancel bound function in scope',function(){
            expect(directive.scope.onCancel).toBe('&');
        });
    });
});