(function () {
    'use strict';

    var module = angular.module('refresh.inputLeadingIcon', []);
    module.directive('inputLeadingIcon', function () {
        return {
            link: function (scope, element, attr) {
                if (attr.inputLeadingIcon === '') {
                    return;
                }
                var inputElement = element.parent().find('input');
                if (inputElement.length !== 1) {
                    throw new Error('None or more than one input were found');
                }

                inputElement.before('<span class="icon input-leading-icon ' + attr.inputLeadingIcon + '"></span>');
            },
            require: ['^form'],
            restrict: 'A'
        };

    });
})();
