(function (app) {
    'use strict';

    app.directive('serviceError', function () {
        return {
            restrict: 'E',
            priority: 10,
            transclude: true,
            replace: true,
            template: '<div ng-show="serviceError" class="text-notification error"><span ng-transclude></span></div>',
            scope: true,

            link: function (scope) {
                scope.$on('unsuccessfulMcaResponse', function (errorMessage) {
                    scope.serviceError = errorMessage;
                });
            }
        };
    });
})(angular.module('refresh.serviceError', []));
