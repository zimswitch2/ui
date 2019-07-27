describe('EAPLimitValidations', function () {
    'use strict';
    beforeEach(module('refresh.profileAndSettings.eapLimitValidations','refresh.limits'));

    var service;

    beforeEach(inject(function (EAPLimitValidations) {
       service = new EAPLimitValidations();
    }));

    var cardProfile = {monthlyEAPLimit: {amount: 100}, usedEAPLimit: {amount: 7000}};

    var errorMessage = function (type, message) {
        return _.merge({error: true}, {type: type, message: message});
    };

    describe('#enforce', function () {
        describe('available monthly limit', function () {
            it('should not exceed the max EAP limit of R 500 000', function () {
                var newEAP = '10000000';
                expect(service.enforce({ amount: newEAP, cardProfile: cardProfile })).toEqual(errorMessage('maxEAPLimitExceeded', 'The amount you entered exceeds the maximum monthly payment limit of <span class="rand-amount">R 500 000</span>. To increase your limit further, call Customer Care on 0860 123 000 or visit your nearest branch'));
            });

            it('should not be 0', function () {
                var newEAP = '0';
                expect(service.enforce({ amount: newEAP, cardProfile: cardProfile })).toEqual(errorMessage('amountValue', 'Please enter an amount greater than zero'));
            });

            it('should be valid number', function () {
                var newEAP = 'ooo';
                expect(service.enforce({ amount: newEAP, cardProfile: cardProfile })).toEqual(errorMessage('currencyFormat', 'Please enter the amount in a valid format'));
            });

            var testData = [
                {
                    eap: '100'
                },
                {
                    eap: 100
                }
            ];
            using(testData ,function(value){
                it('should not be the same as EAP limit', function () {
                    expect(service.enforce({ amount: value.eap, cardProfile: cardProfile })).toEqual(errorMessage('sameEAPAmount', 'New monthly payment limit cannot be the same as current monthly payment limit'));
                });
            });
        });
    });
});
