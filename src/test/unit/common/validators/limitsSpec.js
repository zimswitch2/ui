describe('LimitsService', function () {
    beforeEach(module('refresh.limits'));

    beforeEach(inject(function (LimitsService) {
        this.service = new LimitsService();
    }));

    var cardProfile = {monthlyEAPLimit: {amount: 10000},
                       usedEAPLimit: {amount: 7000}};
    var account = {availableBalance: {amount: 5000}};

    var nextMonth = function () {
        return moment().add(1, 'month');
    };
    var today = function () {
        return moment().format("DD MMMM YYYY");
    };
    var tomorrow = function () {
        return moment().add(1, 'day').format("DD MMMM YYYY");
    };

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    describe('#enforce', function () {
        describe('amount', function () {
            it('should be greater than zero', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: 0 })).toEqual(errorMessage('amountValue', 'Please enter an amount greater than zero'));
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: -1 })).toEqual(errorMessage('amountValue', 'Please enter an amount greater than zero'));
            });

            it('should not be undefined', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account })).toEqual(errorMessage('amountValue', 'Please enter an amount greater than zero'));
            });

            it('should be a valid amount', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: '$4.00' })).toEqual(errorMessage('currencyFormat', 'Please enter the amount in a valid format'));
            });
        });

        describe('available balance', function () {
            it('should understand amount may be valid', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: 1000 })).toEqual({});
            });

            it('should understand an amount may not exceed the available balance on the account when the payment is made today', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: 6000, date: today() })).toEqual(errorMessage('availableBalanceExceeded', 'The amount exceeds your available balance'));
            });

            it('should understand an amount may exceed the available balance on the account when the payment date is tomorrow', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: 6000, date: tomorrow()})).toEqual({});
            });

            it('should understand an amount may exceed the available balance if it is scheduled after the current month', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: 6000, date: nextMonth()})).toEqual({});
            });
        });

        describe('maximum amount', function () {
            it('should understand the amount may not exceed five million rand', function () {
                expect(this.service.enforce({ cardProfile: cardProfile, account: account, amount: 5000000 })).toEqual(errorMessage('maximumPaymentLimit', 'The amount cannot exceed <span class="rand-amount">R 4 999 999.99</span>'));
            });
        });
    });
});
