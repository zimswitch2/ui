(function () {
    'use strict';

    var module = angular.module('refresh.common.hiddenFormButtonDirective', []);

    module.directive('hiddenFormButton', [function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'common/hiddenFormButton/partials/hiddenFormButton.html',
            scope: {
                actionUrl: '=',
                formItems: '=',
                submitDtmid: '@',
                submitDtmtext: '@'
            },
            link: function (scope, element, attributes) {
                scope.actionMethod = attributes['actionMethod'] || 'GET';

                if (attributes['submitDtmid']){
                    element.find('form button[type=submit]').attr('data-dtmid', scope.submitDtmid);
                }

                if (attributes['submitDtmtext']){
                    element.find('form button[type=submit]').attr('data-dtmtext', scope.submitDtmtext);
                }
            }

        };
    }]);
}());
