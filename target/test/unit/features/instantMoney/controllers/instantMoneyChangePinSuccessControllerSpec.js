describe('Unit Test - Change Instant Money Voucher Pin Success', function () {
    'use strict';

    beforeEach(module('refresh.instantMoneyChangePinSuccessController'));

    describe('routes', function() {
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        it('should have the controller set to InstantMoneyChangePinSuccessController', function() {
            expect(route.routes['/instant-money/change-pin/success'].controller).toEqual('InstantMoneyChangePinSuccessController');
        });

        it('should have the template set to the instant money change pin success template', function() {
            expect(route.routes['/instant-money/change-pin/success'].templateUrl).toEqual('features/instantMoney/partials/instantMoneyChangePinSuccess.html');
        });
    });

    var expectedVoucher = {
        cellNumber: '0111',
        voucherPin: '0111',
        voucherNumber: '12345',
        availableBalance:'8756.41'
    };

    var controller, scope, viewModel, location, path;

    function initializeController() {
        controller('InstantMoneyChangePinSuccessController', {
            $scope: scope,
            ViewModel: viewModel,
            $location: location
        });
    }

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller;
        viewModel = jasmine.createSpyObj('viewModel', ['current']);
        viewModel.current.and.returnValue(expectedVoucher);

        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);
    }));

    describe('on initialize', function () {
        beforeEach(function () {
            initializeController();
        });
        it('should have called viewModel', function () {
            expect(viewModel.current).toHaveBeenCalled();
        });

        it('should set the scope vouchers', function () {
            expect(scope.voucher).toEqual(expectedVoucher);

        });
    });

    describe('backToInstantMoney', function(){
        it('should change location to instant money', function(){
            initializeController();
            scope.backToInstantMoney();
            expect(location.path).toHaveBeenCalledWith('/instant-money');
            expect(path.replace).toHaveBeenCalled();
        });
    });
});