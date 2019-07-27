(function (app) {

    'use strict';

    app.directive('productTile', function() {
        return {
            restrict: 'E',
            templateUrl: 'features/accountorigination/common/directives/partials/productTile.html',
            scope: {
                productTitle: '@',
                productDescription: '@',
                productImageUrl: '@',
                productType: '@',
                detailsPageUrl: '@',
                accountNumberLabel: '@',
                application: '=',
                continueApplication: '&'
            }
        };
    });

})(angular.module('refresh.accountOrigination.common.directives.productTile', []));
