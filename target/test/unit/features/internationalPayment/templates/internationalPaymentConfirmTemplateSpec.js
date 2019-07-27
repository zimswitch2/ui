describe('international payment confirm template', function () {
    'use strict';

    var scope, element, InternationalPaymentBeneficiary, InternationalPaymentCustomer;

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    function expectElementToExist(elementId) {
        expect(element.find(elementId).length).not.toBe(0);
    }

    function expectElementToNotExist(elementId) {
        expect(element.find(elementId).length).toBe(0);
    }

    beforeEach(module(  'refresh.filters',
                        'refresh.internationalPayment.domain.internationalPaymentBeneficiary',
                        'refresh.internationalPayment.domain.internationalPaymentCustomer'));

    beforeEach(inject(function (TemplateTest, Fixture, _InternationalPaymentBeneficiary_, _InternationalPaymentCustomer_) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('common/print/partials/printFooter.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPaymentConfirm.html'));
        element = TemplateTest.compileTemplate(html);

        InternationalPaymentBeneficiary = _InternationalPaymentBeneficiary_;
        InternationalPaymentCustomer = _InternationalPaymentCustomer_;
    }));

    it('individiual beneficiary should show individual name fields',
        function () {
            scope.beneficiary = InternationalPaymentBeneficiary.initialize();
            scope.$digest();

            expectElementToBeShown('#beneficiaryName');
            expectElementToNotExist('#entityName');
        });

    it('entity beneficiary should show entity name field',
        function () {
            scope.beneficiary = InternationalPaymentBeneficiary.initialize();
            scope.beneficiary.type = 'ENTITY';
            scope.$digest();

            expectElementToBeShown('#entityName');
            expectElementToNotExist('#beneficiaryName');
        });

    it('beneficiary with iban, account number, routing code or customs client number should show iban field',
        function () {
            scope.beneficiary = InternationalPaymentBeneficiary.initialize();
            scope.beneficiary = {
                bank: {
                    iban: 'IBAN12345',
                    accountNumber: 'ACC12345',
                    routingCode: 'ROUTE2345'
                },
                pay: {customsClientNumber: '12345678'}
            };
            scope.$digest();

            expectElementToBeShown('#iban');
            expectElementToBeShown('#accountNumber');
            expectElementToBeShown('#routingCode');
            expectElementToBeShown('#customsClientNumber');
        });

    it('beneficiary without iban, account number, routing code or customs client number should not show these fields',
        function () {
            scope.beneficiary = InternationalPaymentBeneficiary.initialize();
            scope.$digest();

            expectElementToNotExist('#iban');
            expectElementToNotExist('#accountNumber');
            expectElementToNotExist('#routingCode');
            expectElementToNotExist('#customsClientNumber');
        });
});