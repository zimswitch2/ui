describe('TaxFreeCallAccount', function () {
    beforeEach(module('refresh.accountOrigination.savings.screens.taxFreeCallAccount'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when TaxFreeCallAccount is selected', function () {

            it('should use the correct template', function () {
                expect(route.routes['/apply/tax-free-call-account'].templateUrl).toEqual('features/accountorigination/savings/screens/products/taxFreeCallAccount/partials/taxFreeCallAccountDetails.html');
            });

        });
    });
});
