'use strict';
(function (app) {
    app.factory('BeneficiariesService', function ($q, URL, ServiceEndpoint, BeneficiariesListService) {
        var errorMessages = {
            '2308': 'Please enter a valid account number',
            '2311': 'Please enter a valid account number',
            '2318': 'This beneficiary is already listed in our directory. To add this beneficiary, search for it below',
            '2202': 'Please enter a valid beneficiary reference',
            '7545': 'Please enter a valid notification email address'
        };

        return {
            addOrUpdate: function (beneficiary, card) {
                BeneficiariesListService.clear();

                var request = {
                    beneficiaries: [beneficiary],
                    card: card
                };

                return ServiceEndpoint.addOrUpdateBeneficiary.makeRequest(request)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-type') === "ERROR") {
                            var errorMessage = errorMessages[response.headers('x-sbg-response-code')] || 'An error has occurred';
                            return $q.reject({message: errorMessage});
                        }

                        return response;
                    }, function (error) {
                        var errorMessage = error.message || 'An error has occurred';
                        return $q.reject({message: errorMessage});
                    });

            },
            changeBeneficiaryGroupMembership: function (beneficiaries, card) {
                BeneficiariesListService.clear();
                var deferred = $q.defer();
                var request = {
                    beneficiaries: beneficiaries,
                    card: card
                };
                ServiceEndpoint.changeBeneficiaryGroupMembership.makeRequest(request)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-code') === "0000" && response.headers('x-sbg-response-type') === "SUCCESS") {
                            deferred.resolve(response);
                        } else {
                            deferred.reject({message: 'An error has occurred'});
                        }
                    }, function () {
                        deferred.reject({message: 'An error has occurred'});
                    });
                return deferred.promise;
            },
            deleteBeneficiary: function (beneficiary, card) {
                BeneficiariesListService.clear();
                var deferred = $q.defer();
                var request = {
                    beneficiaries: [beneficiary],
                    card: card
                };
                ServiceEndpoint.deleteBeneficiary.makeRequest(request)
                    .then(function (response) {
                        if (response.headers('x-sbg-response-code') === "0000" && response.headers('x-sbg-response-type') === "SUCCESS") {
                            deferred.resolve(response);
                        } else {
                            deferred.reject();
                        }
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            }
        };
    });
})(angular.module('refresh.beneficiaries.beneficiariesService', ['refresh.beneficiaries', 'refresh.beneficiaries.groups',
    'refresh.metadata', 'refresh.cache', 'refresh.configuration', 'refresh.beneficiaries.beneficiariesListService']));
