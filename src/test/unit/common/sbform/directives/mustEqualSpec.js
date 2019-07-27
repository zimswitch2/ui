describe('must equal', function() {
    var test, form;
    beforeEach(module('refresh.mustEqual'));

    beforeEach(inject(function(_TemplateTest_) {
        test = _TemplateTest_;
        test.scope.model = {
            property1: '',
            property2: ''
        };
        test.compileTemplate('<form name="theForm"><input name="input1" ng-model="model.property1" /><input name="input2" ng-model="model.property2" must-equal="input1" /></form>');
        form = test.scope.theForm;
    }));

    describe('when values are not equal', function() {
       it('should make the field invalid', function() {
           form.input1.$setViewValue('some value');
           form.input2.$setViewValue('some other value');
           test.scope.$digest();
           expect(form.input2.$valid).toEqual(false);
       });
    });

    describe('when values are equal', function() {
        it('should make the field valid', function() {
            form.input1.$setViewValue('some value');
            form.input2.$setViewValue('some other value');
            test.scope.$digest();
            expect(form.input2.$valid).toEqual(false);
            form.input1.$setViewValue('some value');
            form.input2.$setViewValue('some value');
            test.scope.$digest();
            expect(form.input2.$valid).toEqual(true);
        });
    });
});