(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.common.directives.applyForAccount',
        ['refresh.accountOrigination.common.services.accountOriginationProvider', 'refresh.flow']);

    app.directive('applyForAccount', function ($location, AccountOriginationProvider, Flow) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'features/accountorigination/common/directives/partials/applyForAccount.html',
            scope: {
                productType: '@',
                isDisabled: '='
            },
            link: function (scope) {

                var provider = AccountOriginationProvider.for(scope.productType);
                scope.buttonText = provider.buttonText.apply;

                scope.applyForAccount = function () {
                    Flow.create(provider.flowSteps, 'Your Details');
                    provider.application.start(scope.productType);
                    provider.continueToApplication();
                };
            }
        };
    });
})();
