describe('Unit Test - Hidden Form Button', function () {
    'use strict';

    beforeEach(module('refresh.common.hiddenFormButtonDirective', 'refresh.test'));

    var templateTest, parentScope, document;

    beforeEach(inject(function (TemplateTest) {
        templateTest = TemplateTest;
        parentScope = templateTest.scope;
        templateTest.allowTemplate('common/hiddenFormButton/partials/hiddenFormButton.html');
    }));

    describe('initialise', function () {
        describe('with non-empty url', function () {
            beforeEach(function () {
                parentScope.items = [
                    {name: 'item1', value: 'value1'},
                    {name: 'item2', value: 'value2'},
                    {name: 'item3', value: 'value3'}
                ];
                parentScope.url = '/somewhere';
                document =
                    templateTest.compileTemplate('<hidden-form-button action-url="url" form-items="items"><i class="iconName"></i></hidden-form-button>',
                        true);
            });

            it('should have actionUrl', function () {
                expect(document.find('form').attr('action')).toBe('/somewhere');
            });

            it('should have default method GET', function () {
                expect(document.find('form').attr('method')).toBe('GET');
            });

            it('should have default target to _blank', function () {
                expect(document.find('form').attr('target')).toBe('_blank');
            });

            it('should have hidden inputs', function () {
                var find = document.find('form input[type=hidden]');
                expect(find.length).toBe(3);
                expect(angular.element(find[0]).attr('name')).toBe('item1');
                expect(angular.element(find[1]).attr('value')).toBe('value2');
            });

            it('should have submit button with transclude', function () {
                var button = document.find('form button[type=submit]');
                expect(button.length).toBe(1);
                expect(button.find('i.iconName').length).toBe(1);
            });
        });

        describe('with empty url', function () {
            it('should give "#" when url is undefined', function () {
                parentScope.url = undefined;

                document =
                    templateTest.compileTemplate(
                        '<hidden-form-button action-url="url" form-items="[]"></hidden-form-button>', true);
                expect(document.find('form').attr('action')).toBe('#');
            });

            it('should give "#" when url is empty', function () {
                parentScope.url = '';

                document =
                    templateTest.compileTemplate(
                        '<hidden-form-button action-url="url" form-items="[]"></hidden-form-button>', true);
                expect(document.find('form').attr('action')).toBe('#');
            });
        });
        
        describe('no tagging', function () {
            var button;
            beforeEach(function () {
                document =
                    templateTest.compileTemplate('<hidden-form-button></hidden-form-button>',
                        true);
                button = document.find('form button[type=submit]');
            });
            
            it('should not have a dtmid attribute on submit button', function () {
                expect(document.find(button).attr('data-dtmid')).not.toBeDefined();
            });

            it('should not have a dtmtext attribute on submit button', function () {
                expect(document.find(button).attr('data-dtmtext')).not.toBeDefined();
            });
        });

        describe('with tagging', function () {
            var button;
            beforeEach(function () {
                document =
                    templateTest.compileTemplate('<hidden-form-button submit-dtmid="some dtm id" submit-dtmtext="some dtm text"></hidden-form-button>',
                        true);
                button = document.find('form button[type=submit]');
            });

            it('should have a dtmid attribute on submit button', function () {
                expect(document.find(button).attr('data-dtmid')).toEqual('some dtm id');
            });

            it('should have a dtmtext attribute on submit button', function () {
                expect(document.find(button).attr('data-dtmtext')).toEqual('some dtm text');
            });
        });
    });

});
