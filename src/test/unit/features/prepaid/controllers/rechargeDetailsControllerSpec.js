describe('RechargeDetailsController', function () {
    'use strict';

    var firstAccount = {
        "accountFeature": [
            {
                "feature": "PAYMENTFROM",
                "value": true
            }
        ],
        "formattedNumber": "12-34-567-890-0",
        "availableBalance": {"amount": 9000.0 },
        name: "CURRENT",
        number: 'accountBeingUsed'
    };
    var accounts = [
        firstAccount,
        {
            "accountFeature": [
                {
                    "feature": "PAYMENTFROM",
                    "value": true
                }
            ],
            "formattedNumber": "1234-1234-1234-1234",
            "availableBalance": {"amount": 10000.0 },
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

    beforeEach(module('refresh.prepaid.recharge.controllers.details', 'refresh.test', 'refresh.configuration'));

    var scope, accountsService, card, mock, location, viewModel, flow, $controller, validationService, rechargeService,
        builders, vodacomDataBundle, prepaidProviders, telkomProvider, vodacomProvider, electricityProvider;

    var instantiateController = function (routeParams, newViewModel) {
        routeParams = routeParams || {providerId: 'vodacom'};
        $controller('RechargeDetailsController', {
            AccountsService: accountsService,
            $scope: scope,
            Card: card,
            $location: location,
            ViewModel: newViewModel || viewModel,
            Flow: flow,
            RechargeLimitsService: validationService,
            $routeParams: routeParams,
            RechargeService: rechargeService
        });
        scope.$digest();
    };

    beforeEach(inject(function ($rootScope, _$controller_, _mock_, RechargeLimitsService, RechargeService, _builders_) {
        mock = _mock_;
        scope = $rootScope.$new();
        builders = _builders_;
        validationService = RechargeLimitsService;

        accountsService = jasmine.createSpyObj('AccountsService', ['list', 'validFromPaymentAccounts']);
        card = jasmine.createSpyObj('Card', ['current']);
        location = jasmine.createSpyObj('$location', ['path']);
        viewModel = jasmine.createSpyObj('ViewModel', ['current', 'initial', 'isInitial','modifying']);
        flow = jasmine.createSpyObj('Flow', ['create', 'current', 'next', 'previous']);

        viewModel.initial.and.returnValue({});
        accountsService.list.and.returnValue(mock.resolve({accounts: accounts, cardProfile: cardProfile}));
        accountsService.validFromPaymentAccounts.and.returnValue(accounts);

        rechargeService = RechargeService;
        electricityProvider = {id: "electricity", name: "Electricity", products: [{name: 'Electricity', range: { "max": 500, "min": 10}}], infoMessage: 'Please ensure that you are paying a participating municipality, that your prepaid meter is registered and that your meter number is valid'};
        telkomProvider = {id: "telkom-mobile", name: "Telkom Mobile", products: [{name: 'Airtime', range: { "max": 10, "min": 1}}]};
        vodacomDataBundle = {amount: {amount: 99}};
        vodacomProvider = {id: "vodacom", name: "Vodacom", products: [{name: 'Airtime', range: { "max": 1000, "min": 5}},
            {name: 'Data bundles', bundles: [vodacomDataBundle]}]};
        prepaidProviders = [telkomProvider, vodacomProvider, electricityProvider];
        spyOn(rechargeService, 'listProviders');
        rechargeService.listProviders.and.returnValue(mock.resolve(prepaidProviders));

        $controller = _$controller_;
    }));

    describe('providers', function () {
        it('should display a different info message if no available account exists', function () {
            accountsService.validFromPaymentAccounts.and.returnValue([]);
            instantiateController({providerId: 'vodacom'});
            expect(scope.displayNotification.type).toEqual('info');
            expect(scope.displayNotification.message).toEqual('You do not have an account linked to your profile from which payment may be made to a third party');
        });

        it('should know list of available providers', function () {
            instantiateController();
            expect(scope.recharge.providers).toEqual(prepaidProviders);
        });

        it('should know the provider that is selected', function () {
            instantiateController({providerId: 'vodacom'});
            expect(scope.recharge.provider).toEqual(vodacomProvider);
        });

        it('should redirect back to dashboard screen if provider is unknown', function () {
            instantiateController({providerId: 'unknownValue'});
            expect(location.path).toHaveBeenCalledWith('/prepaid');
        });

        it('should redirect to the corresponding url when the provider changes', function () {
            instantiateController({providerId: 'vodacom'});
            scope.recharge.provider = telkomProvider;
            scope.$digest();
            expect(location.path).toHaveBeenCalledWith('/prepaid/recharge/telkom-mobile');
        });

        it('should not throw an error when the value passed to the watch on provider is undefined', function () {
            instantiateController();
            scope.recharge.provider = undefined;
            expect(function() {scope.$digest();}).not.toThrow();
        });

        it('should not reload providers if they were on the ViewModel already', function () {
            var provider = {id: 1, products: [{}]};
            var providers = [provider];
            var recharge = {providers: providers, provider: provider};
            viewModel.initial.and.returnValue(recharge);
            instantiateController({providerId: 'vodacom'}, viewModel);
            expect(scope.recharge.providers).toBe(providers);
        });

        it('should get providers from the recharge service if it has no providers', function () {
            var recharge = {};
            viewModel.initial.and.returnValue(recharge);
            instantiateController({providerId: 'vodacom'}, viewModel);
            expect(scope.recharge.providers).toBe(prepaidProviders);
        });
    });

    describe("products", function () {
        var twoBundles, dataProduct, expectedProducts, provider, airtimeProduct;
        beforeEach(function () {
            twoBundles = [{name: "data1"}, {name: "data2"}];
            dataProduct = {type: 'Data', name: 'Data bundles', bundles: twoBundles};
            airtimeProduct = {type: 'Airtime', name: 'Airtime', bundles: undefined};
            expectedProducts = [airtimeProduct, dataProduct];
            provider = {id: 'mtn', products: expectedProducts};
            rechargeService.listProviders.and.returnValue(mock.resolve([provider]));

            instantiateController({providerId: 'mtn'});
        });

        describe('when a product is selected', function () {
            it('should default bundle to the first one in the list of bundles for that product', function () {
                scope.recharge.provider.productName = 'Data bundles';
                scope.$digest();
                expect(scope.recharge.provider.product.bundle).toEqual(twoBundles[0]);
            });

            it('should not default bundle when there are no bundles for the product', function () {
                scope.recharge.provider.productName = 'Airtime';
                scope.$digest();
                expect(scope.recharge.provider.product.bundle).toBeUndefined();
            });

            it('should not default bundle to the first one in the list when bundle already has a value', function () {
                scope.recharge.provider.productName = 'Data bundles';
                scope.$digest();
                scope.recharge.provider.product.bundle = twoBundles[1];

                scope.recharge.provider.productName = 'Airtime';
                scope.$digest();

                scope.recharge.provider.productName = 'Data bundles';
                scope.$digest();

                expect(scope.recharge.provider.product.bundle).toEqual({name: "data2"});
            });

            it('should not throw an error when the value passed to the watch is undefined', function () {
                scope.recharge.provider.productName = undefined;
                expect(function() {scope.$digest();}).not.toThrow();
            });
        });

        it('should know the available bundles based on selected provider and product', function () {
            scope.recharge.provider.productName = 'Data bundles';
            scope.$digest();
            expect(scope.recharge.provider.product.bundles).toEqual(twoBundles);
        });

        it('should default to the first product', function () {
            expect(scope.recharge.provider.productName).toEqual(scope.recharge.provider.products[0].name);
        });
    });

    describe('accounts', function () {
        it('should not call the account service if it had already been called', function () {
            var fromAccounts = 'some accounts';
            var anAccount = 'an account';
            var recharge = {fromAccounts: fromAccounts, account: anAccount};
            viewModel.initial.and.returnValue(recharge);
            instantiateController({providerId: 'vodacom'}, viewModel);
            expect(scope.recharge.account).toBe(anAccount);
            expect(scope.recharge.fromAccounts).toBe(fromAccounts);
        });

        it('should call the account service for accounts if it has not already been called', function () {
            var recharge = {};
            viewModel.initial.and.returnValue(recharge);
            instantiateController({providerId: 'vodacom'}, viewModel);
            expect(scope.recharge.account).toBe(firstAccount);
            expect(scope.recharge.fromAccounts).toBe(accounts);
        });

        it('should set the daily withdrawal limit from the card profile', function () {
            accountsService.list.and.returnValue(mock.resolve({cardProfile: {dailyWithdrawalLimit: {amount: 8}},accounts: accounts}));
            instantiateController();
            expect(scope.recharge.dailyWithdrawalLimit).toBe(8);
        });
    });

    describe('navigation', function () {
        it('should create flow', function () {
            instantiateController();

            expect(flow.create).toHaveBeenCalledWith(['Enter details', 'Confirm details', 'Enter OTP'], 'Buy prepaid', '/prepaid');
        });
    });

    describe('when cancelling', function () {
        beforeEach(function () {
            instantiateController();
        });

        it('should go back to the list page when cancel is clicked', function () {
            scope.cancel();
            expect(viewModel.initial).toHaveBeenCalled();
        });
    });

    describe('when proceeding', function () {
        beforeEach(function () {
            instantiateController();
            scope.recharge = {
                prepaidPurchase: {}, provider: {
                    id: 'vodacom', products: [
                        {name: 'product', type: "aproduct", bundles: [{productCode: "code", amount: {amount: 1}}]}
                    ],
                    productName: 'Airtime',
                    product: {bundle: {productCode: "code", amount: {amount: 1}}}
                }
            };
        });

        it('should change the location and set productCode on prepaidPurchase to undefined', function () {
            scope.proceed();
            expect(location.path).toHaveBeenCalledWith('/prepaid/recharge/vodacom/confirm');
            expect(scope.recharge.prepaidPurchase.productCode).toBeUndefined();
        });

        it('should store the view model', function () {
            scope.recharge.provider.productName = 'product';
            scope.$digest();
            scope.proceed();
            expect(viewModel.current).toHaveBeenCalledWith(scope.recharge);
        });

        it('should go to the next flow step', function () {
            scope.proceed();
            expect(scope.recharge.provider.productName).toEqual('Airtime');
            expect(flow.next).toHaveBeenCalled();
        });
    });

    describe('enforcer', function () {
        beforeEach(function () {
            instantiateController();
            scope.recharge.provider.productName = 'Airtime';
            scope.$digest();
        });

        it('should validate against ranges when the available balance changes', function () {
            scope.recharge.provider.product.amount = 4;
            expect(scope.enforcer()).toEqual({ error: true, type: 'invalidRechargeAmount', message: 'Please enter an amount within the specified range' });
        });

        it('should not enforce limits when provider is not available', function () {
            scope.recharge.provider = undefined;
            expect(scope.enforcer()).toEqual({});
        });

        it('should not enforce limits when product is not available', function () {
            scope.recharge.provider = {product: undefined};
            expect(scope.enforcer()).toEqual({});
        });

    });

    describe('amount validation', function () {

        describe('when the selected product has bundles', function () {
            beforeEach(function () {
                instantiateController();
                scope.recharge.provider.productName = 'Data bundles';
                scope.$digest();
                scope.recharge.provider.product.bundle = vodacomDataBundle;
            });

            it('should know that the amount is invalid when it exceeds the available balance', function () {
                scope.recharge.account.availableBalance.amount = vodacomDataBundle.amount.amount - 10;
                expect(scope.amountExceedsAvailableBalance()).toBe('The amount exceeds your available balance');
            });

            it('should know that the amount is valid when it does not exceed the available balance', function () {
                scope.recharge.account.availableBalance.amount = vodacomDataBundle.amount.amount + 9;
                expect(scope.amountExceedsAvailableBalance()).toBeUndefined();
            });

            it('should know that the amount is invalid when it exceeds the daily withdrawal limit', function () {
                scope.recharge.dailyWithdrawalLimit = vodacomDataBundle.amount.amount - 7;
                expect(scope.amountExceedsDailyWithdrawalLimit()).toBe('The amount exceeds your daily withdrawal limit');
            });

            it('should know that the amount is valid when it does not exceed the daily withdrawal limit', function () {
                scope.recharge.dailyWithdrawalLimit = vodacomDataBundle.amount.amount + 3;
                expect(scope.amountExceedsDailyWithdrawalLimit()).toBeUndefined();
            });
        });

        describe('when the selected product has no bundles', function () {
            beforeEach(function () {
                instantiateController();
                scope.recharge.provider.productName = 'Airtime';
                scope.$digest();
            });

            it('should know that the amount is invalid when it exceeds the available balance', function () {
                scope.recharge.account.availableBalance.amount = 9;
                scope.recharge.provider.product.amount = 10;
                expect(scope.amountExceedsAvailableBalance()).toBe('The amount exceeds your available balance');
            });

            it('should know that the amount is valid when it does not exceed the available balance', function () {
                scope.recharge.account.availableBalance.amount = 900;
                scope.recharge.provider.product.amount = 10;
                expect(scope.amountExceedsAvailableBalance()).toBeUndefined();
            });

            it('should know that the amount is invalid when it exceeds the daily withdrawal limit', function () {
                scope.recharge.dailyWithdrawalLimit = 4;
                scope.recharge.provider.product.amount = 7;
                expect(scope.amountExceedsDailyWithdrawalLimit()).toBe('The amount exceeds your daily withdrawal limit');
            });

            it('should know that the amount is valid when it does not exceed the daily withdrawal limit', function () {
                scope.recharge.dailyWithdrawalLimit = 18;
                scope.recharge.provider.product.amount = 5;
                expect(scope.amountExceedsDailyWithdrawalLimit()).toBeUndefined();
            });
        });

        describe('info message for provider', function () {
            it('should not show info message for mtn', function () {
                instantiateController( { providerId: 'mtn' } );
                scope.$digest();

                expect(scope.displayNotification).toBeUndefined();
            });

            it('should show info message for electricity', function () {
                instantiateController( { providerId: 'electricity' } );
                scope.$digest();

                expect(scope.displayNotification.hasInfo).toBeTruthy();
                expect(scope.displayNotification.message).toEqual('Please ensure that you are paying a participating municipality, that your prepaid meter is registered and that your meter number is valid');
            });
        });

        describe('when no provider has been populated', function () {
            beforeEach(function () {
                instantiateController();
                scope.recharge = {provider: undefined};
            });

            it('amountExceedsDailyWithdrawalLimit should not throw an error', function () {
                expect(function () { scope.amountExceedsAvailableBalance(); }).not.toThrow();
            });

            it('amountExceedsDailyWithdrawalLimit should not throw an error', function () {
                expect(function () { scope.amountExceedsDailyWithdrawalLimit(); }).not.toThrow();
            });
        });

        describe('when no product has been populated', function () {
            beforeEach(function () {
                instantiateController();
                scope.recharge = {provider: {product: undefined}};
            });

            it('amountExceedsDailyWithdrawalLimit should not throw an error', function () {
                expect(function () { scope.amountExceedsAvailableBalance(); }).not.toThrow();
            });

            it('amountExceedsDailyWithdrawalLimit should not throw an error', function () {
                expect(function () { scope.amountExceedsDailyWithdrawalLimit(); }).not.toThrow();
            });
        });
    });
});
