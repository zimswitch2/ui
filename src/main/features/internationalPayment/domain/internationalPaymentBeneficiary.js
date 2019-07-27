(function () {

    var module = angular.module('refresh.internationalPayment.domain.internationalPaymentBeneficiary', []);

    module.factory('InternationalPaymentBeneficiary', function () {
        var _beneficiary;

        var Beneficiary = function (properties) {
            var isIndividual = function () {
                return _beneficiary.type === "INDIVIDUAL";
            };

            var ibanAndAccountNumberCapable = function () {
                return _beneficiary.bank.country && _beneficiary.bank.country.ibanCapable &&
                    _beneficiary.bank.routingName && _beneficiary.bank.currency;
            };

            return _.merge(properties, {
                isIndividual: function () {
                    return isIndividual();
                },
                ibanAndAccountNumberCapable: function () {
                    return ibanAndAccountNumberCapable();
                }
            });
        };

        var beneficiary = function () {
            return _beneficiary;
        };

        var initialize = function () {
            _beneficiary = new Beneficiary({type: 'INDIVIDUAL', reasonForPayment: {}});
            return _beneficiary;
        };

        var setConversionRates = function(conversionRates) {
            _beneficiary.rates = conversionRates;

            _beneficiary.rates.internationalAmount =
                conversionRates.convertedAmount.currency !== 'R' ? conversionRates.convertedAmount.amount :
                    _beneficiary.pay.amount;

            _beneficiary.rates.zarAmount =
                conversionRates.convertedAmount.currency === 'R' ? conversionRates.convertedAmount.amount :
                    _beneficiary.pay.amount;

            var beneficiaryCurrency = _beneficiary.bank.currency;
            if (beneficiaryCurrency.code === _beneficiary.pay.currency.code) {
                _beneficiary.pay.sellAmount = {
                    amount: conversionRates.convertedAmount.amount,
                    currency: _beneficiary.pay.fromAccount.availableBalance.currency
                };

                _beneficiary.pay.buyAmount = {
                    amount: _beneficiary.pay.amount,
                    currency: _beneficiary.pay.currency.code
                };
            } else {
                _beneficiary.pay.buyAmount = {
                    amount: conversionRates.convertedAmount.amount,
                    currency: beneficiaryCurrency.code
                };

                _beneficiary.pay.sellAmount = {
                    amount: _beneficiary.pay.amount,
                    currency: _beneficiary.pay.currency.code
                };
            }
        };

        return {
            initialize: initialize,
            current: beneficiary,
            setConversionRates: setConversionRates
        };
    });
})();