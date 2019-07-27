describe('exact lengths', function() {
    var test, form;
    beforeEach(module('refresh.exactLengths'));

    beforeEach(inject(function(_TemplateTest_) {
        test = _TemplateTest_;
        test.scope.model = {
            property: undefined
        };
    }));

    describe('when a single value is specified', function() {
        beforeEach(function() {
            test.compileTemplate('<form name="theForm"><input name="theInput" ng-model="model.property" exact-lengths="5" /></form>');
            form = test.scope.theForm;
        });

        describe('and the length does not match the length specified', function() {
            it('should make the field invalid with fewer characters', function() {
                form.theInput.$setViewValue('1234');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(false);
            });

            it('should make the field invalid with more characters', function() {
                form.theInput.$setViewValue('123456');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(false);
            });
        });

        describe('and the length matches the length specified', function() {
            it('should make the field valid', function() {
                form.theInput.$setViewValue('12345');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(true);
            });
        });
    });

    describe('when multiple values are specified', function() {
        beforeEach(function() {
            test.compileTemplate('<form name="theForm"><input name="theInput" ng-model="model.property" exact-lengths="5,7" /></form>');
            form = test.scope.theForm;
        });

        describe('and the length does not match any of the lengths specified', function() {
            it('should make the field invalid with fewer characters', function() {
                form.theInput.$setViewValue('1234');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(false);
            });

            it('should make the field invalid with number of character not matching any of the lengths specified', function() {
                form.theInput.$setViewValue('123456');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(false);
            });

            it('should make the field invalid with more characters', function() {
                form.theInput.$setViewValue('12345678');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(false);
            });
        });

        describe('and the length matches one of the lengths specified', function() {
            it('should make the field valid', function() {
                form.theInput.$setViewValue('12345');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(true);

                form.theInput.$setViewValue('1234567');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(true);
            });
        });
    });

    describe('when input is blank', function() {
        beforeEach(function() {
            test.compileTemplate('<form name="theForm"><input name="theInput" ng-model="model.property" exact-lengths="5,7" /></form>');
            form = test.scope.theForm;
        });

        describe('and exact lengths have been specified', function() {
            it('should make the field invalid when input is undefined', function() {
                expect(form.theInput.$valid).toEqual(false);
            });

            it('should make the field invalid when input is empty string', function() {
                form.theInput.$setViewValue('');
                test.scope.$digest();
                expect(form.theInput.$valid).toEqual(false);
            });
        });
    });
});