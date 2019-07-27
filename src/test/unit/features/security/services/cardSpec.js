describe('Card Factory', function () {
    'use strict';

    beforeEach(module('refresh.card', 'refresh.test'));

    describe('when feature toggle:', function () {
        describe('Personal Finance Management', function () {
            describe('is toggled off', function () {
                var card;
                beforeEach(inject(function (Card) {
                    personalFinanceManagementFeature = false;
                    card = Card;
                }));

                it('should return the current card', function () {
                    card.setCurrent('332231233123',1 );
                    expect(card.current()).toEqual({countryCode: "ZA", type: '0', number: '332231233123'});
                });

                afterEach(function () {
                    personalFinanceManagementFeature = true;
                });
            });

            describe('Toggled on', function () {
                var card;
                beforeEach(inject(function (Card) {
                    card = Card;
                }));

                it('should return the current card', function () {
                    card.setCurrent('332231233123', 9);
                    expect(card.current()).toEqual({countryCode: "ZA", type: '0', number: '332231233123', personalFinanceManagementId: 9});
                });
            });
        });
    });
});
