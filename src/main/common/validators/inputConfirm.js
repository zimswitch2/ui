(function () {
    'use strict';

    angular.module('refresh.validators.inputConfirm', [])
        .directive('inputConfirm', function (IdNumber) {
            var directive = {
                restrict: 'A',
                require: ['^form','ngModel'],
                link: function (scope, el, attr, ctrl) {
                    var ngForm = ctrl[0];
                    var ngModel = ctrl[1];

                    var validator = function (modelValue, viewValue) {
                        if (ngModel.$isEmpty(modelValue)) {
                            return true;
                        }

                        if (!scope.confirmInputName) {
                            return true;
                        }

                        var matchValue = ngForm[scope.confirmInputName].$modelValue;
                        return (matchValue === viewValue);
                    };

                    ngModel.$validators.inputConfirm = validator;
                }
            };

            return directive;
        });
})();
