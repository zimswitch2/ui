
(function() {
    'use strict';

    var module = angular.module('refresh.input.validation.preventConsecutiveNumbers', []);

    module.directive('preventConsecutiveNumbers', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attr, ngModel) {

                if (attr.preventConsecutiveNumbers === '') {
                    return;
                }

                var maximumConsecutiveNumbers = parseInt(attr.preventConsecutiveNumbers);

                var hasThreeConsecutiveNumbers = function(remainingNumbersString, numberOfConsecutive, isAscending) {

                    if (numberOfConsecutive === maximumConsecutiveNumbers) {
                        return true;
                    }

                    if (remainingNumbersString.length === 1) {
                        return false;
                    }

                    var firstNumber = parseInt(remainingNumbersString[0]);
                    var secondNumber = parseInt(remainingNumbersString[1]);

                    if ((isAscending && secondNumber === (firstNumber + 1)) || (!isAscending && secondNumber === (firstNumber - 1))) {
                        numberOfConsecutive += 1;
                    }

                    remainingNumbersString = remainingNumbersString.slice(1, remainingNumbersString.length);
                    return hasThreeConsecutiveNumbers(remainingNumbersString, numberOfConsecutive, isAscending);
                };

                var isValid = function(numberString) {
                    var hasThreeConsecutiveAscendingNumbers = hasThreeConsecutiveNumbers(numberString, 1, true);
                    var hasThreeConsecutiveDescendingNumbers = hasThreeConsecutiveNumbers(numberString, 1, false);
                    return !hasThreeConsecutiveAscendingNumbers && !hasThreeConsecutiveDescendingNumbers;
                };

                ngModel.$validators.preventConsecutiveNumbers = function(modelValue, viewValue) {
                    if (!viewValue) {
                        return;
                    }

                    return isValid(viewValue.toString());
                };
            }
        };
    });
}());
