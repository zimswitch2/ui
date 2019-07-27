describe('international payment pay template', function () {
    'use strict';

    var scope, element, InternationalPaymentBeneficiary;

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(module('refresh.filters', 'refresh.sbInput', 'refresh.internationalPayment.domain.internationalPaymentBeneficiary'));

    beforeEach(inject(function (TemplateTest, Fixture, _InternationalPaymentBeneficiary_) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('common/sbform/partials/sbTextInput.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPaymentPay.html'));
        element = TemplateTest.compileTemplate(html);

        InternationalPaymentBeneficiary = _InternationalPaymentBeneficiary_;
    }));

    it('bop with bopFields should show customs clients number', function (){
        scope.beneficiary = InternationalPaymentBeneficiary.initialize();
        scope.beneficiary = {reasonForPayment: {bopFields: 'something'}};
        scope.$digest();

        expectElementToBeShown('#customsClientNumber');
    });

    it('entity type beneficiary should show entity and not personal fields', function (){
        scope.beneficiary = InternationalPaymentBeneficiary.initialize();
        scope.$digest();

        expectElementToBeShown('#customsClientNumber');
    });
});