describe('OverdraftLimitsService', function () {

    beforeEach(module('refresh.accountOrigination.currentAccount.services.overdraftLimits'));

    var service;

    beforeEach(inject(function (OverdraftLimitsService) {
        service = new OverdraftLimitsService();
    }));

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    it('should set hint', function () {
        expect(service.hint()).toEqual('Enter in 100s or 1000s, e.g. <span class="rand-amount">R 600, R 5700</span>');
    });

    it('should set error message when amount is zero', function () {
        expect(service.enforce({ amount: '0' })).toEqual(errorMessage('amountValue', 'Please enter an amount greater than zero'));
    });

    it('should set error message when amount has decimals', function () {
        expect(service.enforce({ amount: '100.00' })).toEqual(errorMessage('decimalError', 'Please enter the amount in rands only'));
    });

    it('should set error message when amount format is invalid', function () {
        expect(service.enforce({ amount: '0foo' })).toEqual(errorMessage('currencyFormat', 'Please enter the amount in a valid format'));
    });

    it('should set error message when amount is greater than limit', function () {
        expect(service.enforce({ amount: '7000', limit: 6000 })).toEqual(errorMessage('overdraftLimit', 'Please enter an amount up to <span class="rand-amount">R 6000</span>'));
    });

    it('should set error message when amount is not in multiples of hundred', function () {
        expect(service.enforce({ amount: '7001' })).toEqual(errorMessage('multiples', 'Please enter a valid amount as per guidelines below'));
    });
});
