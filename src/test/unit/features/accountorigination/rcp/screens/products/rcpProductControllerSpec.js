describe('RCP', function () {
    beforeEach(module('refresh.accountOrigination.rcp.screens.products'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when RCP is selected', function () {

            it('should use the correct template', function () {
                expect(route.routes['/apply/rcp'].templateUrl).toEqual('features/accountorigination/rcp/screens/products/partials/rcpProducts.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/rcp'].controller).toEqual('RcpProductController');
            });
        });
    });

    describe('controller', function () {
        var scope, invokeController, applicationLoader, mock;

        beforeEach(inject(function ($rootScope, $controller, _ApplicationLoader_, _mock_) {
            scope = $rootScope.$new();
            mock = _mock_;

            applicationLoader = _ApplicationLoader_;
            spyOn(applicationLoader, 'loadAll');

            invokeController = function () {
                $controller('RcpProductController', {
                    $scope: scope
                });
            };
        }));

        it("hasRcpAccount should be true when accepted", function () {
            applicationLoader.loadAll.and.returnValue(mock.resolve({rcp: {status: 'EXISTING'}}));

            invokeController();
            scope.$digest();

            expect(scope.hasRcpAccount).toBeTruthy();

            expect(scope.canApply).toBeFalsy();
        });

        it("hasRcpAccount should be false when new", function () {
            applicationLoader.loadAll.and.returnValue(mock.resolve({rcp: {status: 'NEW'}}));

            invokeController();
            scope.$digest();
            expect(scope.hasRcpAccount).toBeFalsy();
            expect(scope.canApply).toBeTruthy();
        });

        it('should not allow any other states other than new or existing', inject(function ($location) {
            applicationLoader.loadAll.and.returnValue(mock.resolve({rcp: {status: 'PENDING'}}));

            invokeController();
            scope.$digest();
            expect($location.path()).toEqual('/apply');
        }));
    });
});
