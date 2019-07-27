(function (app) {
    'use strict';

    var knownProviders = {};

    function addProvider(type, id, serviceId, name, infoMessage) {
        knownProviders[serviceId] = { type:type, id: id, serviceId: serviceId, name: name, infoMessage: infoMessage };
    }

    addProvider('mobile', 'telkom-mobile', 'Heita', 'Telkom Mobile');
    addProvider('mobile', 'mtn', 'MTN', 'MTN');
    addProvider('mobile', 'vodacom', 'Vodacom', 'Vodacom');
    addProvider('mobile', 'cellc', 'CellC', 'CellC');
    addProvider('mobile', 'virgin', 'Virgin', 'Virgin Mobile');
    addProvider('electricity', 'electricity', 'Electricity', 'Electricity', 'Please ensure that you are paying a participating municipality, that your prepaid meter is registered and that your meter number is valid');

    app.factory('RechargeService', function (ServiceEndpoint, $q, ServiceError, AccountsService, Cacher) {

        var formatRequest = function (recharge) {
            return {
                account: recharge.account,
                transactions: {
                    prepaidPurchases: [
                        {
                            rechargeNumber: recharge.rechargeNumber,
                            prepaidType: recharge.provider.product.type,
                            basePrepaidProvider: {
                                prepaidProviderType: recharge.provider.serviceId
                            },
                            amount: {
                                amount: recharge.provider.product.bundle ? recharge.provider.product.bundle.amount.amount : parseInt(recharge.provider.product.amount)
                            },
                            productCode: recharge.provider.product.bundle ? recharge.provider.product.bundle.productCode : undefined
                        }
                    ]
                }
            };
        };

        var errorResponses = {
            '2160': 'You have exceeded your daily cash withdrawal limit.',
            '9018': 'Recharge unsuccessful. Please try again later',
            '2170': 'You have exceeded your monthly withdrawal limit',
            '2190': 'Daily prepaid transactions limit exceeded. Please try again tomorrow',
            '9104': 'Transaction declined. Please contact your electricity provider for the status of your account',
            '9019': 'Invalid cell phone number. Please try again',
            '2180': 'Recharge limit exceeded for today',
            '2016': 'You have insufficient funds in this account to make the requested payments'
        };

        var transformProviders = function (providers) {
            return _.map(providers, function (provider) {
                return {
                    type: knownProviders[provider.prepaidProviderType].type,
                    id: knownProviders[provider.prepaidProviderType].id,
                    name: knownProviders[provider.prepaidProviderType].name,
                    products: transformProducts(provider),
                    serviceId: provider.prepaidProviderType,
                    infoMessage: knownProviders[provider.prepaidProviderType].infoMessage
                };
            });
        };

        var transformBundles = function(product) {
            if (product.prepaidType === 'Airtime') {
                return undefined;
            }

            var bundles = _.map(product.prepaidPreset, function (prepaidPreset) {
                return {
                    amount: prepaidPreset.amount,
                    productCode: prepaidPreset.productCode,
                    name: prepaidPreset.friendlyName
                };
            });
            return _.sortBy(bundles, function (bundle) {
                return bundle.amount.amount;
            });
        };

        var productName = function (prepaidType) {
            return {
                Airtime: 'Airtime',
                SMS: 'SMS bundles',
                Data: 'Data bundles',
                Electricity: 'Electricity'
            }[prepaidType];
        };

        var transformProducts = function (provider) {
            var products = _.reduce(provider.prepaidProduct, function (result, prepaidProduct) {
                result[prepaidProduct.prepaidType] = {
                    type: prepaidProduct.prepaidType,
                    name: productName(prepaidProduct.prepaidType),
                    bundles: transformBundles(prepaidProduct),
                    range: prepaidProduct.range
                };
                return result;
            }, {});

            var orderedProductsMap = _.map(['Airtime', 'SMS', 'Data', 'Electricity'], function (productType) {
                return products[productType];
            });
            return _.filter(orderedProductsMap, function (product){
                return product !== undefined;
            });
        };

        function filterToOnlyKnownProviders(response) {
            return _.filter(response.data.prepaidProviders, function (prepaidProvider) {
                return knownProviders[prepaidProvider.prepaidProviderType];
            });
        }

        return {
            recharge: function (recharge) {
                AccountsService.clear();

                var request = formatRequest(recharge);
                var providersOnNewService = {'Heita':'Heita'};

                var prepaidProviderType = request.transactions.prepaidPurchases[0].basePrepaidProvider.prepaidProviderType;
                var service = (providersOnNewService[prepaidProviderType]) ? ServiceEndpoint.prepaidRechargePurchase : ServiceEndpoint.prepaidRecharge;
                if (prepaidProviderType === 'Heita'){
                    request.transactions.prepaidPurchases[0].basePrepaidProvider.prepaidProviderType = 'Telkom Mobile';
                }

                return service.makeRequest(request)
                    .then(function(response) {

                        var responseCode = response.headers('x-sbg-response-code');

                        if (responseCode === '0000') {
                            return response.data;
                        } else if (errorResponses[responseCode]) {
                            return $q.reject(ServiceError.newInstance(errorResponses[responseCode], request));
                        } else {
                            return $q.reject(ServiceError.newInstance('An error has occurred', request));
                        }
                    },function(error) {
                        return $q.reject(ServiceError.newInstance(error.message || 'An error has occurred', request));
                    });
            },
            listProviders: function () {
                return Cacher.perennial.fetch('prepaidProviderDetails', {})
                    .then(function (response) {
                        if (response.headers('x-sbg-response-code') === '0000') {
                            return transformProviders(filterToOnlyKnownProviders(response));
                        } else {
                            return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                        }
                    },
                    function () {
                        return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                    });
            }
        };
    });
})(angular.module('refresh.prepaid.recharge.services', ['refresh.mcaHttp', 'refresh.accounts', 'refresh.cache', 'refresh.error.service']));
