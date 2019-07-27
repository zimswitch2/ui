describe("RechargeConfirmController", function () {
    'use strict';
    var scope, mock, location, rechargeService, viewModel, recharge, flow, window;
    beforeEach(module('refresh.prepaid.recharge.controllers.confirm', 'refresh.test', 'refresh.configuration'));

    beforeEach(inject(function ($rootScope, $controller, _mock_) {
        mock = _mock_;
        viewModel = jasmine.createSpyObj('ViewModel', ['initial', 'current', 'error', 'modifying']);
        scope = $rootScope.$new();
        location = jasmine.createSpyObj('$location', ['path']);
        rechargeService = jasmine.createSpyObj('RechargeService', ['recharge']);
        flow = jasmine.createSpyObj('Flow', ['current', 'next', 'previous']);
        recharge = {recharge: 1, account: {name: 'test account', availableBalance: {amount: 10}}};
        viewModel.current.and.returnValue(_.cloneDeep(recharge));
        window = {history: jasmine.createSpyObj('history', ['back'])};

        $controller('RechargeConfirmController', {
            $scope: scope,
            $location: location,
            ViewModel: viewModel,
            RechargeService: rechargeService,
            Flow: flow,
            $routeParams: {providerId: 'vodacom'},
            $window: window
        });
    }));

    function makeResult(overrides) {
        return mock.resolve(_.merge({
            voucherNumber: '1234',
            cardProfile: {
                dailyWithdrawalLimit: {amount: 90, currency: 'ZAR'}
            },
            account: [{availableBalance: 10}],
            transactionResults: []
        }, overrides));
    }

    it('should go to the results page upon success', function () {
        rechargeService.recharge.and.returnValue(makeResult());

        scope.confirm();
        scope.$digest();

        expect(location.path).toHaveBeenCalledWith('/prepaid/recharge/vodacom/results');
        expect(flow.next).toHaveBeenCalled();
    });

    it('should store the updated daily withdrawal limit', function () {
        var cardProfile = {dailyWithdrawalLimit: {amount: 20, currency: 'ZAR'}};
        rechargeService.recharge.and.returnValue(makeResult({cardProfile: cardProfile}));

        scope.confirm();
        scope.$digest();

        var viewModelObject = viewModel.current.calls.mostRecent().args[0];
        expect(viewModelObject.dailyWithdrawalLimit).toEqual(20);
    });

    it('should store the updated available balance for the current account', function () {
        var accounts = [{
            availableBalance: {
                amount: 8756.41
            }
        }];
        rechargeService.recharge.and.returnValue(makeResult({account: accounts}));

        scope.confirm();
        scope.$digest();

        var viewModelObject = viewModel.current.calls.mostRecent().args[0];
        expect(viewModelObject.account.availableBalance.amount).toEqual(8756.41);
    });

    it('should store electricity transaction metadata', function () {
        var transactionResultMetaData = [
            {
                "transactionResultKey": "VOUCHERNUMBER",
                "value": "12345678901234567890  "
            },
            {
                "transactionResultKey": "KILOWATTS",
                "value": "108.0                 kWh"
            },
            {
                "transactionResultKey": "REFERENCE",
                "value": "SD562160              "
            },
            {
                "transactionResultKey": "VAT",
                "value": "4490205749"
            }
        ];
        rechargeService.recharge.and.returnValue(makeResult({transactionResults: [{ transactionResultMetaData: transactionResultMetaData }]}));

        scope.confirm();
        scope.$digest();

        var viewModelObject = viewModel.current.calls.mostRecent().args[0];
        expect(viewModelObject.results.referenceNumber).toEqual('SD562160              ');
        expect(viewModelObject.results.voucherNumber).toEqual('12345678901234567890  ');
        expect(viewModelObject.results.quantityPurchased).toEqual('108.0                 kWh');
        expect(viewModelObject.results.vatRegistrationNumber).toEqual('4490205749');
    });

    it('should go back to input page and set error', function () {
        var serviceError = {message: 'OMG'};
        rechargeService.recharge.and.returnValue(mock.reject(serviceError));

        scope.confirm();
        scope.$digest();

        expect(viewModel.error).toHaveBeenCalledWith(serviceError);
        expect(location.path).toHaveBeenCalledWith('/prepaid/recharge/vodacom');
        expect(flow.previous).toHaveBeenCalled();
    });

    describe('when modifying', function () {
        it('should go the previous flow step', function () {
            scope.modify();

            expect(viewModel.modifying).toHaveBeenCalled();
            expect(flow.previous).toHaveBeenCalled();
        });
    });
    describe('when cancelling ', function () {
        it('should go back to the list page when cancel is clicked', function () {
            scope.cancel();
            expect(viewModel.initial).toHaveBeenCalled();
        });
    });
});
