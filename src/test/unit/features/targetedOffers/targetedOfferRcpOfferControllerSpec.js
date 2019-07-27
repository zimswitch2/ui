describe('Targeted Offers RCP Offer Controller Unit Test', function () {
    'use strict';

    beforeEach(module('refresh.targetedOffers', 'refresh.test', 'refresh.targetedOffers.targetedOffersService'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when at targeted offers RCP location", function () {
            it("should use the correct template", function () {
                expect(route.routes['/targetedoffers/rcp'].templateUrl).toEqual('features/targetedOffers/partials/targetedOfferRcp.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/targetedoffers/rcp'].controller).toEqual('TargetedOfferRcpController');
            });
        });
    });

    describe('TargetedOfferRcpController', function () {
        var location, Flow, RcpApplication, TargetedOffersService, mock;

        beforeEach(inject(function ($rootScope, $controller, $location, _RcpApplication_, _Flow_, _TargetedOffersService_, _mock_) {
            location = $location;
            Flow = _Flow_;
            RcpApplication = _RcpApplication_;
            TargetedOffersService = _TargetedOffersService_;
            mock = _mock_;

            spyOn(TargetedOffersService, 'actionOffer').and.returnValue(mock.resolve());
            $controller('TargetedOfferRcpController');
            $rootScope.$digest();

        }));

        it('should start current account application', function () {
            expect(RcpApplication.isNew()).toBeTruthy();
        });

        it('should create the flow with the current account application steps', function () {
            expect(_.map(Flow.steps(), 'name')).toEqual(['Details', 'Offer', 'Confirm', 'Finish']);
        });

        it('should have the flow header as Your Details', function () {
            expect(Flow.get().headerName).toEqual('Your Details');
        });

        it('should go to current account pre-screen page', function () {
            expect(location.url()).toEqual('/apply/rcp/pre-screen?intcmp=ibr-ao-rcp');
        });

        it('should call action of with Accept Offer Text', function () {
            expect(TargetedOffersService.actionOffer).toHaveBeenCalledWith('Accept Offer');
        });
    });
});
