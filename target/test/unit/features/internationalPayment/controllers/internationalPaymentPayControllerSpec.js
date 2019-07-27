describe('Unit Test - International Payment Pay Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentPayController', 'refresh.test'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment pay controller', function () {
            expect(route.routes['/international-payment/pay'].controller).toBe('InternationalPaymentPayController');
        });

        it('should load the international payment pay template', function () {
            expect(route.routes['/international-payment/pay'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentPay.html');
        });
    });

    describe('controller', function () {
        var controller, scope, location, mock, card, accountsService, internationalPaymentService, accounts, payAccount, beneficiary, Flow, internationalPaymentCustomer, internationalPaymentBeneficiary;

        var currencies = [
            {
                "code": "AUD",
                "currencyPair": "ZAR/AUD",
                "name": "Australian Dollar"
            },
            {
                "code": "USD",
                "currencyPair": "ZAR/USD",
                "name": "US Dollar"
            }
        ];

        function invokeController() {
            controller('InternationalPaymentPayController', {
                $scope: scope,
                $location: location,
                Flow: Flow,
                AccountsService: accountsService,
                InternationalPaymentService: internationalPaymentService,
                InternationalPaymentCustomer: internationalPaymentCustomer
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _mock_, $q, _Flow_,
                                    InternationalPaymentBeneficiary) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            Flow = _Flow_;
            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;

            mock = _mock_;

            card = jasmine.createSpyObj('card', ['current']);
            card.current.and.returnValue({number: 'number'});

            accountsService =
                jasmine.createSpyObj('accountsService', ['currentAndSavingsAccounts', 'validFromPaymentAccounts']);
            accountsService.currentAndSavingsAccounts.and.returnValue($q.defer().promise);


            internationalPaymentService =
                jasmine.createSpyObj('internationalPaymentService',
                    ['validateDetails', 'getConversionRates', 'getCurrencies']);
            internationalPaymentService.validateDetails.and.returnValue($q.defer().promise);
            internationalPaymentService.getConversionRates.and.returnValue($q.defer().promise);
            internationalPaymentService.getCurrencies.and.returnValue(mock.resolve(currencies));

            internationalPaymentCustomer = jasmine.createSpyObj('internationalPaymentCustomer', ['customer']);
            internationalPaymentCustomer.customer.and.returnValue({
                isResident: function () {
                    return true;
                }, customerTierCode: 'RETAIL', countryCode: 'ZA'
            });

            beneficiary = internationalPaymentBeneficiary.initialize();
            beneficiary.bank = {
                currency: {
                    code: 'USD',
                    name: 'US Dollar',
                    currencyPair: 'USD/ZAR'
                }
            };

            payAccount = {
                availableBalance: {
                    amount: 3000,
                    currency: 'ZAR'
                }
            };
            accounts = [payAccount];
            accountsService.currentAndSavingsAccounts.and.returnValue(mock.resolve(accounts));
            accountsService.validFromPaymentAccounts.and.returnValue(accounts);
        }));


        describe('when initializing', function () {
            it('should set a payFromAccounts list on the scope', function () {
                invokeController();

                expect(scope.payFromAccounts).toEqual(accounts);
            });

            it("should set beneficiary details on the scope", function () {
                invokeController();
                expect(scope.beneficiary.bank.currency).toEqual({
                    code: 'USD',
                    name: 'US Dollar',
                    currencyPair: 'USD/ZAR'
                });
            });

            it("should set customer on the scope", function () {
                invokeController();
                expect(scope.customer.customerTierCode).toEqual("RETAIL");
            });

            it('should set a currencies on the scope from the beneficiary chosen currency including ZAR if first account is rand account',
                function () {
                    invokeController();

                    expect(scope.currencies).toEqual([{
                        code: 'USD',
                        description: '(USD) US Dollar',
                        currencyPair: 'USD/ZAR'
                    },
                        {
                            code: 'ZAR',
                            description: '(ZAR) South African Rand',
                            currencyPair: 'USD/ZAR'
                        }
                    ]);
                });

            it('should set a currencies on the scope from the beneficiary chosen currency and excluding ZAR if first account is not a rand account',
                function () {
                    payAccount = {
                        availableBalance: {
                            amount: 3000,
                            currency: 'GBP'
                        }
                    };
                    accounts = [payAccount];
                    accountsService.currentAndSavingsAccounts.and.returnValue(mock.resolve(accounts));
                    accountsService.validFromPaymentAccounts.and.returnValue(accounts);

                    invokeController();

                    expect(scope.currencies).toEqual([{
                        code: 'USD',
                        description: '(USD) US Dollar',
                        currencyPair: 'USD/GBP'
                    }]);
                });

            it('should set the currencyList on the scope', function () {
                invokeController();

                expect(scope.currencyList).toEqual(currencies);
            });

            it('should create a beneficiary pay object if it does not exist', function () {
                invokeController();

                expect(scope.beneficiary.pay).toEqual({
                    currency: scope.currencies[0],
                    fromAccount: payAccount
                });
            });

            it('should not create a beneficiary pay object if it does exists', function () {
                beneficiary.pay = {
                    existing_value: "existing_value",
                    fromAccount: payAccount
                };

                invokeController();

                expect(scope.beneficiary.pay.existing_value).toEqual("existing_value");
            });

            it('should set the rates error message if it exists', function() {
                beneficiary.rates = {
                   error: {
                       message: 'Oh dear, something is broken'
                   }
                };

                invokeController();

                expect(scope.errorMessage).toEqual('Oh dear, something is broken');
            });
        });

        it('should highlight balance when transfer amount exceeds it for the same currency', function () {
            invokeController();

            beneficiary.pay.currency = {
                code: 'ZAR'
            };
            beneficiary.pay.amount = 5000;

            expect(scope.highlightBalance()).toBeTruthy();
        });

        it('should not highlight balance when transfer amount exceeds it for a different currency', function () {
            invokeController();

            beneficiary.pay.currency = {
                code: 'GBP'
            };
            beneficiary.pay.amount = 5000;

            expect(scope.highlightBalance()).toBeFalsy();
        });

        it('should not highlight balance when transfer amount exceeds balance for a different currency', function () {
            invokeController();

            beneficiary.pay.currency = {
                code: 'GBP'
            };
            beneficiary.pay.amount = 5000;

            expect(scope.highlightBalance()).toBeFalsy();
        });

        it('should return amount invalid error object for enforcer when different currency and format is invalid', function () {
            invokeController();

            beneficiary.pay.currency = {
                code: 'GBP'
            };

            expect(scope.enforcer(5000.121).message).toEqual('Please enter the amount in a valid format');
        });

        it('should return empty object object for enforcer when different currency and absolute amount is greater than account absolute amount', function () {
            invokeController();

            beneficiary.pay.currency = {
                code: 'GBP'
            };

            expect(scope.enforcer(5000)).toEqual({});
        });

        it('should return empty object object for enforcer when currency is greater than 4 999 999', function () {
            invokeController();

            beneficiary.pay.currency = {
                code: 'GBP'
            };

            expect(scope.enforcer(500000000)).toEqual({});
        });

        describe("when account is changed", function () {
            it('should populate the currency list with selected foreign currency account', function () {
                invokeController();

                scope.beneficiary.pay.fromAccount.availableBalance = {currency: "AUD", name: "Australian Dollar"};
                var expected_currencies = [{
                    code: 'USD',
                    currencyPair: 'USD/AUD',
                    description: '(USD) US Dollar'
                }, {
                    code: 'AUD',
                    currencyPair: 'USD/AUD',
                    description: '(AUD) Australian Dollar'
                }];
                scope.populateCurrencyList();

                expect(scope.currencies).toEqual(expected_currencies);
            });

            it('should populate the currency list with selected ZAR currency account', function () {
                invokeController();

                scope.beneficiary.pay.fromAccount.availableBalance = {currency: "ZAR"};
                var expected_currencies = [{
                    code: 'USD',
                    currencyPair: 'USD/ZAR',
                    description: '(USD) US Dollar'
                }, {
                    code: 'ZAR',
                    currencyPair: 'USD/ZAR',
                    description: '(ZAR) South African Rand'
                }];
                scope.populateCurrencyList();

                expect(scope.currencies).toEqual(expected_currencies);
            });

            it('should populate the beneficiary pay currency with beneficiary bank currency if undefined', function () {
                invokeController();

                scope.beneficiary.pay.fromAccount.availableBalance = {currency: "AUD", name: "Australian Dollar"};
                var expected_beneficiary_pay_currency = {
                    code: 'USD',
                    currencyPair: 'USD/AUD',
                    description: '(USD) US Dollar'
                };
                scope.populateCurrencyList();

                expect(scope.beneficiary.pay.currency).toEqual(expected_beneficiary_pay_currency);
            });

            it('should populate the beneficiary pay currency with beneficiary bank currency if previously selected currency not in updated currency list',
                function () {
                    invokeController();

                    scope.beneficiary.pay.fromAccount.availableBalance = {currency: "AUD", name: "Australian Dollar"};
                    scope.beneficiary.pay.currency = {
                        code: 'GBP',
                        currencyPair: 'USD/GBP',
                        description: '(GBP) Pound'
                    };
                    var expected_beneficiary_pay_currency = {
                        code: 'USD',
                        currencyPair: 'USD/AUD',
                        description: '(USD) US Dollar'
                    };
                    scope.populateCurrencyList();

                    expect(scope.beneficiary.pay.currency).toEqual(expected_beneficiary_pay_currency);
                });

            it('should not populate the beneficiary pay currency with first currency if defined and in currency list',
                function () {
                    invokeController();

                    var expected_beneficiary_pay_currency = {
                        code: 'AUD',
                        currencyPair: 'USD/AUD',
                        description: '(AUD) Australian Dollar'
                    };
                    scope.beneficiary.pay.fromAccount.availableBalance = {currency: "AUD", name: "Australian Dollar"};
                    scope.beneficiary.pay.currency = expected_beneficiary_pay_currency;

                    scope.populateCurrencyList();

                    expect(scope.beneficiary.pay.currency).toEqual(expected_beneficiary_pay_currency);
                });
        });

        describe('when getting the payment currency code', function () {
            it('should return the payment currency code if not ZAR', function () {
                invokeController();
                scope.beneficiary.pay.currency.code = 'USD';

                expect(scope.getCurrencyCode()).toEqual('USD');
            });

            it('should be R if the payment currency is ZAR', function () {
                invokeController();
                scope.beneficiary.pay.currency.code = 'ZAR';

                expect(scope.getCurrencyCode()).toEqual('R');
            });

            it('should be an empty string if there is no currency', function () {
                invokeController();
                scope.beneficiary.pay.currency = null;

                expect(scope.getCurrencyCode()).toEqual('');
            });
        });

        describe("when next is clicked", function () {
            describe('when customs client number is defined', function () {
                it('should send the CCN details if defined', function () {
                    invokeController();
                    scope.beneficiary.pay.customsClientNumber = '12343214';
                    scope.next();

                    expect(internationalPaymentService.validateDetails).toHaveBeenCalledWith({
                        CCN: '12343214'
                    });
                });

                it('should set the correct validation message if customs client number is invalid', function () {
                    internationalPaymentService.validateDetails.and.returnValue(mock.resolve({
                        "isCCNValid": false
                    }));

                    invokeController();

                    scope.beneficiary.pay.customsClientNumber = '12343214';

                    scope.next();
                    scope.$digest();

                    expect(scope.errorMessage).toEqual('Invalid CCN');
                });

                describe('when customs client number is correct', function () {
                    var conversionRate = {
                        "convertedAmount": {
                            "currency": 'R',
                            "amount": 765
                        }
                    };

                    beforeEach(function () {
                        internationalPaymentService.validateDetails.and.returnValue(mock.resolve({
                            "isCCNValid": true
                        }));
                        internationalPaymentService.getConversionRates.and.returnValue(mock.resolve(conversionRate));
                        spyOn(Flow, 'next');

                        invokeController();
                        scope.beneficiary.pay = {
                            customsClientNumber: '12343214',
                            fromAccount: {
                                availableBalance: {
                                    amount: 500,
                                    currency: 'ZAR'
                                }
                            },
                            currency: {
                                code: 'USD',
                                pair: 'USD/ZAR'
                            },
                            amount: 300
                        };
                        scope.next();
                        scope.$digest();
                    });

                    it('should navigate to international payment confirm page', function () {
                        expect(location.url()).toBe('/international-payment/confirm');
                    });

                    it('should continue to the next step of Flow', function () {
                        expect(Flow.next).toHaveBeenCalled();
                    });

                    it('should set the beneficiary rates objects', function () {
                        expect(scope.beneficiary.rates).toEqual(conversionRate);
                    });
                });
            });

            describe('when customs client number is not defined', function () {
                beforeEach(function () {
                    spyOn(Flow, 'next');
                    invokeController();

                    scope.beneficiary.pay = {
                        fromAccount: {
                            availableBalance: {
                                amount: 500,
                                currency: 'ZAR'
                            }
                        },
                        currency: {
                            code: 'USD',
                            pair: 'USD/ZAR'
                        },
                        amount: 300
                    };
                });

                describe('navigation next', function () {

                    describe('when the request is successful', function() {
                        var conversionRate = {
                            "convertedAmount": {
                                "currency": 'R',
                                "amount": 765
                            }
                        };

                        beforeEach(function () {
                            internationalPaymentService.getConversionRates.and.returnValue(mock.resolve(conversionRate));
                            spyOn(internationalPaymentBeneficiary, 'setConversionRates');

                            scope.next();
                            scope.$digest();
                        });

                        it('should navigate to international payment confirm page', function () {
                            expect(location.url()).toBe('/international-payment/confirm');
                        });

                        it('should continue to the next step of Flow', function () {
                            expect(Flow.next).toHaveBeenCalled();
                        });

                        it('should set the conversion rates on the beneficiary', function () {
                            expect(internationalPaymentBeneficiary.setConversionRates).toHaveBeenCalledWith(conversionRate);
                        });
                    });

                    describe('when the request is not successful', function() {
                        beforeEach(function () {
                            internationalPaymentService.getConversionRates.and.returnValue(mock.reject({
                                error: {
                                    message: 'Oops, something went wrong'
                                }
                            }));

                            scope.next();
                            scope.$digest();
                        });

                        it('should navigate to the pay page', function () {
                            expect(location.url()).toBe('/international-payment/pay');
                        });

                        it('should set the error on the rates object', function() {
                            expect(beneficiary.rates.error).toEqual({
                                message: 'Oops, something went wrong'
                            });
                        });
                    });
                });

                describe('beneficiary rates international amount', function () {
                    it('should set it to the converted amount if the currency code is not "R"', function () {
                        internationalPaymentService.getConversionRates.and.returnValue(mock.resolve({
                            "convertedAmount": {
                                "currency": 'GBP',
                                "amount": 765
                            }
                        }));

                        scope.next();
                        scope.$digest();

                        expect(scope.beneficiary.rates.internationalAmount).toEqual(765);
                    });

                    it('should set it to the beneficiary pay amount if the currency code is "R"', function () {
                        internationalPaymentService.getConversionRates.and.returnValue(mock.resolve({
                            "convertedAmount": {
                                "currency": 'R',
                                "amount": 765
                            }
                        }));

                        scope.next();
                        scope.$digest();

                        expect(scope.beneficiary.rates.internationalAmount).toEqual(300);
                    });
                });

                describe('beneficiary rates zar amount', function () {
                    it('should set it to the converted amount if the currency code is "R"', function () {
                        internationalPaymentService.getConversionRates.and.returnValue(mock.resolve({
                            "convertedAmount": {
                                "currency": 'R',
                                "amount": 765
                            }
                        }));

                        scope.next();
                        scope.$digest();

                        expect(scope.beneficiary.rates.zarAmount).toEqual(765);
                    });

                    it('should set it to the beneficiary pay amount if the currency code is not "R"', function () {
                        internationalPaymentService.getConversionRates.and.returnValue(mock.resolve({
                            "convertedAmount": {
                                "currency": 'GBP',
                                "amount": 765
                            }
                        }));

                        scope.next();
                        scope.$digest();

                        expect(scope.beneficiary.rates.zarAmount).toEqual(300);
                    });
                });

                describe('get conversion rates request', function () {
                    beforeEach(function () {
                        scope.beneficiary.bank.swift = 'BIC123';
                    });

                    it('should define buy amount if beneficiary currency equals the payment currency', function () {
                        scope.beneficiary.pay = {
                            fromAccount: {
                                availableBalance: {
                                    amount: 500,
                                    currency: 'ZAR'
                                }
                            },
                            currency: {
                                code: 'USD',
                                currencyPair: 'USD/ZAR'
                            },
                            amount: 300
                        };

                        var expectedConversionRateRequest = {
                            availableBalance: {amount: 500, currency: 'ZAR'},
                            beneficiaryBicCode: 'BIC123',
                            buyAmount: {amount: 300, currency: 'USD'},
                            countryCode: 'ZA',
                            currencyPair: 'USD/ZAR',
                            customerTierCode: 'RETAIL',
                            sellAmount: {amount: 0, currency: 'ZAR'}
                        };

                        scope.next();
                        scope.$digest();

                        expect(internationalPaymentService.getConversionRates).toHaveBeenCalledWith(expectedConversionRateRequest);
                    });

                    it('should define sell amount if beneficiary currency does not equal the payment currency', function () {
                        scope.beneficiary.pay = {
                            fromAccount: {
                                availableBalance: {
                                    amount: 500,
                                    currency: 'ZAR'
                                }
                            },
                            currency: {
                                code: 'ZAR',
                                currencyPair: 'USD/ZAR'
                            },
                            amount: 300
                        };

                        var expectedConversionRateRequest = {
                            availableBalance: {amount: 500, currency: 'ZAR'},
                            beneficiaryBicCode: 'BIC123',
                            buyAmount: {amount: 0, currency: 'USD'},
                            countryCode: 'ZA',
                            currencyPair: 'USD/ZAR',
                            customerTierCode: 'RETAIL',
                            sellAmount: {amount: 300, currency: 'ZAR'}
                        };

                        scope.next();
                        scope.$digest();

                        expect(internationalPaymentService.getConversionRates).toHaveBeenCalledWith(expectedConversionRateRequest);
                    });

                    it('should keep the country as ZA', function () {
                        scope.beneficiary.pay = {
                            fromAccount: {
                                availableBalance: {
                                    amount: 500,
                                    currency: 'ZAR'
                                }
                            },
                            currency: {
                                code: 'ZAR',
                                currencyPair: 'USD/ZAR'
                            },
                            amount: 300
                        };

                        internationalPaymentCustomer.customer().countryCode = 'IN';

                        scope.next();
                        scope.$digest();

                        var conversionRatesRequest = internationalPaymentService.getConversionRates.calls.mostRecent().args[0];
                        expect(conversionRatesRequest.countryCode).toEqual('ZA');
                    });
                });
            });
        });

        describe("when back is clicked", function () {
            beforeEach(function () {
                spyOn(Flow, 'previous');
                invokeController();
                scope.back();
            });

            it('should navigate to international payment reason page', function () {
                expect(location.url()).toBe('/international-payment/reason');
            });

            it('should continue to the previous step of Flow', function () {
                expect(Flow.previous).toHaveBeenCalled();
            });
        });
    });
});
