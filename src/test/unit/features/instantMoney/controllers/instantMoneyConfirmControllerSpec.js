describe('Unit Test - Instant Money Confirm', function () {
    'use strict';

    beforeEach(module('refresh.instantMoney.confirmController'));

    var expectedVoucher = {
        cellNumber: '0111',
        voucherPin: '0111',
        referenceNumber: '12345',
        voucherNumber: '12345',
        availableBalance:'8756.41'
    };

    describe('routes', function() {
        var route;
        beforeEach(inject(function($route) {
            route = $route;
        }));

        it('should have the controller set to InstantMoneyConfirmController', function() {
            expect(route.routes['/instant-money/confirm'].controller).toEqual('InstantMoneyConfirmController');
        });

        it('should have the template set to the instant money confirm template', function() {
            expect(route.routes['/instant-money/confirm'].templateUrl).toEqual('features/instantMoney/partials/instantMoneyConfirm.html');
        });
    });

    var controller, scope, viewModel, location, flow, path, instantMoneyService, mock;

    var successVoucher = {
        transactionResults: [{
            responseCode: {
                "responseType": "SUCCESS",
                "message": "Transaction was successfully processed"
            },
            transactionResultMetaData: [
                {
                    transactionResultKey: "REFERENCE",
                    value: "12345"
                },
                {
                    transactionResultKey: "VOUCHERNUMBER",
                    value: "12345"
                }
            ]
        }]
    };

    var invalidVoucher = {
        transactionResults: [{
            responseCode: {
                "responseType": "ERROR",
                "message": "Invalid Pin",
                "code": "2822"
            },
            transactionResultMetaData: [
                {
                    transactionResultKey: "REFERENCE",
                    value: "12345"
                },
                {
                    transactionResultKey: "VOUCHERNUMBER",
                    value: "12345"
                }
            ]
        }]
    };

    var invalidWithMessageVoucher = {
        transactionResults: [{
            transactionResultMetaData: [
                {
                    transactionResultKey: "REFERENCE",
                    value: "12345"
                },
                {
                    transactionResultKey: "VOUCHERNUMBER",
                    value: "12345"
                }
            ]
        }]
    };

    var messageWithErrorCode= {
        transactionResults: [{
            responseCode: {
                "responseType": "ERROR",
                "code":"2807"
            },
            transactionResultMetaData: [
                {
                    transactionResultKey: "REFERENCE",
                    value: "12345"
                },
                {
                    transactionResultKey: "VOUCHERNUMBER",
                    value: "12345"
                }
            ]
        }]
    };

    var unknownMessageCode = {
        transactionResults: [{
            responseCode: {
                "responseType": "ERROR",
                "code":"2808"
            },
            transactionResultMetaData: [
                {
                    transactionResultKey: "REFERENCE",
                    value: "12345"
                },
                {
                    transactionResultKey: "VOUCHERNUMBER",
                    value: "12345"
                }
            ]
        }]
    };

    function makeResult(overrides) {
        return mock.resolve(_.merge({
            voucherNumber: '1234',
            cardProfile: {
                dailyWithdrawalLimit: {amount: 90, currency: 'ZAR'}
            },
            account: [{availableBalance: {amount:8756.41}}],
            transactionResults: [{
                responseCode: {
                    "responseType": "SUCCESS",
                    "message": "Transaction was successfully processed"
                },
                transactionResultMetaData: [
                    {
                        transactionResultKey: "REFERENCE",
                        value: "12345"
                    },
                    {
                        transactionResultKey: "VOUCHERNUMBER",
                        value: "12345"
                    }
                ]
            }]
        }, overrides));
    }

    function initialize() {
        controller('InstantMoneyConfirmController', {
            $scope: scope,
            ViewModel: viewModel,
            $location: location,
            Flow: flow,
            InstantMoneyService: instantMoneyService
        });
    }

    beforeEach(inject(function($controller, $rootScope, _mock_) {
        scope = $rootScope.$new();
        controller = $controller;
        viewModel = jasmine.createSpyObj('viewModel', ['current', 'modifying', 'error']);
        instantMoneyService = jasmine.createSpyObj('instantMoneyService', ['sendInstantMoney']);
        mock = _mock_;

        instantMoneyService.sendInstantMoney.and.returnValue(mock.resolve(successVoucher));
        viewModel.current.and.returnValue(expectedVoucher);
        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);
        flow = jasmine.createSpyObj('flow', ['next', 'previous']);
    }));

    describe('on initialize', function () {
        beforeEach(function () {
            initialize();
        });
        it('should have called viewModel', function () {
            expect(viewModel.current).toHaveBeenCalled();
        });

        it('should set the scope vouchers', function () {
            expect(scope.voucher).toEqual(expectedVoucher);

        });
    });

    describe('on modify', function () {
        beforeEach(function() {
            initialize();
            scope.modify();
        });

        it('should set the location path to instant-money/details', function () {
            expect(location.path).toHaveBeenCalledWith('/instant-money/details');
            expect(path.replace).toHaveBeenCalled();
        });

        it('should call the modify on the view model', function () {
            expect(viewModel.modifying).toHaveBeenCalled();
        });

        it('should call flow previous', function () {
            expect(flow.previous).toHaveBeenCalled();
        });
    });

    describe('on confirm', function () {
        beforeEach(function () {
            initialize();
            instantMoneyService.sendInstantMoney.and.returnValue(makeResult());
            scope.confirm();
            scope.$digest();


        });
        it('should call instant money service', function () {
            expect(instantMoneyService.sendInstantMoney).toHaveBeenCalledWith(expectedVoucher);
        });

        it('should call location', function () {
            expect(location.path).toHaveBeenCalledWith('/instant-money/success');
            expect(path.replace).toHaveBeenCalled();
        });

        it('should call flow', function () {
            expect(flow.next).toHaveBeenCalled();
        });

        it('should call view model', function () {
            expect(viewModel.current).toHaveBeenCalledWith(expectedVoucher);
        });
    });

    describe('when rejected', function () {
        beforeEach(function () {
            instantMoneyService.sendInstantMoney.and.returnValue(mock.reject("error message"));
            initialize();
            scope.confirm();
            scope.$digest();
        });
        it('should call location', function () {
            expect(location.path).toHaveBeenCalledWith('/instant-money/details');
            expect(path.replace).toHaveBeenCalled();
        });

        it('should call view model', function () {
            expect(viewModel.error).toHaveBeenCalledWith({message: 'error message'});
        });

        it('should call flow previous', function () {
            expect(flow.previous).toHaveBeenCalled();
        });
    });

    describe('when there is an error with a message', function () {
        beforeEach(function () {
            instantMoneyService.sendInstantMoney.and.returnValue(mock.resolve(invalidVoucher));
            initialize();
            scope.confirm();
            scope.$digest();
        });

        it('should call flow', function () {
            expect(flow.previous).toHaveBeenCalled();
        });

        it('should call location', function () {
            expect(location.path).toHaveBeenCalledWith('/instant-money/details');
            expect(path.replace).toHaveBeenCalled();
        });

        it('should call view Model', function () {
            expect(viewModel.error).toHaveBeenCalledWith({message: invalidVoucher.transactionResults[0].responseCode.message});
        });
    });


   describe('when there is an error with known code', function () {
        beforeEach(function () {
            instantMoneyService.sendInstantMoney.and.returnValue(mock.resolve(messageWithErrorCode));
            initialize();
            scope.confirm();
            scope.$digest();
        });

        it('should call flow', function () {
            expect(flow.previous).toHaveBeenCalled();
        });

        it('should call location', function () {
            expect(location.path).toHaveBeenCalledWith('/instant-money/details');
            expect(path.replace).toHaveBeenCalled();
        });

        it('should call view Model', function () {
            expect(viewModel.error).toHaveBeenCalledWith({message: 'Voucher limit exceeded. You can send a maximum of R 5 000 per day'});
        });
    });

    describe('when there is an error with unknown message code', function () {
        beforeEach(function () {
            instantMoneyService.sendInstantMoney.and.returnValue(mock.resolve(unknownMessageCode));
            initialize();
            scope.confirm();
            scope.$digest();
        });

        it('should call view Model', function () {
            expect(viewModel.error).toHaveBeenCalledWith({message: 'An unexpected error has been encountered. Please try again later'});
        });
    });
    describe('when there is no result from the service', function () {
        it('error message should be stored in the view model', function () {
            instantMoneyService.sendInstantMoney.and.returnValue(mock.resolve([]));
            initialize();
            scope.confirm();
            scope.$digest();
            expect(viewModel.error).toHaveBeenCalledWith({message: 'An unexpected error has been encountered. Please try again later'});
        });
    });

    describe('when the results from the service is incomplete', function () {
        it('error message should be stored in the view model', function () {
            instantMoneyService.sendInstantMoney.and.returnValue(mock.resolve(
                {
                    transactionResults: [{
                        transactionResultMetaData: [
                            {
                                transactionResultKey: "REFERENCE",
                                value: "12345"
                            },
                            {
                                transactionResultKey: "VOUCHERNUMBER",
                                value: "12345"
                            }
                        ]
                    }]
                }
            ));
            initialize();
            scope.confirm();
            scope.$digest();
            expect(viewModel.error).toHaveBeenCalledWith({message: 'An unexpected error has been encountered. Please try again later'});
        });
    });
});