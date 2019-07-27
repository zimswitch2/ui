describe('Recharge Dashboard Controller', function () {

    beforeEach(module('refresh.prepaid.recharge.controllers.dashboard'));

    var mock, prepaidProviders, scope;
    beforeEach(inject(function ($controller, $rootScope, _mock_) {
        mock = _mock_;
        scope = $rootScope.$new();
        var rechargeServiceSpy = jasmine.createSpyObj('RechargeService', ['listProviders']);
        prepaidProviders = {};
        rechargeServiceSpy.listProviders.and.returnValue(mock.resolve(prepaidProviders));
        $controller('RechargeDashboardController', {
            $scope: scope,
            RechargeService: rechargeServiceSpy
        });
    }));

    it('should get the list of providers from the RechargeService', function () {
        scope.$digest();
        expect(scope.providers).toBe(prepaidProviders);
    });
});
