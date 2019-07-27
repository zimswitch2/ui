(function (app) {
    'use strict';

    app.directive('paymentReferenceValidation', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.paymentReference = function (modelValue, viewValue) {
                    return !viewValue || !!viewValue.match(/^[A-Za-z0-9:;\/ \\,\-\(\)\.&@\*#\?'"]*$/);
                };
            }
        };
    });
})(angular.module('refresh.paymentReferenceValidation', []));
