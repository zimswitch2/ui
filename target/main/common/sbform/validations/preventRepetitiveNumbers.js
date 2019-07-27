
(function() {
    'use strict';

    var module = angular.module('refresh.input.validation.preventRepetitiveNumbers', []);

    module.directive('preventRepetitiveNumbers', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attr, ngModel) {

                if (attr.preventRepetitiveNumbers === '') {
                    return;
                }

                var maximumRepetitiveNumbers = parseInt(attr.preventRepetitiveNumbers);
                var hasRepetitiveNumbers = function(remainingNumbersString, numberOfRepetitive) {

                    if (numberOfRepetitive === maximumRepetitiveNumbers) {
                        return true;
                    }

                    if (remainingNumbersString.length === 1) {
                        return false;
                    }

                    var firstNumber = parseInt(remainingNumbersString[0]);
                    var secondNumber = parseInt(remainingNumbersString[1]);

                    if (secondNumber === firstNumber) {
                        numberOfRepetitive += 1;
                    }

                    remainingNumbersString = remainingNumbersString.slice(1, remainingNumbersString.length);
                    return hasRepetitiveNumbers(remainingNumbersString, numberOfRepetitive);
                };

                var isValid = function(numberString) {
                    return !hasRepetitiveNumbers(numberString, 1);
                };

                ngModel.$validators.preventRepetitiveNumbers = function(modelValue, viewValue) {
                    if (!viewValue) {
                        return;
                    }

                    return isValid(viewValue.toString());
                };
            }
        };
    });
}());
