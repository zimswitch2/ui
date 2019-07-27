(function (app) {
    'use strict';

    app.directive('notificationCost', ['NotificationCostService', function (NotificationCostService) {
        return {
            link: function (scope, element, attr, ngModel) {
                ngModel.$render = function () {
                    scope.type = ngModel.$modelValue;
                    if (scope.type) {
                        scope.cost = NotificationCostService.getCost(scope.type).toFixed(2);
                    }
                };
            },
            require: 'ngModel',
            restrict: 'E',
            template: '<span id="notification-cost" ng-show="type">({{type}} fee: <span class="rand-amount">R {{cost}}</span>)</span>'
        };
    }]);
})(angular.module('refresh.notificationCost', ['refresh.notificationCostService']));
