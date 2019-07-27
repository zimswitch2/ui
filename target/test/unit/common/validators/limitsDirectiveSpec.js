'use strict';

describe('limits directive', function () {

    beforeEach(module('refresh.validators.limits'));

    var scope, directive, templateTest;



    describe('hints', function () {
        beforeEach(inject(function (_TemplateTest_) {
            templateTest = _TemplateTest_;
            scope = _TemplateTest_.scope;
            directive = _TemplateTest_.compileTemplate('<form><div class="text-notification">nothing</div><input ng-model="obj" hinter="hinter" hint-watcher="hintWatcher" limits></form>');
        }));

        it('should replace the parent text notification with the hint', function () {
            scope.hinter = function () {
                return 'message';
            };

            scope.obj = undefined;
            scope.$apply();

            expect(directive.find('div.text-notification').html()).toBe('message');
        });

        it('should remove the parent text notification if there is no hint set', function () {
            scope.hinter = function () {
                return undefined;
            };

            scope.obj = undefined;
            scope.$apply();

            expect(directive.find('div.text-notification').length).toBe(0);
        });

        it('should leave the parent text notification if there is no hinter function', function () {
            scope.hinter = undefined;

            scope.obj = undefined;
            scope.$apply();

            expect(directive.find('div.text-notification').html()).toBe('nothing');
        });

        it('should watch with the hintWatcher', function () {
            scope.hinter = function () {
                return 'message';
            };

            scope.hintWatcher = function () {
                return {
                    'elements': ['a', 'b'],
                    'scope': scope
                };
            };
            directive = templateTest.compileTemplate('<form><div class="text-notification">nothing</div><input ng-model="obj" hinter="hinter" hint-watcher="hintWatcher" limits></form>');
            scope.$apply();

            scope.a = 'a';
            scope.$apply();

            expect(directive.find('div.text-notification').html()).toBe('message');
        });
    });

    describe('enforcer', function (){
        beforeEach(inject(function (_TemplateTest_) {
            templateTest = _TemplateTest_;
            scope = _TemplateTest_.scope;
            directive = _TemplateTest_.compileTemplate('<form><div class="text-notification">nothing</div><input ng-model="obj" input-name="test" enforcer="enforcer" limits></form>');
        }));

        it('should show the error message if the enforcer returns an error', function () {
            scope.enforcer = function () {
                return {
                    error: true,
                    type: 'foo',
                    message: 'error message'
                };
            };

            scope.obj ={};

            scope.$apply();

            expect(directive.find('span.form-error').html()).toBe('error message');
        });
    });
});
