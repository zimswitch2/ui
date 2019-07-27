describe('prevent repetitive numbers directive', function() {
    'use strict';

    beforeEach(module('refresh.input.validation.preventRepetitiveNumbers'));

    var scope, form;

    var error = function(){
        return form.myInput.$error["preventRepetitiveNumbers"];
    };

    describe('valid details used to setup', function() {
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;
            var element = angular.element('<form name="myForm"><input ng-model="testing.item" name="myInput" prevent-repetitive-numbers="3"/></form>');
            scope.testing = {
                item: 9318
            };

            $compile(element)(scope);
            form = scope.myForm;
        }));

        it('should set the validity of the model to false if there are repetitive numbers at the beginning when changing the input', function() {
            form.myInput.$setViewValue(1119);

            scope.$digest();

            expect(error()).toBeTruthy();
        });

        it('should set the validity of the model to false if there are repetitive numbers at the beginning when changing the scope', function() {
            scope.testing.item = 1119;

            scope.$digest();

            expect(error()).toBeTruthy();
        });

        it('should set the validity of the model to false if there are repetitive numbers at the end when changing the input', function() {
            form.myInput.$setViewValue(9111);

            scope.$digest();

            expect(error()).toBeTruthy();
        });

        it('should set the validity of the model to false if there are repetitive numbers at the end when changing the scope', function() {
            scope.testing.item = 9111;

            scope.$digest();

            expect(error()).toBeTruthy();
        });



        it('should set the validity of the model to true if there arent repetitive numbers when changing the input', function() {
            form.myInput.$setViewValue(2583);

            scope.$digest();

            expect(error()).toBeFalsy();
        });

        it('should set the validity of the model to true if there arent repetitive numbers when changing the scope', function() {
            scope.testing.item = 2583;

            scope.$digest();

            expect(error()).toBeFalsy();
        });

        it('should set the validity of the model to true if the value is null the scope', function() {
            scope.testing.item = null;

            scope.$digest();

            expect(error()).toBeFalsy();
        });

        it('should set the validity of the model to true if the value is null on the form', function() {
            form.myInput.$setViewValue(null);

            scope.$digest();

            expect(error()).toBeFalsy();
        });
    });

    it('should be valid if the parameter has an empty string', inject(function($rootScope, $compile) {
        scope = $rootScope;
        var element = angular.element('<form name="myForm"><input ng-model="testing.item" name="myInput" prevent-repetitive-numbers=""/></form>');
        scope.testing = {
            item: 9318
        };

        $compile(element)(scope);
        form = scope.myForm;

        form.myInput.$setViewValue(1234);

        expect(error()).toBeFalsy();
    }));
});