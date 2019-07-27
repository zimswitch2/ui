'use strict';

(function (app) {
    app.directive('printButton', function ($window) {
        return {
            restrict: 'E',
            templateUrl: 'common/print/partials/printButton.html',
            scope: {
                buttonClass: '@',
                buttonTrackClick: '@',
                buttonText: '@',
                buttonClick: '&',
                actionButton: '='
            },
            link: function (scope, element, attrs) {
                scope.print = function () {
                    if (attrs.buttonClick) {
                        scope.buttonClick();
                    } else {
                        $window.print();
                    }
                };
            }
        };
    });
}(angular.module('refresh.printButtonDirective', [])));
