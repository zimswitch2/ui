/*global Placeholders:true */

var Placeholders;

describe('TypeAhead', function () {

    beforeEach(module('refresh.typeahead', 'refresh.fixture', 'refresh.test'));

    var scope, template;
    var items = [{
            'name': 'Standard item',
            'code': '051'
        }, {
            'name': 'ABSA',
            'code': '089'
        }, {
            'name': 'Neditem',
            'code': '911'
        }, {
            'name': 'Before Duplicated Text',
            'code': '123'
        }, {
            'name': 'Duplicated Text',
            'code': '124'
        }];

    describe('filter', function () {
        beforeEach(inject(function ($filter) {
            this.$filter = $filter;
            this.data = [
                {
                    name: "ZZ Top",
                    label: function () {
                        return this.name;
                    },
                    description: 'description',
                    code: 1
                },
                {
                    name: 'Foo bar baz',
                    label: function () {
                        return this.name;
                    },
                    code: 2
                },
                {
                    name: 'Herp Derp',
                    label: function () {
                        return this.name;
                    },
                    code: 3
                },
                {
                    name: 'Something else',
                    label: function () {
                        return this.name;
                    },
                    code: 4
                }];
        }));

        it('should match on the full search string', function () {
            expect(this.$filter('typeaheadFilter')(this.data, 'Foo', true)).toEqual([this.data[1]]);
        });

        it('should match on all words in the search string', function () {
            expect(this.$filter('typeaheadFilter')(this.data, 'Fo baz', true)).toEqual([this.data[1]]);
        });

        it('should only match if all words in the search string match', function () {
            expect(this.$filter('typeaheadFilter')(this.data, 'Foo Derp', true)).toEqual([]);
        });

        it('should sort the filtered data by specified criteria', function () {
            var sortedData = _.sortBy(this.data, 'name');
            expect((this.$filter('typeaheadFilter')(this.data, '', true, 'name'))).toEqual(sortedData);
        });

        it('should not sort by anything when the seach criteria is empty', function () {
            expect((this.$filter('typeaheadFilter')(this.data, '', true, ''))).toEqual(this.data);
        });
    });

    describe('directive', function () {
        var test, filter, timeout;
        beforeEach(inject(function (_TemplateTest_, $filter, $timeout) {
            test = _TemplateTest_;
            filter = $filter;
            timeout = $timeout;
            scope = _TemplateTest_.scope;
            scope.data = _.map(items, function (item) {
                item.label = function () {
                    return item.name;
                };
                return item;
            });
            _TemplateTest_.allowTemplate('common/typeahead/partials/typeahead.html');
        }));

        it("should be require an ng-model", function () {
            var template = '<sb-typeahead id="myItem" name="Item" items="data" ng-required="true"></sb-typeahead>';
            var error;
            try {
                test.compileTemplate(template);
            }
            catch (e) {
                error = e;
            }

            expect(error).toMatch("Controller 'ngModel', required by directive 'sbTypeahead', can't be found!");
        });

        it('should list the elements', function () {
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            element.click();
            expect(element.find('li.item').length).toEqual(items.length);
        });

        it('should set the selectedItem if there was already a selected item in the scope', function () {
            scope.chosenItem = scope.data[1];
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var inputElement = element.find('#myItem-input');
            var directiveScope = element.isolateScope();
            inputElement.triggerHandler('focus');
            expect(directiveScope.itemText).toEqual(items[1].name);
        });

        it('should set the selectedItem if there was already a selected item in the scope', function () {
            scope.chosenItem = {};
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var inputElement = element.find('#myItem-input');
            var directiveScope = element.isolateScope();
            inputElement.triggerHandler('focus');
            expect(directiveScope.itemText).toBeUndefined();
        });

        it('should select the item in the list if it only has one item', function () {
            scope.data = [scope.data[0]];
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var inputElement = element.find('#myItem-input');
            var directiveScope = element.isolateScope();
            inputElement.triggerHandler('focus');
            expect(directiveScope.itemText).toEqual(items[0].name);
            expect(inputElement.val()).toEqual(items[0].name);
        });

        it('should set the filteredItems to the empty list if data is undefined', function () {
            scope.data = undefined;
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var inputElement = element.find('#myItem-input');
            var directiveScope = element.isolateScope();
            inputElement.triggerHandler('focus');
            expect(directiveScope.filteredItems).toEqual([]);
        });

        it('should have a placeholder', function () {
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true" placeholder="Blah blah"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var inputElement = element.find('#myItem-input');
            expect(inputElement.attr('placeholder')).toEqual('Blah blah');
        });

        it('may not have a deepFilter option', function () {
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();
            expect(directiveScope.deepFilter).toBeFalsy();
        });

        it('may have a deepFilter option', function () {
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true" deepFilter="deepFilter"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();
            expect(directiveScope.deepFilter).toBeTruthy();
        });

        it('should set sortBy criteria', function () {
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true" sort-by="name"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var directiveScope = element.isolateScope();
            expect(directiveScope.sortByCriteria).toEqual('name');
        });

        it('should clear the input value when the X is clicked', function () {
            var autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
            var element = test.compileTemplate(autocomplete);
            var inputElement = element.find('#myItem-input');
            element.click();
            element.find('li').mousedown();
            expect(inputElement.val()).toEqual(items[0].name);
            element.find('.close').click();
            expect(inputElement.val()).toEqual('');
            expect(scope.chosenItem).toBeUndefined();
        });

        it('should change external scope value in ngmodel', function () {
            scope.chosenItem = {};
            var testOnChange = '<sb-typeahead id="myItem" name="Item" items="data" ng-model="chosenItem" ng-required="true" ></sb-typeahead>';
            var element = test.compileTemplate(testOnChange);
            var inputElement = element.find('#myItem-input');
            element.click();
            element.find('li').mousedown();
            expect(inputElement.val()).toEqual(items[0].name);
            expect(scope.chosenItem).toBe(scope.data[0]);
        });

        describe("with specific value property", function () {
            beforeEach(function () {
                this.autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem" ng-required="true" value-property="code" label-property="description"></sb-typeahead>';
                this.element = test.compileTemplate(this.autocomplete);
                this.inputElement = this.element.find('#myItem-input');
                this.directiveScope = this.element.isolateScope();
            });

            it('should set the model based on the value-property', function () {
                this.directiveScope.selectItem(items[0]);
                expect(scope.chosenItem).toEqual(items[0].code);
                expect(this.directiveScope.itemText).toEqual(items[0].name);
            });

            it('should clear the model when no item has been selected', function () {
                scope.chosenItem = '089';
                scope.$apply();

                this.directiveScope.selectItem(undefined);
                expect(scope.chosenItem).toBeUndefined();
                expect(this.directiveScope.itemText).toEqual('');
            });

            it('should set the selected item based on the external scope value', function () {
                scope.chosenItem = '089';
                scope.$apply();
                expect(this.directiveScope.itemText).toEqual('ABSA');
            });
        });

        describe("List", function () {
            beforeEach(function () {
                this.autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem" ng-required="true"></sb-typeahead>';
                this.element = test.compileTemplate(this.autocomplete);
                this.inputElement = this.element.find('#myItem-input');
                this.directiveScope = this.element.isolateScope();
            });

            describe("select none", function () {
                var timeout;

                beforeEach(inject(function ($timeout) {
                    timeout = $timeout;
                    this.directiveScope.selectNone();
                }));

                it('should set the items to hidden', function () {
                    expect(this.directiveScope.itemsHidden).toBeTruthy();
                });

                it('should clear the selected item', function () {
                    expect(this.directiveScope.selectedItem).toBeUndefined();
                    expect(this.directiveScope.ngModel).toBeUndefined();
                });

                it('should clear the item text', function () {
                    expect(this.directiveScope.itemText).toEqual('');
                });

                it('should mark the validity of items in list to true', function () {
                    this.directiveScope.$digest();
                    expect(this.inputElement.controller('ngModel').$error.notInList).toBeFalsy();
                });

                it('should mark the validity of required to false', function () {
                    this.directiveScope.$digest();
                    expect(this.inputElement.controller('ngModel').$error.required).toBeTruthy();
                });

                it('should force placeholder display', function () {
                    Placeholders = jasmine.createSpyObj('Placeholders', ['showPlaceholder']);
                    timeout.flush();
                    expect(Placeholders.showPlaceholder).toHaveBeenCalled();
                });

                // this is a pointless test really, just for coverage
                it('should not use placeholder polyfill on non-ie9', function () {
                    Placeholders = jasmine.createSpyObj('Placeholders', ['showPlaceholder']);
                    var spy = Placeholders.showPlaceholder;
                    Placeholders = undefined;
                    timeout.flush();
                    expect(spy).not.toHaveBeenCalled();
                });
            });

            describe("autocomplete list", function () {
                it('should set the current item input to the current item model', function () {
                    this.element.find('.items li').first().mousedown();
                    expect(this.directiveScope.itemText).toEqual(items[0].name);
                    expect(this.inputElement.val()).toEqual(items[0].name);
                });

                it('should set the model to the clicked item', function () {
                    this.element.find('.items li').first().mousedown();
                    expect(this.inputElement.val()).toEqual(items[0].name);
                });

                it('should set the model when selectItem is called', function () {
                    this.inputElement.controller('ngModel').$pristine = true;
                    this.inputElement.controller('ngModel').$dirty = false;
                    this.directiveScope.selectItem(items[0], true);
                    expect(this.directiveScope.itemText).toEqual(items[0].name);
                    expect(scope.chosenItem).toEqual(items[0]);
                    expect(this.inputElement.controller('ngModel').$pristine).toBeFalsy();
                    expect(this.inputElement.controller('ngModel').$dirty).toBeTruthy();
                });

                it('should not set the model when selectItem is called with an invalid item', function () {
                    this.directiveScope.selectItem(null);
                    expect(this.directiveScope.itemText).toBe('');
                    expect(scope.chosenItem).toBeUndefined();
                });

                it('should set the model when selectItem is called but not reevaluate validations', function () {
                    this.inputElement.controller('ngModel').$pristine = true;
                    this.inputElement.controller('ngModel').$dirty = false;
                    this.directiveScope.selectItem(items[0]);
                    expect(this.directiveScope.itemText).toEqual(items[0].name);
                    expect(scope.chosenItem).toEqual(items[0]);
                    expect(this.inputElement.controller('ngModel').$pristine).toBeTruthy();
                    expect(this.inputElement.controller('ngModel').$dirty).toBeFalsy();
                });

                it('should unhide the item list when the input is focused with more than one result', function () {
                    this.inputElement.triggerHandler('focus');
                    expect(this.directiveScope.itemsHidden).toBeFalsy();
                });

                it('should hide the item list when the input is focused with zero results', function () {
                    this.element.find('.items li').first().mousedown();
                    this.directiveScope.itemText = 'z';
                    scope.$apply();
                    this.inputElement.triggerHandler('focus');
                    expect(this.directiveScope.itemsHidden).toBeTruthy();
                });

                it('should hide the item list when the input is blurred', function () {
                    this.directiveScope.selectItem(items[0]);
                    this.inputElement.blur();
                    expect(this.directiveScope.itemsHidden).toBeTruthy();
                });

                it('should not set the model and itemText if the selected item label is not the same as the itemText', function () {
                    this.directiveScope.selectItem({
                        'name': '', 'code': '051', label: function () {
                            return '';
                        }
                    });
                    this.directiveScope.itemText = '';
                    this.inputElement.blur();
                    expect(this.directiveScope.itemText).toEqual('');
                    expect(scope.chosenItem).toBeUndefined();
                });

                it('should set the model and itemText if the selected item label is the same as the itemText and the item is not the first item in the filtered list', function () {
                    var duplicatedTextItem = _.find(items, { 'name': 'Duplicated Text' });
                    this.directiveScope.selectItem({
                        'name': duplicatedTextItem.name, 'code': duplicatedTextItem.code, label: function () {
                            return duplicatedTextItem.name;
                        }
                    });
                    this.directiveScope.itemText = 'Duplicated Text';
                    this.inputElement.blur();
                    expect(this.directiveScope.itemText).toEqual('Duplicated Text');
                    expect(scope.chosenItem).toBe(duplicatedTextItem);
                });

                it('should not set the model and itemtext if the selected item label is not the same as the itemtext', function () {
                    this.directiveScope.selectedItem = items[0];
                    this.directiveScope.itemText = "text";
                    this.inputElement.blur();
                    expect(this.directiveScope.itemText).toEqual('');
                    expect(this.directiveScope.ngModel).toBeUndefined();
                });

                it('should mark the first result in the item list as current on focus', function () {
                    this.inputElement.triggerHandler('focus');
                    expect(this.directiveScope.current.item.instance).toEqual(this.directiveScope.items[0]);
                });

                it('should set current item to the first item in the item list when focused', function () {
                    this.directiveScope.current.item.instance = items[2];
                    this.directiveScope.current.item.index = 2;
                    this.inputElement.triggerHandler('focus');
                    expect(this.directiveScope.current.item.index).toEqual(0);
                    expect(this.directiveScope.current.item.instance).toEqual(items[0]);
                });

                describe("validations", function () {
                    it('should set the item field to required if there is no valid selection', function () {
                        scope.itemText = "";
                        this.inputElement.triggerHandler('keyup', {keyCode: 8});
                        expect(this.inputElement.controller('ngModel').$error.required).toBeTruthy();
                    });

                    it('should set the dirty class if the item input is not valid', function () {
                        this.directiveScope.itemText = "ard";
                        this.inputElement.triggerHandler('keyup');
                        this.inputElement.controller('ngModel').$pristine = false;
                        var result = this.directiveScope.dirtyClass("#selectedItem");
                        expect(result).toEqual("ng-dirty form-error");
                    });

                    it('should set the item field to required if there is no input and it is dirty', function () {
                        this.directiveScope.itemText = undefined;
                        this.inputElement.trigger('blur');
                        expect(this.inputElement.controller('ngModel').$pristine).toBeFalsy();
                        expect(this.inputElement.controller('ngModel').$error.required).toBeTruthy();
                    });

                    it('should mark the item input as invalid if the entered item is not in the item list', function () {
                        this.directiveScope.itemText = "jibberish";
                        this.inputElement.trigger('keyup');
                        expect(this.inputElement.controller('ngModel').$error.notInList).toBeTruthy();
                    });

                    it("should display an error message when the entered item is not in the item list", function () {
                        this.directiveScope.itemText = "jibberish";
                        this.inputElement.trigger('keyup');
                        expect(this.element.find('.item-not-in-list').html()).toEqual("Blah blah invalid message");
                    });

                    it("should indicate item input as invalid when the entered item is not in the item list", function () {
                        this.directiveScope.itemText = "jibberish";
                        this.inputElement.trigger('keyup');
                        expect(this.directiveScope.invalid('itemNotInList')).toBeTruthy();
                    });

                    it('should mark the item input as valid if the entered item is in the item list', function () {
                        this.element.find('.items li').first().mousedown();
                        expect(this.inputElement.controller('ngModel').$error.notInList).toBeFalsy();
                    });
                });
            });

            describe("action keys", function () {
                it('should mark the first result in the filtered item list as current on keyup', function () {
                    this.directiveScope.itemText = 'abs';
                    this.inputElement.triggerHandler('keyup');
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[1].code);
                });

                it('should set the current item to the next item in the list when pressing down arrow', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 40}));
                    var webElement = this.element.find('.items li:nth(' + this.directiveScope.current.item.index + ')');
                    expect(webElement.hasClass('current')).toBeTruthy();
                    expect(webElement.text()).toContain('ABSA');
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[1].code);
                });

                it('should do nothing when at the end of the item list when pressing down', function () {
                    this.inputElement.triggerHandler('focus');
                    this.directiveScope.current.item.instance = items[items.length - 1];
                    this.directiveScope.current.item.index = items.length - 1;
                    this.inputElement.trigger($.Event('keydown', {keyCode: 40}));
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[items.length - 1].code);
                });

                it('should do nothing when at the beginning of the item list when pressing up', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 38}));
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[0].code);
                });

                it('should choose the previous item in the list at the beginning of the item list when pressing up', function () {
                    this.inputElement.triggerHandler('focus');
                    this.directiveScope.current.item.instance = items[2];
                    this.directiveScope.current.item.index = 2;
                    this.inputElement.trigger($.Event('keydown', {keyCode: 38}));
                    var webElement = this.element.find('.items li:nth(' + this.directiveScope.current.item.index + ')');
                    expect(webElement.hasClass('current')).toBeTruthy();
                    expect(webElement.text()).toContain('ABSA');
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[1].code);
                });

                it('should set currentIndex to zero when pressing any key', function () {
                    this.inputElement.triggerHandler('focus');
                    this.directiveScope.current.item.instance = items[2];
                    this.directiveScope.current.item.index = 2;
                    this.inputElement.trigger($.Event('keyup', {keyCode: 120}));
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[0].code);
                    expect(this.directiveScope.current.item.index).toEqual(0);
                });

                it('should do nothing when at the beginning of the item list when pressing up', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 38}));
                    expect(this.directiveScope.current.item.instance.code).toEqual(items[0].code);
                });

                it('should select the current item when pressing enter', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 13}));
                    expect(this.directiveScope.itemText).toEqual(items[0].name);
                });

                it('should select the current item when pressing tab', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 9}));
                    expect(this.directiveScope.itemText).toEqual(items[0].name);
                });

                it('should hide list when pressing esc', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keyup', {keyCode: 27}));
                    expect(this.directiveScope.itemsHidden).toBeTruthy();
                });

                it('should not hide list when pressing upArrow', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keyup', {keyCode: 38}));
                    expect(this.directiveScope.itemsHidden).toBeFalsy();
                });

                it('should hide list when pressing downArrow', function () {
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keyup', {keyCode: 40}));
                    expect(this.directiveScope.itemsHidden).toBeFalsy();
                });

                it('should hide the item list when pressing enter', function () {
                    this.inputElement.triggerHandler('focus');
                    expect(this.directiveScope.itemsHidden).toBeFalsy();
                    this.inputElement.trigger($.Event('keyup', {keyCode: 13}));
                    this.inputElement.triggerHandler('blur');
                    expect(this.directiveScope.itemsHidden).toBeTruthy();
                });

                it('should unhide the item list when the input receives keydown and there is more than one result', function () {
                    this.element.find('.items li').first().mousedown();
                    this.directiveScope.itemText = 'a';
                    this.inputElement.triggerHandler('keyup');
                    expect(this.directiveScope.itemsHidden).toBeFalsy();
                });

                it('should hide the item list when the input receives keydown and there is one or less results', function () {
                    this.element.find('.items li').first().mousedown();
                    this.inputElement.triggerHandler('focus');
                    this.directiveScope.itemText = 'tz';
                    this.inputElement.triggerHandler('keyup');
                    expect(this.directiveScope.itemsHidden).toBeTruthy();
                });
            });

            describe("lazy load", function () {
                it('should not get focus when pressing enter if the next input is lazy loaded', inject(function ($document) {
                    this.autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem" ng-required="true"></sb-typeahead>' +
                    '<sb-typeahead id="myItem2" name="Item2" lazy-load="true" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem2" ng-required="true"></sb-typeahead>';
                    this.element = test.compileTemplate(this.autocomplete);
                    this.inputElement = this.element.find('#myItem-input');
                    this.directiveScope = this.element.isolateScope();
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 13}));

                    var nextElementToFocus = this.directiveScope.findNextElementToFocus(this.element);
                    expect(nextElementToFocus.length).toEqual(0);
                }));

                it('should get focus when pressing enter if the next input is not lazy loaded', inject(function ($document) {
                    this.autocomplete = '<sb-typeahead id="myItem" name="Item" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem" ng-required="true"></sb-typeahead>' +
                    '<div><sb-typeahead id="myItem2" name="Item2" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem2" ng-required="true"></sb-typeahead></div>' +
                    '<sb-typeahead id="myItem3" name="Item3" items="data" invalid-item-message="Blah blah invalid message" ng-model="chosenItem3" ng-required="true"></sb-typeahead>';
                    this.element = test.compileTemplate(this.autocomplete);
                    this.inputElement = this.element.find('#myItem-input');
                    this.directiveScope = this.element.isolateScope();
                    this.inputElement.triggerHandler('focus');
                    this.inputElement.trigger($.Event('keydown', {keyCode: 13}));

                    var nextElementToFocus = this.directiveScope.findNextElementToFocus(this.element);
                    expect(nextElementToFocus.attr('id')).toEqual('myItem2-input');

                }));
            });
        });
    });
});
