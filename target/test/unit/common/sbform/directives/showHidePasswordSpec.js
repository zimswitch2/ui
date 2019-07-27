describe('showHidePassword directive', function () {
    'use strict';
    var tempalteTest, element, scope;

    beforeEach(module('refresh.showHidePassword', 'refresh.test'));

    beforeEach(inject(function (_TemplateTest_) {
        tempalteTest = _TemplateTest_;

        element =
            tempalteTest.compileTemplate('<form><input type="password" ng-model="psw" id="test" show-hide-password="true" /></form>');
        element.appendTo(document.body);
        scope = tempalteTest.scope;
    }));

    describe('initialize', function () {
        it('should insert Show button after password input', function () {
            expect(element.find('span').text()).toBe('Show');
        });

        it('should not insert Show button after password input if show-hide-password not equal to "true"', function () {
            element =
                tempalteTest.compileTemplate('<form><input type="password" ng-model="psw" id="test" show-hide-password="false" /></form>');
            expect(element.find('span').length).toBe(0);
        });
    });

    describe('click on "Show"', function () {
        var showOrHideBtn, input;
        beforeEach(function () {
            showOrHideBtn = element.find('span');
            showOrHideBtn.click();
            input = element.find('input');
        });

        it('should switch the text to "Hide"', function () {
            expect(showOrHideBtn.text()).toBe('Hide');
        });

        it('should change input type to text', function () {
            expect(input.prop('type')).toBe('text');
        });

        it('should focus on input after click', function () {
            expect(document.activeElement.id).toBe('test');
        });
    });

    describe('click on "Hide"', function () {
        var showOrHideBtn, input;
        beforeEach(function () {
            showOrHideBtn = element.find('span');
            showOrHideBtn.click();
            expect(showOrHideBtn.text()).toBe('Hide');
            showOrHideBtn.click();
            input = element.find('input');
        });

        it('should switch the text to "Show"', function () {
            expect(showOrHideBtn.text()).toBe('Show');
        });

        it('should change input type to password', function () {
            expect(input.prop('type')).toBe('password');
        });

        it('should focus on input after click', function () {
            expect(document.activeElement.id).toBe('test');
        });
    });

    describe('No input found', function () {
        it('should throw exception', function () {
            expect(function () {
                tempalteTest.compileTemplate('<form><not-input type="text" ng-model="psw" id="test" show-hide-password="true" /></form>');
            }).toThrow(new Error('None or more than one input were found'));
        });
    });
});
