describe('Unit Test - Customized filter', function () {
    'use strict';

    var customizedFilterService;
    beforeEach(module('refresh.customizedFilter'));
    beforeEach(inject(function (CustomizedFilterService) {
        customizedFilterService = CustomizedFilterService;
    }));

    var data = [{
        id: 0,
        "beneficiaryName": "911 TRUCK RENTALS        ",
        "amount": 10,
        "randAmount": 10,
        "currencyAmount": 10,
        "complexAmount": {
            "amount": 333
        },
        "nextPaymentDate": "2014-07-17T00:00:00.000+0000",
        "finalPaymentDate": "2014-08-07T00:00:00.000+0000",
        "frequency": "Weekly",
        "remainingPayments": 4,
        "recipientId": 56
    }, {
        id: 1,
        "beneficiaryName": "DEMO                     ",
        "amount": 10,
        "randAmount": 10,
        "currencyAmount": 10,
        "complexAmount": {
            "amount": 44
        },
        "nextPaymentDate": "2014-06-26T00:00:00.000+0000",
        "finalPaymentDate": "2014-06-26T00:00:00.000+0000",
        "remainingPayments": 1,
        "recipientId": 12
    }, {
        id: 2,
        "beneficiaryName": "KEFILWE                  ",
        "amount": 150,
        "randAmount": 150,
        "currencyAmount": 150,
        "complexAmount": {
            "amount": 55
        },
        "nextPaymentDate": "2014-07-09T00:00:00.000+0000",
        "finalPaymentDate": "2014-07-09T00:00:00.000+0000",
        "frequency": "Single",
        "remainingPayments": 1,
        "recipientId": 1
    }, {
        id: 3,
        "beneficiaryName": "2QVEWMVU9                ",
        "amount": 1,
        "randAmount": 1,
        "currencyAmount": 42,
        "complexAmount": {
            "amount": 44
        },
        "nextPaymentDate": "2014-08-01T00:00:00.000+0000",
        "finalPaymentDate": "2014-08-01T00:00:00.000+0000",
        "frequency": "Single",
        "remainingPayments": 1,
        "recipientId": 37
    }, {
        id: 4,
        "beneficiaryName": "2QVEWMVU9                ",
        "amount": 33.69,
        "randAmount": 33.69,
        "currencyAmount": 33.69,
        "complexAmount": {
            "amount": 44
        },
        "nextPaymentDate": "2014-08-01T00:00:00.000+0000",
        "finalPaymentDate": "2014-08-01T00:00:00.000+0000",
        "frequency": "Single",
        "remainingPayments": 1,
        "recipientId": 37
    }, {
        id: 5,
        "beneficiaryName": "JOHN                     ",
        "amount": 40,
        "randAmount": 150,
        "currencyAmount": 150,
        "complexAmount": {
            "amount": 44
        },
        "nextPaymentDate": "2014-06-16T00:00:00.000+0000",
        "finalPaymentDate": "2014-07-16T00:00:00.000+0000",
        "frequency": "Monthly",
        "remainingPayments": 2,
        "recipientId": 4
    }, {
        id: 6,
        "beneficiaryName": "JOHN                     ",
        "amount": 40,
        "randAmount": 40,
        "currencyAmount": 40,
        "nextPaymentDate": "2014-07-25T00:00:00.000+0000",
        "finalPaymentDate": "2014-07-25T00:00:00.000+0000",
        "frequency": "Weekly",
        "remainingPayments": 1,
        "recipientId": 4
    }];

    var desc = [
        {path: 'beneficiaryName'},
        {path: 'amount', type: 'amount'},
        {path: 'randAmount', type: 'randAmount'},
        {path: 'currencyAmount', type: 'currencyAmount', args: {currencyCode: 'USD'}},
        {path: 'nextPaymentDate', type: 'date'},
        {path: 'frequency', type: 'text'},
        {path: 'complexAmount.amount', type: 'amount'}
    ];

    describe('create', function () {
        var newFilter;
        beforeEach(function () {
            newFilter = customizedFilterService.create(desc);
        });

        it('should create new custom filter by description', function () {
            expect(newFilter).not.toBeNull();
        });

        using([
            {query: '2QVEWMVU9', result: [3, 4]},
            {query: '150', result: [2, 5]},
            {query: 'R 40', result: [6]},
            {query: 'USD 42', result: [3], args: {currencyCode: 'USD'}},
            {query: '16 Jun', result: [5]},
            {query: 'Monthly', result: [5]},
            {query: null, result: [0, 1, 2, 3, 4, 5, 6]},
            {query: '', result: [0, 1, 2, 3, 4, 5, 6]},
            {query: '333', result: [0]}
        ], function (example) {
            it('should find exact result with query:' + example.query, function () {
                var result = example.args ? newFilter(data, example.query, example.args) : newFilter(data, example.query);
                var ids = _.map(result, function (one) {
                    return one.id;
                });
                expect(ids).toEqual(example.result);
            });
        });

    });
});
