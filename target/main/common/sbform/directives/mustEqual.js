(function (app) {
    'use strict';
    app.directive('mustEqual', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var mustEqualInput = elem.inheritedData("$formController")[attrs.mustEqual];
                ctrl.$validators.mustEqual = function(value) {
                    return (value === mustEqualInput.$viewValue);
                };
                mustEqualInput.$parsers.push(function (value) {
                    ctrl.$setValidity('mustEqual', value === ctrl.$viewValue);
                    return value;
                });
            }
        };
    });
})(angular.module('refresh.mustEqual', []));
