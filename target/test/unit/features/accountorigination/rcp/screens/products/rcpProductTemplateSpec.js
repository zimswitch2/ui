describe('rcp account product template', function () {
    'use strict';
    var scope, element;

    beforeEach(module('refresh.filters'));

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/rcp/screens/products/partials/rcpProducts.html'));
        TemplateTest.allowTemplate('features/accountorigination/rcp/screens/products/partials/rcpDetails.html');
        element = TemplateTest.compileTemplate(html);
    }));

    it('existing rcp account should show message and hide apply now buttons', function () {
        scope.hasRcpAccount = true;
        scope.$digest();
        expect(element.find('#hasRcpAccountMessage').text()).toContain('You already have a Revolving Credit Plan (RCP)');
        expect(element.find('.apply-now').length).toEqual(0);
        expect(element.find('#rcpApplyNowMobile').length).toEqual(0);

    });

    it('no rcp account should not show message but show apply now buttons', function () {
        scope.hasRcpAccount = false;
        scope.canApply = true;
        scope.$digest();
        expect(element.find('#hasRcpAccountMessage').text()).toEqual('');
        expect(element.find('.apply-now').length).toEqual(1);
        expect(element.find('#rcpApplyNowMobile').length).toEqual(1);

    });

});