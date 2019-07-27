describe('account product template', function () {
    'use strict';
    var scope, element;

    beforeEach(module('refresh.filters'));

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/currentaccount/screens/products/partials/currentAccountProducts.html'));
        TemplateTest.allowTemplate('features/accountorigination/currentaccount/screens/applicationstatus/acceptedOffer.html');
        TemplateTest.allowTemplate('features/accountorigination/currentaccount/screens/applicationstatus/pendingOffer.html');
        TemplateTest.allowTemplate('features/accountorigination/currentaccount/directives/partials/whatHappensNext.html');
        TemplateTest.allowTemplate('features/accountorigination/currentaccount/screens/finish/partials/whatHappensNextForPrivateBanking.html');
        element = TemplateTest.compileTemplate(html);
    }));

    it('existing current account', function () {
        scope.hasCurrentAccount = function () {
            return true;
        };
        scope.$digest();
        expect(element.find('.info').text()).toMatch(/You already have a current account/);
    });

    it('can apply', function () {
        scope.canApply = function () {
            return true;
        };
        scope.$digest();
        expect(element.find('button.apply')).not.toBeHidden();
    });

    it('cannot apply', function () {
        scope.canApply = function () {
            return false;
        };
        scope.$digest();

        _.each(element.find('button.apply'), function (item) {
            expect($(item)).toBeHidden();
        });
    });

});