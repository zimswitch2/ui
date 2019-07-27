describe('secure message results template', function () {
    'use strict';

    var scope, document, templateTestHelper;

    beforeEach(module('refresh.secure.message.results', 'refresh.notifications', 'refresh.filters'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.stubTemplate('features/security/partials/secureMessageSummary.html', '');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/security/partials/secureMessageResults.html'));
        document = templateTestHelper.compileTemplate(html);
    }));

    describe('success message', function () {
        it('should be invisible if boolean is falsy', function () {
            scope.successMessage = 'this is a success message';
            scope.isSuccessful = false;
            scope.$digest();
            expect(document.find('div.success').first().hasClass('ng-hide')).toBeTruthy();
        });

        it('should be visible if boolean is truthy', function () {
            scope.successMessage = 'this is a success message';
            scope.isSuccessful = true;
            scope.$digest();
            expect(document.find('div.success').first().hasClass('ng-hide')).toBeFalsy();
            expect(document.find('div.success').first().text()).toBe('this is a success message');
        });
    });

    describe('info message', function () {
        it('should be invisible if boolean is falsy', function () {
            scope.hasInfo = false;
            scope.$digest();
            expect(document.find('div.info').first().hasClass('ng-hide')).toBeTruthy();
        });

        it('should be visible if boolean is truthy', function () {
            scope.hasInfo = true;
            scope.$digest();
            expect(document.find('div.info').first().hasClass('ng-hide')).toBeFalsy();
            expect(document.find('div.info').first().text()).toBe('A branch consultant will contact you within 24 hours to confirm your request');
        });
    });
});
