(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.rcp.domain.loanCalculator', []);

    app.factory('LoanCalculator', function () {

        var calculateRepaymentAmount = function (loanPrincipal, term, interestRatePerTerm) {
            var repaymentAmount = interestRatePerTerm / (1 - (Math.pow((1 + interestRatePerTerm), -1 * term))) * loanPrincipal;
            return Math.ceil(repaymentAmount * 100) / 100;
        };

        var calculateInitiationFee = function (minimumFee, maximumFee, feeRate, loanAmount, baseFee) {
            var rate = baseFee + loanAmount * feeRate / 100;

            if (rate > maximumFee) {
                return maximumFee;
            }
            else if (rate < minimumFee) {

                return minimumFee;
            }

            return rate;
        };

        return {
            calculateRepaymentAmount: calculateRepaymentAmount,
            calculateInitiationFee: calculateInitiationFee
        };
    });

})();