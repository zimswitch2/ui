describe('sentenceCaseForNotificationTypeFilter', function () {
    beforeEach(module('refresh.beneficiaries.filters.sentenceCaseForNotificationTypeFilter'));

    var sentenceCaseForNotificationTypeFilter;

    beforeEach(inject(function ($filter) {
        sentenceCaseForNotificationTypeFilter = $filter('sentenceCaseForNotificationTypeFilter');
    }));

    it('exists', function () {
        expect(sentenceCaseForNotificationTypeFilter).toBeTruthy();
    });

    it('leaves SMS as uppercase', function () {
        expect(sentenceCaseForNotificationTypeFilter('SMS')).toEqual('SMS');
    });

    it('converts other types to lowercase', function () {
        expect(sentenceCaseForNotificationTypeFilter('Email')).toEqual('email');
    });
});
