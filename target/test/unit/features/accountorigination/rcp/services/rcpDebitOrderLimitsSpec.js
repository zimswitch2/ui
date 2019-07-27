describe('RcpDebitOrderLimitsService', function () {

    beforeEach(module('refresh.accountOrigination.rcp.services.rcpDebitOrderLimits'));

    var service;

    beforeEach(inject(function (RcpDebitOrderLimitsService) {
        service = new RcpDebitOrderLimitsService();
    }));

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    it('should set hint', function () {
        expect(service.hint()).toEqual('You agree to pay more than the required minimum repayment amount');
    });

    it('should set error message when amount is less than the minimum repayment amount', function () {
        expect(service.enforce({ amount: '5000', limit: 6000 })).toEqual(errorMessage('debitOrderLimit', 'Please enter the minimum amount of <span class="rand-amount">R 6000</span> or higher'));
    });

    it('should set  no error if amount is greater than the minimum', function () {
        expect(service.enforce({ amount: '7000', limit: 6000 })).toEqual({ });
    });
});
