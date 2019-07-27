describe('Unit test - Instant Money change pin confirmation', function(){
	beforeEach(module('refresh.instantMoneyChangePinConfirmController'));

    var voucher = {
        "accNo": "12-34-567-890-0",
        "accProductName": "TEST",
        "contact": {"address": "0711111111"},
        "amount": {"amount": 1000}
    };

	var controller, scope, viewModel, route, instantMoneyService, mock, location, path, flow;
	function initializeController(){
        controller('InstantMoneyChangePinConfirmController', {
            $scope: scope,
            ViewModel: viewModel,
            InstantMoneyService: instantMoneyService,
            $location: location,
            Flow: flow
        });
    }

    beforeEach(inject(function($controller, $rootScope, $route, _InstantMoneyService_, _mock_, Flow){
    	controller = $controller;
    	scope = $rootScope.$new();
        viewModel = jasmine.createSpyObj('viewModel', ['current', 'error']);
        route = $route;
        instantMoneyService = _InstantMoneyService_;
        mock = _mock_;
        flow = Flow;

        location = jasmine.createSpyObj('$location', ['path']);
        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);

        viewModel.current.and.returnValue(voucher);
    }));

    it('should have controller associated with url', function () {
        expect(route.routes['/instant-money/change-pin/confirm'].controller).toEqual('InstantMoneyChangePinConfirmController');
    });

    it('should have template associated with url', function () {
        expect(route.routes['/instant-money/change-pin/confirm'].templateUrl).toEqual('features/instantMoney/partials/instantMoneyChangePinConfirm.html');
    });

    describe('When init', function(){
        beforeEach(function(){
            initializeController();
        });

        it('should have called viewModel', function () {
            expect(viewModel.current).toHaveBeenCalled();
        });

        it('should set the scope vouchers', function () {
            expect(scope.voucher).toEqual(voucher);
        });
    });

    describe('confirm', function(){
        beforeEach(function(){
            initializeController();
        });

        it('should go to success page upon success', function(){
            spyOn(instantMoneyService, 'changeInstantMoneyVoucherPin');
            instantMoneyService.changeInstantMoneyVoucherPin.and.returnValue(mock.resolve({}));
            scope.confirm();
            scope.$digest();
            expect(instantMoneyService.changeInstantMoneyVoucherPin).toHaveBeenCalled();
            expect(location.path).toHaveBeenCalledWith('/instant-money/change-pin/success');

        });

        it('should go back to change pin page upon error', function () {
            var serviceError = {message: 'OMG'};
            spyOn(instantMoneyService, 'changeInstantMoneyVoucherPin');
            spyOn(flow, 'previous');
            instantMoneyService.changeInstantMoneyVoucherPin.and.returnValue(mock.reject('OMG'));
            scope.confirm();
            scope.$digest();

            expect(location.path).toHaveBeenCalledWith('/instant-money/change-pin');
            expect(flow.previous).toHaveBeenCalled();
            expect(viewModel.error).toHaveBeenCalledWith(serviceError);
        });
    });
});