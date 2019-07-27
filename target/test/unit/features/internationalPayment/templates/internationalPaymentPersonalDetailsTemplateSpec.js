describe('international payment personal details template', function () {
    'use strict';

    var scope, element, InternationalPaymentCustomer;

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    function expectElementToNotExist(elementId) {
        expect(element.find(elementId).length).toBe(0);
    }

    beforeEach(module('refresh.filters', 'refresh.internationalPayment.domain.internationalPaymentCustomer'));

    beforeEach(inject(function (TemplateTest, Fixture, _InternationalPaymentCustomer_) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPaymentPersonalDetails.html'));
        element = TemplateTest.compileTemplate(html);

        InternationalPaymentCustomer = _InternationalPaymentCustomer_;
    }));

    it('customer with no incomplete information', function (){
        scope.customerDetails = InternationalPaymentCustomer.initialize({
            contact: '078 854 1141',
            dateOfBirth: '04 January 1985',
            firstName: 'Vaftest',
            gender: 'Female',
            idNumber: '850104 5570 09 9',
            lastName: 'Sitone',
            postalAddressOne: '52 Anderson St',
            postalAddressTwo: '',
            postalCity: 'Johannesburg',
            postalCountry: 'ZA',
            postalPostalCode: '2001',
            postalProvince: 'Gauteng',
            postalSuburb: 'Marshalltown',
            residentialAddressOne: '5 Simmonds St',
            residentialAddressTwo: '',
            residentialCity: 'Johannesburg',
            residentialCountry: 'ZA',
            residentialPostalCode: '2001',
            residentialProvince: 'Gauteng',
            residentialSuburb: 'Marshalltown'
        });
        scope.$digest();

        expectElementToBeHidden('#incomplete-fields-notification');
        expectElementToNotExist('#navigate-home');
        expectElementToBeShown('#internationalPaymentPersonalDetailsConfirmation');
        expectElementToNotExist('.incomplete-field');
    });

    it('customer with incomplete information', function (){
        scope.customerDetails = InternationalPaymentCustomer.initialize({firstName: 'Vaftest', idNumber: '850104 5570 09 9'});
        scope.$digest();

        expectElementToBeShown('#incomplete-fields-notification');
        expectElementToBeShown('#navigate-home');
        expectElementToNotExist('#internationalPaymentPersonalDetailsConfirmation');
        expect(element.find('.incomplete-field').length).toBe(14);
    });
});