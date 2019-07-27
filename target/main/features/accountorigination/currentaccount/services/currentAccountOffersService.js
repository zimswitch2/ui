(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.currentAccount.services.currentAccountOffersService',
        ['refresh.security.user', 'refresh.accountOrigination.currentAccount.domain.currentAccountOfferDecorator',
         'refresh.accountOrigination.currentAccount.domain.acceptedOfferResponseParser']);

    app.factory('CurrentAccountOffersService', function (ServiceEndpoint, User, CurrentAccountOfferDecorator, AcceptedOfferResponseParser, $q) {
        var declineHandling = function (response) {
            if (!response.data.offerDetails[0].approved) {
                return $q.reject({
                    applicationNumber: response.data.applicationNumber,
                    reason: 'DECLINED'
                });
            }

            return response;
        };

        var successHandling = function (response) {
            var enhancedOffer = CurrentAccountOfferDecorator.prepareForDisplay(response.data);

            if (!enhancedOffer.productFamily || enhancedOffer.products.length === 0) {
                return $q.reject({
                    reason: 'UNSUPPORTED'
                });
            }
            return enhancedOffer;
        };

        var getQuotationDetails = function (applicationNumber) {
            var request, endpoint;

                request = _.merge({applicationNumber: applicationNumber}, User.principal());
                endpoint = ServiceEndpoint.getQuotationDetails;

            return endpoint.makeRequest(request)
                .then(declineHandling)
                .then(successHandling);
        };

        var getOffers = function () {
            var request, endpoint;

                request = User.principal();
                endpoint = ServiceEndpoint.currentAccountOffers;


            return endpoint.makeRequest(request, { omitServiceErrorNotification: true })
                .then(declineHandling)
                .then(successHandling);
        };

        var openAccount = function (endpoint, applicationNumber, productNumber, preferredBranch, overdraftAmount, statementsConsentDetails) {
            var request = _.merge(User.principal(), {
                productNumber: productNumber,
                selectedOffer: 1,
                applicationNumber: applicationNumber,
                preferredBranch: preferredBranch,
                requestedLimit: overdraftAmount || 0
            }, statementsConsentDetails);
            return endpoint.makeRequest(request).then(function (response) {
                return response.data;
            });
        };

        return {
            getQuotationDetails : getQuotationDetails,
            getOffers: getOffers,
            accept: function (applicationNumber, productNumber, preferredBranch, overdraft, statementsConsentDetails) {
                return openAccount(ServiceEndpoint.acceptOffer, applicationNumber, productNumber, preferredBranch, overdraft, statementsConsentDetails)
                    .then(function (response) {
                        return AcceptedOfferResponseParser.format(response);
                    });
            }
        };
    });
})();
