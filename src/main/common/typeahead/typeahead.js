(function (app) {
    'use strict';

    var keys = {
        enter: 13,
        escape: 27,
        upArrow: 38,
        downArrow: 40,
        tab: 9
    };

    var validateAutocomplete = function (scope, element, text) {
        element = angular.element(element);
        element.controller('ngModel').$pristine = false;
        element.controller('ngModel').$dirty = true;
        element.addClass("ng-dirty");
        if (text === undefined) {
            element.controller('ngModel').$setValidity('required', false);
        }
    };

    var validateItemInList = function (scope, element) {
        element = angular.element(element);

        var filteredData = scope.filteredItems;
        if (filteredData.length === 0) {
            element.controller('ngModel').$setValidity('notInList', false);
            scope.selectedItem = undefined;
        } else {
            element.controller('ngModel').$setValidity('notInList', true);
        }
    };

    var moveUp = function (filteredData, current) {
        if (current.index <= 0) {
            return;
        }
        current.index--;
        current.instance = filteredData[current.index];
    };

    var moveDown = function (filteredData, current) {
        if (current.index >= filteredData.length - 1 || current.index >= 9) {
            return;
        }
        current.index++;
        current.instance = filteredData[current.index];
    };

    var hideItems = function (scope) {
        scope.itemsHidden = true;
    };

    var resetCurrent = function (filteredData, current) {
        current.index = 0;
        current.instance = filteredData[current.index];
    };

    var validateItem = function (scope, element, list, current) {
        resetCurrent(list, current);
        validateItemInList(scope, element.find('input'));
        validateAutocomplete(scope, element.find('input'), scope.itemText);
        scope.itemsHidden = list.length === 0;
    };

    var handleKeyUp = function (scope, event, element, current, list) {
        switch (event.keyCode) {
            case keys.escape:
                hideItems(scope);
                break;
            case keys.upArrow:
                break;
            case keys.downArrow:
                break;
            case keys.enter:
                break;
            default:
                validateItem(scope, element, list, current);
                break;
        }
        scope.$apply();
    };

    var scroll = function (element, list, current) {
        if ((list.length - 1) > current.index) {
            element.find('ul.typeahead.items').scrollTo('li:eq(' + current.index + ')');
        }
    };

    app.directive('sbTypeahead', function ($timeout, $filter) {
        return {
            require: 'ngModel',
            templateUrl: 'common/typeahead/partials/typeahead.html',
            restrict: "E",
            scope: {
                ngRequired: '=',
                ngFocus: '&',
                ngBlur: '&',
                items: '=',
                id: '@',
                name: '@',
                invalidItemMessage: '@',
                placeholder: '@',
                lazyLoad: '@'
            },
            link: function (scope, element, attrs, ngModel) {

                var selectedItem = {};

                var modelChanged = function () {
                    if (element.attr('value-property')) {
                        if (selectedItem) {
                            ngModel.$setViewValue(selectedItem[element.attr('value-property')]);
                        } else {
                            ngModel.$setViewValue(selectedItem);
                        }
                    } else {
                        ngModel.$setViewValue(selectedItem);
                    }
                };

                ngModel.$viewChangeListeners.push(function() {
                    scope.$eval(attrs.ngChange);
                });

                function initializeItemText() {
                    if (selectedItem && selectedItem.label) {
                        scope.itemText = selectedItem.label();
                    } else {
                        scope.itemText = undefined;
                    }
                }

                ngModel.$render = function () {

                    var key = element.attr('value-property');
                    var value = ngModel.$modelValue;

                    if (key && value) {
                        var finder = {};
                        finder[key] = value;
                        selectedItem = _.find(scope.items, finder);

                    } else {
                        selectedItem = value;
                    }

                    initializeItemText();
                };

                scope.sortByCriteria = element.attr('sort-by');

                scope.itemsHidden = true;

                scope.current = {
                    item: {
                        index: 0
                    }
                };

                scope.deepFilter = element.is('[deepFilter]');

                scope.filteredItems = scope.items || [];

                element.find('input').on('focus', function () {
                    scope.current.item.index = 0;
                    scope.filteredItems =
                        $filter('typeaheadFilter')(scope.items, scope.itemText, '', scope.sortByCriteria);
                    var filteredData = scope.filteredItems;
                    if (filteredData.length === 1) {
                        scope.itemsHidden = true;
                        scope.current.item.instance = filteredData[0];
                        scope.selectItem(filteredData[0]);
                        scope.$apply();
                    } else if (filteredData.length > 1) {
                        scope.itemsHidden = false;
                        scope.current.item.instance = filteredData[0];
                    } else {
                        scope.itemsHidden = true;
                    }
                }).on('blur', function () {
                    validateAutocomplete(scope, this, scope.itemText);
                    var filteredData = scope.filteredItems;
                    if (filteredData.length > 0 && scope.itemText) {
                        var selectedItemInFilteredData = _.find(filteredData, function(filteredDataItem) {
                           return scope.itemText.toLowerCase() === filteredDataItem.label().toLowerCase();
                        });
                        scope.selectItem(selectedItemInFilteredData);
                    } else {
                        scope.selectItem();
                    }

                    scope.itemsHidden = true;
                    scope.$apply();
                }).on('keyup', function (event) {
                    scope.filteredItems =
                        $filter('typeaheadFilter')(scope.items, scope.itemText, '', scope.sortByCriteria);
                    var filteredData = scope.filteredItems;
                    scope.current.item.instance = scope.current.item.instance || filteredData[0];

                    handleKeyUp(scope, event, element, scope.current.item, filteredData);
                    scope.$apply();
                }).on('keydown', function (event) {
                    scope.filteredItems =
                        $filter('typeaheadFilter')(scope.items, scope.itemText, '', scope.sortByCriteria);
                    var filteredData = scope.filteredItems;
                    switch (event.keyCode) {
                        case keys.upArrow:
                            moveUp(filteredData, scope.current.item);
                            scroll(element, filteredData, scope.current.item);
                            break;
                        case keys.downArrow:
                            moveDown(filteredData, scope.current.item);
                            scroll(element, filteredData, scope.current.item);
                            break;
                        case keys.tab:
                            scope.selectItem(scope.current.item.instance);
                            break;
                        case keys.enter:
                            scope.selectItem(scope.current.item.instance);
                            event.preventDefault();
                            scope.findNextElementToFocus(element).focus();
                            break;
                    }
                    scope.$apply();
                });

                scope.findNextElementToFocus = function (element) {
                    var nextInput = element.next().find('input');
                    if (nextInput.length > 0) {
                        if (!nextInput.attr('lazy-load')) {
                            return nextInput;
                        }
                        return nextInput.find('[lazy-load]');
                    } else {
                        return element.parent().next().find('input');
                    }
                };

                scope.$watch('itemText', function () {
                    scope.filteredItems = $filter('typeaheadFilter')(scope.items, scope.itemText);

                });

                scope.selectItem = function (item, validate) {
                    scope.itemsHidden = true;
                    selectedItem = item;

                    if (selectedItem && selectedItem.label) {
                        scope.itemText = selectedItem.label();
                        if (validate) {
                            validateItem(scope, element, _.cloneDeep(scope.filteredItems), _.cloneDeep(item));
                        }
                    } else {
                        scope.itemText = '';
                    }
                    modelChanged();
                };

                scope.selectNone = function () {
                    scope.itemsHidden = true;
                    selectedItem = undefined;
                    scope.itemText = '';
                    modelChanged();
                    element.find('input').controller('ngModel').$setValidity('notInList', true);
                    element.find('input').controller('ngModel').$setValidity('required', false);
                    // for ie9 of course, force placeholder to show
                    // note: placeholders.js:458 is patched to expose this method globally
                    $timeout(function () {
                        if (typeof(Placeholders) !== "undefined") {
                            Placeholders.showPlaceholder(element.find('input')[0]);
                        }
                    });
                };

                scope.invalid = function (errorName) {
                    return {
                        "itemRequired": element.find('input').controller('ngModel').$error.required && !scope.itemText,
                        "itemNotInList": element.find('input').controller('ngModel').$error.notInList
                    }[errorName];
                };

                //TODO: use .has-been-visited instead of pristine
                scope.dirtyClass = function (id) {
                    var inputModel = element.find('input').controller('ngModel');

                    if (inputModel.$pristine) {
                        return "pristine form-error";
                    } else {
                        return "ng-dirty form-error";
                    }
                };

            }
        };
    });

    app.filter('typeaheadFilter', function () {
        return function (array, expression, comparator, sortByCriteria) {
            var labelMatched = _.filter(array, function (item) {
                return expression ? _.contains(item.label().toLowerCase(), expression.toLowerCase()) : true;
            });
            var expressionWords = expression ? expression.split(' ') : [];
            var allWords = _.filter(array, function (item) {
                return _.every(expressionWords, function (word) {
                    return _.contains(item.label().toLowerCase(), word.toLowerCase());
                });
            });
            var uniqueResults = _.uniq(labelMatched.concat(allWords));
            return _.sortBy(uniqueResults, sortByCriteria);
        };
    });

})(angular.module('refresh.typeahead', []));
