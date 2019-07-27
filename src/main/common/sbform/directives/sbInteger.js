(function (app) {
    'use strict';

    function isEmpty(value) {
        return angular.isUndefined(value) || value === '' || value === null || value !== value;
    }

    var INTEGER_REGEXP = /^\d+$/;
    app.directive('sbInteger', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var integerValidator = function (viewValue) {
                    if (isEmpty(viewValue) || INTEGER_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('sbInteger', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('sbInteger', false);
                        return undefined;
                    }
                };

                ctrl.$parsers.push(integerValidator);
                ctrl.$formatters.push(integerValidator);
            }
        };
    });
})(angular.module('refresh.sbInteger', []));
