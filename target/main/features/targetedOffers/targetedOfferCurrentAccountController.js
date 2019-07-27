(function () {

    'use strict';
    var app = angular.module('refresh.targetedOffers.targetedOfferCurrentAccountController', [
        'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
        'refresh.targetedOffers.targetedOffersService'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/targetedoffers/current-account', {
            templateUrl: 'features/targetedOffers/partials/targetedOfferCurrentAccount.html',
            controller: 'TargetedOfferCurrentAccountController'
        });
    });

    app.controller('TargetedOfferCurrentAccountController', function ($location, Flow, CurrentAccountApplication, TargetedOffersService) {
        Flow.create(['Details', 'Offer', 'Accept', 'Finish'], 'Your Details', '/apply/current-account/profile');
        TargetedOffersService.actionOffer('Accept Offer').then(function(){
            CurrentAccountApplication.start();
            $location.url('/apply/current-account/pre-screen?intcmp=ibr-ao-currentaccount').replace();
        });
    });
})();