describe('button click tracker', function () {
    'use strict';

    beforeEach(module('refresh.analytics.trackclick'));

    beforeEach(inject(function (TemplateTest) {
        this.element = TemplateTest.compileTemplate('<button track-click="my button"></button>');
        this.scope = TemplateTest.scope;
        spyOn(this.scope, '$emit');
    }));

    it('should send a trackButtonClick event', function () {
        this.element.triggerHandler('click');
        expect(this.scope.$emit).toHaveBeenCalledWith('trackButtonClick', 'my button');
    });
});
