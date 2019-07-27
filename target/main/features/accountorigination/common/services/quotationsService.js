(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.common.services.quotations',
        ['refresh.configuration', 'refresh.security.user', 'refresh.lookups']);

    app.factory('QuotationsService', function ($q, ServiceEndpoint, User, LookUps) {
        var enhanceWithApplicationDate = function (quotationsResponse) {
            return {
                quotations: _.map(quotationsResponse.quotations, function (quotation) {
                    var segments = quotation.applicationNumber.split(' ');
                    var applicationDate = moment(segments[segments.length - 1], 'YYYYMMDDHHmmssSSS');
                    return _.merge(quotation, {
                        applicationDate: applicationDate,
                        aboutToExpire: moment().diff(applicationDate, 'days') >= 21
                    });

                })
            };
        };

        var getLatestProductQuotation = function (quotations, productCategory) {
            var latest = _.max(_.filter(quotations, function (quotation) {
                return quotation.productCategory === productCategory &&
                        quotation.status === 'A' && _.startsWith(quotation.applicationNumber, 'SIB_USR');
            }), function (quotation) {
                return quotation.applicationDate.valueOf();
            });
            return latest === -Infinity ? null : latest;
        };

        return {
            getRCPQuotationDetails: function (applicationNumber) {
                return ServiceEndpoint.getRCPQuotationDetails.makeRequest(_.merge({applicationNumber: applicationNumber}, User.principal()))
                    .then(function (response) {
                        var offer = response.data;
                        var offerDetails = offer.rcpOfferDetails[0];

                        return {
                            applicationNumber: offer.applicationNumber,
                            rcpOfferDetails: offerDetails
                        };
                    });
            },
            list: function () {
                return ServiceEndpoint.getQuotations.makeRequest(User.principal()).then(function (response) {
                    var dateEnhancedQuotations = enhanceWithApplicationDate(response.data);

                    var latestAccounts = {};

                    _.forEach(LookUps.productCategories.values(), function (item) {
                        latestAccounts[item.description] = getLatestProductQuotation(dateEnhancedQuotations.quotations, item.code);
                    });

                    return latestAccounts;
                });
            }
        };
    });
})();
