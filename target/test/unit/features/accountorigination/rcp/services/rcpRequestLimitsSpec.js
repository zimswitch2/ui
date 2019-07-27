describe('RcpRequestLimitsService', function () {

    beforeEach(module('refresh.accountOrigination.rcp.services.rcpRequestLimitsService'));

    var service;

    beforeEach(inject(function (RcpRequestLimitsService) {
        service = new RcpRequestLimitsService();
    }));

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    it('should set hint', function () {
        expect(service.hint()).toEqual('You agree to pay more than the required minimum repayment amount');
    });

    it('should set error message when amount is zero', function () {
        expect(service.enforce({ amount: '0', minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('requestedLoanAmount', 'Please enter an amount between <span class="rand-amount">R 6000</span> and <span class="rand-amount">R 120000</span>'));
    });

    it('should set error message when amount is not in a valid format', function () {
        expect(service.enforce({ amount: '120 00', minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('currencyFormat', 'Please enter the amount in a valid format'));
    });

    it('should set error message when amount is undefined', function () {
        expect(service.enforce({ amount: undefined, minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('requestedLoanAmount', 'Please enter an amount between <span class="rand-amount">R 6000</span> and <span class="rand-amount">R 120000</span>'));
    });

    it('should set error message when amount is negative', function () {
        expect(service.enforce({ amount: '-6000', minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('requestedLoanAmount', 'Please enter an amount between <span class="rand-amount">R 6000</span> and <span class="rand-amount">R 120000</span>'));
    });

    it('should set error message when amount is less than the minimum loan amount', function () {
        expect(service.enforce({ amount: '5000', minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('requestedLoanAmount', 'Please enter an amount between <span class="rand-amount">R 6000</span> and <span class="rand-amount">R 120000</span>'));
    });

    it('should set error message when amount is greater than the maximum loan amount', function () {
        expect(service.enforce({ amount: '120001', minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('requestedLoanAmount', 'Please enter an amount between <span class="rand-amount">R 6000</span> and <span class="rand-amount">R 120000</span>'));
    });

    it('should set error message when amount includes cents', function () {
        expect(service.enforce({ amount: '12000.10', minimumLoanAmount: 6000, maximumLoanAmount: 120000 })).toEqual(errorMessage('requestedLoanAmount', 'Please enter an amount in 100s or 1000s, e.g. <span class="rand-amount">R 600</span>, <span class="rand-amount">R 5700</span>'));
    });

    it('should set no error if amount is greater than the minimum', function () {
        expect(service.enforce({ amount: '7000', limit: 6000 })).toEqual({ });
    });
});
