'use strict';

describe('Profile dropdown directive', function () {
    var scope, test, element;

    beforeEach(module('refresh.dropdownMenu'));

    beforeEach(inject(function (_TemplateTest_) {
        scope = _TemplateTest_.scope;
        test = _TemplateTest_;
        var html = '<body><div class="wrapper"><a id="link">myname</a><div dropdown-menu class="dropdown" ng-show="dropDown"><a id="dropdown-link">dosomething</a></div></div></body>';
        element = test.compileTemplate(html);
    }));

    it('should hide the dropdown when clicking a link in the dropdown', function () {
        scope.dropDown = true;
        scope.$apply();

        element.find('#dropdown-link').trigger('click');

        expect(scope.dropDown).toBeFalsy();
        expect(element.find('.dropdown').hasClass('ng-hide')).toBeTruthy();
    });

    it('should hide the dropdown when the mouse leaves the dropdown parent container', function () {
        scope.dropDown = true;
        scope.$apply();

        element.find('.wrapper').end().trigger('mouseleave');

        expect(scope.dropDown).toBeFalsy();
    });
});
