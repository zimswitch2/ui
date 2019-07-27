describe('Loan Calculator', function () {
   'use strict';

    var loanCalculator;

    beforeEach(module('refresh.accountOrigination.rcp.domain.loanCalculator'));

    beforeEach(inject(function (LoanCalculator) {
        loanCalculator = LoanCalculator;
    }));

    describe ('calculateRepaymentAmount', function () {
        it('should be able to calculate the loan repayment amount rounded up to the nearest cent', function(){
            var loanAmount = 120000;
            var loanTermInMonths = 54.0;
            var interestRate = 21.0 / 1200.0;

            var repaymentAmount = loanCalculator.calculateRepaymentAmount(loanAmount, loanTermInMonths, interestRate);

            expect(repaymentAmount).toEqual(3453.21);
        });

        it('should be able to calculate the loan repayment amount rounded up to the nearest cent', function(){
            var loanAmount = 150000;
            var loanTermInMonths = 54.0;
            var interestRate = 20.0 / 1200.0;

            var repaymentAmount = loanCalculator.calculateRepaymentAmount(loanAmount, loanTermInMonths, interestRate);

            expect(repaymentAmount).toEqual(4234.40);
        });
    });

    describe('calculateInitiationFee', function() {
        var minimumFee = 0;
        var maximumFee = 1140;
        var feeRate = 11.4;
        var baseFee = 57;

        it('should return the base fee if the loan amount is zero', function(){
            var loanAmount = 0;
            //baseFee = -1000;

            var repaymentAmount = loanCalculator.calculateInitiationFee(minimumFee, maximumFee, feeRate, loanAmount, baseFee);

            expect(repaymentAmount).toEqual(baseFee);
        });

        it('should return the minimum loan amount if the fee is less than the minimum', function(){
            var loanAmount = -50000;

            var repaymentAmount = loanCalculator.calculateInitiationFee(minimumFee, maximumFee, feeRate, loanAmount, baseFee);

            expect(repaymentAmount).toEqual(0);
        });

        it('should return the maximum initiation fee amount if the fee is more than the maximum', function(){
            var loanAmount = 9000;

            var repaymentAmount = loanCalculator.calculateInitiationFee(minimumFee, maximumFee, feeRate, loanAmount, baseFee);

            expect(repaymentAmount).toEqual(1083);
        });

        it ('should return the exact initiaiton fee based on the rate if the fee falls within the bounds of maximum and minimum', function () {
            var loanAmount = 9500;

            var repaymentAmount = loanCalculator.calculateInitiationFee(minimumFee, maximumFee, feeRate, loanAmount, baseFee);

            expect(repaymentAmount).toEqual(maximumFee);
        });
    });
});