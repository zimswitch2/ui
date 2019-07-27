describe('secure message summary template', function () {
    'use strict';

    var scope, document, templateTestHelper;

    beforeEach(module('refresh.filters'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/security/partials/secureMessageSummary.html'));
        document = templateTestHelper.compileTemplate(html);
        scope.secureMessage = {account: {branch: {}}};
    }));

    it('should not show the branch section if there is no branch name', function () {
        expect(document.text()).not.toContain('Branch');
    });

    it('should not show the branch section if there is an empty branch name', function () {
        scope.secureMessage.account.branch.name = ' ';
        scope.$digest();
        expect(document.text()).not.toContain('Branch');
    });

    it('should show the branch section if there is a branch', function () {
        scope.secureMessage.account.branch.name = 'a branch';
        scope.$digest();
        expect(document.text()).toContain('Branch');
    });

    it('should not show the home telephone section if there is no value', function () {
        expect(document.text()).not.toContain('Home telephone');
    });

    it('should show the home telephone section if there is a value', function () {
        scope.secureMessage.homeTelephone = '0212121212';
        scope.$digest();
        expect(document.text()).toContain('Home telephone');
    });

    it('should not show the business telephone section if there is no value', function () {
        expect(document.text()).not.toContain('Business telephone');
    });

    it('should show the business telephone section if there is a value', function () {
        scope.secureMessage.businessTelephone = '0212121212';
        scope.$digest();
        expect(document.text()).toContain('Business telephone');
    });
});
