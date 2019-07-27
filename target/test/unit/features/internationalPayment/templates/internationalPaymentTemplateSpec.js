describe('international payment template', function () {
    'use strict';

    var scope, element, InternationalPaymentCustomer;

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementToExist(elementId) {
        expect(element.find(elementId).length).not.toBe(0);
    }

    function expectElementToNotExist(elementId) {
        expect(element.find(elementId).length).toBe(0);
    }

    beforeEach(module('refresh.filters', 'refresh.internationalPayment.domain.internationalPaymentCustomer'));

    beforeEach(inject(function (TemplateTest, Fixture, _InternationalPaymentCustomer_) {
        scope = TemplateTest.scope;
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPayment.html'));
        element = TemplateTest.compileTemplate(html);

        InternationalPaymentCustomer = _InternationalPaymentCustomer_;
    }));

    describe('customer with valid information', function () {
        it('older than 18 years of age and has valid account', function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({
                isOver18: true,
                idNumber: '1234656789'
            });
            scope.hasValidAccount = true;
            scope.$digest();

            expectElementToBeShown('#internationalPaymentTermsAndConditions');
            expectElementToNotExist('.telephone-number-link');
        });
    });

    describe('customer with invalid information', function () {
        it('younger than 18 years of age and has valid account', function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({
                isOver18: false,
                idNumber: '1234656789'
            });
            scope.hasValidAccount = true;
            scope.$digest();

            expectElementToNotExist('#internationalPaymentTermsAndConditions');
            expectElementToNotExist('#noValidAccount');
            expectElementToBeShown('#youngerThan18');
            expectElementToBeShown('.telephone-number-link');
            expectElementToBeHidden('#applyAccount');
        });

        it('older than 18 years of age foreign national and has valid account', function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({
                isOver18: true
            });
            scope.hasValidAccount = true;
            scope.$digest();

            expectElementToNotExist('#internationalPaymentTermsAndConditions');
            expectElementToNotExist('#noValidAccount');
            expectElementToBeShown('#youngerThan18');
            expectElementToBeShown('.telephone-number-link');
            expectElementToBeHidden('#applyAccount');
        });

        it('has no valid account', function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({
                isOver18: true,
                idNumber: '1234656789'
            });
            scope.hasValidAccount = false;
            scope.$digest();

            expectElementToNotExist('#internationalPaymentTermsAndConditions');
            expectElementToNotExist('#youngerThan18');
            expectElementToBeShown('#noValidAccount');
            expectElementToBeShown('.telephone-number-link');
            expectElementToBeShown('#applyAccount');
        });
    });

    describe('customer is a resident', function () {
        beforeEach( function () {
            scope.customerDetails = InternationalPaymentCustomer.initialize({
                isOver18: true,
                idNumber: '1234656789'
            });
            scope.hasValidAccount = true;
            scope.$digest();
        });

        it('should show faq and t&c links for a resident', function () {
            expect(element.find('#internationalPaymentFAQLink').attr('href')).toEqual('http://sbgmobile.standardbank.co.za/SBGMobileApp/International-Payments/FAQ');
            expect(element.find('#internationalPaymentTermsAndConditionsLink').attr('href')).toEqual('http://sbgmobile.standardbank.co.za/SBGMobileApp/International-Payments/Terms-and-conditions');
        });

        it('should show the annual limit note for a resident', function () {
            expectElementToExist('#residentAnnualLimitNote');
            expectElementToNotExist('#fnAnnualLimitNote');
        });
    });
});