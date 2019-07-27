'use strict';

describe('Prepaid History Service', function () {

    var http, prepaidHistoryService, url, transaction, actual;
    var card = { "number": "3423"};

    beforeEach(module('refresh.prepaid.history.services.service'));


    beforeEach(inject(function (_PrepaidHistoryService_, _$httpBackend_, _URL_, _Card_) {
        http = _$httpBackend_;
        prepaidHistoryService = _PrepaidHistoryService_;
        url = _URL_;
        transaction = {};
        spyOn(_Card_, 'current');
        _Card_.current.and.returnValue(card);
    }));

    it('should resolve the response upon success', function () {
        var requestData = {
            dateFrom: "2016-04-12T00:00",
            dateTo: "2016-05-12T23:59",
            card: card, prepaidProviderType: "All"
        };

        http.expectPOST(url.prepaid, requestData)
            .respond(200, {prepaidHistoryItems: 'some data'}, {
                'x-sbg-response-code': '0000',
                'x-sbg-response-type': 'SUCCESS'
            });

        prepaidHistoryService.history('2016-04-12T00:00', '2016-05-12T23:59').then(function (response) {
            actual = response;
        });

        http.flush();
        expect(actual).toEqual('some data');
    });

    it('should reject response if there is no data with correct message', function () {
        var requestData = {
            dateFrom: "2016-04-12T00:00",
            dateTo: "2016-05-12T23:59",
            card: card, prepaidProviderType: "All"
        };

        http.expectPOST(url.prepaid, requestData).respond(204, {}, {
            'x-sbg-response-code': '3100',
            'x-sbg-response-type': 'ERROR'
        });
        prepaidHistoryService.history('2016-04-12T00:00', '2016-05-12T23:59')
            .catch(function (error) {
                actual = error;
            });
        http.flush();

        expect(actual).toEqual({message: 'No prepaid purchases in this period', 'id': '3100'});
    });

    it('should reject response if there is an application error', function () {
        var requestData = {
            dateFrom: "2016-04-12T00:00",
            dateTo: "2016-05-12T23:59",
            card: card, prepaidProviderType: "All"
        };

        http.expectPOST(url.prepaid, requestData).respond(204, {}, {
            'x-sbg-response-code': 'error-occur',
            'x-sbg-response-type': 'ERROR'
        });
        prepaidHistoryService.history('2016-04-12T00:00', '2016-05-12T23:59')
            .catch(function (error) {
                actual = error;
            });
        http.flush();

        expect(actual).toEqual({message: 'An error occurred'});
    });
});
