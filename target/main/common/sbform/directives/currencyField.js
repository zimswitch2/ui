(function (app) {
    'use strict';

    app.directive('currencyField', function (amountKeyCodeValidator) {
        var ensureValidCurrencyAmount = function (event) {
            var currentValue = event.target.value;
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            var noDecimal = event.data;

            if (event.shiftKey || amountKeyCodeValidator.invalidKeyCode(keyCode, currentValue) || amountKeyCodeValidator.invalidPeriodKey(keyCode, noDecimal)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ngModel) {
                scope.allowBlank = elem.is('[allow-blank]');

                var allowZero = elem.is('[allow-zero]');
                var noDecimal = elem.is('[no-decimal]');
                var maxLimit = elem.attr('max-limit') || 5000000.00;
                maxLimit = parseFloat(maxLimit);

                elem.on('keydown', noDecimal, ensureValidCurrencyAmount);


                var validate = function (value) {
                    elem.controller('ngModel').$setValidity('currencyFormat', true);
                    elem.controller('ngModel').$setValidity('currencyLimit', true);

                    if (scope.allowBlank && value === '') {
                        elem.controller('ngModel').$setValidity('currencyFormat', true);
                        return '';
                    }

                    if (!(/^[0-9]*\.?[0-9]{1,2}$/.test(value))) {
                        elem.controller('ngModel').$setValidity('currencyFormat', false);
                        return 0;
                    }

                    var modelValue = parseFloat(value);

                    if (modelValue > maxLimit) {
                        elem.controller('ngModel').$setValidity('currencyLimit', false);
                        return modelValue;
                    }

                    if (!allowZero && modelValue === 0 && elem.controller('ngModel').$dirty) {
                        elem.controller('ngModel').$setValidity('currencyFormat', false);
                    } else {
                        elem.controller('ngModel').$setValidity('currencyFormat', true);
                    }
                    return modelValue;
                };
                ngModel.$parsers.unshift(validate);
            }
        };
    });
})(angular.module('refresh.currencyField', ['refresh.metadata', 'refresh.parameters']));
