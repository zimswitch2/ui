describe('OperatorPaymentLimitsService', function () {
    beforeEach(module('refresh.payments.limits'));

    beforeEach(inject(function (OperatorPaymentLimitsService) {
        this.service = new OperatorPaymentLimitsService();
    }));

    var cardProfile = {monthlyEAPLimit: {amount: 10000},
        usedEAPLimit: {amount: 7000}};
    var account = {availableBalance: {amount: 5000}};

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    describe('#enforce', function () {
        describe('available balance', function () {
            it('should understand an amount may exceed the available balance on the account for an operator', function () {
                expect(this.service.enforce({ amount: 6000, account: account, cardProfile: cardProfile })).toEqual({});
            });
        });

        describe('maximum amount', function () {
            it('should understand the amount may not exceed five million rand', function () {
                expect(this.service.enforce({ amount: 5000000, account: account, cardProfile: cardProfile })).toEqual(errorMessage('maximumPaymentLimit', 'The amount cannot exceed <span class="rand-amount">R 4 999 999.99</span>'));
            });
        });

        describe('available monthly limit', function () {
            it('should understand the amount may exceed the available EAP limit for an operator', function () {
                expect(this.service.enforce({ amount: 4000, account: account, cardProfile: cardProfile })).toEqual({});
            });
        });
    });
});
