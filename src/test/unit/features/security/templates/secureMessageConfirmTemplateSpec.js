describe('secure message confirm template', function () {
    'use strict';

    var scope, document, templateTestHelper;

    beforeEach(module('refresh.secure.message.confirm'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.allowTemplate('common/flow/partials/flow.html');
        templateTestHelper.stubTemplate('features/security/partials/secureMessageSummary.html', '');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/security/partials/secureMessageConfirm.html'));
        document = templateTestHelper.compileTemplate(html);
    }));

    describe('cancel button', function () {
        it('should have a track click', function () {
            expect(document.find('#cancel').attr('track-click')).toBe('send secure message.cancel');
        });
    });

    describe('confirm button', function () {
        it('should have a track click', function () {
            expect(document.find('#confirm').attr('track-click')).toBe('send secure message.confirm');
        });
    });
});
