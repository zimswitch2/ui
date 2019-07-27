describe('RechargeLimitsService', function () {
    beforeEach(module('refresh.recharge.limits'));
    var service, someProduct;

    beforeEach(inject(function (RechargeLimitsService) {
        service = new RechargeLimitsService();
        someProduct = {range: {min: 1, max: 10000}};
    }));

    var dailyWithdrawalLimit = 500;
    var account = {availableBalance: {amount: 700}};

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    it('should set error message when amount exceeds available daily limit', function () {
        someProduct.amount = 501;
        var error = service.enforce({ dailyWithdrawalLimit: dailyWithdrawalLimit, account: account, prepaidProduct: someProduct });
        expect(error).toEqual(errorMessage('availableDailyLimit', 'The amount exceeds your daily withdrawal limit'));
    });

    it('should not set error message when the card profile has not yet been set (i.e promise resolved)', function () {
        dailyWithdrawalLimit = undefined;
        someProduct.amount = 501;
        var error = service.enforce({ dailyWithdrawalLimit: dailyWithdrawalLimit, account: account, prepaidProduct: someProduct });
        expect(error).toEqual({});
    });

    it('should not set error message when amount exceeds available daily limit', function () {
        someProduct.amount = 90;
        var error = service.enforce({ dailyWithdrawalLimit: dailyWithdrawalLimit, account: account, prepaidProduct: someProduct });
        expect(error).toEqual({});
    });

    it('should set error message when amount exceeds available balance', function () {
        var dailyLimit = {dailyWithdrawalLimit: {amount: 900}};
        var account = {availableBalance: {amount: 700}};
        someProduct.amount = 701;
        var error = service.enforce({ dailyWithdrawalLimit: dailyLimit, account: account, prepaidProduct: someProduct });
        expect(error).toEqual(errorMessage('availableBalanceExceeded', 'The amount exceeds your available balance'));
    });

    it('should set an error message if the recharge amount is not within allowable range for the provider', function () {
        var product = {range: {min: 12, max: 100}, amount :11};
        var error = service.enforce({ dailyWithdrawalLimit: dailyWithdrawalLimit, account: account, prepaidProduct: product });
        expect(error).toEqual(errorMessage('invalidRechargeAmount', 'Please enter an amount within the specified range'));
    });

    it('should get the amount from the products bundle if there is a bundle', function () {
        var product = {range: {min: 12, max: 100}, bundle: {amount : {amount : 11}}};
        var error = service.enforce({ dailyWithdrawalLimit: dailyWithdrawalLimit, account: account, prepaidProduct: product });
        expect(error).toEqual(errorMessage('invalidRechargeAmount', 'Please enter an amount within the specified range'));
    });

    it('should not validate that the amount is in rands only for products with bundles', function () {
        var product = {range: {min: 12, max: 100}, bundle: {amount : {amount : 19.07}}};
        var error = service.enforce({ dailyWithdrawalLimit: dailyWithdrawalLimit, account: account, prepaidProduct: product });
        expect(error).toEqual({});
    });
});
