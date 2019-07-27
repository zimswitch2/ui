describe("ng-pattern", function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var form, element, inputElement;

    beforeEach(inject(function (_TemplateTest_) {
        _TemplateTest_.allowTemplate('common/sbform/partials/sbTextInput.html');

        form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-pattern='/^abc/' pattern-message='Wrong pattern'></form>";
        element = _TemplateTest_.compileTemplate(form);
        inputElement = element.find('sb-input').find('input');
    }));

    it("should render pattern error when ng-pattern is provided ", function () {
        expect(inputElement.attr('ng-pattern')).toEqual('/^abc/');
        element.find('sb-input').find('input').val('123456789');
        element.find('sb-input').find('input').trigger('input');
        var requiredError = element.find('sb-input').find('.form-error').not('.ng-hide');
        expect(requiredError.text()).toEqual('Wrong pattern');
    });
});
