describe('sbInteger directive', function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var scope;

    beforeEach(inject(function (_TemplateTest_) {
        scope = _TemplateTest_.scope;
        var form = '<form name="theForm"><input ng-model="myValue" name="value" sb-integer></sb-input></form>';
        _TemplateTest_.compileTemplate(form);
    }));

    it('should not have an error if value is valid', function () {
        scope.myValue = 2;
        scope.$apply();
        expect(scope.theForm.value.$valid).toBeTruthy();
        expect(scope.theForm.value.$error.sbInteger).toBeFalsy();
    });

    it('should have an error if value has letters', function () {
        scope.myValue = 'bob';
        scope.$apply();
        expect(scope.theForm.value.$valid).toBeFalsy();
        expect(scope.theForm.value.$error.sbInteger).toBeTruthy();
    });

    it('should have an error if value has decimals', function () {
        scope.myValue = 1.5;
        scope.$apply();
        expect(scope.theForm.value.$valid).toBeFalsy();
        expect(scope.theForm.value.$error.sbInteger).toBeTruthy();
    });
});
