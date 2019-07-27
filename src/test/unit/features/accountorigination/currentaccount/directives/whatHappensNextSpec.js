describe('what happens next directive', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.currentAccount.directives.whatHappensNext'));

    var test;

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        test.allowTemplate('features/accountorigination/currentaccount/directives/partials/whatHappensNext.html');
    }));

    it('should not request overdraft documents if overdraft accepted', function () {
        var document = test.compileTemplate('<what-happens-next statements-consent-selected="true" />');
        expect(document.find('#supportingDocuments')).toBeHidden();
    });

    it('should request overdraft documents if overdraft accepted', function () {
        var document = test.compileTemplate('<what-happens-next statements-consent-selected="false" />');
        expect(document.find('#supportingDocuments')).not.toBeHidden();
    });

    it('should request overdraft documents if overdraft accepted', function () {
        var document = test.compileTemplate('<what-happens-next has-overdraft="true" />');
        expect(document.find('#overdraftSupportingDocs')).not.toBeHidden();
    });

    it('should show offer validity instructions if overdraft accepted', function () {
        var document = test.compileTemplate('<what-happens-next has-overdraft="true" />');
        expect(document.find('#overdraftDisclaimer')).not.toBeHidden();
    });

    it('should not show offer validity instructions if overdraft accepted', function () {
        var document = test.compileTemplate('<what-happens-next has-overdraft="false" />');
        expect(document.find('#overdraftDisclaimer')).toBeHidden();
    });

    it('should include account number in mailto link', function () {
        var document = test.compileTemplate('<what-happens-next account-number="12345" />');
        expect(document.find('#sendSupportingDocsLink').attr('href')).toMatch('12345');
    });

    it('should have less text on short version', function () {
        var document = test.compileTemplate('<what-happens-next short-version="true" />');
        expect(document.find('#confirmingYourApplication')).toBeHidden();
        expect(document.find('#receiveSms')).toBeHidden();
    });

    it('should have more text on non short version', function () {
        var document = test.compileTemplate('<what-happens-next short-version="false" />');
        expect(document.find('#confirmingYourApplication')).not.toBeHidden();
        expect(document.find('#receiveSms')).not.toBeHidden();
    });

    it('should not ask for customer documents if customer is KYC', function () {
        var document = test.compileTemplate('<what-happens-next customer-kyc="true" />');
        expect(document.find('#nonKycCompliantSupportingDocs')).toBeHidden();
    });

    it('should ask for customer documents if customer is not KYC', function () {
        var document = test.compileTemplate('<what-happens-next customer-kyc="false" />');
        expect(document.find('#nonKycCompliantSupportingDocs')).not.toBeHidden();
    });

    it('should show linking card instructions if customer is new to bank', function () {
        var document = test.compileTemplate('<what-happens-next new-to-bank="true" />');
        expect(document.find('#linkingCard')).not.toBeHidden();
    });

    it('should not show linking card instructions if customer is not new to bank', function () {
        var document = test.compileTemplate('<what-happens-next new-to-bank="false" />');
        expect(document.find('#linkingCard')).toBeHidden();
    });
});