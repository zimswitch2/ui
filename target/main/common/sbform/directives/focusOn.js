(function (app) {
    'use strict';

    app.directive('focusOn', function ($timeout) {
        return {
            restrict: "A",
            link: function (scope, element) {

                $timeout(function () {
                    element.find('input').first().focus();
                }, 200);

                scope.$on('spinnerInactive', function () {
                    $timeout(function () {
                        element.find('input').first().focus();
                    }, 200);
                });
            }
        };
    });
})(angular.module('refresh.focusOn', ['refresh.metadata', 'refresh.parameters']));
