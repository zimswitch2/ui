describe("Pending Payments Widget Directive", function () {
    'use strict';

    var directive;

    beforeEach(module('refresh.accountSharing.beneficiaryPayments'));

    beforeEach(inject(function (pendingPaymentsWidgetDirective) {
        directive = _.first(pendingPaymentsWidgetDirective);
    }));

    describe('properties', function () {
        it('should be restricted to elements', function () {
            expect(directive.restrict).toBe('E');
        });

        it('should have templateUrl set to accountSharing', function () {
            expect(directive.templateUrl).toBe('features/accountSharing/beneficiaryPayments/pendingPaymentsWidget/partials/pendingPaymentsWidget.html');
        });

        it('should have controller set to PendingPaymentsWidgetController', function () {
            expect(directive.controller).toBe('PendingPaymentsWidgetController');
        });

        it('should bind to controller', function () {
            expect(directive.bindToController).toBeTruthy();
        });

        it('should bind scope to true', function () {
            expect(directive.scope).toBeTruthy();
        });
    });
});