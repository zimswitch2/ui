(function (app) {
    'use strict';

    var PRIVATE_BANKING_PRODUCT = 'PRIVATE BANKING - 140';
    app.factory('CurrentAccountOfferDecorator', function (CurrentAccountProductContent, CurrentAccountProductFamilyContent) {
        var prepareTimestamp = function (applicationNumber) {
            return moment(applicationNumber.split(' ')[1], 'YYYYMMDD');
        };

        var enhanceProductWithContent = function (product) {
            var replace = product.name.toUpperCase() === 'PRIVATE BANKING PLUS CURRENT ACCOUNT' ? ' PLUS CURRENT ACCOUNT' : ' CURRENT ACCOUNT';
            product.name = product.name.toUpperCase().replace(replace, '');
            return _.merge(product, CurrentAccountProductContent[product.number]);
        };

        var validProduct = function (offer, product) {
            return offer.productFamily === PRIVATE_BANKING_PRODUCT ? product.productFamily === offer.productFamily :
                CurrentAccountProductContent[product.number];
        };

        var prepareProducts = function (offer) {
            return _.filter(_.map(offer.productDetails, enhanceProductWithContent), function (product) {
                return validProduct(offer, product);
            });
        };

        var prepareOverdraft = function (overdraft) {
            overdraft.amount = 0;
            return overdraft;
        };

        return {
            prepareForDisplay: function (response) {
                var offer = response.offerDetails[0];
                return {
                    applicationNumber: response.applicationNumber,
                    timestamp: prepareTimestamp(response.applicationNumber),
                    productFamily: CurrentAccountProductFamilyContent.for(offer.productFamily),
                    products: prepareProducts(offer),
                    overdraft: prepareOverdraft(offer.overdraft)
                };
            }
        };
    });
})(angular.module('refresh.accountOrigination.currentAccount.domain.currentAccountOfferDecorator',
    ['refresh.accountOrigination.currentAccount.domain.currentAccountProductContent']));
