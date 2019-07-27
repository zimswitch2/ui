describe('Unit Test - Instant Money Success Controller', function () {
    beforeEach(module('refresh.instantMoney.success'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should associate controller with url', function () {
            expect(route.routes['/instant-money/success'].controller).toEqual('InstantMoneySuccessController');
        });

        it('should associate template with url', function () {
            expect(route.routes['/instant-money/success'].templateUrl).toEqual('features/instantMoney/partials/instantMoneySuccess.html');
        });
    });


    var controller, scope, viewModel, path, location, applicationParameters;

    var voucher = {
        cellNumber: '0111',
        voucherPin: '0111',
        referenceNumber: '0000',
        voucherNumber: '1111'
    };

    function initialize() {
        controller('InstantMoneySuccessController', {
            $scope: scope,
            ViewModel: viewModel,
            $location: location,
            ApplicationParameters: applicationParameters
        });
    }
    beforeEach(inject(function ($controller, $rootScope) {
        controller = $controller;
        scope = $rootScope.$new();
        viewModel = jasmine.createSpyObj('viewModel', ['current']);
        viewModel.current.and.returnValue(voucher);

        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);

        applicationParameters = jasmine.createSpyObj('applicationParameters', ['getVariable']);

    }));

    describe('on initialize', function () {
        beforeEach(function () {
            applicationParameters.getVariable.and.returnValue('2015-09-25');
            initialize();
        });
        it('should call view model', function () {
            expect(viewModel.current).toHaveBeenCalled();
        });

        it('should set voucher', function () {
            expect(scope.voucher).toEqual(voucher);
        });

        it('set success', function () {
            expect(scope.isSuccessful).toBeTruthy();
        });

        it('should set the current date and time', function () {
            expect(applicationParameters.getVariable).toHaveBeenCalledWith('latestTimestampFromServer');
                expect(scope.latestTimestampFromServer).toEqual('2015-09-25');

        });
    });

    describe('on backToTransact', function () {
        it('should call location with the instant money path', function () {
            initialize();
            scope.backToTransact();
            expect(location.path).toHaveBeenCalledWith('/instant-money');
            expect(path.replace).toHaveBeenCalled();
        });
    });

    describe('on makeAnotherTransfer', function () {
        it('should call location with the instant money details', function () {
            initialize();
            scope.makeAnotherTransfer();
            expect(location.path).toHaveBeenCalledWith('/instant-money/details');
            expect(path.replace).toHaveBeenCalled();
        });
    });
});