(function (app) {
    'use strict';

    app.factory('AcceptCardCrossSellService', function (ServiceEndpoint, User, $q) {
        return {
            accept: function (applicationNumber, productNumber, preferredBranch) {
                var request = _.merge(User.principal(), {
                    productNumber: productNumber,
                    selectedOffer: 1,
                    applicationNumber: applicationNumber,
                    preferredBranch: preferredBranch
                });
                return ServiceEndpoint.acceptCardCrossSell.makeRequest(request).then(function (response) {
                    if (response.headers('x-sbg-response-type') !== 'SUCCESS') {
                        return $q.reject();
                    }
                    else {
                        return response.data;
                    }
                });
            }
        };
    });
})(angular.module('refresh.accountOrigination.currentAccount.services.acceptCardCrossSellService', ['refresh.configuration','refresh.security.user']));