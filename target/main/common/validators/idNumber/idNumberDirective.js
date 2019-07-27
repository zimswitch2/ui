(function () {
    'use strict';

    angular
        .module('refresh.validators.idNumber')
        .directive('idNumber', function (IdNumber) {
            var directive = {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, el, attr, ctrl) {
                    var validator = function (modelValue, viewValue) {
                        if (ctrl.$isEmpty(viewValue)) {
                            return true;
                        }

                        return IdNumber.hasValidBirthDate(viewValue) &&
                               IdNumber.hasValid11thDigit(viewValue) &&
                               IdNumber.hasValidCheckDigit(viewValue);
                    };

                    ctrl.$validators.idNumber = validator;
                }
            };

            return directive;
        });
})();
