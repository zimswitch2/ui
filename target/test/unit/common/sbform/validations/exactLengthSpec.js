describe("exact-length", function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var form, element, inputElement, directiveScope, templateTestHelper;

    beforeEach(inject(function (_TemplateTest_) {
        templateTestHelper = _TemplateTest_;
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');

        form = "<form name='theForm'><sb-input ng-model='model' name='superInput' exact-length='3,5'></form>";
        element = templateTestHelper.compileTemplate(form);
        inputElement = element.find('sb-input').find('input');
        directiveScope = element.find('sb-input').isolateScope();
    }));

    it("should render an error when length is not 3 or 5 is provided ", function () {
        expect(inputElement.attr('exact-lengths')).toEqual('3,5');
        templateTestHelper.changeInputValueTo(inputElement, '1');
        var requiredError = element.find('sb-input').find('.form-error').not('.ng-hide');
        expect(requiredError.text()).toEqual('Must be 3 or 5 numbers long');
    });

    it("should not render an error when the input's length is 3", function () {
        element.find('sb-input').find('input').val('123');
        inputElement.trigger('input');
        expect(inputElement.hasClass('ng-valid')).toBeTruthy();
    });
});
