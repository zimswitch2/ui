describe('instantMoneyLimitsSpec', function () {
   'use strict';

    beforeEach(module('refresh.instantMoney.limits'));

    var service;

    beforeEach(inject(function(InstantMoneyLimitsService) {
        service = new InstantMoneyLimitsService();
    }));

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    it('should show the correct hint', function() {
       expect(service.hint()).toEqual('Enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5 000</span>');
    });

    it('should show an error if not a multiple of 10', function () {
        expect(service.enforce({amount: 11 })).toEqual(errorMessage('multipleOfTen',
            'Please enter an amount that is a multiple of <span class="rand-amount">R 10</span>'));
    });

    it('should have a minimum of 50', function () {
        expect(service.enforce({amount: 30 })).toEqual(errorMessage('minimumAmount',
            'Please enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5000</span>'));
    });

    it('should have a maximum of 5000', function () {
        expect(service.enforce({amount: 5050})).toEqual(errorMessage('maximumAmount',
            'Please enter an amount from <span class="rand-amount">R 50</span> to <span class="rand-amount">R 5000</span>'));
    });

    it('should set error message when amount exceeds available daily limit', function () {
        var error = service.enforce({ amount: 3000, dailyWithdrawalLimit: 2000 });
        expect(error).toEqual(errorMessage('availableDailyLimit', 'The amount exceeds your daily withdrawal limit'));
    });

    it('should set error message when monthly limit exceeds 25000', function () {
        var error = service.enforce({amount:300, monthlyLimit: 25500 });
        expect(error).toEqual(errorMessage('monthlyLimit', 'The amount exceeds your monthly limit of <span class="rand-amount">R 25000</span>'));
    });

    it('should set error message when amount exceeds available monthly limit', function () {
        var error = service.enforce({amount:2500, remainingEAP: 2000 });
        expect(error).toEqual(errorMessage('remainingEAP', 'The amount exceeds your available limit'));
    });
});