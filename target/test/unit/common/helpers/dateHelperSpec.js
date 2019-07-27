describe('date helper', function () {
    'use strict';

    beforeEach(module('refresh.dateHelper'));

    function timestampFromServer(dateTimeAsString) {
        return moment(dateTimeAsString);
    }

    var applicationParams, dateHelper;

    beforeEach(inject(function (ApplicationParameters, DateHelper) {
        applicationParams = ApplicationParameters;
        dateHelper = DateHelper;
    }));

    using([
        {timestamp: timestampFromServer('2014-05-29 23:59'), paymentDate: '30 May 2014', isFutureDatedPayment: true},
        {timestamp: timestampFromServer('2014-05-30 00:00'), paymentDate: '30 May 2014', isFutureDatedPayment: false},
        {timestamp: timestampFromServer('2014-05-30 23:59'), paymentDate: '30 May 2014', isFutureDatedPayment: false},
        {timestamp: timestampFromServer('2014-12-31 23:59'), paymentDate: '01 Jan 2015', isFutureDatedPayment: true}
    ], function (example) {
        it('should know if a date is in the future : ' + JSON.stringify(example), function () {
            applicationParams.pushVariable('latestTimestampFromServer', example.timestamp);
            expect(dateHelper.isDateInTheFuture(example.paymentDate)).toBe(example.isFutureDatedPayment);
        });
    });

});
