describe('otp template', function () {
    'use strict';

    beforeEach(module('refresh.otp', 'refresh.sbInput', 'refresh.textValidation'));

    var scope, element, templateTestHelper;
    var submit;
    var otp;

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');
        templateTestHelper.allowTemplate('common/flow/partials/flow.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/otp/partials/verify.html'));
        element = templateTestHelper.compileTemplate(html);

        submit = element.find('#submit-otp');
        otp = element.find('#otp');
    }));

    describe('the submit button', function () {
        it('should be disabled on initial load', function () {
            expect(submit.attr('disabled')).toBe('disabled');
        });

        it('should be disabled when otp text field has invalid value', function () {
            templateTestHelper.changeInputValueTo(otp, 'aaaaaaaaaaaaaaaaaaaaaaaaa');
            scope.$digest();
            expect(submit.attr('disabled')).toBe('disabled');
        });

        it('should be enabled when otp text field has valid value', function () {
            var otp = element.find('#otp');
            templateTestHelper.changeInputValueTo(otp, '12345');
            scope.$digest();
            expect(submit.attr('disabled')).toBeUndefined();
        });
    });
});
