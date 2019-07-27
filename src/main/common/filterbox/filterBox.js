(function (app) {
    'use strict';

    app.directive('filterBox', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                placeholder: '@'
            },
            link: function (scope, element, attrs, ngModel) {
                ngModel.$render = function () {
                    scope.filterText = ngModel.$modelValue;
                };

                scope.modelChanged = function () {
                    ngModel.$setViewValue(scope.filterText);
                };

                scope.clearFilter = function () {
                    scope.filterText = '';
                    scope.modelChanged();
                };
            },
            templateUrl: 'common/filterbox/partials/filterBox.html'
        };
    });
})(angular.module('refresh.filterBox', []));
