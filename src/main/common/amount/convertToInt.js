(function (app) {
    'use strict';

    app.directive('convertToInt', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.unshift(function (input) {
                    if (!/^[0-9]*\.?[0-9]{1,2}$/.test(input)) {
                        return undefined;
                    }
                    return parseInt(input);
                });
            }
        };
    });
})(angular.module('refresh.directives.converttoint', []));
