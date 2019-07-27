(function (app) {
    'use strict';

    app.directive('sbAccountDropdown', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/accountdropdown/partials/accountDropdown.html',
            require: 'ngModel',
            scope: {
                id: '@name',
                name: '@',
                label: '@',
                items: '=',
                noBalance: '=',
                currencyCode: '=',
                highlightBalance: '&'
            },
            link: function (scope, element, attributes, ngModel) {
                scope.isEmpty = function () {
                    return !scope.items || (scope.items.length === 0);
                };

                if (attributes.autofocus !== undefined) {
                    element.find('select').attr('autofocus', 'true');
                }

                ngModel.$render = function () {
                    scope.account = ngModel.$modelValue;
                };

                scope.modelChanged = function () {
                    ngModel.$setViewValue(scope.account);
                };
            }
        };
    });
})(angular.module('refresh.accountDropdown', ['refresh.filters']));