(function () {
    'use strict';

    var app = angular.module('refresh.common.backDirective', []);

    app.directive('goBack', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                element.bind('click', function () {
                    var count = attributes.numberOfPages || 1;
                    $window.history.go(count * -1);
                });
            }
        };
    });
})();