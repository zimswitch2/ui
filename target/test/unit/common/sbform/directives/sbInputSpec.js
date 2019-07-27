describe('SB input', function () {
    'use strict';
    beforeEach(module('ngMessages', 'refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var test, timeout, rootScope;

    beforeEach(inject(function (_TemplateTest_, $timeout, $rootScope) {
        test = _TemplateTest_;
        timeout = $timeout;
        rootScope = $rootScope;
        _TemplateTest_.allowTemplate('common/sbform/partials/sbTextInput.html');
    }));

    describe('text input element', function () {
        it("should be within a form", function () {
            var form = "<sb-input name='myPrecious' ng-model='model'></sb-input>";
            var error;
            try {
                test.compileTemplate(form);
            }
            catch (e) {
                error = e;
            }

            expect(error).toMatch("Controller 'form', required by directive 'sbInput', can't be found!");
        });
    });

    describe('label', function () {
        it("should not render a label element when no label attribute is present", function () {
            var form = "<form name='theForm'><sb-input name='myPrecious' ng-model='model'></sb-input></form>";
            var element = test.compileTemplate(form);
            var labels = element.find('sb-input').find('label');

            expect(labels.length).toEqual(0);
        });

        it("should render a label element when the label attribute is present", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='myPrecious' label='Type your name'></sb-input></form>";
            var element = test.compileTemplate(form);

            var labelElement = element.find('sb-input').find('label');
            expect(labelElement.length).toEqual(1);
            expect(labelElement.text()).toEqual("Type your name");
        });

        it("should use input-id as id for input in label for when present", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' input-id='myInputId' name='myPrecious' label='Type your name'></sb-input></form>";
            var element = test.compileTemplate(form);

            expect(element.find('sb-input').find('label').attr('for')).toEqual('myInputId');
            expect(element.find('sb-input').find('input').attr('id')).toEqual('myInputId');
        });

        it("should use name as id for input in label for when input-id is not present", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='myPrecious' label='Type your name'></sb-input></form>";
            var element = test.compileTemplate(form);

            expect(element.find('sb-input').find('label').attr('for')).toEqual('myPrecious');
            expect(element.find('sb-input').find('input').attr('id')).toEqual('myPrecious');
        });
    });

    describe('icon', function () {
        it('should show leading icon if with iconClassName set', function () {
            var element = test.compileTemplate("<form name='theForm'><sb-input ng-model='model' name='superInput' type='password' icon-class-name='security-icon'></sb-input></form>");
            expect(element.find('sb-input').find('span.icon.security-icon').length).toBe(1);
        });
    });

    describe('tooltip', function () {
        it("should not render a tooltip element when no tooltip attribute is present", function () {
            var form = "<form><sb-input ng-model='model'></sb-input></form>";
            var element = test.compileTemplate(form);
            var tooltip = element.find('sb-input').find('.sb-tooltip');

            expect(tooltip.length).toBe(0);
        });

        it("should render a tooltip element when the tooltip and label attributes are present", function () {
            var form = "<form><sb-input ng-model='model' tooltip='Your tooltip' label='Your label'></sb-input></form>";
            var element = test.compileTemplate(form);
            var tooltip = element.find('sb-input').find('.sb-tooltip');

            expect(tooltip.length).toBe(1);
            expect(tooltip.attr('name')).toBe('Your tooltip');
        });

        it("should render a tooltip with a negative tabindex", function () {
            var form = "<form><sb-input ng-model='model' tooltip='Your tooltip' label='Your label'></sb-input></form>";
            var element = test.compileTemplate(form);
            var tooltip = element.find('sb-input').find('.sb-tooltip');

            expect(tooltip.attr('tabindex')).toBe('-1');
        });
    });

    describe("password fields", function () {
        describe('general', function () {
                var inputElement, scope;
                beforeEach(function () {
                    rootScope.isMobileDevice = true;

                    var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' type='password'></sb-input></form>";
                    var element = test.compileTemplate(form);
                    scope = test.scope;

                    inputElement = element.find('sb-input').find('input');
                });

                it("should not be trimmed", function () {
                    expect(inputElement.attr('name')).toEqual('superInput');
                });

                it("should NOT have its value trimmed", function () {
                    expect(inputElement.attr('ng-trim')).toEqual('false');
                });
            }
        );

        describe('show/hide password', function () {
            beforeEach(function () {
                rootScope.isMobileDevice = true;
            });

            it('should show password if has attr:show-password-button', function () {
                var element = test.compileTemplate("<form name='theForm'><sb-input ng-model='model' name='superInput' type='password' show-password-button></sb-input></form>");
                expect(element.find('sb-input').find('span.showOrHideLabel').length).toBe(1);
            });

            it('should not show password if do not has attr:show-password-button', function () {
                var element = test.compileTemplate("<form name='theForm'><sb-input ng-model='model' name='superInput' type='password'></sb-input></form>");
                expect(element.find('sb-input').find('span.showOrHideLabel').length).toBe(0);
            });

            it('should not show password if is not mobile device', function () {
                rootScope.isMobileDevice = false;
                var element = test.compileTemplate("<form name='theForm'><sb-input ng-model='model' name='superInput' type='password' show-password-button></sb-input></form>");
                expect(element.find('sb-input').find('span.showOrHideLabel').length).toBe(0);
            });
        });
    });

    describe('text input with id number', function () {
        it('should not display default error message when id number is not required', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');


            inputElement.val('12345678');
            inputElement.trigger('input');

            inputElement.trigger('input');

            expect(element.find('ng-message').text()).not.toEqual('Please enter a valid 13-digit South African ID number');
        });

        it('should display default error message when id number is not valid invalid', function () {
            var form = "<form name='theForm'><sb-input id-number ng-model='model' name='superInput' ng-required='true'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');


            inputElement.val('12345678');
            inputElement.trigger('input');

            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('Please enter a valid 13-digit South African ID number');
        });
    });

    describe("text input field", function () {
        it("should have a name", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            expect(inputElement.attr('name')).toEqual('superInput');
        });

        it("should have the same id and name when no id attribute is present", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            expect(inputElement.attr('id')).toEqual('superInput');
        });

        it("should render an id when input-id attribute is present", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' input-id='iKnowWhoIAm' name='superInput'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            expect(inputElement.attr('id')).toEqual('iKnowWhoIAm');
        });

        it("should have its value trimmed", function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            expect(inputElement.attr('ng-trim')).toEqual('true');
        });

        it('should display default required message when empty', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('Required');
        });

        it('should allow for a custom required message when empty', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true' required-message='this is a custome message'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('this is a custome message');
        });

        it('should display default min length message', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-minlength='2'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.val('a');
            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('Must be longer than 2 characters');
        });

        it('should allow for a custom min length message', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-minlength='2' min-length-message='message'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.val('a');
            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('message');
        });

        it('should display default max length message', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-maxlength='1'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.val('aa');
            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('Cannot be longer than 1 characters');
        });

        it('should allow for a custom max length message', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-maxlength='1' max-length-message='message'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.val('aa');
            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('message');
        });

        it('when ng-required is true but input is blank should allow for ng-pattern and ng-required but should displayed required error message', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true' ng-pattern='/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+[A-Za-z0-9]$/' pattern-message='Please enter a valid email address'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('Required');
        });

        it('when ng-required is true but input is not blank should allow for ng-pattern and ng-required but should displayed pattern message', function () {
            var form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true' ng-pattern='/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+[A-Za-z0-9]$/' pattern-message='Please enter a valid email address'></sb-input></form>";
            var element = test.compileTemplate(form);
            var inputElement = element.find('sb-input').find('input');

            inputElement.val('dd');
            inputElement.trigger('input');

            expect(element.find('ng-message').text()).toEqual('Please enter a valid email address');
        });

        describe('on blur', function () {
            var form,
                element,
                inputElement,
                directiveScope;

            beforeEach(function () {
                form = "<form name='theForm'><sb-input ng-model='model' name='superInput' ng-required='true'></form>";
                element = test.compileTemplate(form);
                inputElement = element.find('sb-input').find('input');
                directiveScope = element.find('sb-input').isolateScope();
            });

            it('should set class with has-been-visited', function () {
                timeout.flush();
                inputElement.blur();
                expect(inputElement.hasClass('has-been-visited')).toBeTruthy();
            });
        });
    });

    describe("text area field", function () {
        var form, element, textareaElement;

        beforeEach(function () {
            form =
                "<form name='theForm'><sb-input name='superInput' type='textarea' ng-model='content' ng-maxlength='100'></sb-input></form>";
            element = test.compileTemplate(form);
            textareaElement = element.find('sb-input').find('textarea');
        });

        it('should render as textarea only', function () {
            expect(textareaElement.length).toBe(1);
            expect(element.find('sb-input').find('input').length).toBe(0);
        });

        it('should hide "Characters left:" by default', function () {
            var charactersLeftElement = element.find('sb-input .characters-left');
            expect(charactersLeftElement.length).toBe(1);
            expect(charactersLeftElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('should update "Characters left:" when text changes', function () {
            var charactersLeftElement = element.find('sb-input .characters-left');
            test.changeInputValueTo(textareaElement, 'test');
            expect(charactersLeftElement.hasClass('ng-hide')).toBeFalsy();
            expect(charactersLeftElement.text()).toBe('Characters left:96');
        });

        it('should hide "Characters left:" when the max-length is not assigned', function () {
            form = "<form name='theForm'><sb-input name='superInput' type='textarea' ng-model='content'></sb-input></form>";
            element = test.compileTemplate(form);
            textareaElement = element.find('sb-input').find('textarea');

            var charactersLeftElement = element.find('sb-input .characters-left');
            expect(charactersLeftElement.length).toBe(1);
            expect(charactersLeftElement.hasClass('ng-hide')).toBeTruthy();
        });

        it('should not update "Characters left:" when text changes without max-length', function () {
            form = "<form name='theForm'><sb-input name='superInput' type='textarea' ng-model='content'></sb-input></form>";
            element = test.compileTemplate(form);
            textareaElement = element.find('sb-input').find('textarea');

            var charactersLeftElement = element.find('sb-input .characters-left');
            test.changeInputValueTo(textareaElement, 'test');
            expect(charactersLeftElement.hasClass('ng-hide')).toBeTruthy();
        });
    });
});
