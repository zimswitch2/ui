describe('element helper', function () {
    'use strict';

    beforeEach(module('refresh.elementHelper'));

    var elementHelper, element;

    beforeEach(inject(function (ElementHelper) {
        elementHelper = ElementHelper;
        element = $('<div></div>');
        $('body').append(element);
    }));

    describe('is visible', function () {
        it('should return false when element passed is not visible', function () {
            element.css("display", "none");

            expect(elementHelper.isVisible(element)).toBeFalsy();
        });

        it('should return true when element passed is not visible', function () {
            element.css("display", "block");

            expect(elementHelper.isVisible(element)).toBeTruthy();
        });
    });

    describe('get width', function () {
        it('should return the width of the element in pixels', function () {
            element.css("width", "123px");

            expect(elementHelper.getWidth(element)).toEqual(123);
        });
    });

    describe('get height', function () {
        it('should return the height of the element in pixels', function () {
            element.css("height", "321px");

            expect(elementHelper.getHeight(element)).toEqual(321);
        });
    });
});
