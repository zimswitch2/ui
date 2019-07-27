describe("confirm-input-name", function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var form, element, inputElement, passwordScope, confirmPasswordScope;

    beforeEach(inject(function (_TemplateTest_) {
        _TemplateTest_.allowTemplate('common/sbform/partials/sbTextInput.html');

        form = "<form name='theForm'>" +
        "<section><sb-input name='password' ng-model='password'></sb-input></section>" +
        "<section><sb-input name='confirmPassword' ng-model='confirmPassword' confirm-input-name='password' confirmation-message='does not match password field'></section>" + "" +
        "</form>";
        element = _TemplateTest_.compileTemplate(form);
        inputElement = element.find('sb-input[name="confirmPassword"]').find('input');
        passwordScope = element.find('sb-input[name="password"]').isolateScope();
        confirmPasswordScope = element.find('sb-input[name="confirmPassword"]').isolateScope();
    }));

    it("should display confirmation error when confirm attribute doesn't match input value", function () {
        element.find('input[name="confirmPassword"]').controller('ngModel').$setViewValue('value');

        confirmPasswordScope.$digest();
        var requiredError = element.find('.input-confirm-error').not('.ng-hide');
        expect(requiredError.text()).toEqual('does not match password field');
        expect(inputElement.hasClass('ng-invalid')).toBeTruthy();
    });

    it("should not render an error when the input value is the same as the confirm input attribute", function () {
        element.find('input[name="password"]').val('password');
        element.find('input[name="confirmPassword"]').controller('ngModel').$viewValue = 'password';
        passwordScope.$apply();
        var requiredError = element.find('.input-confirm-error').not('.ng-hide');
        expect(requiredError.text()).toEqual('');
        expect(inputElement.hasClass('ng-invalid')).toBeFalsy();
    });
});
