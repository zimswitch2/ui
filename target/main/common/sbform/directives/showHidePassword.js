(function () {
    'use strict';

    var module = angular.module('refresh.showHidePassword', []);
    module.directive('showHidePassword', ['$compile', function ($compile) {
        var hide = {
            label: 'Show',
            type: 'password',
            next: undefined
        };
        var show = {
            label: 'Hide',
            type: 'text',
            next: hide
        };
        hide.next = show;
        var templateString = '<span class="showOrHideLabel" ng-click="switchMode()">{{mode.label}}</span>';

        return {
            link: function (scope, element, attr) {
                if (attr.showHidePassword !== 'true') {
                    return;
                }

                var pswElement = element.parent().find('input');
                if (pswElement.length !== 1) {
                    throw new Error('None or more than one input were found');
                }

                pswElement.after($compile(templateString)(scope));
                scope.switchMode = function () {
                    scope.mode = scope.mode.next;
                    pswElement.prop('type', scope.mode.type);
                    pswElement.focus();
                };

                scope.mode = hide;
            },
            require: ['^form'],
            restrict: 'A'
        };

    }]);

})();
