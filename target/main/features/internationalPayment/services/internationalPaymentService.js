(function (app) {
    'use strict';

    app.factory('InternationalPaymentService', function ($q, ServiceEndpoint, User, Cacher) {

        var getMasterData = function (isResident, countryCode) {
            var request = {
                keyValueMetadata: [{
                    key: 'USESIMPLEBOPGROUPS',
                    value: 'true'
                }],
                countryCode: countryCode,
                isResident: isResident
            };

            return Cacher.perennial.fetch('getMasterDataForXBP', request).then(function (response) {
                return response.data;
            });
        };

        var getCountries = function (isResident, countryCode) {
            return getMasterData(isResident, countryCode).then(function (masterData) {
                return masterData.countries;
            });
        };

        var getCurrencies = function (isResident, countryCode) {
            return getMasterData(isResident, countryCode).then(function (masterData) {
                return masterData.currencies;
            });
        };

        var getBopGroups = function (isResident, countryCode) {
            return getMasterData(isResident, countryCode).then(function (masterData) {
                return masterData.bopGroups;
            });
        };

        function getValidationRequest(validationFields) {
            var validationRequest = {validationFields: []};

            if (validationFields.IBAN) {
                validationRequest.validationFields.push({
                    "accountFieldKey": "IBAN",
                    "countryCode": validationFields.countryCode,
                    "fieldValue": validationFields.IBAN
                });
            }

            if (validationFields.SWIFT) {
                validationRequest.validationFields.push({
                    "accountFieldKey": "SWIFT",
                    "countryCode": validationFields.countryCode,
                    "fieldValue": validationFields.SWIFT
                });
            }

            if (validationFields.CCN) {
                validationRequest.validationFields.push({
                    "accountFieldKey": "CCN",
                    "countryCode": validationFields.countryCode,
                    "fieldValue": validationFields.CCN
                });
            }

            return validationRequest;
        }

        var validateDetails = function (validationFields) {
            var validationRequest = getValidationRequest(validationFields);

            return ServiceEndpoint.validateDetailsForXBP.makeRequest(validationRequest).then(function (response) {
                var validationResults = response.data.validationResults;
                var isIBANValid = true, isSWIFTValid = false, isCCNValid = false;
                for (var i = 0; i < validationResults.length; i++) {
                    if (validationFields.IBAN && validationResults[i].validationFieldKey === 'IBAN') {
                        isIBANValid = validationResults[i].fieldIsValid;
                    }

                    if (validationFields.SWIFT && validationResults[i].validationFieldKey === 'SWIFT') {
                        isSWIFTValid = validationResults[i].fieldIsValid;
                    }

                    if (validationFields.CCN && validationResults[i].validationFieldKey === 'CCN') {
                        isIBANValid = false;
                        isCCNValid = validationResults[i].fieldIsValid;
                    }
                }

                return {
                    isIBANValid: isIBANValid,
                    isSWIFTValid: isSWIFTValid,
                    isCCNValid: isCCNValid
                };
            });
        };

        var getConversionRates = function (conversionRatesRequest) {
            var request = _.merge(User.principal(), conversionRatesRequest);
            return ServiceEndpoint.getConversionRateAndFeesForXBP.makeRequest(request, { omitServiceErrorNotification: true }).then(function (response) {
                return response.data;
            }, function(response) {
                var errorMessage = response.headers('x-sbg-response-message');
                return $q.reject({
                    error: {
                        message: errorMessage
                    }
                });
            });
        };

        var submitPayment = function (submitPaymentRequest) {
            var request = _.merge(User.principal(), submitPaymentRequest);
            return ServiceEndpoint.submitPaymentForXBP.makeRequest(request, { omitServiceErrorNotification: true }).then(function (response) {
                return response.data;
            });
        };

        return {
            getCountries: getCountries,
            getCurrencies: getCurrencies,
            validateDetails: validateDetails,
            getBopGroups: getBopGroups,
            getConversionRates: getConversionRates,
            submitPayment: submitPayment,
            getCustomerDetails: function () {
                var request = User.principal();
                return ServiceEndpoint.customerDetailsXBP.makeRequest(request).then(function (response) {
                    var customerDetails = response.data.customerDetails;
                    return {
                        contact: customerDetails.contact.fieldValue,
                        countryCode: customerDetails.countryCode.fieldValue,
                        countryOfIssue: customerDetails.countryOfIssue.fieldValue,
                        dateOfBirth: customerDetails.dateOfBirth.fieldValue,
                        firstName: customerDetails.firstName.fieldValue,
                        foreignIdNumber: customerDetails.foreignIdNumber.fieldValue,
                        gender: customerDetails.gender.fieldValue,
                        idNumber: customerDetails.idNumber.fieldValue,
                        lastName: customerDetails.lastName.fieldValue,
                        passportNumber: customerDetails.passportNumber.fieldValue,
                        postalAddressOne: customerDetails.postalAddressOne.fieldValue,
                        postalAddressTwo: customerDetails.postalAddressTwo.fieldValue,
                        postalCity: customerDetails.postalCity.fieldValue,
                        postalCountry: customerDetails.postalCountry.fieldValue,
                        postalPostalCode: customerDetails.postalPostalCode.fieldValue,
                        postalProvince: customerDetails.postalProvince.fieldValue,
                        postalSuburb: customerDetails.postalSuburb.fieldValue,
                        residentialAddressOne: customerDetails.residentialAddressOne.fieldValue,
                        residentialAddressTwo: customerDetails.residentialAddressTwo.fieldValue,
                        residentialCity: customerDetails.residentialCity.fieldValue,
                        residentialCountry: customerDetails.residentialCountry.fieldValue,
                        residentialPostalCode: customerDetails.residentialPostalCode.fieldValue,
                        residentialProvince: customerDetails.residentialProvince.fieldValue,
                        residentialSuburb: customerDetails.residentialSuburb.fieldValue,
                        tempResidentIdNumber: customerDetails.tempResidentIdNumber.fieldValue,
                        workPermitExpiryDate: customerDetails.workPermitExpiryDate.fieldValue,
                        workPermitNumber: customerDetails.workPermitNumber.fieldValue,
                        customerTierCode: response.data.customerTierCode,
                        isOver18: response.data.isOver18,
                        isResident: response.data.isResident,
                        customerDetailsData: customerDetails
                    };
                });
            }
        };
    });

})(angular.module('refresh.internationalPaymentService',
    ['refresh.configuration', 'refresh.security.user', 'refresh.cache']));
