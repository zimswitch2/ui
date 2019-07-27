(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentConfirmController', [
        'refresh.flow',
        'refresh.internationalPayment.domain.internationalPaymentBeneficiary',
        'refresh.internationalPayment.domain.internationalPaymentCustomer'
    ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/confirm', {
            controller: 'InternationalPaymentConfirmController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentConfirm.html'
        });
    });

    module.controller('InternationalPaymentConfirmController', function ($scope, $location, $interval, Flow, ApplicationParameters,
                                                                         InternationalPaymentBeneficiary, InternationalPaymentCustomer, InternationalPaymentService) {
        $scope.beneficiary = InternationalPaymentBeneficiary.current();
        $scope.customerDetails = InternationalPaymentCustomer.customer();
        $scope.latestTimestampFromServer = ApplicationParameters.getVariable('latestTimestampFromServer');
        $scope.offerElapsedPopup = {
            isVisible: false
        };

        function setAcknowledgementFlags() {
            return {
                "acceptTsAndCs": "2016-02-05T10:30:54.151Z",
                "bopDeclaration": "2016-02-05T10:30:54.151Z",
                "confirmCustomerDetails": "2016-02-05T10:30:54.151Z",
                "withinSDALimit": "2016-02-05T10:30:54.151Z"
            };
        }

        function setBankData() {
            return {
                "accountNumber": $scope.beneficiary.bank.iban || $scope.beneficiary.bank.accountNumber,
                "bic": $scope.beneficiary.bank.swift,
                "country": $scope.beneficiary.bank.country,
                "currency": $scope.beneficiary.bank.currency,
                "regionalRoutingCode": $scope.beneficiary.bank.routingCode
            };
        }

        function setBeneficiaryData() {
            return {
                "beneficiaryAddress": {
                    "addressLineOne": $scope.beneficiary.addressLineOne,
                    "addressLineTwo": $scope.beneficiary.addressLineTwo,
                    "city": $scope.beneficiary.city,
                    "country": $scope.beneficiary.country
                },
                "beneficiaryType": $scope.beneficiary.type,
                "entityName": $scope.beneficiary.entityName,
                "firstName": $scope.beneficiary.firstName,
                "gender": $scope.beneficiary.gender,
                "lastName": $scope.beneficiary.lastName
            };
        }

        function setFromAccountData() {
            return {
                "accountCurrency": {
                    "currencyCode": $scope.beneficiary.pay.fromAccount.availableBalance.currency
                },
                "accountType": $scope.beneficiary.pay.fromAccount.accountType,
                "branch": $scope.beneficiary.pay.fromAccount.branch,
                "holderName": $scope.beneficiary.pay.fromAccount.holderName,
                //"internationalBankAccountNumber": "string", // may not be needed
                "number": $scope.beneficiary.pay.fromAccount.number,
                "serialNumber": $scope.beneficiary.pay.fromAccount.serialNumber
            };
        }

        function setPaymentInstruction() {
            return {
                "beneficiaryReference": $scope.beneficiary.preferences.theirReference,
                "chargeAmount": $scope.beneficiary.rates.conversionRateFee.totalCharge,
                "chargeType": $scope.beneficiary.preferences.fee.code,
                "customerReference": $scope.beneficiary.preferences.yourReference,
                "exchangeRate": $scope.beneficiary.rates.exchangeRate,
                "fromAmount": $scope.beneficiary.pay.sellAmount,
                "sourceReference": $scope.beneficiary.rates.quoteId,
                "toAmount": $scope.beneficiary.pay.buyAmount,
                "valueDate": $scope.beneficiary.rates.valueDate
            };
        }

        function getSubmitPaymentRequest() {
            return {
                "acknowledgementFlags": setAcknowledgementFlags(),
                "bankData": setBankData(),
                "beneficiary": setBeneficiaryData(),
                "bopCategory": $scope.beneficiary.reasonForPayment,
                "ccn": $scope.beneficiary.pay.customsClientNumber,
                "customerDetails": $scope.customerDetails.customerDetailsData,
                "fromAccount": setFromAccountData(),
                "paymentInstruction": setPaymentInstruction()
            };
        }

        var intervalCanceller = $interval(function () {
            $scope.offerElapsedPopup.isVisible = true;
            $interval.cancel(intervalCanceller);
        }, $scope.beneficiary.rates.ttl * 1000);

        $scope.confirm = function () {
            InternationalPaymentService.submitPayment(getSubmitPaymentRequest()).then(function (paymentResult) {
                $scope.beneficiary.paymentResult = paymentResult;
                $interval.cancel(intervalCanceller);
                $scope.paymentSubmitted = true;
            }, function() {
                $scope.paymentError = true;
            });
        };

        $scope.back = function () {
            Flow.previous();
            Flow.previous();
            $location.path('/international-payment/pay');
        };

        $scope.getNewRates = function () {
            InternationalPaymentService.getConversionRates($scope.beneficiary.conversionRatesRequest).then(function (conversionResult) {
                InternationalPaymentBeneficiary.setConversionRates(conversionResult);
                $location.path('/international-payment/confirm');
            }, function() {
                $scope.paymentError = true;
            });
        };
    });
})();
