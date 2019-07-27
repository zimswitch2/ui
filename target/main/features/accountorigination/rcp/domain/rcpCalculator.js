(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.rcp.domain.rcpCalculator', ['refresh.accountOrigination.rcp.domain.loanCalculator']);

    app.factory('RcpCalculator', function (LoanCalculator) {
        var getMinimumRepaymentAmountForOffer = function(offer, requestedLimit){

            var offerDetails = offer.rcpOfferDetails;
            var initiationFee = LoanCalculator.calculateInitiationFee(offerDetails.initiationFeeMinimum, offerDetails.initiationFeeMaximum, offerDetails.initiationFeeRate, requestedLimit, offerDetails.initiationFeeBase);
            var totalLoanAmount = (+requestedLimit) + initiationFee;
            var loanRepaymentAmount = LoanCalculator.calculateRepaymentAmount(totalLoanAmount, offerDetails.loanTermInMonths, offerDetails.interestRate / 1200.0);

            return parseFloat((loanRepaymentAmount + offerDetails.monthlyServiceFee).toFixed(2));
        };

        return {
            getMinimumRepaymentAmountForOffer: getMinimumRepaymentAmountForOffer
        };
    });

})();