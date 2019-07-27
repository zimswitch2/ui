describe('Unit Test - International Payment Beneficiary Bank Details Controller', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentBeneficiaryBankDetailsController', 'refresh.test'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the international payment beneficiary bank details controller', function () {
            expect(route.routes['/international-payment/beneficiary/bank-details'].controller).toBe('InternationalPaymentBeneficiaryBankDetailsController');
        });

        it('should load the international payment beneficiary bank details template', function () {
            expect(route.routes['/international-payment/beneficiary/bank-details'].templateUrl).toBe('features/internationalPayment/partials/internationalPaymentBeneficiaryBankDetails.html');
        });
    });

    describe('controller', function () {
        var scope, location, controller, mock, internationalPaymentService, internationalPaymentCustomer, internationalPaymentBeneficiary;

        var countries = [
            {
                "code": "AD",
                "defaultCurrency": {
                    "code": "EUR",
                    "currencyPair": null,
                    "name": "Euro"
                },
                "ibanCapable": true,
                "name": "Andorra",
                "routingName": "",
                "usableForPayment": true
            },
            {
                "code": "AE",
                "defaultCurrency": {
                    "code": "AED",
                    "currencyPair": null,
                    "name": "United Arab Emirates Dirham"
                },
                "ibanCapable": true,
                "name": "United Arab Emirates",
                "routingName": "",
                "usableForPayment": true
            }
        ];

        var currencies = [
            {
                "code": "AUD",
                "currencyPair": "ZAR/AUD",
                "name": "Australian Dollar"
            },
            {
                "code": "BWP",
                "currencyPair": "ZAR/BWP",
                "name": "Botswanan Pula"
            }
        ];

        var country = {
            "code": "GB",
            "defaultCurrency": {
                "code": "GBP",
                "currencyPair": null,
                "name": "British Pound Sterling"
            },
            "ibanCapable": true,
            "name": "United Kingdom of Great Britain and Northern Ireland",
            "routingName": "Sort Code",
            "usableForPayment": true
        };

        function StaticLookUp(staticValues) {
            return {
                values: function () {
                    return staticValues;
                }
            };
        }

        var LookUps = {
            beneficiaryAccountType: new StaticLookUp([{code: "IBAN", description: 'IBAN'}])
        };

        function initController() {
            controller('InternationalPaymentBeneficiaryBankDetailsController', {
                $scope: scope,
                $location: location,
                LookUps: LookUps,
                InternationalPaymentService: internationalPaymentService
            });

            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _mock_, $q, InternationalPaymentCustomer,
                                    InternationalPaymentBeneficiary) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            mock = _mock_;

            internationalPaymentService = jasmine.createSpyObj('internationalPaymentService',
                ['getCountries', 'getCurrencies', 'validateDetails']);
            internationalPaymentService.getCountries.and.returnValue($q.defer().promise);
            internationalPaymentService.getCurrencies.and.returnValue($q.defer().promise);
            internationalPaymentService.validateDetails.and.returnValue($q.defer().promise);

            internationalPaymentCustomer = InternationalPaymentCustomer;
            internationalPaymentCustomer.initialize({isResident: false});

            internationalPaymentBeneficiary = InternationalPaymentBeneficiary;
            internationalPaymentBeneficiary.initialize();
        }));

        describe('when initializing', function () {
            it('should set the countries on the scope', function () {

                internationalPaymentService.getCountries.and.returnValue(mock.resolve(countries));
                initController();
                expect(scope.countries).toEqual(countries);
                expect(scope.countries[0].label()).toEqual(countries[0].name);

            });

            it('should set the currencies on the scope', function () {
                internationalPaymentService.getCountries.and.returnValue(mock.resolve(countries));
                internationalPaymentService.getCurrencies.and.returnValue(mock.resolve(currencies));
                initController();
                expect(scope.currencies).toEqual(currencies);
                expect(scope.currencies[0].label()).toEqual('(' + currencies[0].code + ') ' + currencies[0].name);
            });

            it('should set the account types on the scope', function () {
                initController();
                expect(scope.accountTypes).toEqual([{code: "IBAN", description: 'IBAN'}]);
            });

            it('should set the beneficiary on the scope', function () {
                var beneficiary = internationalPaymentBeneficiary.current();

                initController();

                expect(scope.beneficiary).toEqual(beneficiary);
            });

            it('should create a beneficiary bank object if it does not exist', function () {
                initController();

                expect(scope.beneficiary.bank).toEqual({accountType: "IBAN"});
            });

            it('should not create a beneficiary bank object if it does exists', function () {
                var beneficiary = internationalPaymentBeneficiary.current();
                beneficiary.bank = {
                    accountType: "accountNumber"
                };

                initController();

                expect(scope.beneficiary.bank).toEqual({accountType: "accountNumber"});
            });
        });

        describe("when account type is changed", function () {
            beforeEach(function () {
                internationalPaymentBeneficiary.initialize();
                internationalPaymentBeneficiary.current().bank = { accountNumber: 'accountNumber',
                    routingCode: 'routingCode', iban: 'ibanNumber'};

                initController();
            });

            it('should clear beneficiary bank account fields if IBAN is selected', function () {
                scope.beneficiary.bank.accountType = 'IBAN';
                scope.accountTypeChanged();

                expect(internationalPaymentBeneficiary.current().bank.accountNumber).toBeUndefined();
                expect(internationalPaymentBeneficiary.current().bank.routingCode).toBeUndefined();
                expect(internationalPaymentBeneficiary.current().bank.iban).toEqual('ibanNumber');
            });

            it('should clear beneficiary bank iban field if account number is selected', function () {
                scope.beneficiary.bank.accountType = 'accountNumber';
                scope.accountTypeChanged();

                expect(internationalPaymentBeneficiary.current().bank.iban).toBeUndefined();
                expect(internationalPaymentBeneficiary.current().bank.accountNumber).toEqual('accountNumber');
                expect(internationalPaymentBeneficiary.current().bank.routingCode).toEqual('routingCode');
            });
        });

        describe('when the selected country is changed', function () {
            beforeEach(function () {
                internationalPaymentService.getCountries.and.returnValue(mock.resolve(countries));
                internationalPaymentService.getCurrencies.and.returnValue(mock.resolve(currencies));
                initController();
            });

            it('should set the default currency if it is included in the currency list', function () {
                var country = {
                    "code": "TZ",
                    "defaultCurrency": {
                        "code": "TZS",
                        "currencyPair": null,
                        "name": "Tanzanian Shilling"
                    },
                    "ibanCapable": false,
                    "name": "Tanzania, United Republic of",
                    "routingName": "",
                    "usableForPayment": false
                };

                var currency = {
                    "code": "TZS",
                    "currencyPair": null,
                    "name": "Tanzanian Shilling"
                };

                scope.currencies.push(currency);

                scope.beneficiary.bank.country = country;
                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.currency).toEqual(currency);
            });

            it('should clear the currency if not included in the currency list', function () {
                var country = {
                    "code": "TW",
                    "defaultCurrency": {
                        "code": "TWD",
                        "currencyPair": null,
                        "name": "New Taiwan Dollar"
                    },
                    "ibanCapable": false,
                    "name": "Taiwan, Province of China",
                    "routingName": "",
                    "usableForPayment": true
                };

                scope.beneficiary.bank.country = country;
                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.currency).toBeNull();
            });

            it('should clear the currency if no country is selected', function () {

                scope.beneficiary.bank.country = null;
                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.currency).toBeNull();
            });

            it('should set the account type to account number if the country is not IBAN capable', function () {
                var country = {
                    "code": "TW",
                    "defaultCurrency": {
                        "code": "TWD",
                        "currencyPair": null,
                        "name": "New Taiwan Dollar"
                    },
                    "ibanCapable": false,
                    "name": "Taiwan, Province of China",
                    "routingName": "",
                    "usableForPayment": true
                };

                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.accountType = 'IBAN';

                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.accountType).toEqual('accountNumber');
            });

            it('should set the routing code to the country routing code', function () {

                scope.beneficiary.bank.country = country;

                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.routingName).toEqual('Sort Code');
            });

            it('should clear the routing code if no country is selected', function () {
                scope.beneficiary.bank.country = null;
                scope.beneficiary.bank.routingName = 'existing';

                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.routingName).toBeNull();
            });

            it('should set the account type to IBAN', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.accountType = 'accountNumber';

                scope.selectedCountryChanged();

                expect(scope.beneficiary.bank.accountType).toEqual('IBAN');
            });
        });

        describe("next", function () {

            it('should send the swift and iban details if IBAN selected', function () {
                initController();
                scope.beneficiary.bank.accountType = 'IBAN';
                scope.beneficiary.bank.iban = '324455042334345';
                scope.beneficiary.bank.swift = '2341235';
                scope.beneficiary.bank.country = {
                    "code": "AD",
                    "defaultCurrency": {
                        "code": "EUR",
                        "currencyPair": null,
                        "name": "Euro"
                    },
                    "ibanCapable": true,
                    "name": "Andorra",
                    "routingName": "",
                    "usableForPayment": true
                };

                scope.next();

                expect(internationalPaymentService.validateDetails).toHaveBeenCalledWith({
                    countryCode: 'AD',
                    IBAN: '324455042334345',
                    SWIFT: '2341235'
                });
            });

            it('should send the swift details if IBAN is not selected', function () {
                initController();
                scope.beneficiary.bank.accountType = 'accountNumber';
                scope.beneficiary.bank.swift = '2341235';
                scope.beneficiary.bank.country = {
                    "code": "AD",
                    "defaultCurrency": {
                        "code": "EUR",
                        "currencyPair": null,
                        "name": "Euro"
                    },
                    "ibanCapable": true,
                    "name": "Andorra",
                    "routingName": "",
                    "usableForPayment": true
                };

                scope.next();

                expect(internationalPaymentService.validateDetails).toHaveBeenCalledWith({
                    countryCode: 'AD',
                    IBAN: null,
                    SWIFT: '2341235'
                });
            });

            describe('if both iban and swift are valid', function () {
                beforeEach(function () {
                    internationalPaymentService.validateDetails.and.returnValue(mock.resolve({
                        "isIBANValid": true,
                        "isSWIFTValid": true
                    }));

                    initController();

                    scope.beneficiary.bank.accountType = 'accountNumber';
                    scope.beneficiary.bank.swift = '2341235';
                    scope.beneficiary.bank.country = {
                        "code": "AD"
                    };

                    scope.next();
                    scope.$digest();
                });

                it('should navigate to international payment beneficiary preferences', function () {
                    expect(location.url()).toBe('/international-payment/beneficiary/preferences');
                });

                it('should set bank details active on beneficiary', function () {
                    expect(internationalPaymentBeneficiary.current().preferencesActive).toBeTruthy();
                });
            });

            it('should set the correct validation message if swift is incorrect', function () {
                internationalPaymentService.validateDetails.and.returnValue(mock.resolve({
                    "isIBANValid": true,
                    "isSWIFTValid": false
                }));

                initController();

                scope.beneficiary.bank.accountType = 'accountNumber';
                scope.beneficiary.bank.swift = '2341235';
                scope.beneficiary.bank.country = {
                    "code": "AD"
                };

                scope.next();
                scope.$digest();

                expect(scope.errorMessage).toEqual('The SWIFT/BIC you have entered is incorrect.');
            });

            it('should set the correct validation message if IBAN is incorrect', function () {
                internationalPaymentService.validateDetails.and.returnValue(mock.resolve({
                    "isIBANValid": false,
                    "isSWIFTValid": true
                }));

                initController();

                scope.beneficiary.bank.accountType = 'accountNumber';
                scope.beneficiary.bank.swift = '2341235';
                scope.beneficiary.bank.country = {
                    "code": "AD"
                };

                scope.next();
                scope.$digest();

                expect(scope.errorMessage).toEqual('The IBAN you have entered is incorrect.');
            });

            it('should set the correct validation message if both SWIFT and IBAN are incorrect', function () {
                internationalPaymentService.validateDetails.and.returnValue(mock.resolve({
                    "isIBANValid": false,
                    "isSWIFTValid": false
                }));

                initController();

                scope.beneficiary.bank.accountType = 'accountNumber';
                scope.beneficiary.bank.swift = '2341235';
                scope.beneficiary.bank.country = {
                    "code": "AD"
                };

                scope.next();
                scope.$digest();

                expect(scope.errorMessage).toEqual('The IBAN and SWIFT/BIC you have entered are incorrect.');
            });
        });

        describe("back", function () {
            beforeEach(function () {
                initController();
                scope.back();
            });

            it('should navigate to international payment beneficiary details', function () {
                expect(location.url()).toBe('/international-payment/beneficiary/details');
            });
        });

        describe('routing code', function () {
            beforeEach(function () {
                internationalPaymentService.getCountries.and.returnValue(mock.resolve(countries));
                internationalPaymentService.getCurrencies.and.returnValue(mock.resolve(currencies));
                initController();
            });

            it('should return true if account number field is selected and country is not iban capable', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.country.ibanCapable = false;
                scope.beneficiary.bank.accountType = 'accountNumber';
                scope.selectedCountryChanged();

                expect(scope.useAccountType('accountNumber')).toBeTruthy();

            });

            it('should return false if iban is selected and the country is IBAN capable', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.country.ibanCapable = true;
                scope.beneficiary.bank.accountType = 'IBAN';
                scope.selectedCountryChanged();

                expect(scope.useAccountType('accountNumber')).toBeFalsy();

            });
        });

        describe('useAccountType', function () {
            beforeEach(function () {
                internationalPaymentService.getCountries.and.returnValue(mock.resolve(countries));
                internationalPaymentService.getCurrencies.and.returnValue(mock.resolve(currencies));
                initController();
            });

            it('should return true for IBAN if IBAN is selected as account type', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.accountType = 'IBAN';

                expect(scope.useAccountType('IBAN')).toBeTruthy();
            });

            it('should return false for IBAN if account number is selected as account type', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.accountType = 'accountNumber';

                expect(scope.useAccountType('IBAN')).toBeFalsy();
            });

            it('should return false for IBAN if no country is selected', function () {
                scope.beneficiary.bank.country = null;

                expect(scope.useAccountType('IBAN')).toBeFalsy();
            });

            it('should return true for accountNumber if accountNumber is selected as account type', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.accountType = 'accountNumber';

                expect(scope.useAccountType('accountNumber')).toBeTruthy();
            });

            it('should return false for accountNumber if IBAN is selected as account type', function () {
                scope.beneficiary.bank.country = country;
                scope.beneficiary.bank.accountType = 'IBAN';

                expect(scope.useAccountType('accountNumber')).toBeFalsy();
            });

            it('should return false for accountNumber if no country is selected', function () {
                scope.beneficiary.bank.country = null;

                expect(scope.useAccountType('accountNumber')).toBeFalsy();
            });
        });

        describe('show help', function() {
            beforeEach(function () {
                initController();
            });

            it('should create the showHelp object if it doesnt exist', function() {
                scope.showHelpForItem('iban');
                expect(scope.showHelp).toBeTruthy();
            });

            it('should set the value to true for the relevant item', function() {
                scope.showHelpForItem('iban');
                expect(scope.showHelp.iban).toBeTruthy();
            });

            it('should clear other helps when showing a help', function() {
                scope.showHelpForItem('country');
                scope.showHelpForItem('iban');
                expect(scope.showHelp.country).toBeFalsy();
            });

            it('should clear the help for the item when close help is called', function() {
                scope.showHelpForItem('country');
                scope.closeHelpItemFor('country');
                expect(scope.showHelp.country).toBeFalsy();
            });
        });
    });
});
