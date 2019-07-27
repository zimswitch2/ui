(function (app) {
    'use strict';

    app.factory('amountKeyCodeValidator', function () {
        var validActionKeys = {
            backspace: 8,
            tab: 9,
            enter: 13,
            delete: 46,
            leftArrow: 37,
            rightArrow: 39,
            end: 35,
            home: 36
        };

        var periodKeys = {
            period: 190,
            numPadPeriod: 110
        };

        var isSecondPeriod = function (keyCode, existingValue) {
            if (keyCode === periodKeys.period || keyCode === periodKeys.numPadPeriod) {
                if (existingValue.indexOf('.') >= 0) {
                    return true;
                }
            }
        };

        var validAction = function (keyCode) {
            if (_.contains(_.values(validActionKeys), keyCode)) {
                return true;
            }
        };

        var isPeriod = function (keyCode) {
            if (_.contains(_.values(periodKeys), keyCode)) {
                return true;
            }
        };

        var isDigit = function (keyCode) {
            var zero = 48;
            var nine = 57;
            var numPadZero = 96;
            var numPadNine = 105;
            if ((keyCode >= zero && keyCode <= nine) || (keyCode >= numPadZero && keyCode <= numPadNine)) {
                return true;
            }
        };

        var validKeyCode = function (keyCode, existingValue) {
            if (isSecondPeriod(keyCode, existingValue)) {
                return false;
            }

            if (validAction(keyCode)) {
                return true;
            }

            if (isPeriod(keyCode)) {
                return true;
            }

            return isDigit(keyCode);
        };

        var periodNotAllowed = function (keyCode, noDecimal) {
            return isPeriod(keyCode) && noDecimal;
        };

        return {
            invalidKeyCode: function (keyCode, existingValue) {
                return !validKeyCode(keyCode, existingValue);
            },
            invalidPeriodKey: function (keyCode, noDecimal) {
                return periodNotAllowed(keyCode, noDecimal);
            }
        };
    });
})(angular.module('refresh.amountKeyCodeValidator', ['refresh.metadata', 'refresh.parameters']));
