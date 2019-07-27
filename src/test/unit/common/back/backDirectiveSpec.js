describe('go-back directive', function () {
    'use strict';

    var scope, templateTest, windowSpy;

    beforeEach(module('refresh.common.backDirective'));

    beforeEach(inject(function (TemplateTest, $window) {
        templateTest = TemplateTest;
        scope = templateTest.scope;
        windowSpy = spyOn($window.history, 'go');
    }));

    it('should call window.history.back with default value 1 on click', function () {
        var document = templateTest.compileTemplate('<div><a go-back>Test</a></div>');
        document.find('a').click();
        expect(windowSpy).toHaveBeenCalledWith(-1);
    });

    it('should call window.history.back with specified number of pages on click', function () {
        var document = templateTest.compileTemplate('<div><a go-back number-of-pages="2">Test</a></div>');
        document.find('a').click();
        expect(windowSpy).toHaveBeenCalledWith(-2);
    });

    it('should call ng-click before navigating back', function () {
        var callOrder = [];
        scope.click = function () { callOrder.push('click'); };
        windowSpy.and.callFake(function () { callOrder.push('back'); });

        var document = templateTest.compileTemplate('<div><a go-back ng-click="click()">Test</a></div>');
        document.find('a').click();

        expect(callOrder).toEqual(['click', 'back']);
    });
});