(function(){
    'use strict';

    angular
        .module('refresh.accountSharing.beneficiaryPayments')
        .factory('EntitlementsBeneficiaryPaymentService', function(ServiceEndpoint, ServiceError, User, $q, Cacher){

            var rejectedPayment = {};

            var getPendingPayments = function() {

                return ServiceEndpoint
                    .getPendingBeneficiaryPayments
                    .makeRequest(User.principal())
                    .then(function(response){

                        return response.data.transactions;
                    },
                    function(response){
                        return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                    });
            };

            var getRejectedPayments = function() {

                return ServiceEndpoint
                    .getRejectedBeneficiaryPayments
                    .makeRequest(User.principal())
                    .then(function(response){
                        return response.data.transactions;
                    },
                    function(response){
                        return $q.reject(ServiceError.newInstance('An error has occurred', {}));
                    });
            };

            var setRejectedPaymentDetails = function(_rejectedPayment){
                rejectedPayment = _rejectedPayment;
            };

            var getRejectedPaymentsDetails = function(){
                return rejectedPayment;
            };

            return {
                getPendingPayments: getPendingPayments,
                getRejectedPayments: getRejectedPayments,
                setRejectedPaymentDetails : setRejectedPaymentDetails,
                getRejectedPaymentsDetails : getRejectedPaymentsDetails
            };

        });
})();