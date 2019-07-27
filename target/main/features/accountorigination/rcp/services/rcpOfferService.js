(function () {
    'use strict';
    var app = angular.module('refresh.accountOrigination.rcp.services.OfferService',
        [
            'refresh.security.user',
            'refresh.configuration'
        ]);

    app.factory('RcpOfferService', function (ServiceEndpoint, User, $q) {
        var errorHandling = function (response) {
            if (response && response.headers && response.headers('x-sbg-response-code') === '8815') {
                return $q.reject({ reason: 'UNSUPPORTED'});
            }
            else {
                return $q.reject(response);
            }
        };

        var declineHandling = function (response) {
            if (!response.data.rcpOfferDetails[0].approved) {
                return $q.reject({
                    applicationNumber: response.data.applicationNumber,
                    reason: 'DECLINED',
                    message: response.data.rcpOfferDetails[0].message
                });
            }

            return response;
        };

        var successHandling = function(response) {
            var offer = response.data;
            var offerDetails = offer.rcpOfferDetails[0];

            return {
                applicationNumber: offer.applicationNumber,
                rcpOfferDetails: offerDetails
            };
        };

        var getOffers = function () {
            return ServiceEndpoint.createRcpOffer
                .makeRequest(User.principal(), {omitServiceErrorNotification: true})
                .then(declineHandling)
                .then(successHandling)
                .catch(errorHandling);
        };

        var getPath = function() {
            return '/apply/rcp/offer';
        };

        var accept = function (NewAccountDetails, DebitOrderDetails) {
            var request = _.merge(User.principal(), NewAccountDetails, DebitOrderDetails);
            return ServiceEndpoint.acceptRcpOffer.makeRequest(request)
                .then(function (response) {
                    return response.data;
                })
                .catch(errorHandling);
        };

        var getPreAgreementHtml = function (RcpOfferDetails) {
            var request = _.merge(User.principal(), RcpOfferDetails);
            return ServiceEndpoint.getPreAgreementHtml.makeRequest(request)
                .then(function (response) {
                    return response.data;
                })
                .catch(errorHandling);
        };

        return {
            getOffers: getOffers,
            getPath: getPath,
            accept: accept,
            getPreAgreementHtml: getPreAgreementHtml
        };
    });
})();
