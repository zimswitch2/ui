describe('go-home directive', function () {
    'use strict';

    var scope, templateTest, homeService;

    beforeEach(module('refresh.common.homeDirective'));

    beforeEach(inject(function (TemplateTest, HomeService) {
        templateTest = TemplateTest;
        scope = templateTest.scope;
        spyOn(scope, ['$apply']);
        homeService = HomeService;
        spyOn(homeService, ['goHome']);
    }));

    it('should call goHome when button is clicked', function () {
        var document = templateTest.compileTemplate('<div><a go-home>Test</a></div>');
        document.find('a').click();
        expect(homeService.goHome).toHaveBeenCalled();
    });

    it('should trigger $digest when button is clicked', function () {
        var document = templateTest.compileTemplate('<div><a go-home>Test</a></div>');
        document.find('a').click();
        expect(scope.$apply).toHaveBeenCalled();
    });
});