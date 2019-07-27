'use strict';

describe('paymentReferenceValidationSpec', function () {
    var compile, element, scope;

    beforeEach(module('refresh.sbForm'));

    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
    }));

    it('should set payment reference validator with error if payment reference content is invalid', function () {
        element = compile('<input name="myReference" ' +
            'ng-model="currentBeneficiary.customerReference" payment-reference-validation/>')(scope);

        scope.currentBeneficiary = {
            customerReference: 'fail ref $'
        };
        scope.$digest();

        expect(element.hasClass("ng-invalid")).toEqual(true);
        expect(element.hasClass("ng-invalid-payment-reference")).toEqual(true);
        expect(element.hasClass("ng-valid")).toEqual(false);
        expect(element.hasClass("ng-valid-payment-reference")).toEqual(false);
    });

    it('should not set payment reference validator with error if payment reference content is valid', function() {
        element = compile('<input name="myReference" ' +
            'ng-model="currentBeneficiary.customerReference" payment-reference-validation/>')(scope);

        scope.currentBeneficiary = {
            customerReference: 'good ref#.a-Z0-9/\\,()&@?\'"'
        };
        scope.$digest();

        expect(element.hasClass("ng-invalid")).toEqual(false);
        expect(element.hasClass("ng-invalid-payment-reference")).toEqual(false);
        expect(element.hasClass("ng-valid")).toEqual(true);
        expect(element.hasClass("ng-valid-payment-reference")).toEqual(true);
    });
});