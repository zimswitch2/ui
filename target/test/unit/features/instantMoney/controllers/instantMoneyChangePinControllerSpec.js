describe('Unit test - Instant Money change pin', function(){
	beforeEach(module('refresh.instantMoneyChangePinController'));

    var accounts = [
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            "formattedNumber": "12-34-567-890-0",
            "availableBalance": {"amount": 9000.0},
            name: "CURRENT",
            number: 'accountBeingUsed',
            "productName" : "TEST"
        },
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": {"amount": 10000.0},
            name: "CREDIT_CARD",
            "productName": "TEST"
        }
    ];

    var voucher = {
        "accNo": "12-34-567-890-0",
        "accProductName": "TEST",
        "contact": {"address": "0711111111"},
        "amount": {"amount": 1000}
    };

	var controller, scope, flow, accountsService, card, viewModel, mock, route, location, path;
	function initializeController(){
        controller('InstantMoneyChangePinController', {
            $scope: scope,
            Flow: flow,
            AccountsService: accountsService,
            Card: card,
            ViewModel: viewModel,
            $location: location
        });
    }

    beforeEach(inject(function($controller, $rootScope, Flow, $route, _mock_){
    	controller = $controller;
    	scope = $rootScope.$new();
    	flow = Flow;
        accountsService = jasmine.createSpyObj('AccountsService', ['list', 'validFromPaymentAccounts']);
        card = jasmine.createSpyObj('Card', ['current']);
        viewModel = jasmine.createSpyObj('viewModel', ['current']);
        route = $route;
        mock = _mock_;
        location = jasmine.createSpyObj('$location', ['path']);
        path = jasmine.createSpyObj('path', ['replace']);

        location.path.and.returnValue(path);
        accountsService.list.and.returnValue(mock.resolve({accounts: accounts}));
        accountsService.validFromPaymentAccounts.and.returnValue(accounts);
    }));

    it('should have controller associated with url', function () {
        expect(route.routes['/instant-money/change-pin'].controller).toEqual('InstantMoneyChangePinController');
    });

    it('should have template associated with url', function () {
        expect(route.routes['/instant-money/change-pin'].templateUrl).toEqual('features/instantMoney/partials/instantMoneyChangePin.html');
    });

    describe('When init', function(){

        beforeEach(function(){
            viewModel.current.and.returnValue(voucher);
        });

    	it('should have called flow', function(){
            spyOn(flow, 'create');
            initializeController();
    		expect(flow.create).toHaveBeenCalledWith(['Change PIN', 'Confirm details'], 'Instant Money');
    	});

        it('should have called viewModel', function () {
            initializeController();
            expect(viewModel.current).toHaveBeenCalled();
        });

        it('should set the scope vouchers', function () {
            initializeController();
            expect(scope.voucher).toEqual(voucher);
        });
    });

    describe('Next function', function(){

        it('should call store values in viewModel', function () {
            initializeController();
            scope.voucher = voucher;
            scope.next();
            expect(viewModel.current).toHaveBeenCalledWith(voucher);
        });

        it('should change a flow', function () {
            spyOn(flow, 'next');
            initializeController();
            scope.next();
            expect(flow.next).toHaveBeenCalled();
        });

        it('should change location', function () {
            initializeController();
            scope.next();
            expect(location.path).toHaveBeenCalledWith('/instant-money/change-pin/confirm');
            expect(path.replace).toHaveBeenCalled();
        });
    });
});