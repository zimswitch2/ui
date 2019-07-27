describe('Targeted Offers Current Account Offer Controller Unit Test', function () {
    'use strict';

    beforeEach(module('refresh.targetedOffers', 'refresh.test', 'refresh.targetedOffers.targetedOffersService'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when at targeted offers current account location", function () {
            it("should use the correct template", function () {
                expect(route.routes['/targetedoffers/current-account'].templateUrl).toEqual('features/targetedOffers/partials/targetedOfferCurrentAccount.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/targetedoffers/current-account'].controller).toEqual('TargetedOfferCurrentAccountController');
            });
        });
    });

    describe('TargetedOfferCurrentAccountController', function () {
        var location, Flow, CurrentAccountApplication, TargetedOffersService, mock;

        beforeEach(inject(function ($rootScope, $controller, $location, _Flow_, _CurrentAccountApplication_, _TargetedOffersService_, _mock_) {
            location = $location;
            Flow = _Flow_;
            CurrentAccountApplication = _CurrentAccountApplication_;
            TargetedOffersService = _TargetedOffersService_;
            mock = _mock_;
            spyOn(TargetedOffersService, 'actionOffer').and.returnValue(mock.resolve());
            $controller('TargetedOfferCurrentAccountController');
            $rootScope.$digest();
        }));

        it('should start current account application', function () {
            expect(CurrentAccountApplication.isNew()).toBeTruthy();
        });

        it('should create the flow with the current account application steps', function () {
            expect(_.map(Flow.steps(), 'name')).toEqual(['Details', 'Offer', 'Accept', 'Finish']);
        });

        it('should have the flow header as Your Details', function () {
            expect(Flow.get().headerName).toEqual('Your Details');
        });

        it('should go to current account pre-screen page', function () {
            expect(location.url()).toEqual('/apply/current-account/pre-screen?intcmp=ibr-ao-currentaccount');
        });

        it('should call action of with Accept Offer Text', function () {
            expect(TargetedOffersService.actionOffer).toHaveBeenCalledWith('Accept Offer');
        });
    });
});
