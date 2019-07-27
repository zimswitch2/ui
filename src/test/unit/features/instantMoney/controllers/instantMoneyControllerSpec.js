describe('Unit Test - Create Instant Money Controller', function () {
    'use strict';

    beforeEach(module('refresh.instantMoneyController', 'refresh.test'));

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
            number: '12345678900',
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
            number: "1234123412341234",
            "productName": "TEST"
        }
    ];

    var vouchers = [
        {
            date: '25 Nov 2015',
            voucherNumber: '12345',
            accNo: 12345678900,
            accProductName: 'TEST', 
            cellPhone: '011',
            amount: '100'
        },
        {
            date: '25 Dec 2015',
            voucherNumber: '12345',
            accNo: 1234123412341234,
            accProductName: 'TEST',
            cellPhone: '011',
            amount: '1000'
        }
    ];

    var cardNumber = {
        number: '12345'
    };

    var route, controller, scope, InstantMoneyService, card, mock, viewModel, location, accountsService;
    function initializeController(){
        controller('InstantMoneyController', {
            $scope: scope,
            InstantMoneyService: InstantMoneyService,
            Card: card,
            ViewModel: viewModel,
            $location: location,
            AccountsService: accountsService
        });
        scope.$digest();
    }

    beforeEach(inject(function ($route, $controller, $rootScope, _mock_, _InstantMoneyService_) {
        route = $route;
        controller = $controller;
        scope = $rootScope.$new();
        mock = _mock_;

        InstantMoneyService = jasmine.createSpyObj('InstantMoneyService', ['getUncollectedVouchers', 'cancelVoucher']);
        InstantMoneyService.getUncollectedVouchers.and.returnValue(mock.resolve(_.clone(vouchers)));
        InstantMoneyService.cancelVoucher.and.returnValue(mock.resolve({}));

        card = jasmine.createSpyObj('card', ['current']);
        card.current.and.returnValue(cardNumber);

        viewModel = jasmine.createSpyObj('viewModel', ['current', 'modifying']);
        viewModel.current.and.returnValue({});

        location = jasmine.createSpyObj('$location', ['path']);

        accountsService = jasmine.createSpyObj('AccountsService', ['list', 'validFromPaymentAccounts']);
        accountsService.list.and.returnValue(mock.resolve({accounts: accounts}));
        accountsService.validFromPaymentAccounts.and.returnValue(accounts);
    }));

    it('should have a controller linked to url', function () {
        expect(route.routes['/instant-money'].controller).toEqual('InstantMoneyController');
        expect(route.routes['/instant-money'].templateUrl).toEqual('features/instantMoney/partials/instantMoney.html');
    });

    describe('sorting', function () {
        beforeEach(function () {
            initializeController();
        });

        var sorter;

        beforeEach(inject(function ($sorter) {
            sorter = $sorter;
        }));

        it('should set the sorter', function () {
            expect(scope.sortBy).toEqual(sorter);
        });

        it('should sort by createdDate', function () {
            expect(scope.sort.criteria).toEqual('createdDate');
        });

        it('should sort in descending order', function () {
            expect(scope.sort.descending).toEqual(true);
        });

        it('should have the sort arrow icon on the beneficiary name column by default', function () {
            expect(scope.sortArrowClass("")).toEqual('icon icon-sort');
        });

        it('should set the clicked column as active', function () {
            expect(scope.sortArrowClass('createdDate')).toContain('active');
        });

        it('should set the sort criteria', function () {
            scope.sortBy('field');
            expect(scope.sort.criteria).toEqual('field');
        });
    });

    describe('when initializing instant money history', function () {
        var cardNumber = {
            number: '12345'
        };

        beforeEach(function () {
            initializeController();
        });

        it('should call instant money and card service', function () {
            var expectedFromAccount = vouchers[0].accProductName +" - "+ accounts[0].formattedNumber;
            expect(InstantMoneyService.getUncollectedVouchers).toHaveBeenCalledWith(cardNumber);
            expect(card.current).toHaveBeenCalled();
            scope.$digest();
            expect(scope.instantMoneyHistory).toEqual(vouchers);
            expect(scope.InfoMessage).not.toEqual('No vouchers');
            expect(scope.instantMoneyHistory[0].accAvailableBalance).toEqual(accounts[0].availableBalance);
            expect(scope.instantMoneyHistory[0].fromAccount).toEqual(expectedFromAccount);        
        });
    });

    describe('when there are no instant money vouchers', function () {

        var cardNumber = {
            number: '12345'
        };

        beforeEach(function () {
            InstantMoneyService.getUncollectedVouchers.and.returnValue(mock.resolve([]));
            initializeController();
        });


        it('should display notification', function () {
            expect(InstantMoneyService.getUncollectedVouchers).toHaveBeenCalledWith(cardNumber);
            expect(card.current).toHaveBeenCalled();
            scope.$digest();
            expect(scope.haveVouchers).toEqual(false);
        });
    });

    describe('uncollectedInstantMoneyFilter', function () {
        var uncollectedInstantMoneyFilter;
        var uncollectedInstantMoneyVouchers = [{
            createdDate: '1 September 2015',
            fromAccount: 'ACCESSACC - 10-00-530-418-2',
            voucherNumber: 111111111123456789,
            contact: {address: '0716008907'},
            amount: {amount: 100}
        }];
        beforeEach(inject(function ($filter) {
            uncollectedInstantMoneyFilter = $filter('uncollectedInstantMoneyFilter');
        }));

        using([{
            field: 'date',
            text: 'September'
        }, {
            field: 'cellphone',
            text: '0716'
        }, {
            field: 'voucher number',
            text: '1111111'
        }, {
            field: 'from account',
            text: 'ACCESSACC - 10-00-530-418-2'
        }], function (search) {
            it('should filter by ' + search.field, function () {
                var result = uncollectedInstantMoneyFilter(uncollectedInstantMoneyVouchers, search.text);
                expect(result.length).toBe(1);
                expect(result[0]).toEqual(uncollectedInstantMoneyVouchers[0]);
            });
        });
    });


    describe('modify', function () {

        beforeEach(function () {
            initializeController();
        });

        it('should redirect to the change uncollected cash collection PIN page after setting the View Model', function () {
            scope.modify(vouchers[0]);
            expect(viewModel.current).toHaveBeenCalled();
            var actualArgs = viewModel.current.calls.mostRecent().args[0];
            expect(viewModel.modifying).toHaveBeenCalled();
            expect(location.path).toHaveBeenCalledWith('/instant-money/change-pin');
        });
    });

    describe('when cancelling', function () {
        var voucherToDelete = vouchers[0];

        beforeEach(function () {
            initializeController();
        });

        it('should set the voucher to be deleted', function () {
            scope.delete(voucherToDelete);
            expect(scope.voucherToDelete).toBe(voucherToDelete);
        });

        it('should allow the delete voucher modal to be cancelled', function () {
            scope.delete(voucherToDelete);
            scope.cancelDelete();
            expect(scope.voucherToDelete).toBeFalsy();
        });

        it('should confirm the voucher to be cancelled', function () {
            scope.delete(voucherToDelete);
            scope.confirmDelete();
            scope.$digest();

            expect(InstantMoneyService.cancelVoucher).toHaveBeenCalledWith({number: '12345'}, voucherToDelete);
            expect(scope.success).toBe('Voucher 12345 successfully cancelled.');
            expect(scope.instantMoneyHistory.length).toBe(1);
        });

        it('should set the error to display for an known failure', function () {
            InstantMoneyService.cancelVoucher.and.returnValue(mock.reject('random error'));
            scope.delete(voucherToDelete);
            scope.confirmDelete();
            scope.$digest();

            expect(InstantMoneyService.cancelVoucher).toHaveBeenCalledWith({number: '12345'}, voucherToDelete);
            expect(scope.errorMessage).toBe('Error cancelling voucher 12345. Reason: random error.');
            expect(scope.instantMoneyHistory.length).toBe(2);
        });

        it('should set the error to display for an unknown failure', function () {
            InstantMoneyService.cancelVoucher.and.returnValue(mock.reject());
            scope.delete(voucherToDelete);
            scope.confirmDelete();
            scope.$digest();

            expect(InstantMoneyService.cancelVoucher).toHaveBeenCalledWith({number: '12345'}, voucherToDelete);
            expect(scope.errorMessage).toBe('Error cancelling voucher 12345. ');
            expect(scope.instantMoneyHistory.length).toBe(2);
        });
    });
});