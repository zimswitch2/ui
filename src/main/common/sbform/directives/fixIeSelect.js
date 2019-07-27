(function (app) {
    'use strict';

    app.directive('fixIeSelect', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element) {
                fixIe(scope, element, $timeout);
            },
            restrict: 'A'
        };
    }]);

    var fixIeIssues = function (element) {
        // fix: IE9 do not remove the empty option on selecting an option
        element.hide();
        element.show();

        // fix: IE9 only shows first char of selected option
        var style = element[0].runtimeStyle;
        if (style) {
            style.zoom = style.zoom; // do not apply on NOT IE
        }
    };

    var fixIe = function (scope, element, timeout) {
        element.bind('change', function (event) {
            fixIeIssues($(event.target));
        });

        timeout(function () {
            fixIeIssues(element);
        });
    };
})(angular.module('refresh.fixIeSelect', []));
