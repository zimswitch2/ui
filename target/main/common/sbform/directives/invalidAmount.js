(function (app) {
    'use strict';

    app.directive('invalidAmount', function () {
        var setInvalidBalance = function (floatValue, allowedBalance, controller) {
            controller.$setValidity('invalidBalance', (floatValue <= allowedBalance));
        };

        var setInvalidMonthlyTransfer = function (floatValue, allowedMonthlyTransfer, controller) {
            controller.$setValidity('invalidMonthlyTransfer', (floatValue <= allowedMonthlyTransfer));
        };

        function resetValidations(controller) {
            controller.$setValidity('invalidBalance', true);
            controller.$setValidity('invalidMonthlyTransfer', true);
        }

        return {
            require: 'ngModel',
            scope: {
                invalidAmount: '=',
                availableBalance: '=',
                monthlyLimit: '='
            },
            link: function (scope, element, attrs, controller) {
                function applyValidations() {
                    var shouldApply = element.scope('ngModel').$eval(attrs.invalidAmount);
                    return shouldApply === undefined ? true : shouldApply;
                }

                var validate = function (value) {
                    if (!applyValidations()) {
                        resetValidations(controller);
                    } else if (value) {
                        var allowedBalance = parseFloat(scope.availableBalance);
                        var floatValue = parseFloat(value);
                        var allowedMonthlyTransfer = parseFloat(scope.monthlyLimit);
                        var defaultValue = 0;

                        if (allowedBalance <= allowedMonthlyTransfer) {
                            setInvalidBalance(floatValue, allowedBalance, controller);
                            setInvalidMonthlyTransfer(defaultValue, defaultValue, controller);
                        } else {
                            setInvalidMonthlyTransfer(floatValue, allowedMonthlyTransfer, controller);
                            setInvalidBalance(defaultValue, defaultValue, controller);
                        }
                    }
                    return value;
                };

                _.each(['invalidAmount', 'availableBalance', 'monthlyLimit'], function (field) {
                    scope.$watch(field, function () {
                        validate(controller.$viewValue);
                    });
                });

                controller.$parsers.unshift(validate);
            }
        };
    });
})(angular.module('refresh.invalidAmount', ['refresh.metadata', 'refresh.parameters']));