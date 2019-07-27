(function (app) {
    'use strict';

    app.directive('monthlyPaymentLimits', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/monthlyPaymentLimits/partials/monthlyPaymentLimits.html',
            controller: 'MonthlyPaymentLimitsController'
        };
    });
})(angular.module('refresh.monthlyPaymentLimits.directives', ['refresh.monthlyPaymentLimits']));
