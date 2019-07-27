(function (app) {

    'use strict';

    app.directive('savingsProductTile', function() {
        return {
            restrict: 'E',
            templateUrl: 'features/accountorigination/savings/directives/partials/savingsProductTile.html',
            scope: {
                productTitle: '@',
                productDescription: '@',
                productImageUrl: '@',
                productType: '@',
                detailsPageUrl: '@'
            }
        };
    });

})(angular.module('refresh.accountOrigination.savings.directives.savingsProductTile', []));
