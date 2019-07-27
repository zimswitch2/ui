(function (app) {
    'use strict';
    app.directive('limits', function () {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                enforcer: '=',
                hinter: '=',
                hintWatcher: '='
            },
            link: function (scope, element, attrs, controller) {
                var clear = function () {
                    element.parent().find('span.form-error').remove();
                    element.parent().find('div.text-notification.warning').remove();
                };

                var hint = function () {
                    if (scope.hinter) {
                        element.parent().find('div.text-notification').remove();
                        var infoMessage = scope.hinter();
                        if (infoMessage) {
                            element.parent().append('<div class="text-notification">' + infoMessage + '</div>');
                        }
                    }
                };

                var validate = function (value) {
                    controller.$setValidity('limits', true);
                    controller.$setValidity('required', true);
                    controller.$pristine = true;
                    controller.$dirty = false;
                    element.addClass('ng-pristine');
                    clear();

                    var message = scope.enforcer(value);

                    var customValidationToken = element.attr('input-name');

                    if (customValidationToken) {
                        controller.$setValidity(customValidationToken, !(message.message && message.error));
                    }

                    if (message.message) {
                        if (message.error) {
                            controller.$pristine = true;
                            controller.$dirty = false;
                            element.addClass('ng-dirty');

                            controller.$setValidity('limits', false);
                            controller.$setValidity('required', false);
                            element.parent().append('<span class="small form-error">' + message.message + '</span>');
                        } else {
                            element.parent().append('<div class="text-notification warning">' + message.message + '</div>');
                        }
                    }
                };

                var validateThenUpdate = function () {
                    if ((controller.$viewValue !== undefined || controller.$modelValue !== undefined) && controller.$modelValue === controller.$modelValue) {
                        validate(controller.$viewValue);
                    }
                    if (controller.$viewValue === undefined && controller.$modelValue === undefined) {
                        clear();
                    }
                    hint();
                };
                var watchHint = function (watchExpression) {
                    scope.hintWatcher().scope.$watch(watchExpression, validateThenUpdate);
                };

                if (scope.hintWatcher) {
                    angular.forEach(scope.hintWatcher().elements, watchHint);
                } else {
                    scope.$watch(validateThenUpdate);
                }
            }
        };
    });
})(angular.module('refresh.validators.limits', []));
