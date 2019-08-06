(function (app) {
    'use strict';

    app.factory('BeneficiariesListService', function (ServiceEndpoint, dateFormatFilter, Cacher) {
        var lastPaymentDate = function (benef) {
            if (benef.recentPayment[0] !== undefined && benef.recentPayment[0].amount.amount !== 0) {
                return benef.recentPayment[0].date;
            }
            return "";
        };

        var amountPaid = function (benef) {
            if (benef.recentPayment && benef.recentPayment[0] && benef.recentPayment[0].amount) {
                return benef.recentPayment[0].amount.amount;
            }
            return undefined;
        };

        var formattedLastPayment = function (beneficiary) {
            return ( beneficiary.recentPayment[0] !== undefined && beneficiary.recentPayment[0].amount.amount !== 0 ) ?
                dateFormatFilter(beneficiary.recentPayment[0].date) : undefined;
        };

        var recentPayment = function (beneficiary) {
            if (beneficiary.recentPayment[0] !== undefined && beneficiary.recentPayment[0].amount.amount !== 0) {
                return beneficiary.recentPayment;
            }
            else {
                return [];
            }
        };

        var clear = function(){
            Cacher.shortLived.flushEndpoint('listBeneficiary');
        };

        return {
            formattedBeneficiaryList: function (card) {
                var beneficiaryList = [];
                var formattedBeneficiaryList = function (result) {
                    beneficiaryList = _.map(result.data.beneficiaries, function (originalBeneficiary) {
                        return {
                            recipientId: originalBeneficiary.recipientId,
                            name: originalBeneficiary.name,
                            accountNumber: originalBeneficiary.accountNumber,
                            recipientReference: originalBeneficiary.recipientReference,
                            customerReference: originalBeneficiary.customerReference,
                            lastPaymentDate: lastPaymentDate(originalBeneficiary),
                            formattedLastPaymentDate: formattedLastPayment(originalBeneficiary),
                            recentPayment: recentPayment(originalBeneficiary),
                            bank: originalBeneficiary.bank,
                            paymentConfirmation: originalBeneficiary.paymentConfirmation,
                            amountPaid: amountPaid(originalBeneficiary),
                            recipientGroupName: originalBeneficiary.recipientGroup !== null ?
                                originalBeneficiary.recipientGroup.name : "",
                            canSelect: originalBeneficiary.recipientGroup === null,
                            originalBeneficiary: originalBeneficiary,
                            selectedClass: "",
                            beneficiaryType: originalBeneficiary.beneficiaryType
                        };
                    });
                    return beneficiaryList;
                };

                return Cacher.shortLived.fetch('listBeneficiary', {card: card}).then(formattedBeneficiaryList);
            },

            clear: clear,

            isBeneficiaryValid: function(card, recipientId) {
                clear();
                return Cacher.shortLived
                        .fetch('listBeneficiary', {card: card})
                        .then(function(results){
			    console.log("======= beneficiaries : " + JSON.stringify(results.data.beneficiaries));
			    console.log("======= beneficiaries : " + JSON.stringify(results.beneficiaries));
			    console.log("======= card : " + JSON.stringify(card));
			    console.log("======= recipientId : " + recipientId);
                            var idx =  _.findIndex(results.data.beneficiaries, function (beneficiary) {
			                    console.log("======= beneficiary : " + beneficiary);
                                            return beneficiary.recipientId === recipientId;
                                        });

			    console.log("======= idx  " + idx);
                            return idx !== -1;
                        });


            }
        };
    });
})(angular.module('refresh.beneficiaries.beneficiariesListService', ['refresh.beneficiaries', 'refresh.metadata',
    'refresh.cache', 'refresh.configuration']));
