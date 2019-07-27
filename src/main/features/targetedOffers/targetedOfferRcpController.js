(function () {
    'use strict';

    var app = angular.module('refresh.targetedOffers.targetedOfferRcpController', [
        'refresh.accountOrigination.rcp.domain.rcpApplication',
        'refresh.targetedOffers.targetedOffersService'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/targetedoffers/rcp', {
            templateUrl: 'features/targetedOffers/partials/targetedOfferRcp.html',
            controller: 'TargetedOfferRcpController'
        });
    });

    app.controller('TargetedOfferRcpController', function ($location, Flow, RcpApplication, TargetedOffersService) {
        Flow.create(['Details', 'Offer', 'Confirm', 'Finish'], 'Your Details');
        TargetedOffersService.actionOffer('Accept Offer').then(function(){
            RcpApplication.start();
            $location.url('/apply/rcp/pre-screen?intcmp=ibr-ao-rcp').replace();
        });

    });
})();