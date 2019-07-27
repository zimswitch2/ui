describe('Unit Test - International Payment Confirm Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentConfirmController', 'refresh.test'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment confirm controller', function () {
            expect(route.routes['/international-payment/confirm'].controller).toBe('InternationalPaymentConfirmController');
        });

        it('should load the international payment confirm template', function () {
            expect(route.routes['/international-payment/confirm'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentConfirm.html');
        });
    });

    describe('controller', function () {
        var controller, scope, location, mock, Flow, interval, applicationParameters, internationalPaymentBeneficiary, internationalPaymentCustomer, internationalPaymentService;

        function invokeController() {
            controller('InternationalPaymentConfirmController', {
                $scope: scope,
                $location: location,
                $interval: interval,
                Flow: Flow,
                InternationalPaymentCustomer: internationalPaymentCustomer,
                ApplicationParameters: applicationParameters,
                InternationalPaymentService: internationalPaymentService
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, $interval, _mock_, $q, _Flow_,
                                    InternationalPaymentBeneficiary, InternationalPaymentCustomer) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            interval = $interval;
            Flow = _Flow_;
            mock = _mock_;

            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;
            internationalPaymentBeneficiary.initialize();

            internationalPaymentBeneficiary.current().rates = {
                ttl: 300
            };

            internationalPaymentCustomer = InternationalPaymentCustomer;
            internationalPaymentCustomer.initialize({isResident: false});

            applicationParameters = jasmine.createSpyObj('applicationParameters', ['getVariable']);
            applicationParameters.getVariable.and.returnValue('2015-09-25');

            internationalPaymentService = jasmine.createSpyObj('internationalPaymentService', ['submitPayment', 'getConversionRates']);
            internationalPaymentService.submitPayment.and.returnValue($q.defer().promise);
        }));

        describe("on initialize", function () {
            it("should set beneficiary details on the scope", function () {
                internationalPaymentBeneficiary.current().whatever = 'whatever';

                invokeController();
                expect(scope.beneficiary.whatever).toEqual('whatever');
            });

            it("should set customer details on the scope", function () {
                invokeController();
                expect(scope.customerDetails.isResident()).toBeFalsy();
            });

            it("should set latest time stamp from server on the scope", function () {
                invokeController();
                expect(applicationParameters.getVariable).toHaveBeenCalledWith('latestTimestampFromServer');
                expect(scope.latestTimestampFromServer).toEqual('2015-09-25');
            });

            it('should set the offer elapsed popup to be hidden', function() {
                invokeController();

                expect(scope.offerElapsedPopup.isVisible).toBeFalsy();
            });
        });

        describe("when confirm is clicked", function () {

            describe('on success', function() {
                beforeEach(function () {
                    internationalPaymentService.submitPayment.and.returnValue(mock.resolve({'referenceCode': 'Ref-12345'}));
                    spyOn(interval, 'cancel');
                    invokeController();

                    scope.beneficiary = {
                        type: 'INDIVIDUAL',
                        firstName: 'Jane',
                        lastName: 'Doe',
                        gender: 'FEMALE',
                        addressLineOne: 'address',
                        city: 'city',
                        country: {data: 'country'},
                        bank: {
                            iban: 'IBAN1234',
                            swift: 'SWIFT1234',
                            country: {data: 'country'},
                            currency: 'ZAR'
                        },
                        customerDetailsData: {data: 'customer'},
                        conversionRatesRequest: {
                            sellAmount: {
                                amount: 180,
                                currency: 'R'
                            },
                            buyAmount: {
                                amount: 0,
                                currency: 'R'
                            }
                        },
                        pay: {
                            fromAccount: {
                                availableBalance: {
                                    currency: 'ZAR'
                                },
                                accountType: 'CURRENT',
                                branch: 'BENMORE',
                                number: '1234567'
                            },
                            sellAmount: {
                                amount: 180,
                                currency: 'ZAR'
                            },
                            buyAmount: {
                                amount: 240,
                                currency: 'USD'
                            }
                        },
                        preferences: {
                            theirReference: 'theirRef',
                            yourReference: 'yourRef',
                            fee: {
                                code: 'OWN'
                            }
                        },
                        rates: {
                            quoteId: 'MA16032ZA0000001',
                            conversionRateFee: {
                                totalCharge: {
                                    amount: 240,
                                    currency: 'R'
                                }
                            },
                            exchangeRate: 15.9,
                            valueDate: '2016-02-02T22:00:00.000+0000'
                        },
                        reasonForPayment: {
                            data: 'reason'
                        }
                    };

                });

                it('should set payment reference on beneficiary object', function () {
                    scope.confirm();
                    scope.$digest();
                    expect(scope.beneficiary.paymentResult).toEqual({'referenceCode': 'Ref-12345'});
                });

                it('should cancel the interval', function () {
                    scope.confirm();
                    scope.$digest();
                    expect(interval.cancel).toHaveBeenCalled();
                });

                it('should set the payment submitted on the scope to true', function() {
                    scope.confirm();
                    scope.$digest();
                    expect(scope.paymentSubmitted).toBeTruthy();
                });

                it('should call submit payment with account number if iban is undefined', function () {
                    delete scope.beneficiary.bank.iban;
                    scope.beneficiary.bank.accountNumber = 'ACC12345';
                    var accountNumberSubmitPaymentRequest = {
                        acknowledgementFlags: {
                            acceptTsAndCs: '2016-02-05T10:30:54.151Z',
                            bopDeclaration: '2016-02-05T10:30:54.151Z',
                            confirmCustomerDetails: '2016-02-05T10:30:54.151Z',
                            withinSDALimit: '2016-02-05T10:30:54.151Z'
                        },
                        bankData: {
                            accountNumber: 'ACC12345',
                            bic: 'SWIFT1234',
                            country: {data: 'country'},
                            currency: 'ZAR',
                            regionalRoutingCode: undefined
                        },
                        beneficiary: {
                            beneficiaryAddress: {
                                addressLineOne: 'address',
                                addressLineTwo: undefined,
                                city: 'city',
                                country: {data: 'country'}
                            },
                            beneficiaryType: 'INDIVIDUAL',
                            entityName: undefined,
                            firstName: 'Jane',
                            gender: 'FEMALE',
                            lastName: 'Doe'
                        },
                        bopCategory: {data: 'reason'},
                        ccn: undefined,
                        customerDetails: undefined,
                        fromAccount: {
                            accountCurrency: {currencyCode: 'ZAR'},
                            accountType: 'CURRENT',
                            branch: 'BENMORE',
                            holderName: undefined,
                            number: '1234567',
                            serialNumber: undefined
                        },
                        paymentInstruction: {
                            beneficiaryReference: 'theirRef',
                            chargeAmount: {amount: 240, currency: 'R'},
                            chargeType: 'OWN',
                            customerReference: 'yourRef',
                            exchangeRate: 15.9,
                            fromAmount: {amount: 180, currency: 'ZAR'},
                            sourceReference: 'MA16032ZA0000001',
                            toAmount: {amount: 240, currency: 'USD'},
                            valueDate: '2016-02-02T22:00:00.000+0000'
                        }
                    };

                    scope.confirm();
                    scope.$digest();

                    expect(internationalPaymentService.submitPayment).toHaveBeenCalledWith(accountNumberSubmitPaymentRequest);
                });
            });

            describe('on error', function() {
                beforeEach(function() {
                    internationalPaymentService.submitPayment.and.returnValue(mock.reject());
                    invokeController();

                    scope.beneficiary = {
                        type: 'INDIVIDUAL',
                        firstName: 'Jane',
                        lastName: 'Doe',
                        gender: 'FEMALE',
                        addressLineOne: 'address',
                        city: 'city',
                        country: {data: 'country'},
                        bank: {
                            iban: 'IBAN1234',
                            swift: 'SWIFT1234',
                            country: {data: 'country'},
                            currency: 'ZAR'
                        },
                        customerDetailsData: {data: 'customer'},
                        conversionRatesRequest: {
                            sellAmount: {
                                amount: 180,
                                currency: 'R'
                            },
                            buyAmount: {
                                amount: 0,
                                currency: 'R'
                            }
                        },
                        pay: {
                            fromAccount: {
                                availableBalance: {
                                    currency: 'ZAR'
                                },
                                accountType: 'CURRENT',
                                branch: 'BENMORE',
                                number: '1234567'
                            },
                            sellAmount: {
                                amount: 180,
                                currency: 'ZAR'
                            },
                            buyAmount: {
                                amount: 240,
                                currency: 'USD'
                            }
                        },
                        preferences: {
                            theirReference: 'theirRef',
                            yourReference: 'yourRef',
                            fee: {
                                code: 'OWN'
                            }
                        },
                        rates: {
                            quoteId: 'MA16032ZA0000001',
                            conversionRateFee: {
                                totalCharge: {
                                    amount: 240,
                                    currency: 'R'
                                }
                            },
                            exchangeRate: 15.9,
                            valueDate: '2016-02-02T22:00:00.000+0000'
                        },
                        reasonForPayment: {
                            data: 'reason'
                        }
                    };
                });

                it('should set the paymentError to true on the scope', function () {
                    scope.confirm();
                    scope.$digest();

                    expect(scope.paymentError).toBeTruthy();
                });
            });
        });

        describe("when back is clicked", function () {
            beforeEach(function () {
                spyOn(Flow, 'previous');
                invokeController();
                scope.back();
            });

            it('should navigate to international payment pay page', function () {
                expect(location.url()).toBe('/international-payment/pay');
            });

            it('should continue to the previous step of Flow', function () {
                expect(Flow.previous).toHaveBeenCalled();
            });
        });

        describe("when the interval has elapsed", function() {

           it('should show the offer elapsed popup', function() {
               invokeController();
               interval.flush(300000);

               expect(scope.offerElapsedPopup.isVisible).toBeTruthy();
           });
        });

        describe('when new rates are requested', function() {

            describe('on success', function() {
                beforeEach(function() {
                    var conversionRate = {
                        "convertedAmount": {
                            "currency": 'R',
                            "amount": 765
                        }
                    };

                    internationalPaymentService.getConversionRates.and.returnValue(mock.resolve(conversionRate));
                    spyOn(internationalPaymentBeneficiary, 'setConversionRates');
                    invokeController();

                    scope.beneficiary.conversionRatesRequest = {
                        sellAmount: {
                            amount: 180,
                            currency: 'R'
                        },
                        buyAmount: {
                            amount: 0,
                            currency: 'R'
                        }
                    };

                });

                it('should call the get conversion rates service with the previous request', function() {
                    scope.getNewRates();
                    scope.$digest();

                    expect(internationalPaymentService.getConversionRates).toHaveBeenCalledWith({
                        sellAmount: {
                            amount: 180,
                            currency: 'R'
                        },
                        buyAmount: {
                            amount: 0,
                            currency: 'R'
                        }
                    });
                });

                it('should set the conversion rates on the beneficiary', function() {
                    scope.getNewRates();
                    scope.$digest();

                    expect(internationalPaymentBeneficiary.setConversionRates).toHaveBeenCalledWith({
                        "convertedAmount": {
                            "currency": 'R',
                            "amount": 765
                        }
                    });
                });

                it('should navigate to international payment confirm page', function () {
                    scope.getNewRates();
                    scope.$digest();

                    expect(location.url()).toBe('/international-payment/confirm');
                });
            });

            describe('on error', function() {
                beforeEach(function() {
                    internationalPaymentService.getConversionRates.and.returnValue(mock.reject());
                    invokeController();
                });

                it('should set the paymentError to true on the scope', function () {
                    scope.getNewRates();
                    scope.$digest();

                    expect(scope.paymentError).toBeTruthy();
                });
            });
        });
    });
});
