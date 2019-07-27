(function (app) {
    'use strict';

    app.factory('AcceptedOfferResponseParser', function () {

        var VALID_PRODUCTS_FOR_CROSS_SELL = [1099, 1489, 4251, 4256, 4295];
        var PRODUCT_DISPLAY_NAME = {
            1099: 'MasterCard Blue Cheque Card',
            1489: 'MasterCard Gold Cheque Card',
            4251: 'MasterCard Titanium Cheque Card',
            4256: 'MasterCard Titanium Cheque Card',
            4295: 'Visa Gold Cheque Card'
        };
        var MASTER_CARD_PRODUCTS = [1099, 1489];
        var VISA_CARD_PRODUCTS = [4295];
        var TITANIUM_CARD_PRODUCTS = [4251, 4256];
        var PRODUCT_DISPLAY_IMAGE = {
            MASTERCARD: 'assets/images/Elite_MasterCard.jpg',
            VISA: 'assets/images/Elite_Visa.jpg',
            MASTERCARD_VISA: 'assets/images/Elite_MasterCard_Visa.jpg',
            TITANIUM: 'assets/images/Prestige.jpg'
        };

        var filterNonChequeOffers = function (response) {
            if (response.crossSell && response.crossSell.offerDetails.length > 0) {
                response.crossSell.offerDetails = _.select(response.crossSell.offerDetails, function (offerDetail) {
                    var offerProductsNumbers = _.map(offerDetail.productDetails, function (productDetail) { return productDetail.number; });
                    return _.intersection(offerProductsNumbers, VALID_PRODUCTS_FOR_CROSS_SELL).length > 0;
                });
            }
            return response;
        };

        var filterInvalidProducts = function (response) {
            if (response.crossSell && response.crossSell.offerDetails.length > 0) {
                response.crossSell.offerDetails[0].productDetails = _.filter(response.crossSell.offerDetails[0].productDetails, function (productDetail) {
                    return _.contains(VALID_PRODUCTS_FOR_CROSS_SELL, productDetail.number);
                });
            }
            return response;
        };

        var filterEmptyOffers = function (response) {
            if (response.crossSell && response.crossSell.offerDetails) {
                _.remove(response.crossSell.offerDetails, function (offerDetail) {
                    return offerDetail.productDetails.length === 0;
                });
            }
            return response;
        };

        var readableProductNames = function (response) {
            if (response.crossSell) {
                _.forEach(response.crossSell.offerDetails, function(offerDetail) {
                    _.forEach(offerDetail.productDetails, function(productDetail) {
                        productDetail.name = PRODUCT_DISPLAY_NAME[productDetail.number];
                    });
                });
            }
            return response;
        };

        var productImage = function (response) {
            if (response.crossSell && !_.isEmpty(response.crossSell.offerDetails)) {
                var offerProductsNumbers = _.map(response.crossSell.offerDetails[0].productDetails, function (productDetail) { return productDetail.number; });
                var mastercardOffers  = _.intersection(offerProductsNumbers, MASTER_CARD_PRODUCTS);
                var visaOffers  = _.intersection(offerProductsNumbers, VISA_CARD_PRODUCTS);

                if(!_.isEmpty(_.intersection(offerProductsNumbers, TITANIUM_CARD_PRODUCTS))) {
                    response.crossSell.offerDetails[0].productImage = PRODUCT_DISPLAY_IMAGE.TITANIUM;
                }
                else if(!_.isEmpty(mastercardOffers) && !_.isEmpty(visaOffers)){
                    response.crossSell.offerDetails[0].productImage = PRODUCT_DISPLAY_IMAGE.MASTERCARD_VISA;
                }
                else{
                    response.crossSell.offerDetails[0].productImage = _.isEmpty(mastercardOffers) ? PRODUCT_DISPLAY_IMAGE.VISA : PRODUCT_DISPLAY_IMAGE.MASTERCARD;
                }
            }
            return response;
        };

        return {
            format: function (acceptOfferResponse) {
                acceptOfferResponse = filterNonChequeOffers(acceptOfferResponse);
                acceptOfferResponse = filterInvalidProducts(acceptOfferResponse);
                acceptOfferResponse = filterEmptyOffers(acceptOfferResponse);
                acceptOfferResponse = readableProductNames(acceptOfferResponse);
                acceptOfferResponse = productImage(acceptOfferResponse);
                return acceptOfferResponse;
            }
        };
    });
})(angular.module('refresh.accountOrigination.currentAccount.domain.acceptedOfferResponseParser', []));
