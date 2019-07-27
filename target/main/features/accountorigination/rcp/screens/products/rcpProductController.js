(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.rcp.screens.products',
        [
            'ngRoute',
            'refresh.flow',
            'refresh.accountOrigination.rcp.services.OfferService',
            'refresh.accountOrigination.common.services.applicationLoader',
            'refresh.notifications.service'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/apply/rcp', {
            templateUrl: 'features/accountorigination/rcp/screens/products/partials/rcpProducts.html',
            controller: 'RcpProductController'
        });
    });

    app.controller('RcpProductController', function ($scope, $location, ApplicationLoader) {
        ApplicationLoader.loadAll().then(function (application) {

            var allowedStates = ['NEW', 'EXISTING'];

            if (_.includes(allowedStates, application.rcp.status)) {
                $scope.hasRcpAccount = application.rcp.status === 'EXISTING';
                $scope.canApply = application.rcp.status === 'NEW';
            } else {
                $location.path('/apply');
            }
        });
    });
})();