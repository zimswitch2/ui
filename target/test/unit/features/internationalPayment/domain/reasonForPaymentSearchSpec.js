describe('International Payment Reason For Payment Search object', function () {
    'use strict';

    var reasonForPaymentSearch;

    beforeEach(module('refresh.internationalPayment.domain.reasonForPaymentSearch'));
    beforeEach(inject(function (ReasonForPaymentSearch) {
        reasonForPaymentSearch = ReasonForPaymentSearch;
    }));

    it('should set the search to an empty string when initializing', function() {
       expect(reasonForPaymentSearch.get()).toEqual({ searchText: ''});
    });

    it('should clear the search', function() {
        reasonForPaymentSearch.get().searchText = 'search';
        reasonForPaymentSearch.clear();

        expect(reasonForPaymentSearch.get().searchText).toEqual('');
    });
});
