describe('beneficiaryFilter', function () {
    var filter, beneficiaries;

    beforeEach(module('refresh.beneficiaries.filters.beneficiaryFilter', 'refresh.test'));

    beforeEach(inject(function ($filter) {
        filter = $filter;
        beneficiaries = [
            {
                recipientId: '1',
                name: 'Test',
                accountNumber: '211',
                recipientReference: 'Test',
                customerReference: 'Test',
                recentPayment: [{date: '2014-02-03'}],
                amountPaid: '100',
                recipientGroupName: 'Group 1',
                recipientGroup: {
                    'name': 'Group 1',
                    'oldName': null,
                    'orderIndex': '1'
                }
            },
            {
                recipientId: '2',
                name: 'Ashould be first',
                accountNumber: '2124',
                recipientReference: 'Another recipient',
                customerReference: 'Some reference',
                recentPayment: [{date: '2014-02-09'}],
                amountPaid: '200',
                recipientGroup: null
            }
        ];
    }));

    it("should filter by beneficiary name", function () {
        expect(filter('beneficiaryFilter')(beneficiaries, 'Test', true)).toEqual([beneficiaries[0]]);
    });

    it("should filter by customer reference", function () {
        expect(filter('beneficiaryFilter')(beneficiaries, 'Some reference', true)).toEqual([beneficiaries[1]]);
    });

    it("should search by last amount paid if not adding group", function () {
        expect(filter('beneficiaryFilter')(beneficiaries, '100', true)).toEqual([beneficiaries[0]]);
    });

    it("should filter by group name", function () {
        expect(filter('beneficiaryFilter')(beneficiaries, 'Grou', true)).toEqual([beneficiaries[0]]);
    });

    it("should not search by account number", function () {
        expect(filter('beneficiaryFilter')(beneficiaries, 'cc', true)).toEqual([]);
    });

    it("should not search by last amount paid if adding group", function () {
        expect(filter('beneficiaryFilter')(beneficiaries, '100', false)).toEqual([]);
    });
});

