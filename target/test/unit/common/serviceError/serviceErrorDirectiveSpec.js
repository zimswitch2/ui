describe('serviceError directive', function () {
    'use strict';

    var scope, test, rootScope;

    beforeEach(module('refresh.serviceError'));

    beforeEach(inject(function (_TemplateTest_, $rootScope) {
        scope = _TemplateTest_.scope;
        test = _TemplateTest_;
        rootScope = $rootScope;
    }));

    it('should not render', function () {
        var element = test.compileTemplate('<service-error>error</service-error>');
        scope.$apply();
        expect(element.hasClass('ng-hide')).toBeTruthy();
    });

    it('should render', function () {
        var element = test.compileTemplate('<service-error>error</service-error>');
        scope.$broadcast('unsuccessfulMcaResponse');
        scope.$apply();
        expect(element.hasClass('ng-hide')).toBeFalsy();
    });
});
