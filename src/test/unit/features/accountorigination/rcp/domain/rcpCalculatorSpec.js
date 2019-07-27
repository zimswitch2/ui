describe('RCP Calculator', function () {
    'use strict';

    var rcpCalculator;

    var offer = {
        "applicationNumber": "SC725327 20150515170450001",
        "rcpOfferDetails": {
            "approved": true,
            "maximumLoanAmount": 120000,
            "interestRate": 21.0,
            "initiationFeeMaximum": 1140,
            "initiationFeeMinimum": 0,
            "initiationFeeRate": 11.4,
            "initiationFeeBase": 57,
            "monthlyServiceFee": 57,
            "loanTermInMonths": 54,
            "productName": "REVOLVING CREDIT PLAN LOAN",
            "productNumber": 8
        }
    };

    beforeEach(module('refresh.accountOrigination.rcp.domain.rcpCalculator'));

    beforeEach(inject(function (RcpCalculator) {
        rcpCalculator = RcpCalculator;
    }));

    describe ('getMinimumRepaymentAmountForOffer', function () {

        it('should return the minimum repayment for the offer', function () {
            var requestedLimit = 25000;
            var repaymentAmount = rcpCalculator.getMinimumRepaymentAmountForOffer(offer, requestedLimit);

            expect(repaymentAmount).toEqual(809.23);
        });

        it('should return the minimum repayment for the offer even when a string is passed in', function () {
            var requestedLimit = "25000";
            var repaymentAmount = rcpCalculator.getMinimumRepaymentAmountForOffer(offer, requestedLimit);

            expect(repaymentAmount).toEqual(809.23);
        });

        it ('should return the correct minimum repayment without floating point errors', function() {
            var requestedLimit = 100000;
            offer.rcpOfferDetails.interestRate = 7.0;
            offer.rcpOfferDetails.loanTermInMonths = 60;
            offer.rcpOfferDetails.monthlyServiceFee = 11.4;

            var repaymentAmount = rcpCalculator.getMinimumRepaymentAmountForOffer(offer, requestedLimit);

            expect(repaymentAmount).toEqual(2014.10);
        });
    });
});