(function (app) {
    'use strict';

    app.directive('dailyPaymentLimits', function () {
        return {
            restrict: 'E',
            templateUrl: 'features/instantMoney/dailyPaymentLimits/partials/dailyPaymentLimits.html',
            scope:{
            	limit:"="
            }
        };
    });
})(angular.module('refresh.dailyPaymentLimits.directives', ['refresh.instantMoneyDetailsController']));
