'use strict';

describe('view group details template', function () {

    var scope, element, templateTestHelper;

    beforeEach(module('refresh.spinner'));


    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.allowTemplate('common/spinner/partials/inlineSpinner.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/beneficiaries/partials/viewGroupDetails.html'));
        element = templateTestHelper.compileTemplate(html);
    }));

    it('should call deleteGroup on scope when the delete group button is clicked', function () {
        scope.confirmDeletion = jasmine.createSpy();
        element.find('#delete-group').trigger('click');
        element.find('.danger-confirm').trigger('click');
        expect(scope.confirmDeletion).toHaveBeenCalled();
    });
});
