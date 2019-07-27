describe('number range directives', function () {
    'use strict';

    var scope, TemplateTest;

    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));

    describe('empty min value defaults to zero',function() {
        beforeEach(inject(function (_TemplateTest_) {
            scope = _TemplateTest_.scope;
            var form = '<form name="theForm"><input ng-model="value" name="value" sb-min="" sb-max="20"></form>';
            _TemplateTest_.compileTemplate(form);
        }));

        it('should have an error if value is negative', function () {
            scope.value = -1;
            scope.$apply();
            expect(scope.theForm.value.$valid).toBeFalsy();
            expect(scope.theForm.value.$error.sbMin).toBeTruthy();
        });

        it('should not have an error if value is positive', function () {
            scope.value = 1;
            scope.$apply();
            expect(scope.theForm.value.$valid).toBeTruthy();
            expect(scope.theForm.value.$error.sbMin).toBeFalsy();
        });
    });

    describe('empty max value defaults to Infinity',function() {
        beforeEach(inject(function (_TemplateTest_) {
            scope = _TemplateTest_.scope;
            var form = '<form name="theForm"><input ng-model="value" name="value" sb-min="1" sb-max=""></form>';
            _TemplateTest_.compileTemplate(form);
        }));

        it('should not have an error if value is Infinity', function () {
            scope.value = Infinity;
            scope.$apply();
            expect(scope.theForm.value.$valid).toBeTruthy();
            expect(scope.theForm.value.$error.sbMax).toBeFalsy();
        });
    });

    describe('with min and max both defined',function() {

        beforeEach(inject(function (_TemplateTest_) {
            scope = _TemplateTest_.scope;
            TemplateTest = _TemplateTest_;
            var form = '<form name="theForm"><input ng-model="value" name="value" sb-min="4" sb-max="20"></form>';
            TemplateTest.compileTemplate(form);
        }));

        it('should have a min error if value is below the minimum', function () {
            scope.value = 1;
            scope.$apply();
            expect(scope.theForm.value.$valid).toBeFalsy();
            expect(scope.theForm.value.$error.sbMin).toBeTruthy();
            expect(scope.theForm.value.$error.sbMax).toBeFalsy();
        });

        it('should have no errors if value is between min and max', function () {
            scope.value = 7;
            scope.$apply();
            expect(scope.theForm.value.$valid).toBeTruthy();
            expect(scope.theForm.value.$error.sbMin).toBeFalsy();
            expect(scope.theForm.value.$error.sbMax).toBeFalsy();
        });

        it('should have a max error if value is above the maximum', function () {
            scope.value = 40;
            scope.$apply();
            expect(scope.theForm.value.$valid).toBeFalsy();
            expect(scope.theForm.value.$error.sbMin).toBeFalsy();
            expect(scope.theForm.value.$error.sbMax).toBeTruthy();
        });

    });
});
