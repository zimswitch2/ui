(function () {
    'use strict';

    var module = angular.module('refresh.amount', []);

    module.directive('sbAmount', ['$timeout', function ($timeout) {

        var copyAttributes = function (element) {
            _.each(element[0].attributes, function (attribute) {
                var input = element.find('input');
                if (!input[0].hasAttribute(attribute.name)) {
                    input.attr(attribute.name, attribute.value);
                }
            });
        };

        return {
            restrict: 'E',
            templateUrl: 'common/amount/partials/amount.html',
            scope: {
                ngModel: '=',
                enforcer: '=',
                hinter: '=',
                hintWatcher: '=',
                placeholder: '=',
                ngDisabled: '=',
                label: '@',
                currencyCode: '=',
                ngChange: '&',
                inputName: '@'
            },
            compile: function (element) {
                copyAttributes(element);
                return {
                    post: function (scope) {
                        scope.timeoutChange = function (onChangeMethod) {
                            $timeout(function () {
                                onChangeMethod();
                            });
                        };
                    }
                };
            }
        };
    }]);
})();
