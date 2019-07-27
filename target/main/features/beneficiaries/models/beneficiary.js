'use strict';
(function (app) {
    app.factory('Beneficiary', function () {
        var beneficiary = {
            recipientId: 0,
            accountNumber: null,
            beneficiaryType: null,
            customerReference: null,
            recipientReference: null,
            recentPayment: null,
            paymentConfirmation: {
                recipientName: null,
                address: null,
                confirmationType: 'None',
                sendFutureDated: null
            },
            name: null,
            favourite: true
        };

        return {
            newInstance: function () {
                return angular.copy(beneficiary);
            }
        };
    });
})(angular.module('refresh.beneficiaries.beneficiary', []));