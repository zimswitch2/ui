'use strict';

describe('Prepaid History Request', function () {
    var card;
    beforeEach(module('refresh.prepaid.history.services.request', function ($provide) {
        card = jasmine.createSpyObj('Card', ['current']);
        $provide.value('Card', card);
    }));

    var PrepaidHistoryRequest;

    beforeEach(inject(function (_PrepaidHistoryRequest_) {
        PrepaidHistoryRequest = _PrepaidHistoryRequest_;
    }));

    it('should create request with a card number', function () {
        card.current.and.returnValue({
            number: '12345'
        });
        var request = PrepaidHistoryRequest.create();
        expect(request.card.number).toEqual('12345');
    });

    it('should create a 30 days history request', function () {
        var request = PrepaidHistoryRequest.create(30);
        expect(request.days).toEqual(30);
    });

    it('should create request with a new card number when changed dashboard', function () {
        card.current.and.returnValue({
            number: '54321'
        });
        var request = PrepaidHistoryRequest.create();
        expect(request.card.number).toEqual('54321');
    });
});
