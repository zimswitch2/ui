describe('international payment beneficiary details template', function () {
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

    beforeEach(module(  'refresh.filters', 'refresh.sbInput', 'refresh.typeahead',
                        'refresh.internationalPayment.domain.internationalPaymentBeneficiary',
                        'refresh.internationalPayment.domain.internationalPaymentCustomer'));

    beforeEach(inject(function (TemplateTest, Fixture, _InternationalPaymentBeneficiary_, _InternationalPaymentCustomer_) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('common/sbform/partials/sbTextInput.html');
        TemplateTest.allowTemplate('common/typeahead/partials/typeahead.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPaymentBeneficiaryDetails.html'));
        element = TemplateTest.compileTemplate(html);

        InternationalPaymentBeneficiary = _InternationalPaymentBeneficiary_;
        InternationalPaymentCustomer = _InternationalPaymentCustomer_;
    }));

    it('personal type beneficiary should show personal and not entity fields', function (){
        scope.beneficiary = InternationalPaymentBeneficiary.initialize();
        scope.$digest();

        expectElementToBeShown('#firstName');
        expectElementToBeShown('#lastName');
        expectElementToBeShown('#beneficiaryMale');
        expectElementToBeShown('#beneficiaryFemale');
        expectElementToNotExist('#entityName');
    });

    it('entity type beneficiary should show entity and not personal fields', function (){
        scope.beneficiary = InternationalPaymentBeneficiary.initialize();
        scope.beneficiary.type = 'ENTITY';
        scope.$digest();

        expectElementToNotExist('#firstName');
        expectElementToNotExist('#lastName');
        expectElementToNotExist('#beneficiaryMale');
        expectElementToNotExist('#beneficiaryFemale');
        expectElementToBeShown('#entityName');
    });

    describe('customer is a resident', function () {
        beforeEach( function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({
                idNumber: '1234656789'
            });
            scope.$digest();
        });

        it('should show beneficiary type selector', function () {
            expectElementToExist('#beneficiaryTypeSelector');
        });
    });

    describe('customer is not a resident', function () {
        beforeEach( function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({});
            scope.$digest();
        });

        it('should not show beneficiary type selector', function () {
            expectElementToNotExist('#beneficiaryTypeSelector');
        });
    });
});