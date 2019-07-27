describe('Unit Test - Instant Money Details', function () {
    beforeEach(module('refresh.instantMoneyDetailsController'));

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
            branch: {

            }
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
            name: "CREDIT_CARD"
        },
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": false
                }
            ],
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": {"amount": 10000.0},
            name: "HOME_LOAN"
        }
    ];
    var cardProfile = {dailyWithdrawalLimit: {amount: 1000}};

    var expectedCall = {
        account: accounts[0],
        cellNumber: '0111',
        voucherPin: '0112'
    };

    var route, flow, controller, card, accountsService, mock, scope, viewModel, location, path;

    function initialize() {
        controller('InstantMoneyDetailsController', {
            Flow: flow,
            AccountsService: accountsService,
            Card: card,
            $scope: scope,
            ViewModel: viewModel,
            $location: location
        });
    }

    beforeEach(inject(function ($route, Flow, $controller, _mock_, $rootScope, _ViewModel_) {
        route = $route;
        flow = Flow;
        controller = $controller;
        mock = _mock_;
        scope = $rootScope.$new();
        card = jasmine.createSpyObj('Card', ['current', 'anySelected']);
        accountsService = jasmine.createSpyObj('AccountsService', ['list', 'validFromPaymentAccounts']);
        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);
        viewModel = jasmine.createSpyObj('viewModel', ['current', 'initial', 'error']);

        accountsService.list.and.returnValue(mock.resolve({accounts: accounts, cardProfile: cardProfile}));
        accountsService.validFromPaymentAccounts.and.returnValue(accounts);
    }));

    it('should have controller associated with url', function () {
        expect(route.routes['/instant-money/details'].controller).toEqual('InstantMoneyDetailsController');
    });

    it('should have template associated with url', function () {
        expect(route.routes['/instant-money/details'].templateUrl).toEqual('features/instantMoney/partials/instantMoneyDetails.html');
    });


    describe('when init', function () {
        it('should have called flow', function () {
            spyOn(flow, 'create');
            cardProfile.monthlyEAPLimit = 1000;
            cardProfile.usedEAPLimit = {amount: 4000};
            cardProfile.remainingEAP = {amount: 3000};
            initialize();
            expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Confirm details', 'Enter OTP'], 'Instant Money', '/instant-money');
        });

        it('should init alive accounts', function () {
            initialize();
            cardProfile.monthlyEAPLimit = 1000;
            cardProfile.usedEAPLimit = {amount: 4000};
            cardProfile.remainingEAP = {amount: 3000};
            scope.$digest();
            expect(accountsService.list).toHaveBeenCalled();
            expect(accountsService.validFromPaymentAccounts).toHaveBeenCalled();
            expect(scope.aliveAccounts).toEqual(accounts);
        });

        it('should not set aliveAccounts if there are no accounts', function () {
            accountsService.validFromPaymentAccounts.and.returnValue([]);
            initialize();
            scope.$digest();
            expect(scope.aliveAccounts).toEqual([]);
        });

        it('should set the voucher to the stored voucher in ViewModel if available', function () {
            var voucher = {
                account: accounts[1]
            };

            viewModel.initial.and.returnValue(voucher);

            initialize();
            scope.$digest();

            expect(scope.voucher).toEqual(voucher);
        });

        it('should default the from account to the first account on the list', function() {
            initialize();
            scope.$digest();
            expect(scope.voucher.account).toEqual(accounts[0]);
        });

        it('should set error message to undefined when there is no error in viewModel', function () {
            expect(scope.errorMessage).toBeUndefined();
        });

        it('should set error message when there is an error', function () {
            viewModel.initial.and.returnValue({error: 'error message'});
            initialize();
            expect(scope.errorMessage).toEqual('error message');
        });
    });

    describe('next', function () {
        it('should call store values in viewModel', function () {
            initialize();

            scope.voucher = {
                account: accounts[0]
            } ;
            scope.voucher.cellNumber = '0111';
            scope.voucher.voucherPin = '0112';

            scope.next();
            scope.$digest();
            expect(viewModel.current).toHaveBeenCalledWith(expectedCall);
        });

        it('should change a flow', function () {
            spyOn(flow, 'next');
            initialize();
            scope.next();
            scope.$digest();
            expect(flow.next).toHaveBeenCalled();
        });

        it('should change location', function () {
            initialize();
            scope.next();
            scope.$digest();
            expect(location.path).toHaveBeenCalledWith('/instant-money/confirm');
            expect(path.replace).toHaveBeenCalled();
        });
    });

    describe('Disclaimer', function() {
        beforeEach(function() {
            initialize();
        });

        it('should show the disclaimer', function() {
            scope.showDisclaimer();
            expect(scope.isDisclaimerVisible).toBe(true);
        });

        it('should hide the disclaimer', function() {
            scope.hideDisclaimer();
            expect(scope.isDisclaimerVisible).toBe(false);
        });
    });

    describe('Enforce and hint', function () {
        var instantMoneyLimitsService;
        beforeEach(inject(function (InstantMoneyLimitsService) {
            instantMoneyLimitsService = InstantMoneyLimitsService;
        }));

        it('should enforce minimum value', function () {
            initialize();

            scope.voucher = {
                amount: 30
            };
            expect(scope.enforcer().message).toEqual('Please enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5000</span>');
        });

        it('should show the hint from the limit service', function () {
           instantMoneyLimitsService.prototype.hint = function() {
                return 'This is a hint';
           };

            initialize();
            expect(scope.hinter()).toEqual('This is a hint');
        });

        it('should enforce daily limit', function () {
            cardProfile.dailyWithdrawalLimit.amount = 20;
            initialize();
            scope.$digest();
            scope.voucher = {
                amount: 60
            };

            expect(scope.enforcer().message).toEqual('The amount exceeds your daily withdrawal limit');
        });
        it('should set hasInfo and infoMessage if no accounts that have payment functionality are available', function () {
            expect(scope.hasInfo).toBeFalsy();
            expect(scope.infoMessage).toBeUndefined();

            accountsService.validFromPaymentAccounts.and.returnValue([]);
            initialize();
            scope.$digest();
            expect(scope.hasInfo).toBeTruthy();
            expect(scope.infoMessage).toEqual('You do not have an account linked to your profile from which payment may be made to a third party');
        });
    });
    describe("When MonthlyEAP is not set", function () {

        it('should set to hasZeroEAPLimit to true', function () {
            cardProfile.monthlyEAPLimit = 1000;

            initialize();
            scope.$digest();
            expect(scope.hasZeroEAPLimit).toBeFalsy();
        });
    });


});