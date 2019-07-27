describe('beneficiaries table template', function () {
    'use strict';

    var scope, element, templateTestHelper;

    beforeEach(module('refresh.beneficiaries'));

    beforeEach(inject(function (_TemplateTest_, Fixture,PermissionsService) {
        spyOn(PermissionsService, ['checkPermission']).and.returnValue(true);
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/beneficiaries/partials/beneficiariesTable.html'));
        element = templateTestHelper.compileTemplate(html);
    }));

    describe('sorting', function () {

        beforeEach(function () {
            scope.sortBy = jasmine.createSpy();
        });

        it('should call sortBy with name when name table header is clicked', function () {
            element.find('#name-heading').click();
            expect(scope.sortBy).toHaveBeenCalledWith('name');
        });

        it('should call sortBy with name when name table header is clicked', function () {
            element.find('#customer-reference-heading').click();
            expect(scope.sortBy).toHaveBeenCalledWith('customerReference');
        });

        it('should call sortBy with recipientGroupName when name table header is clicked', function () {
            scope.hasGroup = true;
            element.find('#recipient-group-name-heading').click();
            expect(scope.sortBy).toHaveBeenCalledWith('recipientGroupName');
        });

        it('should call sortBy with lastPaymentDate when name table header is clicked', function () {
            scope.hasPayment = true;
            element.find('#last-payment-date-heading').click();
            expect(scope.sortBy).toHaveBeenCalledWith('lastPaymentDate');
        });
    });
});
