(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.services.accountOriginationProvider', [
        'refresh.accountOrigination.rcp.domain.rcpApplication',
        'refresh.accountOrigination.rcp.services.OfferService',
        'refresh.accountOrigination.currentAccount.domain.currentAccountApplication',
        'refresh.accountOrigination.currentAccount.services.currentAccountOffersService',
        'refresh.accountOrigination.savings.domain.savingsAccountApplication',
        'refresh.accountOrigination.savings.services.savingsAccountOffersService',
        'refresh.accountOrigination.savings.services.savingsApplicationStartService'

    ]);

    app.factory('AccountOriginationProvider', function (RcpApplication, RcpOfferService,
                                                        CurrentAccountApplication, CurrentAccountOffersService,
                                                        SavingsAccountApplication, SavingsAccountOffersService, $location, SavingsApplicationStartService) {

        var rcp = {
            application: RcpApplication,
            service: RcpOfferService,
            paths: {offer: '/apply/rcp/offer'},
            buttonText: {offer: 'Get offer', apply: 'Apply now'},
            flowSteps: ['Details', 'Offer', 'Confirm', 'Finish'],
            continueToApplication: function(){
                $location.path('/apply/rcp/pre-screen');
            }

        };
        var currentAccount = {
            application: CurrentAccountApplication,
            service: CurrentAccountOffersService,
            paths: {offer: '/apply/current-account/offer'},
            buttonText: {offer: 'Get offer', apply: 'Apply now'},
            flowSteps: ['Details', 'Offer', 'Accept', 'Finish'],
            continueToApplication: function(){
                $location.path('/apply/current-account/pre-screen');
            }

        };
        var pureSave = {
            application: SavingsAccountApplication,
            service: SavingsAccountOffersService,
            paths: {offer: '/apply/pure-save/transfer'},
            buttonText: {offer: 'Submit', apply: 'Next'},
            flowSteps: ['Info', 'Transfer', 'Accept', 'Finish'],
            continueToApplication: function(){
                SavingsApplicationStartService.start('pure-save');
            }
        };
        var marketLink = {
            application: SavingsAccountApplication,
            service: SavingsAccountOffersService,
            paths: {offer: '/apply/market-link/transfer'},
            buttonText: {offer: 'Submit', apply: 'Next'},
            flowSteps: ['Info', 'Transfer', 'Accept', 'Finish'],
            continueToApplication: function(){
                SavingsApplicationStartService.start('market-link');
            }
        };
        var taxFreeCallAccount = {
            application: SavingsAccountApplication,
            service: SavingsAccountOffersService,
            paths: {offer: '/apply/tax-free-call-account/transfer'},
            buttonText: {offer: 'Submit', apply: 'Next'},
            flowSteps: ['Info', 'Transfer', 'Accept', 'Finish'],
            continueToApplication: function(){
                SavingsApplicationStartService.start('tax-free-call-account');
            }
        };


        return {
            for: function (productType) {
                var productTypes = {'rcp': rcp, 'current-account': currentAccount, 'pure-save': pureSave, 'market-link': marketLink, 'tax-free-call-account': taxFreeCallAccount};
                return productTypes[productType];
            }
        };
    });
})();