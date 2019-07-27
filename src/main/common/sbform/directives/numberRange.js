(function (app) {
    'use strict';

    function isEmpty(value) {
        return angular.isUndefined(value) || value === '' || value === null || value !== value;
    }

    app.directive('sbMin', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                var minValidator = function (value) {
                    var min = scope.$eval(attr.sbMin) || 0;
                    if (!isEmpty(value) && value < min) {
                        ctrl.$setValidity('sbMin', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('sbMin', true);
                        return value;
                    }
                };
                ctrl.$parsers.push(minValidator);
                ctrl.$formatters.push(minValidator);
            }
        };
    });

    app.directive('sbMax', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                var maxValidator = function (value) {
                    var max = scope.$eval(attr.sbMax) || Infinity;
                    if (!isEmpty(value) && value > max) {
                        ctrl.$setValidity('sbMax', false);
                        return value;
                    } else {
                        ctrl.$setValidity('sbMax', true);
                        return value;
                    }
                };
                ctrl.$parsers.push(maxValidator);
                ctrl.$formatters.push(maxValidator);
            }
        };
    });
})(angular.module('refresh.numberRange', []));
