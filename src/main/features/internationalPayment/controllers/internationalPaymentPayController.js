(function () {
    'use strict';

    var module = angular.module('refresh.internationalPaymentPayController', ['refresh.flow',
        'refresh.accounts',
        'refresh.limits',
        'refresh.internationalPayment.domain.internationalPaymentBeneficiary']);

    module.config(function ($routeProvider) {
        $routeProvider.when('/international-payment/pay', {
            controller: 'InternationalPaymentPayController',
            templateUrl: 'features/internationalPayment/partials/internationalPaymentPay.html'
        });
    });

    module.controller('InternationalPaymentPayController',
        function ($scope, $location, Flow, Card, AccountsService, LimitsService, InternationalPaymentBeneficiary,
                  InternationalPaymentCustomer, InternationalPaymentService) {
            $scope.beneficiary = InternationalPaymentBeneficiary.current();
            $scope.customer = InternationalPaymentCustomer.customer();
            $scope.limitsService = new LimitsService();

            if ($scope.beneficiary.rates && $scope.beneficiary.rates.error) {
                $scope.errorMessage = $scope.beneficiary.rates.error.message;
            }

            var beneficiaryCurrency = $scope.beneficiary.bank.currency;

            function setupWatchers() {
                $scope.highlightBalance = function () {
                    if ($scope.beneficiary.pay.currency.code ===
                        $scope.beneficiary.pay.fromAccount.availableBalance.currency) {
                        return $scope.watcher().type === 'availableBalanceExceeded';
                    }
                };

                $scope.enforcer = function (value) {
                    var enforcement = $scope.limitsService.enforce({
                        amount: value,
                        account: $scope.beneficiary.pay.fromAccount
                    });

                    if(_.isMatch(enforcement, {type: 'maximumPaymentLimit'})) {
                        return {};
                    }

                    if ($scope.beneficiary.pay.currency.code ===
                        $scope.beneficiary.pay.fromAccount.availableBalance.currency) {
                        return enforcement;
                    }
                    else {
                        return _.isMatch(enforcement, {type: 'availableBalanceExceeded'}) ? {} : enforcement;
                    }
                };

                $scope.watcher = function () {
                    return $scope.enforcer($scope.beneficiary.pay.amount);
                };
            }

            function checkSelectedCurrency() {
                if (_.isUndefined(_.find($scope.currencies, $scope.beneficiary.pay.currency))) {
                    $scope.beneficiary.pay.currency = $scope.currencies[0];
                }
            }

            function populateAccountCurrencyOnList(accountCurrencyCode) {
                if (accountCurrencyCode === 'ZAR') {
                    $scope.currencies.push({
                        code: accountCurrencyCode,
                        currencyPair: beneficiaryCurrency.currencyPair,
                        description: '(' + accountCurrencyCode + ') South African Rand'
                    });
                }
                else {
                    var accountCurrency = _.find($scope.currencyList, {code: accountCurrencyCode});
                    if (accountCurrency) {
                        $scope.currencies.push({
                            code: accountCurrency.code,
                            currencyPair: beneficiaryCurrency.code + '/' + accountCurrency.code,
                            description: '(' + accountCurrency.code + ') ' + accountCurrency.name
                        });
                    }
                }

                checkSelectedCurrency();
            }

            function populateCurrencies() {
                InternationalPaymentService.getCurrencies($scope.customer.isResident(),
                    "ZA").then(function (currencies) {
                        $scope.currencyList = currencies;

                        $scope.populateCurrencyList();

                        $scope.beneficiary.pay.currency = $scope.currencies[0];

                        setupWatchers();
                    });
            }

            function getConversionRatesRequest() {
                var buyAmount = 0, sellAmount = 0;
                var buyCurrency, sellCurrency;

                if (beneficiaryCurrency.code === $scope.beneficiary.pay.currency.code) {
                    buyAmount = $scope.beneficiary.pay.amount;
                    buyCurrency = $scope.beneficiary.pay.currency.code;
                    sellCurrency = $scope.beneficiary.pay.fromAccount.availableBalance.currency;
                }
                else {
                    sellAmount = $scope.beneficiary.pay.amount;
                    sellCurrency = $scope.beneficiary.pay.currency.code;
                    buyCurrency = beneficiaryCurrency.code;
                }

                return {
                    "availableBalance": {
                        "amount": $scope.beneficiary.pay.fromAccount.availableBalance.amount,
                        "currency": $scope.beneficiary.pay.fromAccount.availableBalance.currency
                    },
                    "beneficiaryBicCode": $scope.beneficiary.bank.swift,
                    "buyAmount": {
                        "amount": buyAmount,
                        "currency": buyCurrency
                    },
                    "countryCode": 'ZA',
                    "currencyPair": $scope.beneficiary.pay.currency.currencyPair,
                    "customerTierCode": $scope.customer.customerTierCode,
                    "sellAmount": {
                        "amount": sellAmount,
                        "currency": sellCurrency
                    }
                };
            }

            function navigateNext() {
                Flow.next();

                $scope.beneficiary.conversionRatesRequest = getConversionRatesRequest();
                InternationalPaymentService.getConversionRates($scope.beneficiary.conversionRatesRequest).then(function (conversionResult) {
                    InternationalPaymentBeneficiary.setConversionRates(conversionResult);

                    Flow.next();
                    $location.path('/international-payment/confirm');
                }, function(response) {
                    $scope.beneficiary.rates = {
                        error: response.error
                    };

                    $location.path('/international-payment/pay');
                });
            }

            function validateCCN() {
                var validationRequest = {
                    CCN: $scope.beneficiary.pay.customsClientNumber
                };

                InternationalPaymentService.validateDetails(validationRequest).then(function (validationResult) {
                    if (validationResult.isCCNValid) {
                        navigateNext();
                    }
                    else {
                        $scope.errorMessage = 'Invalid CCN';
                    }
                });
            }

            AccountsService.currentAndSavingsAccounts(Card.current()).then(function (accounts) {
                $scope.payFromAccounts = angular.copy(AccountsService.validFromPaymentAccounts(accounts));

                if (_.isUndefined($scope.beneficiary.pay)) {
                    $scope.beneficiary.pay = {fromAccount: $scope.payFromAccounts[0]};
                }

                populateCurrencies();
            });

            $scope.populateCurrencyList = function () {
                var accountCurrencyCode = $scope.beneficiary.pay.fromAccount.availableBalance.currency;
                $scope.availableBalanceCurrencyCode = accountCurrencyCode === 'ZAR' ? 'R' : accountCurrencyCode;
                $scope.currencies = [{
                    code: beneficiaryCurrency.code,
                    currencyPair: beneficiaryCurrency.code + '/' + accountCurrencyCode,
                    description: '(' + beneficiaryCurrency.code + ') ' + beneficiaryCurrency.name
                }];

                populateAccountCurrencyOnList(accountCurrencyCode);
            };

            $scope.next = function () {
                return $scope.beneficiary.pay.customsClientNumber ? validateCCN() : navigateNext();
            };

            $scope.back = function () {
                Flow.previous();
                $location.path('/international-payment/reason');
            };

            $scope.getCurrencyCode = function () {
                var currencyCode = $scope.beneficiary.pay && $scope.beneficiary.pay.currency ? $scope.beneficiary.pay.currency.code : '';
                return currencyCode === 'ZAR' ? 'R' : currencyCode;
            };
        });
})();
