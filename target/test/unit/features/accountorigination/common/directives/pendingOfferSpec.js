describe('pending offer directive', function () {
    'use strict';

    var test, scope, element;

    beforeEach(module('refresh.accountOrigination.common.directives.pendingOffer'));

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        scope = test.scope;

        test.allowTemplate('features/accountorigination/common/directives/partials/pendingOffer.html');
        element = test.compileTemplate('<pending-offer application="application"></pending-offer>');
    }));

    describe('offer about to expire', function () {
        beforeEach(function () {
            scope.application = {
                status: 'PENDING',
                reference: '123',
                date: moment(20140930134525001, 'YYYYMMDDHHmmssSSS'),
                aboutToExpire : true
            };
            scope.$digest();
        });

        it('pending icon should be visible', function () {
            expect(element.find('.icomoon-pending')).toBePresent();
        });

        it('scheduled icon should not be visible', function () {
            expect(element.find('.icomoon-scheduled')).not.toBePresent();
        });
    });

    describe('offer not about to expire', function () {
        beforeEach(function () {
            scope.application = {
                status: 'PENDING',
                reference: '123',
                date: moment(20140930134525001, 'YYYYMMDDHHmmssSSS'),
                aboutToExpire : false
            };
            scope.$digest();
        });

        it('pending icon should not be visible', function () {
            expect(element.find('.icomoon-pending')).not.toBePresent();
        });

        it('scheduled icon should be visible', function () {
            expect(element.find('.icomoon-scheduled')).toBePresent();
        });

        it('should display date of application', function () {
            expect(element.find('.with-icon').text()).toMatch('30 September 2014');
        });
    });
});

