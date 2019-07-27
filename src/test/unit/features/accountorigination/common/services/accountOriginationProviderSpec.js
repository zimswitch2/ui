describe('AccountOriginationProvider', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.common.services.accountOriginationProvider'));

    var SavingsApplicationStartService, mock;

    beforeEach(inject(function(_SavingsApplicationStartService_, _mock_, $location){
        SavingsApplicationStartService = _SavingsApplicationStartService_;

        spyOn(SavingsApplicationStartService, 'start').and.returnValue(
            $location.path('/apply/savings/transfer')
        );
        mock = _mock_;
    }));

    using([
        { key: 'current-account', offerPath: '/apply/current-account/offer', offerText: 'Get offer', applyText: 'Apply now', continueApplicationUrl:  '/apply/current-account/pre-screen' },
        { key: 'rcp', offerPath: '/apply/rcp/offer', offerText: 'Get offer', applyText: 'Apply now', continueApplicationUrl: '/apply/rcp/pre-screen'},
        { key: 'pure-save', offerPath: '/apply/pure-save/transfer', offerText: 'Submit', applyText: 'Next', continueApplicationUrl: '/apply/savings/transfer'},
        { key: 'market-link', offerPath: '/apply/market-link/transfer', offerText: 'Submit', applyText: 'Next',  continueApplicationUrl: '/apply/savings/transfer'},
        { key: 'tax-free-call-account', offerPath: '/apply/tax-free-call-account/transfer', offerText: 'Submit', applyText: 'Next', continueApplicationUrl: '/apply/savings/transfer'  }
    ], function (product) {
        describe('offer provider for ' + product.key, function () {
            var provider;

            beforeEach(inject(function (AccountOriginationProvider) {
                provider = AccountOriginationProvider.for(product.key);

            }));

            it('should have service with getOffers', function () {
                expect(provider.service.getOffers).toBeAFunction();
            });

            it('should have a function called continueToApplication', function () {
                expect(provider.continueToApplication).toBeAFunction();
            });

            it('should direct to correct location', inject(function($location){
                provider.continueToApplication();
                expect($location.path()).toBe(product.continueApplicationUrl);
            }));

            describe('application', function () {
                it('should have isNew function', function () {
                    expect(provider.application.isNew).toBeAFunction();
                });

                it('should have offer function', function () {
                    expect(provider.application.offer).toBeAFunction();
                });

                it('should have decline function', function () {
                    expect(provider.application.decline).toBeAFunction();
                });

                it('should have a start function', function (){
                    expect(provider.application.start).toBeAFunction();
                });
            });

            it('should have paths.offer', function () {
                expect(provider.paths.offer).toEqual(product.offerPath);
            });

            it('should have offerText', function () {
                expect(provider.buttonText.offer).toEqual(product.offerText);
            });

            it('should have applyText', function () {
                expect(provider.buttonText.apply).toEqual(product.applyText);
            });
        });
    });
});