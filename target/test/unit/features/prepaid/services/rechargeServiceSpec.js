describe('Recharge Service', function () {

    beforeEach(module('refresh.prepaid.recharge.services', 'refresh.test', 'refresh.configuration',
        'refresh.navigation', 'refresh.fixture'));

    var accountsService;
    beforeEach(function () {
        accountsService = jasmine.createSpyObj('accounts', ['clear']);
        module(function ($provide) {
            $provide.value('AccountsService', accountsService);
        });
    });

    var service, URL, $httpBackend, ServiceError, response, serviceTestHelper, Fixture,
        prepaidProviderDetailsSpy, rechargeSpy, recharge, rechargeTelkom;

    beforeEach(inject(function (_$httpBackend_, _URL_, _RechargeService_, _ServiceError_, _Fixture_, _ServiceTest_) {
        Fixture = _Fixture_;
        URL = _URL_;
        $httpBackend = _$httpBackend_;
        service = _RechargeService_;
        serviceTestHelper = _ServiceTest_;

        prepaidProviderDetailsSpy = serviceTestHelper.spyOnEndpoint('prepaidProviderDetails');
        ServiceError = _ServiceError_;
        recharge =
        { account: {'number': '123123123123'}, rechargeNumber: '0831111111', amount: '10', provider: { id: 'Vodacom', serviceId: 'Vodacom-Service-Id', product: { type: 'Mobile', bundle: { productCode: 'Anything', amount: {amount: 1}}}}};
        rechargeTelkom =
        { account: {'number': '123123123123'}, rechargeNumber: '0831111111', amount: '10', provider: { id: 'Telkom Mobile', serviceId: 'Heita', product: { type: 'Mobile', bundle: { productCode: 'Anything', amount: {amount: 1}}}}};
    }));

    describe('when listing providers', function () {

        beforeEach(function () {
            response =
                JSON.parse(Fixture.load('base/test/unit/fixtures/prepaidProviderDetailsResponse.json'));
            serviceTestHelper.stubResponse('prepaidProviderDetails', 200, response, {'x-sbg-response-code': '0000'});
        });

        describe('provider details', function () {

            describe('products', function () {

                it('should group products by type', function (done) {
                    function productTypes(provider) {
                        return _.map(provider.products, function (product) {
                            return product.type;
                        });
                    }

                    service.listProviders().then(function (providerList) {
                        expect(productTypes(providerList[0])).toEqual(['Airtime']);
                        expect(productTypes(providerList[2])).toEqual(['Airtime', 'SMS', 'Data']);
                        expect(productTypes(providerList[5])).toEqual(['Electricity']);
                        done();
                    });
                    serviceTestHelper.resolvePromise();
                });

                it('should resolve the product name by type', function (done) {
                    service.listProviders().then(function (providerList) {
                        var airtimeProduct = providerList[2].products[0];
                        var smsProduct = providerList[2].products[1];
                        var dataProduct = providerList[2].products[2];
                        var electricityProduct = providerList[5].products[0];
                        expect(airtimeProduct.name).toEqual('Airtime');
                        expect(smsProduct.name).toEqual('SMS bundles');
                        expect(dataProduct.name).toEqual('Data bundles');
                        expect(electricityProduct.name).toEqual('Electricity');
                        done();
                    });
                    serviceTestHelper.resolvePromise();
                });

               it('should identify provider type', function (done) {
                    service.listProviders().then(function (providerList) {
                        expect(providerList[0].type).toEqual('mobile');
                        expect(providerList[1].type).toEqual('mobile');
                        expect(providerList[2].type).toEqual('mobile');
                        expect(providerList[3].type).toEqual('mobile');
                        expect(providerList[4].type).toEqual('mobile');
                        expect(providerList[5].type).toEqual('electricity');
                        done();
                    });
                    serviceTestHelper.resolvePromise();
                });

                it('should resolve range by product type', function (done) {
                    expect(service.listProviders()).toBeResolved();
                    service.listProviders().then(function (providerList) {
                        var airtimeProduct = providerList[2].products[0];
                        var smsProduct = providerList[2].products[1];
                        var dataProduct = providerList[2].products[2];
                        var electricityProduct = providerList[5].products[0];
                        expect(airtimeProduct.range).toEqual({max: 500, min: 5});
                        expect(smsProduct.range).toEqual(null);
                        expect(dataProduct.range).toEqual(null);
                        expect(electricityProduct.range).toEqual({max: 500, min: 10});
                        done();
                    });
                    serviceTestHelper.resolvePromise();
                });

                it('should order products', function () {
                    var responseWithUnorderedBundles = {
                        "prepaidProviders": [
                            {
                                "friendlyName": "MTN",
                                "prepaidProduct": [
                                    {
                                        "prepaidType": "SMS"
                                    },
                                    {
                                        "prepaidType": "Data"
                                    },
                                    {
                                        "prepaidType": "Airtime"
                                    }
                                ],
                                "prepaidProviderType": "MTN"
                            }
                        ]
                    };
                    serviceTestHelper.stubResponse('prepaidProviderDetails', 200, responseWithUnorderedBundles,
                        {'x-sbg-response-code': '0000'});

                    expect(service.listProviders()).toBeResolved();
                    service.listProviders().then(function (providerList) {
                        var products = providerList[0].products;
                        expect(products[0].type).toEqual('Airtime');
                        expect(products[1].type).toEqual('SMS');
                        expect(products[2].type).toEqual('Data');
                    });
                    serviceTestHelper.resolvePromise();

                });

                it('should return the same number of products after sorting them', function () {
                    var responseWithUnorderedBundles = {
                        "prepaidProviders": [
                            {
                                "friendlyName": "MTN",
                                "prepaidProduct": [
                                    {
                                        "prepaidType": "SMS"
                                    }
                                ],
                                "prepaidProviderType": "MTN"
                            }
                        ]
                    };
                    serviceTestHelper.stubResponse('prepaidProviderDetails', 200, responseWithUnorderedBundles,
                        {'x-sbg-response-code': '0000'});

                    expect(service.listProviders()).toBeResolved();
                    service.listProviders().then(function (providerList) {
                        var products = providerList[0].products;
                        expect(products[0]).toBeDefined('This should be a real product');
                        expect(products[0].type).toEqual('SMS');
                    });
                    serviceTestHelper.resolvePromise();

                });
            });

            describe('bundles', function () {
                it('should sort bundles by amount', function () {
                    var responseWithUnorderedBundles = {
                        "prepaidProviders": [
                            {
                                "friendlyName": "MTN",
                                "prepaidProduct": [
                                    {
                                        "friendlyName": "MTN SMS Bundle",
                                        "prepaidPreset": [
                                            {
                                                "amount": {
                                                    "amount": 35,
                                                    "currency": "ZAR"
                                                },
                                                "friendlyName": "100 SMS Bundle @ R35",
                                                "productCode": "SMS100"
                                            },
                                            {
                                                "amount": {
                                                    "amount": 25,
                                                    "currency": "ZAR"
                                                },
                                                "friendlyName": "50 SMS Bundle @ 25",
                                                "productCode": "SMS50"
                                            },
                                            {
                                                "amount": {
                                                    "amount": 50,
                                                    "currency": "ZAR"
                                                },
                                                "friendlyName": "200 SMS Bundle @ R50",
                                                "productCode": "SMS200"
                                            }
                                        ],
                                        "prepaidType": "SMS",
                                        "range": null
                                    }
                                ],
                                "prepaidProviderType": "MTN"
                            }
                        ]
                    };
                    serviceTestHelper.stubResponse('prepaidProviderDetails', 200, responseWithUnorderedBundles,
                        {'x-sbg-response-code': '0000'});

                    expect(service.listProviders()).toBeResolved();
                    service.listProviders().then(function (providerList) {
                        var bundles = providerList[0].products[0].bundles;
                        expect(bundles[0].amount.amount).toEqual(25);
                        expect(bundles[1].amount.amount).toEqual(35);
                        expect(bundles[2].amount.amount).toEqual(50);
                    });
                    serviceTestHelper.resolvePromise();
                });

                it('should remove bundles from the Airtime product', function () {
                    var responseWithUnorderedBundles = {
                        "prepaidProviders": [
                            {
                                "friendlyName": "MTN",
                                "prepaidProduct": [
                                    {
                                        "friendlyName": "MTN Airtime",
                                        "prepaidPreset": [
                                            {
                                                "amount": {
                                                    "amount": 5,
                                                    "currency": "ZAR"
                                                },
                                                "friendlyName": "5 Airtime Bundle @ R5",
                                                "productCode": ""
                                            },
                                            {
                                                "amount": {
                                                    "amount": 10,
                                                    "currency": "ZAR"
                                                },
                                                "friendlyName": "10 Airtime Bundle @ R10",
                                                "productCode": ""
                                            }
                                        ],
                                        "prepaidType": "Airtime",
                                        "range": {
                                            "max": 500,
                                            "min": 5
                                        }
                                    }
                                ],
                                "prepaidProviderType": "MTN"
                            }
                        ]
                    };
                    serviceTestHelper.stubResponse('prepaidProviderDetails', 200, responseWithUnorderedBundles,
                        {'x-sbg-response-code': '0000'});

                    expect(service.listProviders()).toBeResolved();
                    service.listProviders().then(function (providerList) {
                        expect(providerList[0].products[0].bundles).toBeUndefined();
                    });
                    serviceTestHelper.resolvePromise();
                });

                it('should group by bundle type', function (done) {
                    service.listProviders().then(function (providerList) {
                        var smsProduct = providerList[2].products[1];
                        expect(smsProduct.bundles[0].name).toEqual('50 SMS Bundle @ R25');
                        expect(smsProduct.bundles[0].productCode).toEqual('SMS50');
                        expect(smsProduct.bundles[0].amount.amount).toEqual(25);
                        expect(smsProduct.bundles[1].name).toEqual('100 SMS Bundle @ R35');
                        expect(smsProduct.bundles[1].productCode).toEqual('SMS100');
                        expect(smsProduct.bundles[1].amount.amount).toEqual(35);
                        expect(smsProduct.bundles[2].name).toEqual('200 SMS Bundle @ R50');
                        expect(smsProduct.bundles[2].productCode).toEqual('SMS200');
                        expect(smsProduct.bundles[2].amount.amount).toEqual(50);
                        expect(smsProduct.bundles[3].name).toEqual('500 SMS Bundle @ R114');
                        expect(smsProduct.bundles[3].productCode).toEqual('SMS500');
                        expect(smsProduct.bundles[3].amount.amount).toEqual(114);
                        expect(smsProduct.bundles[4].name).toEqual('2000 SMS Bundle @ R420');
                        expect(smsProduct.bundles[4].productCode).toEqual('SMS2000');
                        expect(smsProduct.bundles[4].amount.amount).toEqual(420);
                        done();
                    });
                    serviceTestHelper.resolvePromise();
                });
            });

            it('should return a name to be displayed to the users', function (done) {
                service.listProviders().then(function (providerList) {
                    expect(providerList[0].name).toEqual('CellC');
                    expect(providerList[2].name).toEqual('MTN');
                    expect(providerList[5].name).toEqual('Electricity');
                    done();
                });
                serviceTestHelper.resolvePromise();
            });

            it('should return an identifier to be used by the controller', function (done) {
                service.listProviders().then(function (providerList) {
                    expect(providerList[0].id).toEqual('cellc');
                    expect(providerList[2].id).toEqual('mtn');
                    expect(providerList[5].id).toEqual('electricity');
                    done();
                });
                serviceTestHelper.resolvePromise();
            });

            it('should add the prepaidProviderType as the serviceId of each provider', function (done) {
                expect(service.listProviders()).toBeResolved();
                service.listProviders().then(function (providerList) {
                    expect(providerList[0].serviceId).toEqual('CellC');
                    expect(providerList[2].serviceId).toEqual('MTN');
                    expect(providerList[5].serviceId).toEqual('Electricity');
                    done();
                });
                serviceTestHelper.resolvePromise();
            });
        });

        it('should cache the provider list forever', function () {
            service.listProviders();
            serviceTestHelper.resolvePromise();

            service.listProviders();
            serviceTestHelper.resolvePromise();

            expect(serviceTestHelper.endpoint('prepaidProviderDetails').calls.count()).toBe(1);
        });

        it('should return an error message if the service call returns an error code', function (done) {
            serviceTestHelper.stubResponse('prepaidProviderDetails', 200, {}, {'x-sbg-response-code': '9999'});

            service.listProviders().catch(function (listOfProvider) {
                expect(listOfProvider.message).toEqual('An error has occurred');
                done();
            });
            serviceTestHelper.resolvePromise();
        });

        it('should return an error message if the service call fails', function (done) {
            serviceTestHelper.stubResponse('prepaidProviderDetails', 500, {}, {});

            service.listProviders().catch(function (listOfProvider) {
                expect(listOfProvider.message).toEqual('An error has occurred');
                done();
            });
            serviceTestHelper.resolvePromise();
        });
    });

    describe('when recharging', function () {

        describe('when generating the request', function () {
            beforeEach(function () {
                rechargeSpy = serviceTestHelper.spyOnEndpoint('prepaidRecharge');
                serviceTestHelper.stubResponse('prepaidRecharge', 200, {}, {'x-sbg-response-code': '0000'});
            });

            it('should set account', function () {
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.account).toBe(recharge.account);
            });

            it('should set recharge number', function () {
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].rechargeNumber).toBe(recharge.rechargeNumber);
            });

            it('should set prepaid type', function () {
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].prepaidType).toBe(recharge.provider.product.type);
            });

            it('should set prepaid provider type', function () {
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].basePrepaidProvider.prepaidProviderType).toBe(recharge.provider.serviceId);
            });

            it('should set amount from recharge.provider.product.amount for a product without bundles', function () {
                recharge.provider.product.bundle = undefined;
                recharge.provider.product.amount = 3;
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].amount.amount).toBe(3);
            });

            it('should set amount from the bundle for a product with bundles', function () {
                recharge.provider.product.bundle = {amount: {amount: 9}};
                recharge.provider.product.amount = undefined;
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].amount.amount).toBe(9);
            });

            it('should set product code to undefined for product without bundles', function () {
                recharge.provider.product.bundle = undefined;
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].productCode).toBeUndefined();
            });

            it('should set product code for product with bundles', function () {
                service.recharge(recharge);
                var request = rechargeSpy.calls.argsFor(0)[0];
                expect(request.transactions.prepaidPurchases[0].productCode).toBe(recharge.provider.product.bundle.productCode);
            });
        });

        describe('when the service returns a successful response', function () {

            it('should resolve with the data contained in the response from the service', function () {
                serviceTestHelper.spyOnEndpoint('prepaidRecharge');
                var data = {cardProfile: 'someCardStuff'};
                serviceTestHelper.stubResponse('prepaidRecharge', 200, data, {'x-sbg-response-code': '0000'});

                expect(service.recharge(recharge)).toBeResolvedWith(data);
                serviceTestHelper.resolvePromise();
            });

        });

        describe('when the new service returns a successful response ', function () {

            it('should resolve with the data contained in the response from the service', function () {
                serviceTestHelper.spyOnEndpoint('prepaidRechargePurchase');
                var data = {cardProfile: 'someCardStuff'};
                serviceTestHelper.stubResponse('prepaidRechargePurchase', 200, data, {'x-sbg-response-code': '0000'});
                recharge.provider.serviceId = 'Heita';

                expect(service.recharge(recharge)).toBeResolvedWith(data);
                serviceTestHelper.resolvePromise();
            });

        });

        describe('when an error is returned from the service', function () {

            var rechargeRequest = { account: {'number': '123123123123'}, transactions: {
                prepaidPurchases: [
                    {
                        rechargeNumber: '0831111111',
                        prepaidType: 'Mobile',
                        basePrepaidProvider: {
                            prepaidProviderType: 'Vodacom-Service-Id'
                        },
                        amount: {
                            amount: 1
                        },
                        productCode: 'Anything'
                    }
                ]
            } };

            it('should return an error when there is a service failure while recharging', function (done) {
                $httpBackend.expectPUT(URL.transactions, rechargeRequest).respond(500);

                service.recharge(recharge).catch(function (response) {
                    expect(response).toEqual(ServiceError.newInstance('An error has occurred', rechargeRequest));
                    expect(accountsService.clear).toHaveBeenCalled();
                    done();
                });
                $httpBackend.flush();
            });

            using([
                    {code: '9999', message: 'An error has occurred'},
                    {code: '2160', message: 'You have exceeded your daily cash withdrawal limit.'},
                    {code: '9018', message: 'Recharge unsuccessful. Please try again later'},
                    {code: '2170', message: 'You have exceeded your monthly withdrawal limit'},
                    {code: '2190', message: 'Daily prepaid transactions limit exceeded. Please try again tomorrow'},
                    {code: '9104', message: 'Transaction declined. Please contact your electricity provider for the status of your account'},
                    {code: '9019', message: 'Invalid cell phone number. Please try again'},
                    {code: '2180', message: 'Recharge limit exceeded for today'},
                    {code: '2016', message: 'You have insufficient funds in this account to make the requested payments'}
                ],
                function (example) {
                    it('should return the corresponding error when recharge operation fails with code ' + example.code,
                        function (done) {
                            serviceTestHelper.spyOnEndpoint('prepaidRecharge');
                            serviceTestHelper.stubResponse('prepaidRecharge', 200, {},
                                {'x-sbg-response-code': example.code});

                            service.recharge(recharge).catch(function (response) {
                                expect(response).toEqual(ServiceError.newInstance(example.message, rechargeRequest));
                                expect(accountsService.clear).toHaveBeenCalled();
                                done();
                            });
                            serviceTestHelper.resolvePromise();
                        });
                }
            );

            it('should return the generic otp locked error message when otp locked error occurs', function () {
                $httpBackend.expectPUT(URL.prepaidRecharge, rechargeRequest).respond(200, {},
                    {'x-sbg-response-type': 'ERROR', 'x-sbg-response-code': '1020'});

                service.recharge(recharge).catch(function (response) {
                    expect(response).toEqual(ServiceError.newInstance("Your OTP service has been locked. Please call Customer Care on 0860 123 000",
                        rechargeRequest));
                });
                $httpBackend.flush();
            });
        });
    });

});
