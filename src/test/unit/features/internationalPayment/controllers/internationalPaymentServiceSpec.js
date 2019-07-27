describe('InternationalPaymentService', function () {
    'use strict';

    beforeEach(module('refresh.internationalPaymentService'));

    var test, InternationalPaymentService;
    var systemPrincipal = {
        systemPrincipalIdentifier: {
            systemPrincipalId: '1',
            systemPrincipalKey: 'SBSA_BANKING'
        }
    };

    beforeEach(inject(function (_User_, _ServiceTest_, _InternationalPaymentService_) {
        spyOn(_User_, 'principal');
        _User_.principal.and.returnValue({
            systemPrincipalIdentifier: {
                systemPrincipalId: '1',
                systemPrincipalKey: 'SBSA_BANKING'
            }
        });

        InternationalPaymentService = _InternationalPaymentService_;
        test = _ServiceTest_;
    }));

    describe('getCustomerDetails', function () {

        var customerDetailsData = {
            customerDetails: {
                "contact": {
                    "fieldIdentifier": "02",
                    "fieldValue": "078 854 1141",
                    "mandatory": true,
                    "validationMessage": "Not Available"
                },
                "countryCode": {
                    "fieldIdentifier": "",
                    "fieldValue": "ZA",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                },
                "countryOfIssue": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                },
                "dateOfBirth": {
                    "fieldIdentifier": "1985-01-04",
                    "fieldValue": "04 January 1985",
                    "mandatory": true,
                    "validationMessage": "Not Available"
                },
                "firstName": {
                    "fieldIdentifier": "",
                    "fieldValue": "Vaftest",
                    "mandatory": true,
                    "validationMessage": "Not Available"
                },
                "foreignIdNumber": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                },
                "gender": {
                    "fieldIdentifier": "FEMALE",
                    "fieldValue": "Female",
                    "mandatory": true,
                    "validationMessage": "Not Available"
                },
                "idNumber": {
                    "fieldIdentifier": "",
                    "fieldValue": "850104 5570 09 9",
                    "mandatory": true,
                    "validationMessage": "Not Available"
                },
                "lastName": {
                    "fieldIdentifier": "",
                    "fieldValue": "Sitone",
                    "mandatory": true,
                    "validationMessage": "Not Available"
                },
                "passportNumber": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                },
                "postalAddressOne": {
                    "fieldIdentifier": "",
                    "fieldValue": "52 Anderson St",
                    "mandatory": true,
                    "validationMessage": "Address line 1"
                },
                "postalAddressTwo": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Address line 2"
                },
                "postalCity": {
                    "fieldIdentifier": "",
                    "fieldValue": "Johannesburg",
                    "mandatory": true,
                    "validationMessage": "City"
                },
                "postalCountry": {
                    "fieldIdentifier": "",
                    "fieldValue": "ZA",
                    "mandatory": true,
                    "validationMessage": "Country"
                },
                "postalPostalCode": {
                    "fieldIdentifier": "",
                    "fieldValue": "2001",
                    "mandatory": true,
                    "validationMessage": "Postal code"
                },
                "postalProvince": {
                    "fieldIdentifier": "ZAF.GP",
                    "fieldValue": "Gauteng",
                    "mandatory": true,
                    "validationMessage": "Province"
                },
                "postalSuburb": {
                    "fieldIdentifier": "",
                    "fieldValue": "Marshalltown",
                    "mandatory": true,
                    "validationMessage": "Suburb"
                },
                "residentialAddressOne": {
                    "fieldIdentifier": "",
                    "fieldValue": "5 Simmonds St",
                    "mandatory": true,
                    "validationMessage": "Address line 1"
                },
                "residentialAddressTwo": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Address line 2"
                },
                "residentialCity": {
                    "fieldIdentifier": "",
                    "fieldValue": "Johannesburg",
                    "mandatory": true,
                    "validationMessage": "City"
                },
                "residentialCountry": {
                    "fieldIdentifier": "",
                    "fieldValue": "ZA",
                    "mandatory": true,
                    "validationMessage": "Country"
                },
                "residentialPostalCode": {
                    "fieldIdentifier": "",
                    "fieldValue": "2001",
                    "mandatory": true,
                    "validationMessage": "Postal code"
                },
                "residentialProvince": {
                    "fieldIdentifier": "ZAF.GP",
                    "fieldValue": "Gauteng",
                    "mandatory": true,
                    "validationMessage": "Province"
                },
                "residentialSuburb": {
                    "fieldIdentifier": "",
                    "fieldValue": "Marshalltown",
                    "mandatory": true,
                    "validationMessage": "Suburb"
                },
                "tempResidentIdNumber": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                },
                "workPermitExpiryDate": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                },
                "workPermitNumber": {
                    "fieldIdentifier": "",
                    "fieldValue": "",
                    "mandatory": false,
                    "validationMessage": "Non Mandatory information"
                }
            },
            "customerTierCode": "RETAIL",
            "isOver18": true,
            "isResident": true
        };

        var customerDetailsResponse = {
            contact: customerDetailsData.customerDetails.contact.fieldValue,
            countryCode: customerDetailsData.customerDetails.countryCode.fieldValue,
            countryOfIssue: customerDetailsData.customerDetails.countryOfIssue.fieldValue,
            dateOfBirth: customerDetailsData.customerDetails.dateOfBirth.fieldValue,
            firstName: customerDetailsData.customerDetails.firstName.fieldValue,
            foreignIdNumber: customerDetailsData.customerDetails.foreignIdNumber.fieldValue,
            gender: customerDetailsData.customerDetails.gender.fieldValue,
            idNumber: customerDetailsData.customerDetails.idNumber.fieldValue,
            lastName: customerDetailsData.customerDetails.lastName.fieldValue,
            passportNumber: customerDetailsData.customerDetails.passportNumber.fieldValue,
            postalAddressOne: customerDetailsData.customerDetails.postalAddressOne.fieldValue,
            postalAddressTwo: customerDetailsData.customerDetails.postalAddressTwo.fieldValue,
            postalCity: customerDetailsData.customerDetails.postalCity.fieldValue,
            postalCountry: customerDetailsData.customerDetails.postalCountry.fieldValue,
            postalPostalCode: customerDetailsData.customerDetails.postalPostalCode.fieldValue,
            postalProvince: customerDetailsData.customerDetails.postalProvince.fieldValue,
            postalSuburb: customerDetailsData.customerDetails.postalSuburb.fieldValue,
            residentialAddressOne: customerDetailsData.customerDetails.residentialAddressOne.fieldValue,
            residentialAddressTwo: customerDetailsData.customerDetails.residentialAddressTwo.fieldValue,
            residentialCity: customerDetailsData.customerDetails.residentialCity.fieldValue,
            residentialCountry: customerDetailsData.customerDetails.residentialCountry.fieldValue,
            residentialPostalCode: customerDetailsData.customerDetails.residentialPostalCode.fieldValue,
            residentialProvince: customerDetailsData.customerDetails.residentialProvince.fieldValue,
            residentialSuburb: customerDetailsData.customerDetails.residentialSuburb.fieldValue,
            tempResidentIdNumber: customerDetailsData.customerDetails.tempResidentIdNumber.fieldValue,
            workPermitExpiryDate: customerDetailsData.customerDetails.workPermitExpiryDate.fieldValue,
            workPermitNumber: customerDetailsData.customerDetails.workPermitNumber.fieldValue,
            customerTierCode: customerDetailsData.customerTierCode,
            isResident: customerDetailsData.isResident,
            isOver18: customerDetailsData.isOver18,
            customerDetailsData: customerDetailsData.customerDetails
        };

        beforeEach(function () {
            test.spyOnEndpoint('customerDetailsXBP');
        });

        it('should invoke the customer details XBP service', function () {
            test.stubResponse('customerDetailsXBP', 200, customerDetailsData, {});
            InternationalPaymentService.getCustomerDetails();
            test.resolvePromise();

            expect(test.endpoint('customerDetailsXBP')).toHaveBeenCalledWith(systemPrincipal);
        });

        it('should resolve with customer details', function () {
            test.stubResponse('customerDetailsXBP', 200, customerDetailsData, {});
            expect(InternationalPaymentService.getCustomerDetails()).toBeResolvedWith(customerDetailsResponse);
            test.resolvePromise();
        });
    });

    describe('get master data', function () {
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
            },
            {
                "code": "AF",
                "defaultCurrency": {
                    "code": "AFN",
                    "currencyPair": null,
                    "name": "Afghan Afghani"
                },
                "ibanCapable": false,
                "name": "Afghanistan",
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
            },
            {
                "code": "CAD",
                "currencyPair": "ZAR/CAD",
                "name": "Canadian Dollar"
            }
        ];

        var bopGroups = [
            {
                "bopCategories": [
                    {
                        "bopCode": 101,
                        "bopFields": [],
                        "bopSubCategoryCode": "1",
                        "categoryDescription": "Imports: Advance payments (not in terms of import undertaking)",
                        "maximumAmount": 0,
                        "residentOnly": true
                    },
                    {
                        "bopCode": 101,
                        "bopFields": [
                            {
                                "description": "Customs Client Number",
                                "fieldName": "CCN",
                                "mandatory": null
                            }
                        ],
                        "bopSubCategoryCode": "11",
                        "categoryDescription": "Imports: Advance payment - goods imported via the South African Post Office",
                        "maximumAmount": 0,
                        "residentOnly": true
                    },
                    {
                        "bopCode": 103,
                        "bopFields": [
                            {
                                "description": "Customs Client Number",
                                "fieldName": "CCN",
                                "mandatory": null
                            }
                        ],
                        "bopSubCategoryCode": "11",
                        "categoryDescription": "Import payment - goods imported via the South African Post Office",
                        "maximumAmount": 0,
                        "residentOnly": true
                    }
                ],
                "description": null,
                "groupCode": "100",
                "groupName": "Merchandise"
            },
            {
                "bopCategories": [
                    {
                        "bopCode": 201,
                        "bopFields": [],
                        "bopSubCategoryCode": "0",
                        "categoryDescription": "Rights obtained for licences to reproduce and/or distribute",
                        "maximumAmount": 0,
                        "residentOnly": true
                    },
                    {
                        "bopCode": 202,
                        "bopFields": [],
                        "bopSubCategoryCode": "0",
                        "categoryDescription": "Rights obtained for using patents and inventions (licensing)",
                        "maximumAmount": 0,
                        "residentOnly": true
                    },
                    {
                        "bopCode": 204,
                        "bopFields": [],
                        "bopSubCategoryCode": "0",
                        "categoryDescription": "Rights obtained for using copyrights",
                        "maximumAmount": 0,
                        "residentOnly": true
                    }
                ],
                "description": null,
                "groupCode": "200",
                "groupName": "Intellectual property and other services"
            }];

        var masterDetailsResponse = {
            "bopGroups": bopGroups,
            "countries": countries,
            "currencies": currencies,
            "feeCharges": [
                "OWN",
                "SHA"
            ],
            "keyValueMetadata": [],
            "stepUp": null,
            "responseCode": {
                "code": "0000",
                "message": "SUCCESS",
                "responseType": "SUCCESS"
            }
        };


        beforeEach(function () {
            test.spyOnEndpoint('getMasterDataForXBP');
            test.stubResponse('getMasterDataForXBP', 200, masterDetailsResponse, {});

        });

        describe('get countries', function () {
            it('should invoke the master details details XBP service', function () {
                InternationalPaymentService.getCountries(true, 'UG');
                test.resolvePromise();

                expect(test.endpoint('getMasterDataForXBP')).toHaveBeenCalledWith({
                    keyValueMetadata: [{
                        key: 'USESIMPLEBOPGROUPS',
                        value: 'true'
                    }],
                    isResident: true,
                    countryCode: 'UG'
                });
            });

            it('should resolve with countries', function () {
                expect(InternationalPaymentService.getCountries(true, 'UG')).toBeResolvedWith(countries);
                test.resolvePromise();
            });
        });

        describe('get currencies', function () {
            it('should invoke the master details details XBP service', function () {
                InternationalPaymentService.getCurrencies(true, 'UG');
                test.resolvePromise();

                expect(test.endpoint('getMasterDataForXBP')).toHaveBeenCalledWith({
                    keyValueMetadata: [{
                        key: 'USESIMPLEBOPGROUPS',
                        value: 'true'
                    }],
                    isResident: true,
                    countryCode: 'UG'
                });
            });

            it('should resolve with currencies', function () {
                expect(InternationalPaymentService.getCurrencies(true, 'UG')).toBeResolvedWith(currencies);
                test.resolvePromise();
            });
        });

        describe(' get bop groups', function () {
            it('should invoke the master details XBP service', function () {
                InternationalPaymentService.getBopGroups(true, 'UG');
                test.resolvePromise();

                expect(test.endpoint('getMasterDataForXBP')).toHaveBeenCalledWith({
                    keyValueMetadata: [{
                        key: 'USESIMPLEBOPGROUPS',
                        value: 'true'
                    }],
                    isResident: true,
                    countryCode: 'UG'
                });
            });

            it('should resolve with bop groups', function () {
                expect(InternationalPaymentService.getBopGroups(true, 'UG')).toBeResolvedWith(bopGroups);
                test.resolvePromise();
            });
        });

    });

    describe('validate details', function () {

        var validationRequest = {
            "countryCode": "ZA",
            "IBAN": "1234567890",
            "SWIFT": "12345678"
        };

        var validationResponse = {
            "validationResults": [
                {
                    "fieldIsValid": false,
                    "message": "Please enter a valid CCN",
                    "validationFieldKey": "CCN"
                },
                {
                    "fieldIsValid": true,
                    "message": "IBAN Valid",
                    "validationFieldKey": "IBAN"
                },
                {
                    "fieldIsValid": false,
                    "message": "Please enter a valid SWIFT/BIC for the selected country",
                    "validationFieldKey": "SWIFT"
                }
            ],
            "keyValueMetadata": [],
            "stepUp": null,
            "responseCode": {
                "code": "0000",
                "message": "SUCCESS",
                "responseType": "SUCCESS"
            }
        };

        beforeEach(function () {
            test.spyOnEndpoint('validateDetailsForXBP');
            test.stubResponse('validateDetailsForXBP', 200, validationResponse, {});
        });

        it('should invoke validate details if there is no IBAN', function () {

            var validationRequestWithoutIBAN = {
                "countryCode": "ZA",
                "IBAN": null,
                "SWIFT": "12345678"
            };

            InternationalPaymentService.validateDetails(validationRequestWithoutIBAN);
            test.resolvePromise();

            expect(test.endpoint('validateDetailsForXBP')).toHaveBeenCalledWith({
                "validationFields": [
                    {
                        "accountFieldKey": "SWIFT",
                        "countryCode": "ZA",
                        "fieldValue": "12345678"
                    }
                ]
            });
        });


        it('should invoke validate details', function () {
            InternationalPaymentService.validateDetails(validationRequest);
            test.resolvePromise();

            expect(test.endpoint('validateDetailsForXBP')).toHaveBeenCalledWith({
                "validationFields": [
                    {
                        "accountFieldKey": "IBAN",
                        "countryCode": "ZA",
                        "fieldValue": "1234567890"
                    },
                    {
                        "accountFieldKey": "SWIFT",
                        "countryCode": "ZA",
                        "fieldValue": "12345678"
                    }
                ]
            });
        });

        it('should return the correct details', function () {
            var response = {
                "isIBANValid": true,
                "isSWIFTValid": false,
                "isCCNValid": false
            };

            expect(InternationalPaymentService.validateDetails(validationRequest)).toBeResolvedWith(response);
            test.resolvePromise();
        });

        it('should return IBAN as valid if not supplied', function () {
            var validationRequestWithoutIBAN = {
                "countryCode": "ZA",
                "IBAN": null,
                "SWIFT": "12345678"
            };

            var validationResponseWithoutIBAN = {
                "validationResults": [
                    {
                        "fieldIsValid": false,
                        "message": "Please enter a valid CCN",
                        "validationFieldKey": "CCN"
                    },
                    {
                        "fieldIsValid": false,
                        "message": "Please enter a valid IBAN",
                        "validationFieldKey": "IBAN"
                    },
                    {
                        "fieldIsValid": false,
                        "message": "Please enter a valid SWIFT/BIC for the selected country",
                        "validationFieldKey": "SWIFT"
                    }
                ],
                "keyValueMetadata": [],
                "stepUp": null,
                "responseCode": {
                    "code": "0000",
                    "message": "SUCCESS",
                    "responseType": "SUCCESS"
                }
            };

            test.stubResponse('validateDetailsForXBP', 200, validationResponseWithoutIBAN, {});

            expect(InternationalPaymentService.validateDetails(validationRequestWithoutIBAN)).toBeResolvedWith({
                "isIBANValid": true,
                "isSWIFTValid": false,
                "isCCNValid": false
            });
            test.resolvePromise();
        });

        it('should return SWIFT as valid if supplied', function () {
            var validationRequestWithIBANAndSWIFT = {
                "countryCode": "ZA",
                "IBAN": "12345678",
                "SWIFT": "12345678"
            };

            var validationResponseWithIBANAndSWIFT = {
                "validationResults": [
                    {
                        "fieldIsValid": false,
                        "message": "Please enter a valid CCN",
                        "validationFieldKey": "CCN"
                    },
                    {
                        "fieldIsValid": true,
                        "message": "IBAN valid",
                        "validationFieldKey": "IBAN"
                    },
                    {
                        "fieldIsValid": true,
                        "message": "SWIFT valid",
                        "validationFieldKey": "SWIFT"
                    }
                ],
                "keyValueMetadata": [],
                "stepUp": null,
                "responseCode": {
                    "code": "0000",
                    "message": "SUCCESS",
                    "responseType": "SUCCESS"
                }
            };

            test.stubResponse('validateDetailsForXBP', 200, validationResponseWithIBANAndSWIFT, {});

            expect(InternationalPaymentService.validateDetails(validationRequestWithIBANAndSWIFT)).toBeResolvedWith({
                "isIBANValid": true,
                "isSWIFTValid": true,
                "isCCNValid": false
            });
            test.resolvePromise();
        });

        it('should return CCN as valid if supplied', function () {
            var validationRequestWithCCN = {
                "CCN": "12345678"
            };

            var validationResponseWithCCN = {
                "validationResults": [
                    {
                        "fieldIsValid": true,
                        "message": "CCN valid",
                        "validationFieldKey": "CCN"
                    }
                ],
                "keyValueMetadata": [],
                "stepUp": null,
                "responseCode": {
                    "code": "0000",
                    "message": "SUCCESS",
                    "responseType": "SUCCESS"
                }
            };

            test.stubResponse('validateDetailsForXBP', 200, validationResponseWithCCN, {});

            expect(InternationalPaymentService.validateDetails(validationRequestWithCCN)).toBeResolvedWith({
                "isIBANValid": false,
                "isSWIFTValid": false,
                "isCCNValid": true
            });
            test.resolvePromise();
        });
    });

    describe('get conversion rates', function () {
        var conversionRatesRequest = {
            "availableBalance": {
                "amount": 20000,
                "currency": "ZAR"
            },
            "beneficiaryBicCode": "CETYUS66",
            "buyAmount": {
                "amount": 50,
                "currency": "GHS"
            },
            "countryCode": "ZA",
            "currencyPair": "ZAR/GHS",
            "customerTierCode": "RETAIL",
            "sellAmount": {
                "amount": 0,
                "currency": "ZAR"
            }
        };

        var conversionRatesResponse = {
            "conversionRateFee": {
                "communicationFee": {
                    "amount": 100,
                    "currency": "R"
                },
                "paymentCharge": {
                    "amount": 140,
                    "currency": "R"
                },
                "totalCharge": {
                    "amount": 240,
                    "currency": "R"
                }
            },
            "convertedAmount": {
                "amount": 795,
                "currency": "R"
            },
            "equivalentAmount": {
                "amount": 15.9,
                "currency": "R"
            },
            "exchangeRate": 15.9,
            "quoteId": "MA16032ZA0000001",
            "totalAmount": {
                "amount": 1035,
                "currency": "R"
            },
            "ttl": 300,
            "valueDate": "2016-02-02T22:00:00.000+0000",
            "valueDateFormatted": "03 February 2016"
        };

        beforeEach(function () {
            test.spyOnEndpoint('getConversionRateAndFeesForXBP');
            test.stubResponse('getConversionRateAndFeesForXBP', 200, conversionRatesResponse, {});
        });

        it('should invoke the get conversion rates and fees XBP service', function () {
            InternationalPaymentService.getConversionRates(conversionRatesRequest);
            test.resolvePromise();

            expect(test.endpoint('getConversionRateAndFeesForXBP')).toHaveBeenCalledWith({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '1',
                    systemPrincipalKey: 'SBSA_BANKING'
                },
                "availableBalance": {
                    "amount": 20000,
                    "currency": "ZAR"
                },
                "beneficiaryBicCode": "CETYUS66",
                "buyAmount": {
                    "amount": 50,
                    "currency": "GHS"
                },
                "countryCode": "ZA",
                "currencyPair": "ZAR/GHS",
                "customerTierCode": "RETAIL",
                "sellAmount": {
                    "amount": 0,
                    "currency": "ZAR"
                }
            },
                {omitServiceErrorNotification: true});
        });


        it('should return the conversion rates ', function () {
            expect(InternationalPaymentService.getConversionRates(conversionRatesRequest)).toBeResolvedWith(conversionRatesResponse);
            test.resolvePromise();
        });

        it('should reject the promise if an error is returned', function() {
            test.stubResponse('getConversionRateAndFeesForXBP', 500, {}, {
                "x-sbg-response-type": "EXCEPTION",
                "x-sbg-response-code": "9999",
                "x-sbg-response-message": "This error message came from the gateway"
            });

            expect(InternationalPaymentService.getConversionRates(conversionRatesRequest)).toBeRejectedWith({
                error: { message: 'This error message came from the gateway' }
            });

            test.resolvePromise();
        });
    });

    describe('submit payment', function () {
        var submitPaymentRequest = {
            "request": "something"
        };

        var submitPaymentResponse = {
            "response": "something"
        };

        beforeEach(function () {
            test.spyOnEndpoint('submitPaymentForXBP');
            test.stubResponse('submitPaymentForXBP', 200, submitPaymentResponse, {});
        });

        it('should invoke the submit payment XBP service', function () {
            InternationalPaymentService.submitPayment(submitPaymentRequest);
            test.resolvePromise();

            expect(test.endpoint('submitPaymentForXBP')).toHaveBeenCalledWith({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '1',
                    systemPrincipalKey: 'SBSA_BANKING'
                },
                "request": "something"
            },
                {omitServiceErrorNotification: true});
        });

        it('should return the payment reference', function () {
            expect(InternationalPaymentService.submitPayment(submitPaymentRequest)).toBeResolvedWith(submitPaymentResponse);
            test.resolvePromise();
        });
    });

});
