describe('international payment beneficiary bank details template', function () {
    'use strict';

    var scope, element, InternationalPaymentBeneficiary;

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementToBeShown(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(module('refresh.filters', 'refresh.sbInput', 'refresh.typeahead',
        'refresh.internationalPayment.domain.internationalPaymentBeneficiary'));

    beforeEach(inject(function (TemplateTest, Fixture, _InternationalPaymentBeneficiary_) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('common/sbform/partials/sbTextInput.html');
        TemplateTest.allowTemplate('common/typeahead/partials/typeahead.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/internationalPayment/partials/internationalPaymentBeneficiaryBankDetails.html'));
        element = TemplateTest.compileTemplate(html);

        InternationalPaymentBeneficiary = _InternationalPaymentBeneficiary_;
    }));

    beforeEach(function () {
        scope.beneficiary = InternationalPaymentBeneficiary.initialize();
        scope.beneficiary.bank = {};
        scope.$digest();
    });

    describe('beneficiary bank country', function () {
        it('should show currency if selected', function () {
            scope.beneficiary.bank.country = {code: 'GBP'};
            scope.$digest();

            expectElementToBeShown('#beneficiaryCurrencySection');
        });

        it('should not show currency if not selected', function () {
            expectElementToBeHidden('#beneficiaryCurrencySection');
        });
    });

    describe('beneficiary bank country currency', function () {
        it('should show swift/bic fields if selected', function () {
            scope.beneficiary.bank.currency = 'GBP';
            scope.$digest();

            expectElementToBeShown('#beneficiarySwiftSection');
        });

        it('should not show iban, swift/bic, account type, account number and routing number fields if not selected', function () {
            expectElementToBeHidden('#beneficiaryIBANSection');
            expectElementToBeHidden('#beneficiarySwiftSection');
            expectElementToBeHidden('#beneficiaryAccountTypeSection');
            expectElementToBeHidden('#beneficiaryAccountNumberSection');
            expectElementToBeHidden('#beneficiaryRoutingSection');
        });
    });

    describe('IBAN capable beneficiary bank country selected', function () {
        beforeEach(function () {
            var bank = {
                accountType: {type: "IBAN"},
                country: {ibanCapable: true},
                currency: 'GBP'
            };
            scope.beneficiary.bank = bank;
            scope.$digest();
        });


        it('should only show IBAN field if country has no routing name', function () {
            scope.useAccountType = function (param) {
                return param === 'IBAN' ? true : false;
            };
            scope.$digest();

            expectElementToBeShown('#beneficiaryIBANSection');
            expectElementToBeHidden('#beneficiaryAccountTypeSection');
            expectElementToBeHidden('#beneficiaryAccountNumberSection');
            expectElementToBeHidden('#beneficiaryRoutingSection');
        });

        describe('with routing name', function () {
            beforeEach(function () {
                scope.beneficiary.bank.routingName = "Sort Code";
                scope.$digest();
            });

            it('should show account type and IBAN fields by default', function () {
                scope.useAccountType = function (param) {
                    return param === 'IBAN' ? true : false;
                };
                scope.$digest();

                expectElementToBeShown('#beneficiaryIBANSection');
                expectElementToBeShown('#beneficiaryAccountTypeSection');
                expectElementToBeHidden('#beneficiaryRoutingSection');
                expectElementToBeHidden('#beneficiaryAccountNumberSection');
            });

            it('should show account type, account number and routing number fields if account type switched to account number',
                function () {
                    scope.useAccountType = function (param) {
                        return param === 'accountNumber' ? true : false;
                    };
                    scope.$digest();

                    expectElementToBeShown('#beneficiaryAccountTypeSection');
                    expectElementToBeShown('#beneficiaryRoutingSection');
                    expectElementToBeShown('#beneficiaryAccountNumberSection');
                    expectElementToBeHidden('#beneficiaryIBANSection');
                });
        });
    });

    describe('non-IBAN capable beneficiary bank country selected', function () {
        beforeEach(function () {
            var bank = {
                accountType: {type: "accountNumber"},
                country: {ibanCapable: false},
                currency: 'GBP'
            };
            scope.beneficiary.bank = bank;
            scope.$digest();
        });

        it('should only show account number field if country has no routing name', function () {
            scope.useAccountType = function (param) {
                return param === 'accountNumber' ? true : false;
            };
            scope.$digest();

            expectElementToBeShown('#beneficiaryAccountNumberSection');
            expectElementToBeHidden('#beneficiaryRoutingSection');
            expectElementToBeHidden('#beneficiaryAccountTypeSection');
            expectElementToBeHidden('#beneficiaryIBANSection');
        });

        it('should only show account number and routing number fields if country has routing name', function () {
            scope.useAccountType = function (param) {
                return param === 'accountNumber' ? true : false;
            };
            scope.beneficiary.bank.routingName = "Sort Code";
            scope.$digest();

            expectElementToBeShown('#beneficiaryAccountNumberSection');
            expectElementToBeShown('#beneficiaryRoutingSection');
            expectElementToBeHidden('#beneficiaryAccountTypeSection');
            expectElementToBeHidden('#beneficiaryIBANSection');
        });
    });
});