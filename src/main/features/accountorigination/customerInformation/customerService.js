(function (app) {
    'use strict';

    app.factory('CustomerService', function (ServiceEndpoint, User, $q) {

        var handleError = function (response) {
            if (response.headers('x-sbg-response-type') === 'ERROR') {
                return $q.reject({message: response.headers('x-sbg-response-message')});
            }
            return response;
        };

        return {
            getCustomer: function () {
                var request = User.principal();
                return ServiceEndpoint.customerInformation.makeRequest(request).then(function (response) {
                    return response.data.customerInformation;
                });
            },
            updateCustomer: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateCustomerInformation.makeRequest(request).then(handleError);
            },
            updateFraudConsentAndSourceOfFunds: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateFraudConsentAndSourceOfFunds.makeRequest(request);
            },
            updateIncomeAndExpenses: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateCustomerIncomeAndExpenses.makeFormSubmissionRequest(request);
            },
            updateContactInfo: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateCustomerContactInfo.makeFormSubmissionRequest(request);
            },
            updateEmployment: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateCustomerEmployment.makeFormSubmissionRequest(request).then(handleError);
            },
            updateConsent: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateCustomerConsent.makeFormSubmissionRequest(request);
            },
            updateAddress: function (customerInformation) {
                var customerInformationForUpdate = _.cloneDeep(customerInformation);
                customerInformationForUpdate.addressDetails = _.filter(customerInformationForUpdate.addressDetails, function (address) {
                    return moment().isSame(moment(address.addressUsage[0].validFrom), 'day');
                });
                var request = _.merge(User.principal(), {customerInformation: customerInformationForUpdate});

                return ServiceEndpoint.updateCustomerAddress.makeFormSubmissionRequest(request).then(handleError);
            },
            updateBasicInfo: function (customerInformation) {
                var request = _.merge(User.principal(), {customerInformation: customerInformation});
                return ServiceEndpoint.updateCustomerBasicInfo.makeFormSubmissionRequest(request);
            },
            createCustomer: function (request) {
                return ServiceEndpoint.createCustomer.makeFormSubmissionRequest(request);
            },
            isCustomerCompliant: function (card, reasonForComplianceCheck) {
                return ServiceEndpoint.getCustomerCompliance.makeRequest({
                    card: card,
                    reasonForComplianceCheck: reasonForComplianceCheck
                }).then(function (response) {
                    if (response.headers('x-sbg-response-type') === 'ERROR') {
                        return $q.reject(response);
                    }
                    return response.data.compliant;
                });
            }
        };
    });

})(angular.module('refresh.accountOrigination.customerService', ['refresh.configuration', 'refresh.security.user']));
