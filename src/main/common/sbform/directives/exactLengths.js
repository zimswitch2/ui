(function (app) {
    'use strict';
    app.directive('exactLengths', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                var exactlengths = [0];
                attr.$observe('exactLengths', function(value) {
                    var exactLengthsStringArray = value.split(',');
                    exactlengths = [];
                    _.each(exactLengthsStringArray, function (exactLengthString) {
                        var exactLengthInt = parseInt(exactLengthString);

                        if (exactLengthInt) {
                            exactlengths.push(parseInt(exactLengthInt));
                        }
                    });
                    ctrl.$validate();
                });
                ctrl.$validators.exactLengths = function(modelValue, viewValue) {
                    if (!exactlengths || exactlengths && !exactlengths.length){
                        return true;
                    }

                    return !!viewValue && _.include(exactlengths, viewValue.length);
                };
            }
        };
    });
})(angular.module('refresh.exactLengths', []));
