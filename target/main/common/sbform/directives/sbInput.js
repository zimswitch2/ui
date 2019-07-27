(function () {
    'use strict';
    var module = angular.module('refresh.sbInput',
        [
            'ngMessages',
            'refresh.inputValidationController',
            'refresh.showHidePassword',
            'refresh.input.validation.preventConsecutiveNumbers',
            'refresh.input.validation.preventRepetitiveNumbers',
            'refresh.validators.idNumber',
            'refresh.validators.inputConfirm'
        ]);

    module.directive('sbInput', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        var link = function (scope, element, attributes, ctrls) {
            var ngForm = ctrls[0];
            var ngModel = ctrls[1];
            var isTextarea = scope.type && scope.type === 'textarea';
            scope.form = ngForm;
            scope.id = scope.inputId || scope.name;
            scope.tag = isTextarea ? 'textarea' : 'input';
            scope.showPasswordButton = _.has(attributes, 'showPasswordButton') &&
                $rootScope.isMobileDevice;

            scope.iconClassName = attributes.iconClassName;

            ngModel.$render = function () {
                scope.model = {value: ngModel.$modelValue};
            };

            scope.modelChanged = function () {
                ngModel.$setViewValue(scope.model.value);
            };

            scope.$watch('ngDisabled', function () {
                element.find(scope.tag).prop('disabled', scope.ngDisabled);
            });

            scope.calcLeftCharCount = function () {
                scope.leftChars = -1;
                if (scope.ngMaxlength && scope.model.value) {
                    scope.leftChars = scope.ngMaxlength - scope.model.value.length;
                }
            };

            if (isTextarea) {
                ngModel.$viewChangeListeners.push(scope.calcLeftCharCount);
            }

            $timeout(function () {
                registerHasVisitedWatcher(scope, element, scope.tag);
            });
        };
        return {
            compile: function (element, attr) {
                if (attr.hasOwnProperty('idNumber')) {
                    element.find('input').attr('id-number', ' ');
                }
                return link;
            },
            controller: 'inputValidation',
            require: ['^form', 'ngModel'],
            restrict: 'E',
            transclude: true,
            scope: {
                ngRequired: '=',
                requiredMessage: '@',
                ngMaxlength: '=',
                ngMinlength: '=',
                ngDisabled: '=',
                description: '@',
                ngPattern: '@',
                ngFocus: '&',
                ngBlur: '&',
                confirmInputName: '@',
                exactLength: '@',
                placeholder: '@',
                name: '@',
                label: '@',
                tooltip: '@',
                inputId: '@',
                type: '@',
                confirmationMessage: '@',
                patternMessage: '@',
                minLengthMessage: '@',
                maxLengthMessage: '@',
                preventConsecutiveNumbers: '@',
                preventConsecutiveNumbersMessage: '@',
                preventRepetitiveNumbers: '@',
                preventRepetitiveNumbersMessage: '@',
                validateOnLoad: '@'
            },
            templateUrl: 'common/sbform/partials/sbTextInput.html'
        };
    }]);

    var registerHasVisitedWatcher = function (scope, element, inputType) {
        var input = element.find(inputType);

        if (scope.validateOnLoad) {
            $(input).addClass('has-been-visited');
        }

        input.bind('blur', function (event) {
            $(event.target).addClass('has-been-visited');
            scope.$apply();
        });
    };
})();
