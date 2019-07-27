describe('secure message details controller', function () {
    'use strict';
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

    beforeEach(module('refresh.secure.message.details'));

    var scope, mock, viewModel, flow, card, accountsService, controller, location, digitalId, path, route;

    beforeEach(inject(function ($controller, $rootScope, $route, _mock_, ViewModel, Flow, DigitalId) {
        controller = $controller;
        scope = $rootScope.$new();
        route = $route;
        flow = Flow;
        viewModel = ViewModel;
        mock = _mock_;
        digitalId=DigitalId;
        card = jasmine.createSpyObj('Card', ['current', 'anySelected']);
        accountsService = jasmine.createSpyObj('AccountsService', ['list', 'validFromPaymentAccounts']);

        accountsService.list.and.returnValue(mock.resolve({accounts: accounts, cardProfile: cardProfile}));
        accountsService.validFromPaymentAccounts.and.returnValue(accounts);

        path = jasmine.createSpyObj('path', ['replace']);
        location = jasmine.createSpyObj('$location', ['path']);
        location.path.and.returnValue(path);
    }));

    var initializeController = function () {
        controller('SecureMessageDetailsController', {
            $scope: scope,
            Flow: flow,
            ViewModel: viewModel,
            AccountsService: accountsService,
            Card: card,
            $location:location
        });

        scope.$digest();
    };

    describe('init', function () {
        it('should set flow with 3 steps', function () {
            spyOn(flow, 'create');
            initializeController();
            expect(flow.create).toHaveBeenCalledWith(['Enter message', 'Confirm message', 'Enter OTP'], 'Secure Message');
        });

        it('should copy model to scope secure message object', function () {
            viewModel.current({secureMessage: {key: 'value', account: 'dd'}});
            viewModel.modifying();
            initializeController();

            expect(scope.secureMessage).toEqual({key: 'value', account: 'dd'});

        });

        it('should init alive accounts', function () {
            initializeController();
            expect(accountsService.list).toHaveBeenCalled();
            expect(accountsService.validFromPaymentAccounts).toHaveBeenCalled();
            expect(scope.aliveAccounts).toEqual(accounts);
            expect(scope.secureMessage.account).toBe(accounts[0]);
        });
    });

    describe('Next', function () {
        it('should set secure message to ViewModel', function () {
            initializeController();
            scope.secureMessage = {key: 'another value'};
            scope.next();
            expect(viewModel.current()).toEqual({secureMessage: {key: 'another value'}});
        });

        it('should come to next step in flow', function () {
            spyOn(flow, 'next');
            initializeController();
            scope.next();
            expect(flow.next).toHaveBeenCalled();
        });

        it('should navigate to confirm page', function () {
            initializeController();
            scope.next();
            expect(location.path).toHaveBeenCalledWith('/secure-message/confirm');
            expect(path.replace).toHaveBeenCalled();
        });
    });

    describe('on error message', function () {
        it('should put error message on the scope', function () {
            var model = {};
            viewModel.current(model);
            viewModel.error({message: 'This is an error message'});
            initializeController();
            expect(scope.errorMessage).toBe('This is an error message');
        });
    });

    describe('routing', function () {
        it('when card selected should allow access', function () {
            card.anySelected.and.returnValue(true);
            var secureMessageRoute = route.routes['/secure-message'];
            expect(secureMessageRoute.controller).toEqual('SecureMessageDetailsController');
            expect(secureMessageRoute.allowedFrom[0].condition(card)).toBeTruthy();
        });

        it('when no card selected should not allow access', function () {
            card.anySelected.and.returnValue(false);
            var secureMessageRoute = route.routes['/secure-message'];
            expect(secureMessageRoute.controller).toEqual('SecureMessageDetailsController');
            expect(secureMessageRoute.allowedFrom[0].condition(card)).toBeFalsy();
        });
    });
});
