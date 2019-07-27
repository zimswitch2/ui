describe("RechargeResultsController", function () {

    beforeEach(module('refresh.prepaid.recharge.controllers.results'));

    var rechargeResult, viewModel, scope, location;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        viewModel = jasmine.createSpyObj('ViewModel', ['current']);
        rechargeResult = {recharge: 1, result: {voucherNumber: '1234'}};
        viewModel.current.and.returnValue(_.cloneDeep(rechargeResult));
        location = jasmine.createSpyObj('location', ['path']);

        $controller('RechargeResultsController', {
            $scope: scope,
            ViewModel: viewModel,
            $location: location,
            $routeParams: {providerId: 'someProvider'}
        });
    }));

    it('should display recharge operation result', function () {
        expect(scope.recharge).toEqual(rechargeResult);
    });

    it('should be successful', function () {
        expect(scope.isSuccessful).toBeTruthy();
    });

    describe('when asking to make another recharge', function () {
        it('should redirect you to the recharge page with the same provider', function () {
            scope.makeAnotherRecharge();
            expect(location.path).toHaveBeenCalledWith('/prepaid/recharge/someProvider');
        });
    });
});
