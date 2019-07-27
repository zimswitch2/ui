describe('prepositionForNotificationTypeFilter', function () {
    beforeEach(module('refresh.beneficiaries.filters.prepositionForNotificationTypeFilter'));

    var prepositionForNotificationTypeFilter;

    beforeEach(inject(function ($filter) {
        prepositionForNotificationTypeFilter = $filter('prepositionForNotificationTypeFilter');
    }));

    it('exists', function () {
        expect(prepositionForNotificationTypeFilter).toBeTruthy();
    });

    it('returns at for Email', function () {
        expect(prepositionForNotificationTypeFilter('Email')).toEqual('at');
    });

    it('returns on for everything else', function () {
        expect(prepositionForNotificationTypeFilter('Fax')).toEqual('on');
    });
});
