describe('inputLeadingIcon directive', function () {
    'use strict';
    var tempalteTest, element, scope;

    beforeEach(module('refresh.inputLeadingIcon', 'refresh.test'));

    beforeEach(inject(function (_TemplateTest_) {
        tempalteTest = _TemplateTest_;

        element =
            tempalteTest.compileTemplate('<form><input type="password" ng-model="psw" id="test" input-leading-icon="icon-name" /></form>');
        element.appendTo(document.body);
        scope = tempalteTest.scope;
    }));

    describe('initialize', function () {
        it('should insert icon before input', function () {
            expect(element.find('span.icon.icon-name').length).toBe(1);
        });

        it('should not insert icon if no icon class name is assigned', function () {
            element =
                tempalteTest.compileTemplate('<form><input type="password" ng-model="psw" id="test" input-leading-icon /></form>');
            expect(element.find('span.icon').length).toBe(0);
        });
    });

    describe('No input found', function () {
        it('should throw exception', function () {
            expect(function () {
                tempalteTest.compileTemplate('<form><not-input type="text" ng-model="psw" id="test" input-leading-icon="icon-name" /></form>');
            }).toThrow(new Error('None or more than one input were found'));
        });
    });
});
