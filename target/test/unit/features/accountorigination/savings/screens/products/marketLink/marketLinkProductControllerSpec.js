describe('MarketLink', function () {
    beforeEach(module('refresh.accountOrigination.savings.screens.marketLink'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when MarketLink is selected', function () {

            it('should use the correct template', function () {
                expect(route.routes['/apply/market-link'].templateUrl).toEqual('features/accountorigination/savings/screens/products/marketLink/partials/marketLinkDetails.html');
            });

        });
    });
});
