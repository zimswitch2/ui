(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.directives.acceptedOffer', ['refresh.filters']);

    app.directive('acceptedOffer',
        function () {
            return {
                restrict: 'E',
                templateUrl: 'features/accountorigination/common/directives/partials/acceptedOffer.html',
                scope: {
                    application: '='
                }
            };
        });
})();
