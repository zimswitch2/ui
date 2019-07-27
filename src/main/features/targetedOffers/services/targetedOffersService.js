var dynamicTargetOfferTemplates = false;
if (feature.dynamicTargetOfferTemplates) {
    dynamicTargetOfferTemplates = true;
}
(function () {
    'use strict';

    var app = angular.module('refresh.targetedOffers.targetedOffersService', ['refresh.error.service', 'refresh.card', 'refresh.security.user']);

    app.factory('TargetedOffersService', function ($q, $location, User, Card, ServiceEndpoint, ServiceError) {
        var genericErrorMessage = 'An error has occurred.';
        var defaultProductType = 'CURRENT';
        var defaultAcceptButtonText = 'Call me back';
        var defaultDCSProductName = 'IB';
        var currentOrCreditTemplateUrl = 'features/targetedOffers/directives/partials/currentAndCreditTemplate.html';
        var overdraftTemplateUrl = 'features/targetedOffers/directives/partials/overdraftOfferTemplate.html';
        var savingsTemplateUrl = 'features/targetedOffers/directives/partials/savingsOfferTemplate.html';

        var defaultAcceptUrl = '/targetedoffers/{productName}/callmeback';
        var defaultQualifyingAmountText = 'Limit up to ';
        var offerProductMappings = {
            'ELITE BANKING': {
                mappedProductCode: 'ECA',
                productType: 'CURRENT',
                acceptButtonText: 'Accept offer',
                dcsProductName: 'CURRENT ACCOUNT',
                acceptUrl: '/targetedoffers/current-account',
                templateUrl: currentOrCreditTemplateUrl,
                qualifyingAmountText: 'Overdraft up to '
            },
            'PRESTIGE BANKING': {
                mappedProductCode: 'PRA',
                productType: 'CURRENT',
                acceptButtonText: 'Accept offer',
                dcsProductName: 'CURRENT ACCOUNT',
                acceptUrl: '/targetedoffers/current-account',
                templateUrl: currentOrCreditTemplateUrl,
                qualifyingAmountText: 'Overdraft up to '
            },
            'CONSOLIDATOR CURRENT ACCOUNT': {
                mappedProductCode: 'CCA',
                productType: 'CURRENT',
                acceptButtonText: 'Accept offer',
                dcsProductName: 'CURRENT ACCOUNT',
                acceptUrl: '/targetedoffers/current-account',
                templateUrl: currentOrCreditTemplateUrl,
                qualifyingAmountText: 'Overdraft up to '
            },
            'GRADUATE AND PROFESSIONAL BANKING': {
                mappedProductCode: 'GAP',
                productType: 'CURRENT',
                acceptButtonText: 'Accept offer',
                dcsProductName: 'CURRENT ACCOUNT',
                acceptUrl: '/targetedoffers/current-account',
                templateUrl: currentOrCreditTemplateUrl,
                qualifyingAmountText: 'Overdraft up to '
            },
            'PRIVATE BANKING': {
                mappedProductCode: 'PRCA',
                productType: 'CURRENT',
                acceptButtonText: 'Accept offer',
                dcsProductName: 'CURRENT ACCOUNT',
                acceptUrl: '/targetedoffers/current-account',
                templateUrl: currentOrCreditTemplateUrl,
                qualifyingAmountText: 'Overdraft up to '
            },
            'BLUE CREDIT CARD': {
                mappedProductCode: 'BCC',
                productType: 'CREDIT_CARD',
                dcsProductName: 'CREDIT CARD',
                templateUrl: currentOrCreditTemplateUrl,
            },
            'GOLD CREDIT CARD': {
                mappedProductCode: 'GCC',
                productType: 'CREDIT_CARD',
                dcsProductName: 'CREDIT CARD',
                templateUrl: currentOrCreditTemplateUrl
            },
            'TITANIUM CREDIT CARD': {
                mappedProductCode: 'TCC',
                productType: 'CREDIT_CARD',
                dcsProductName: 'CREDIT CARD',
                templateUrl: currentOrCreditTemplateUrl
            },
            'PLATINUM CREDIT CARD': {
                mappedProductCode: 'PCC',
                productType: 'CREDIT_CARD',
                dcsProductName: 'CREDIT CARD',
                templateUrl: currentOrCreditTemplateUrl
            },
            'ACCESSCREDIT CARD': {
                mappedProductCode: 'ACC',
                productType: 'CREDIT_CARD',
                dcsProductName: 'CREDIT CARD',
                templateUrl: currentOrCreditTemplateUrl
            },
            'REVOLVING CREDIT PLAN': {
                mappedProductCode: 'RCP',
                acceptButtonText: 'Accept offer',
                productType: 'TERM_LOAN',
                dcsProductName: 'CREDIT CARD',
                acceptUrl: '/targetedoffers/rcp',
                templateUrl: overdraftTemplateUrl
            },
            'PURESAVE': {
                mappedProductCode: 'PSA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            '32-DAY NOTICE DEPOSIT': {
                mappedProductCode: 'DND',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'ACCESSSAVE': {
                mappedProductCode: 'ASA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'CALL DEPOSIT': {
                mappedProductCode: 'CDA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'CONTRACTSAVE': {
                mappedProductCode: 'CSA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'FIXED DEPOSIT': {
                mappedProductCode: 'FDA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'MARKETLINK': {
                mappedProductCode: 'MLA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'MONEYMARKET CALL ACCOUNT': {
                mappedProductCode: 'MMC',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'SOCIETY SCHEME': {
                mappedProductCode: 'SSA',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'TAX-FREE CALL ACCOUNT': {
                mappedProductCode: 'TFC',
                productType: 'SAVINGS',
                dcsProductName: 'SAVINGS ACCOUNT',
                templateUrl: savingsTemplateUrl
            },
            'OVERDRAFT': {
                mappedProductCode: 'OD',
                productType: 'CURRENT',
                dcsProductName: 'CURRENT ACCOUNT',
                templateUrl: overdraftTemplateUrl,
            },
            'OVERDRAFT INCREASE': {
                mappedProductCode: 'ODI',
                productType: 'CURRENT',
                dcsProductName: 'CURRENT ACCOUNT',
                templateUrl: overdraftTemplateUrl,
            }
        };
        var cachedOffers = {};
        var lastActionedOffer;

        var rejectResponse = function (message) {
            return $q.reject(ServiceError.newInstance(message));
        };

        var getOfferToPost = function () {
            var offer = cachedOffers[Card.current().number];
            if(dynamicTargetOfferTemplates){
                offer = cachedOffers[Card.current().number].offer;
            }
            return {
                id: offer.id,
                userName: offer.userName,
                cardNumber: offer.cardNumber,
                productCode: offer.productCode,
                demographicCustomerNumber: offer.demographicCustomerNumber,
                channelProfileId: offer.channelProfileId,
                bpId: offer.bpId,
                productFamily: offer.productFamily,
                productName: offer.productName,
                lift: offer.lift,
                confidence: offer.confidence,
                order: offer.order,
                interestRate: offer.interestRate,
                qualifyingAmount: offer.qualifyingAmount
            };
        };

        return {
            getOffer: function () {
                var currentCard = Card.current();
                if (cachedOffers[currentCard.number] === undefined) {
                    var serviceCallOptions = {
                        omitServiceErrorNotification: true
                    };

                    return ServiceEndpoint.targetedOffersGetOffer.makeRequest({cardNumber: currentCard.number}, serviceCallOptions).then(function (response) {
                        if (response.headers('x-sbg-response-type') !== "ERROR") {
                            var formattedResponse = response.data.offer;
                            if (formattedResponse) {
                                if (offerProductMappings.hasOwnProperty(response.data.offer.productName.toUpperCase())) {
                                    formattedResponse = _.merge(response.data.offer, offerProductMappings[response.data.offer.productName.toUpperCase()]);
                                }
                                if (!formattedResponse.hasOwnProperty('productType')) {
                                    formattedResponse.productType = defaultProductType;
                                }
                                if (!formattedResponse.hasOwnProperty('acceptButtonText')) {
                                    formattedResponse.acceptButtonText = defaultAcceptButtonText;
                                }
                                if (!formattedResponse.hasOwnProperty('dcsProductName')) {
                                    formattedResponse.dcsProductName = defaultDCSProductName;
                                }
                                if (!formattedResponse.hasOwnProperty('acceptUrl')) {
                                    formattedResponse.acceptUrl = defaultAcceptUrl.replace('{productName}', formattedResponse.productName.toLowerCase().replace(/ /g, '-'));
                                }
                            } else {
                                formattedResponse = null;
                            }
                            cachedOffers[Card.current().number] = formattedResponse;
                            if(cachedOffers[Card.current().number]) {
                                var deferred = $q.defer();
                                deferred.resolve(cachedOffers[currentCard.number]);
                                return deferred.promise;
                            } else {
                                return rejectResponse('No offer could be found.');
                            }
                        } else if (response.headers('x-sbg-response-code') !== "9999") {
                            return rejectResponse(response.headers('x-sbg-response-message'));
                        } else {
                            return rejectResponse(genericErrorMessage);
                        }
                    }, function () {
                        cachedOffers[Card.current().number] = null;
                        return rejectResponse(genericErrorMessage);
                    });
                } else {
                    var deferred = $q.defer();
                    deferred.resolve(cachedOffers[currentCard.number]);
                    return deferred.promise;
                }
            },
            getOfferForDynamicTemplate: function () {
                var currentCard = Card.current();
                if (cachedOffers[currentCard.number] === undefined) {
                    var serviceCallOptions = {
                        omitServiceErrorNotification: true
                    };

                    return ServiceEndpoint.targetedOffersGetOfferWithTemplateData.makeRequest({cardNumber: currentCard.number}, serviceCallOptions).then(function (response) {

                        if (response.headers('x-sbg-response-type') !== "ERROR") {
                            var formattedResponse = response.data;
                            if (response.data.offer) {
                                if (offerProductMappings.hasOwnProperty(response.data.offer.productName.toUpperCase())) {
                                    formattedResponse.offer = _.merge(response.data.offer, offerProductMappings[response.data.offer.productName.toUpperCase()]);
                                }
                                if (!formattedResponse.offer.hasOwnProperty('productType')) {
                                    formattedResponse.offer.productType = defaultProductType;
                                }
                                if (!formattedResponse.offer.hasOwnProperty('acceptButtonText')) {
                                    formattedResponse.offer.acceptButtonText = defaultAcceptButtonText;
                                }
                                if (!formattedResponse.offer.hasOwnProperty('dcsProductName')) {
                                    formattedResponse.offer.dcsProductName = defaultDCSProductName;
                                }
                                if (!formattedResponse.offer.hasOwnProperty('acceptUrl')) {
                                    formattedResponse.offer.acceptUrl = defaultAcceptUrl.replace('{productName}', formattedResponse.offer.productName.toLowerCase().replace(/ /g, '-'));
                                }
                                if (!formattedResponse.templateData.hasOwnProperty('qualifyingAmountText')) {
                                    formattedResponse.templateData.qualifyingAmountText = defaultQualifyingAmountText;
                                }
                            } else {
                                formattedResponse = null;
                            }
                            cachedOffers[Card.current().number] = formattedResponse;
                            var deferred = $q.defer();
                            deferred.resolve(cachedOffers[currentCard.number]);
                            return deferred.promise;

                        } else if (response.headers('x-sbg-response-code') !== "9999") {
                            return rejectResponse(response.headers('x-sbg-response-message'));
                        } else {
                            return rejectResponse(genericErrorMessage);
                        }
                    }, function () {
                        cachedOffers[Card.current().number] = null;
                        return rejectResponse(genericErrorMessage);
                    });
                } else {
                    var deferred = $q.defer();
                    deferred.resolve(cachedOffers[currentCard.number]);
                    return deferred.promise;
                }
            },
            getLastActionedOffer: function () {
                return cachedOffers[Card.current().number];
            },
            getTemplate: function (templateName) {
                return ServiceEndpoint.targetedOffersGetTemplate.makeRequest({templateName: templateName}).then(function (response) {
                    if (response.headers('x-sbg-response-type') !== "ERROR") {
                        return response.data;
                    } else if (response.headers('x-sbg-response-code') !== "9999") {
                        return rejectResponse(response.headers('x-sbg-response-message'));
                    } else {
                        return rejectResponse(genericErrorMessage);
                    }
                }, function () {
                    return rejectResponse(genericErrorMessage);
                });
            },
            actionOffer: function (actionText) {
                var offer = cachedOffers[Card.current().number];
                var offerToPost = getOfferToPost();
                lastActionedOffer = offer;
                return ServiceEndpoint.targetedOffersActionOffer.makeRequest({action: actionText, offer: offerToPost})
                    .then(function (response) {
                        cachedOffers[Card.current().number] = null;
                        return response;
                    });
            },
            submitDetailsToDCS: function (productName, customerDetails) {
                delete customerDetails.idNumber;
                var offerToPost = getOfferToPost();
                return ServiceEndpoint.targetedOffersSubmitDetailsToDCS.makeRequest(_.merge({
                        description: productName,
                        systemPrincipalIdentifier: User.principal().systemPrincipalIdentifier,
                        offer: offerToPost
                    }, customerDetails))
                    .then(function (response) {
                        cachedOffers[Card.current().number] = null;
                        return response;
                    });
            }
        };
    });
})();
