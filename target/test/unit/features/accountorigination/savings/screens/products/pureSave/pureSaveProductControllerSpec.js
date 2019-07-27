describe('PureSave', function () {
    beforeEach(module('refresh.accountOrigination.savings.screens.pureSave'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when PureSave is selected', function () {

            it('should use the correct template', function () {
                expect(route.routes['/apply/pure-save'].templateUrl).toEqual('features/accountorigination/savings/screens/products/pureSave/partials/pureSaveDetails.html');
            });

        });
    });
});
