(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.directives.pendingOffer', ['refresh.filters']);

    app.directive('pendingOffer',
        function () {
            return {
                restrict: 'E',
                templateUrl: 'features/accountorigination/common/directives/partials/pendingOffer.html',
                scope: {
                    application: '=',
                    viewOffer: '&',
                    completeTracking: '@'
                }
            };
        });
})();
