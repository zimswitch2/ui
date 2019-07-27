var rcp = false;
{
    rcp = true;
}

(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.screens.availableProducts',
        ['ngRoute',
            'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
            'refresh.accountOrigination.rcp.domain.rcpApplication',
            'refresh.accountOrigination.common.services.applicationLoader',
            'refresh.accountOrigination.currentAccount.services.currentAccountOffersService']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/apply', {
                templateUrl: 'features/accountorigination/common/screens/availableproducts/partials/availableProducts.html',
                controller: 'AvailableProductsController'
            });
    });

    app.controller('AvailableProductsController',
        function ($scope, $location, $filter, RcpApplication, CurrentAccountApplication, ApplicationLoader, QuotationsService,
                  NotificationService, CurrentAccountOffersService, Flow, Card) {

            $scope.showSavingsAndInvestmentOptions = !_.isEmpty(Card.current().number);

            ApplicationLoader.loadAll().then(function (application) {
                $scope.applications = application;
                $scope.currentAccountTitle = $scope.applications.current.status === 'NEW' || $scope.applications.current.status === 'PENDING' ? 'Current account' : $filter('currentAccountProductName')( $scope.applications.current.productName);
            }).catch(function (response) {
                NotificationService.displayGenericServiceError(response);
            });

            $scope.rcpViewOffer = function () {
                QuotationsService.getRCPQuotationDetails($scope.applications.rcp.reference).then(function (offer) {
                    Flow.create(['Details', 'Offer', 'Confirm', 'Finish']);
                    Flow.next();
                    RcpApplication.continue(offer);
                    $location.url('/apply/rcp/offer');
                });
            };

            $scope.continueCurrentAccount = function () {
                CurrentAccountOffersService.getQuotationDetails($scope.applications.current.reference).then(function (offer) {
                    CurrentAccountApplication.continue({
                        applicationNumber: $scope.applications.current.reference,
                        offer: offer
                    });
                    Flow.create(['Details', 'Offer', 'Confirm', 'Finish']);
                    Flow.next();
                    $location.url('/apply/current-account/pre-screen');
                });
            };
        });
})();