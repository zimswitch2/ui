(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentBeneficiaryBankDetailsController',
        [
            'refresh.lookups',
            'refresh.internationalPayment.domain.internationalPaymentCustomer',
            'refresh.internationalPayment.domain.internationalPaymentBeneficiary'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/beneficiary/bank-details', {
            controller: 'InternationalPaymentBeneficiaryBankDetailsController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentBeneficiaryBankDetails.html'
        });
    });

    module.controller('InternationalPaymentBeneficiaryBankDetailsController', function ($scope, $location, LookUps, InternationalPaymentCustomer, InternationalPaymentService, InternationalPaymentBeneficiary) {
        $scope.accountTypes = LookUps.beneficiaryAccountType.values();
        $scope.beneficiary = InternationalPaymentBeneficiary.current();

        if (!$scope.beneficiary.bank) {
            $scope.beneficiary.bank = {accountType: "IBAN"};
        }

        InternationalPaymentService.getCountries(InternationalPaymentCustomer.customer().isResident(), "ZA").then(function (countries) {
            $scope.countries = _.map(countries, function (country) {
                country.label = function () {
                    return country.name;
                };
                return country;
            });

            InternationalPaymentService.getCurrencies(InternationalPaymentCustomer.customer().isResident(), "ZA").then(function (currencies) {
                $scope.currencies = _.map(currencies, function (currency) {
                    currency.label = function () {
                        return '(' + currency.code + ') ' + currency.name;
                    };
                    return currency;
                });
            });
        });

        var selectDefaultCurrency = function () {
            if ($scope.beneficiary.bank.country && $scope.beneficiary.bank.country.defaultCurrency && $scope.beneficiary.bank.country.defaultCurrency.code) {
                var defaultCurrency = _.find($scope.currencies, function (currency) {
                    return currency.code === $scope.beneficiary.bank.country.defaultCurrency.code;
                });

                if (defaultCurrency) {
                    $scope.beneficiary.bank.currency = defaultCurrency;
                    return;
                }
            }
            $scope.beneficiary.bank.currency = null;
        };

        $scope.selectedCountryChanged = function () {
            selectDefaultCurrency();

            if ($scope.beneficiary.bank.country) {
                $scope.beneficiary.bank.accountType = $scope.beneficiary.bank.country.ibanCapable ? 'IBAN' :'accountNumber';
                $scope.beneficiary.bank.routingName = $scope.beneficiary.bank.country.routingName;
            }
            else {
                $scope.beneficiary.bank.routingName = null;
            }
        };

        $scope.accountTypeChanged = function () {
            if($scope.beneficiary.bank.accountType === 'IBAN'){
                $scope.beneficiary.bank.accountNumber = undefined;
                $scope.beneficiary.bank.routingCode = undefined;
            }
            else{
                $scope.beneficiary.bank.iban = undefined;
            }
        };

        $scope.useAccountType = function(accountType){
            if ($scope.beneficiary.bank.country && $scope.beneficiary.bank.accountType && ($scope.beneficiary.bank.accountType === accountType)) {
                return true;
            }
            return false;
        };

        $scope.next = function () {
            var validationRequest = {
                countryCode: $scope.beneficiary.bank.country.code,
                IBAN: $scope.beneficiary.bank.accountType === "IBAN" ? $scope.beneficiary.bank.iban : null,
                SWIFT: $scope.beneficiary.bank.swift
            };

            InternationalPaymentService.validateDetails(validationRequest).then(function(validationResult) {
                if (validationResult.isIBANValid && validationResult.isSWIFTValid) {
                    $scope.beneficiary.preferencesActive = true;
                    $location.path('/international-payment/beneficiary/preferences');
                }
                else {
                    if (validationResult.isIBANValid && !validationResult.isSWIFTValid) {
                        $scope.errorMessage = 'The SWIFT/BIC you have entered is incorrect.';
                    }
                    else if (!validationResult.isIBANValid && validationResult.isSWIFTValid) {
                        $scope.errorMessage = 'The IBAN you have entered is incorrect.';
                    }
                    else {
                        $scope.errorMessage = 'The IBAN and SWIFT/BIC you have entered are incorrect.';
                    }
                }
            });
        };

        $scope.back = function () {
            $location.path('/international-payment/beneficiary/details');
        };

        $scope.showHelpForItem = function(help) {
            $scope.showHelp = {};
            $scope.showHelp[help] = true;
        };

        $scope.closeHelpItemFor = function(helpItem) {
            $scope.showHelp[helpItem] = false;
        };
    });
})();
