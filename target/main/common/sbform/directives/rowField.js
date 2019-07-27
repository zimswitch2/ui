(function () {
    'use strict';

    var app = angular.module('refresh.rowField', ['refresh.metadata', 'refresh.parameters']);

    app.directive('rowField', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                label: '@',
                labelFor: '@',
                tooltip: '@'
            },
            templateUrl: 'common/sbform/partials/rowField.html'
        };
    });
})();
