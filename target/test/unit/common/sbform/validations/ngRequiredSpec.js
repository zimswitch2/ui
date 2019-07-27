describe("ng-required", function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var form, element, inputElement, directiveScope, templateTestHelper;

    beforeEach(inject(function (_TemplateTest_) {
        templateTestHelper = _TemplateTest_;
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');

        form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true'></sb-input></form>";
        element = templateTestHelper.compileTemplate(form);
        inputElement = element.find('sb-input').find('input');
        directiveScope = element.find('sb-input').isolateScope();
    }));

    it("should render a required attribute when ng-required is present", function () {
        expect(inputElement.attr('ng-required')).toEqual('ngRequired');
        expect(directiveScope.ngRequired).toBeTruthy();
    });

    it("should not render a required error message when in pristine condition", function () {
        var requiredError = element.find('sb-input').find('ng-messages').not('.ng-hide').find('ng-message');
        expect(requiredError.length).toEqual(0);
    });
});
