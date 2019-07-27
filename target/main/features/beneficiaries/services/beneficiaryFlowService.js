(function (app) {
    'use strict';
    app.factory('BeneficiaryFlowService',
        function (BeneficiariesState, BeneficiariesService, LastRequest, Card, Flow, ApplicationParameters, $location,
                  $window, ErrorMessages) {
            return {
                initialize: function (beneficiary, heading) {
                    Flow.create(['Enter details', 'Confirm details', 'Enter OTP'], heading, '/beneficiaries/list');
                    var modifiedBeneficiary;

                    var lastRequest = LastRequest.lastRequest();

                    if (lastRequest && lastRequest.data && lastRequest.data.beneficiaries) {
                        modifiedBeneficiary = angular.copy(lastRequest.data.beneficiaries[0]);
                        if (modifiedBeneficiary.bank) {
                            modifiedBeneficiary.bank = lastRequest.data.beneficiaries[0].bank;
                            modifiedBeneficiary.bank.branch = lastRequest.data.beneficiaries[0].bank.branch;
                        }
                    } else {
                        modifiedBeneficiary = beneficiary;
                        BeneficiariesState.errorMessage = undefined;
                    }

                    BeneficiariesState.card = Card.current();
                    BeneficiariesState.editing = true;
                    BeneficiariesState.modifiedBeneficiary = modifiedBeneficiary;
                },

                proceed: function () {
                    BeneficiariesState.editing = false;
                    Flow.next();
                },

                modify: function () {
                    BeneficiariesState.editing = true;
                    BeneficiariesState.errorMessage = undefined;
                    Flow.previous();

                },

                confirm: function (beneficiary, card, redirectLocation) {
                    var error = function (errorMessage, redirectLocation) {
                        BeneficiariesState.editing = true;
                        Flow.previous();
                        BeneficiariesState.errorMessage = errorMessage;
                        BeneficiariesState.addBeneficiaryFlow = false;
                        $location.path(redirectLocation).replace();
                    };

                    //TODO: proper error handling—it only works if it returns SUCCESS and 0000
                    Flow.next();
                    return BeneficiariesService.addOrUpdate(beneficiary, card).then(function (response) {
                        BeneficiariesState.addBeneficiaryFlow = true;
                        BeneficiariesState.errorMessage = undefined;
                        BeneficiariesState.latestBeneficiaryRecipientID = response.data.beneficiaries[0].recipientId;
                        $window.history.go(-1);
                        LastRequest.clear();
                    })
                    .catch(function (_error) {
                        error(ErrorMessages.messageFor(_error), redirectLocation);
                    });
                }
            };

        });

})(angular.module('refresh.beneficiaries.beneficiariesFlowService',
    ['refresh.beneficiaries', 'refresh.beneficiaries.groups', 'refresh.metadata', 'refresh.cache', 'refresh.configuration']));