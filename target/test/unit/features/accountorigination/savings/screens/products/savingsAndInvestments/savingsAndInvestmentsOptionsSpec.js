describe('Savings and Investments Options', function () {

    beforeEach(module('refresh.accountOrigination.savings.screens.products.savingsAndInvestmentsOptions'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when SavingsAndInvestments is selected', function () {
            it('should use the correct template', function () {
                expect(route.routes['/apply/savings-and-investments'].templateUrl).toEqual('features/accountorigination/savings/screens/products/savingsAndInvestments/partials/savingsAndInvestmentsOptions.html');
            });
        });
    });
});