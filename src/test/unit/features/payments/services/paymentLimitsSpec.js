/*global moment:true */
describe('PaymentLimitsService', function () {
    beforeEach(module('refresh.payments.limits'));

    var realMoment;

    beforeEach(function () {
        realMoment = moment;
        moment = function () {
            return realMoment('Mar 10, 2013');
        };
        moment.isMoment = realMoment.isMoment;
    });

    afterEach(function () {
        moment = realMoment;
    });

    beforeEach(inject(function (PaymentLimitsService) {
        this.service = new PaymentLimitsService();
    }));

    var cardProfile = {monthlyEAPLimit: {amount: 10000},
        usedEAPLimit: {amount: 7000}};
    var account = {availableBalance: {amount: 5000}};

    var nextMonth = function () {
        return moment().add(1, 'month');
    };
    var tomorrow = function () {
        return moment().add(1,"day");
    };

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    var warningMessage = function (type, message) {
        return _.merge({error: false}, {type: type, message: message});
    };

    describe('#enforce', function () {
        describe('available balance', function () {
            it('should understand amount may be valid', function () {
                expect(this.service.enforce({ amount: 1000, account: account, cardProfile: cardProfile })).toEqual({});
            });

            it('should understand an amount may not exceed the available balance on the account', function () {
                expect(this.service.enforce({ amount: 6000, account: account, cardProfile: cardProfile })).toEqual(errorMessage('availableBalanceExceeded', 'The amount exceeds your available balance'));
            });

            it('should understand an amount may exceed the available balance if it is scheduled after the current month', function () {
                expect(this.service.enforce({ amount: 6000, account: account, cardProfile: cardProfile, date: nextMonth() })).toEqual({});
            });
        });

        describe('maximum amount', function () {
            it('should understand the amount may not exceed five million rand', function () {
                expect(this.service.enforce({ amount: 5000000, account: account, cardProfile: cardProfile })).toEqual(errorMessage('maximumPaymentLimit', 'The amount cannot exceed <span class="rand-amount">R 4 999 999.99</span>'));
            });
        });

        describe('available monthly limit', function () {
            it('should understand the amount may not exceed the available EAP limit', function () {
                expect(this.service.enforce({ amount: 4000, account: account, cardProfile: cardProfile })).toEqual(errorMessage('availableMonthlyLimit', 'The amount exceeds your remaining monthly payment limit'));
            });

            it('should understand an amount may exceed the monthly limit if it is scheduled after the current month', function () {
                expect(this.service.enforce({ amount: 11000, account: account, cardProfile: cardProfile, date: nextMonth() })).toEqual(warningMessage('monthlyLimit', 'This amount exceeds your monthly limit. Please call 0860 123 000 for assistance'));
            });

            it('should understand an amount may exceed the monthly limit if it is scheduled within the current month', function () {
                expect(this.service.enforce({ amount: 4000, account: account, cardProfile: cardProfile, date: tomorrow() })).toEqual(warningMessage('availableMonthlyLimit', 'This amount exceeds your monthly limit. Please call 0860 123 000 for assistance'));
            });

            it('should understand without an account it is valid', function () {
                expect(this.service.enforce({ amount: 11000, cardProfile: cardProfile, date: nextMonth() })).toEqual({});
            });
        });
    });
});
