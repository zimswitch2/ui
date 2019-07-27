describe('accepted offer directive', function () {
    'use strict';

    var test, scope, element;

    beforeEach(module('refresh.accountOrigination.common.directives.acceptedOffer'));

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        scope = test.scope;

        test.allowTemplate('features/accountorigination/common/directives/partials/acceptedOffer.html');
    }));

    describe('offer about to expire', function () {
        beforeEach(function () {
            scope.application = {
                reference: '12345433',
                date: '2013-07-08'
            };
            element = test.compileTemplate('<accepted-offer application="application"></accepted-offer>');
            scope.$digest();
        });

        it('should assign application to scope', function () {
            expect(scope.application).toEqual({  reference: '12345433', date: '2013-07-08'});
        });

    });

});

