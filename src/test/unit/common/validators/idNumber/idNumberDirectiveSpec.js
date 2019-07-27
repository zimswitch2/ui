describe('IdNumber Directive', function() {
    'use strict';
    var form;

    beforeEach(module('refresh.validators.idNumber'));

    beforeEach(inject(function($rootScope, $compile) {
        var scope = $rootScope.$new();
        var element = angular.element('<form name="form"><input name="idNumber" type="text" ng-model="idNumber" id-number></input></form>');
        $compile(element)(scope);
        scope.$digest();
        form = scope.form;
    }));

    describe('validation', function() {
        it('sets valid to true if the value is undefined', function() {
            form.idNumber.$setViewValue(undefined);
            expect(form.idNumber.$valid).toBeTruthy();
        });

        it('sets valid to true if the value is null', function() {
            form.idNumber.$setViewValue(null);
            expect(form.idNumber.$valid).toBeTruthy();
        });

        it('sets valid to true for a valid id number', function() {
            form.idNumber.$setViewValue('8006212361181');
            expect(form.idNumber.$valid).toBeTruthy();
        });

        it('sets valid to false for an invalid id number', function() {
            form.idNumber.$setViewValue('8006212361189');
            expect(form.idNumber.$valid).toBeFalsy();
        });

        it('sets birthDate to true for an idnumber with an invalid birth date', function() {
            form.idNumber.$setViewValue('9090900000000');
            expect(form.idNumber.$error['idNumber']).toBeTruthy();
        });

        it('sets eleventhDigit to true for an idnumber with an invalid eleventh digit', function() {
            form.idNumber.$setViewValue('0001010000300');
            expect(form.idNumber.$error['idNumber']).toBeTruthy();
        });

        it('sets checkDigit to true for an idnumber with an invalid check digit', function() {
            form.idNumber.$setViewValue('8006212361189');
            expect(form.idNumber.$error['idNumber']).toBeTruthy();
        });

        it('sets checkDigit to false for an idnumber with a valid check digit', function() {
            form.idNumber.$setViewValue('8006212361181');
            expect(form.idNumber.$error['idNumber']).toBeFalsy();
        });
    });
});
