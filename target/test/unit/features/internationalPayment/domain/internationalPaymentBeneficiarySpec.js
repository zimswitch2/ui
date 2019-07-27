describe('International Payment Beneficiary object', function () {
    'use strict';

    var internationalPaymentBeneficiary;

    beforeEach(module('refresh.internationalPayment.domain.internationalPaymentBeneficiary'));
    beforeEach(inject(function (InternationalPaymentBeneficiary) {
        internationalPaymentBeneficiary = InternationalPaymentBeneficiary;
    }));

    beforeEach(function () {
        internationalPaymentBeneficiary.initialize();
    });

    describe('when initializing', function () {
        it('should set the beneficiary type to individual', function () {
            expect(internationalPaymentBeneficiary.current().type).toEqual('INDIVIDUAL');
        });

        it('should set the reason for payment to an empty object', function () {
            expect(internationalPaymentBeneficiary.current().reasonForPayment).toEqual({});
        });
    });

    describe('is individual', function () {
        it('should return true if beneficiary type is individual', function () {
            internationalPaymentBeneficiary.current().type = 'INDIVIDUAL';

            expect(internationalPaymentBeneficiary.current().isIndividual()).toBeTruthy();
        });

        it('should return false if beneficiary type is entity', function () {
            internationalPaymentBeneficiary.current().type = 'ENTITY';

            expect(internationalPaymentBeneficiary.current().isIndividual()).toBeFalsy();
        });
    });

    describe('is iban and account number capable', function () {
        it('should return true if beneficiary bank details allow for iban or account number', function () {
            internationalPaymentBeneficiary.current().bank = {
                country: {ibanCapable: true},
                routingName: 'SORT CODE',
                currency: 'EUR'
            };

            expect(internationalPaymentBeneficiary.current().ibanAndAccountNumberCapable()).toBeTruthy();
        });

        it('should return false if beneficiary bank details do not allow for iban or account number', function () {
            internationalPaymentBeneficiary.current().bank = {
                country: {ibanCapable: false}
            };

            expect(internationalPaymentBeneficiary.current().ibanAndAccountNumberCapable()).toBeFalsy();
        });
    });

    describe('when setting conversion rates', function () {

        beforeEach(function () {
            var beneficiary = internationalPaymentBeneficiary.current();
            beneficiary.pay = {
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

            beneficiary.bank = {
                currency: {
                    code: 'USD',
                    name: 'US Dollar',
                    currencyPair: 'USD/ZAR'
                }
            };

            beneficiary.conversionRatesRequest = {
                availableBalance: {amount: 500, currency: 'ZAR'},
                beneficiaryBicCode: 'BIC123',
                buyAmount: {amount: 0, currency: 'USD'},
                countryCode: 'ZA',
                currencyPair: 'USD/ZAR',
                customerTierCode: 'RETAIL',
                sellAmount: {amount: 300, currency: 'ZAR'}
            };
        });

        it('should set the beneficiary rates objects', function () {
            var conversionRate = {
                "convertedAmount": {
                    "currency": 'R',
                    "amount": 765
                }
            };

            internationalPaymentBeneficiary.setConversionRates(conversionRate);

            expect(internationalPaymentBeneficiary.current().rates).toEqual(conversionRate);
        });

        it('should set it to the converted amount if the currency code is not "R"', function () {
            var conversionRate = {
                "convertedAmount": {
                    "currency": 'GBP',
                    "amount": 765
                }
            };

            internationalPaymentBeneficiary.setConversionRates(conversionRate);

            expect(internationalPaymentBeneficiary.current().rates.internationalAmount).toEqual(765);
        });

        it('should set it to the beneficiary pay amount if the currency code is "R"', function () {
            var conversionRate = {
                "convertedAmount": {
                    "currency": 'R',
                    "amount": 765
                }
            };

            internationalPaymentBeneficiary.setConversionRates(conversionRate);

            expect(internationalPaymentBeneficiary.current().rates.internationalAmount).toEqual(300);
        });

        describe('when the beneficiary currency and payment currency are the same', function () {
            beforeEach(function () {
                var conversionRate = {
                    "convertedAmount": {
                        "currency": 'R',
                        "amount": 765
                    }
                };

                internationalPaymentBeneficiary.setConversionRates(conversionRate);
            });

            it('should set the pay sell amount to the converted amount', function () {

                expect(internationalPaymentBeneficiary.current().pay.sellAmount).toEqual({
                    "currency": 'ZAR',
                    "amount": 765
                });
            });

            it('should set the buy amount to the specified amount', function () {
                expect(internationalPaymentBeneficiary.current().pay.buyAmount).toEqual({
                    "currency": 'USD',
                    "amount": 300
                });
            });
        });

        describe('when the beneficiary currency and payment currency are different', function () {

            it('should set the pay buy amount to the converted amount', function () {
                var beneficiary = internationalPaymentBeneficiary.current();
                beneficiary.pay.currency.code = 'ZAR';
                beneficiary.pay.amount = 400;


                var conversionRate = {
                    "convertedAmount": {
                        "currency": 'USD',
                        "amount": 35
                    }
                };

                internationalPaymentBeneficiary.setConversionRates(conversionRate);

                expect(internationalPaymentBeneficiary.current().pay.buyAmount).toEqual({
                    "currency": 'USD',
                    "amount": 35
                });
            });

            it('should set the sell amount to the specified pay amount and code', function () {
                var beneficiary = internationalPaymentBeneficiary.current();
                beneficiary.pay.currency.code = 'ZAR';
                beneficiary.pay.amount = 400;


                var conversionRate = {
                    "convertedAmount": {
                        "currency": 'USD',
                        "amount": 35
                    }
                };

                internationalPaymentBeneficiary.setConversionRates(conversionRate);

                expect(internationalPaymentBeneficiary.current().pay.sellAmount).toEqual({
                    "currency": 'ZAR',
                    "amount": 400
                });

            });
        });

        describe('beneficiary rates zar amount', function () {
            it('should set it to the converted amount if the currency code is "R"', function () {
                var conversionRate = {
                    "convertedAmount": {
                        "currency": 'R',
                        "amount": 765
                    }
                };

                internationalPaymentBeneficiary.setConversionRates(conversionRate);

                expect(internationalPaymentBeneficiary.current().rates.zarAmount).toEqual(765);
            });

            it('should set it to the beneficiary pay amount if the currency code is not "R"', function () {
                var conversionRate = {
                    "convertedAmount": {
                        "currency": 'GBP',
                        "amount": 765
                    }
                };

                internationalPaymentBeneficiary.setConversionRates(conversionRate);

                expect(internationalPaymentBeneficiary.current().rates.zarAmount).toEqual(300);
            });
        });
    });
});