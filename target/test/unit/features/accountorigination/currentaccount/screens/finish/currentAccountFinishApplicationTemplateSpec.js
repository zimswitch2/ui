describe('confirm offer template', function () {
    'use strict';

    var scope, element;

    beforeEach(module('refresh.filters'));

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('features/accountorigination/currentaccount/directives/partials/whatHappensNext.html');
        TemplateTest.allowTemplate('features/accountorigination/currentaccount/screens/finish/partials/whatHappensNextForPrivateBanking.html');
        TemplateTest.allowTemplate('features/accountorigination/common/screens/printheader/partials/printHeader.html');
        TemplateTest.stubTemplate('common/print/partials/printFooter.html', '');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/currentaccount/screens/finish/partials/currentAccountFinishApplication.html'));
        element = TemplateTest.compileTemplate(html);

        scope.product = {name: 'ELITE'};
        scope.offer = {overdraft: {}};
        scope.accountNumber = '1234567890';
        scope.acceptedTimestamp = moment('2015-03-23T13:30:00.000+02:00');
        scope.preferredBranchName = 'ROSEBANK';
    }));

    it('default offer: KYC compliant, existing customer, no card, no card error, no overdraft', function () {
        scope.selectedChequeCardName = undefined;
        scope.crossSellError = undefined;
        scope.offer.overdraft.selected = false;
        scope.newToBankCustomer = false;
        scope.isCustomerKycCompliant = true;
        scope.$digest();

        expect(element.find('#accountType').text()).toMatch('Elite');
        expect(element.find('#accountNumber').text()).toMatch('1234567890');
        expect(element.find('#preferredBranch').text()).toMatch('Rosebank');
        expect(element.find('#dateAccepted').text()).toMatch('23 March 2015');
        expect(element.find('#timeAccepted').text()).toMatch('13:30:00');
        expect(element.find('#chosenCard')).toBeHidden();
        expect(element.find('#chequeCardError')).toBeHidden();
        expect(element.find('#overdraftLimit')).toBeHidden();
        expect(element.find('#overdraftInterestRate')).toBeHidden();
        expect(element.find('#overdraftSupportingDocs')).not.toBeHidden();
        expect(element.find('#letterOverdraftLimit')).toBeHidden();
        expect(element.find('#letterChequeCard')).toBeHidden();
    });

    it('offer with overdraft', function () {
        scope.selectedChequeCardName = undefined;
        scope.crossSellError = undefined;
        scope.offer.overdraft = {
            selected: true,
            amount: 2500,
            interestRate: 22.6
        };
        scope.newToBankCustomer = false;
        scope.isCustomerKycCompliant = true;
        scope.hasOverdraft = function () {
            return true;
        };
        scope.$digest();

        expect(element.find('#overdraftLimit')).not.toBeHidden();
        expect(element.find('#overdraftLimit').text()).toMatch('R 2 500');
        expect(element.find('#overdraftInterestRate')).not.toBeHidden();
        expect(element.find('#overdraftInterestRate').text()).toMatch('22.6%');
        expect(element.find('#overdraftSupportingDocs')).not.toBeHidden();
    });

    it('offer with card', function () {
        scope.selectedChequeCardName = 'MasterCard';
        scope.crossSellError = undefined;
        scope.offer.overdraft.selected = false;
        scope.newToBankCustomer = false;
        scope.isCustomerKycCompliant = true;
        scope.$digest();

        expect(element.find('#chosenCard')).not.toBeHidden();
        expect(element.find('#chosenCard').text()).toMatch('MasterCard');
        expect(element.find('#letterChequeCard')).not.toBeHidden();
    });

    it('offer with card error', function () {
        scope.selectedChequeCardName = undefined;
        scope.crossSellError = true;
        scope.offer.overdraft.selected = false;
        scope.newToBankCustomer = false;
        scope.isCustomerKycCompliant = true;
        scope.$digest();

        expect(element.find('#chequeCardError')).not.toBeHidden();
    });

    it('offer for new to bank customer', function () {
        scope.selectedChequeCardName = undefined;
        scope.crossSellError = undefined;
        scope.offer.overdraft.selected = false;
        scope.newToBankCustomer = true;
        scope.isCustomerKycCompliant = true;
        scope.isPrivateBankingProduct = false;
        scope.$digest();

        expect(element.find('#linkingCard')).not.toBeHidden();
        expect(element.find('#preferredBranch')).not.toBeHidden();
        expect(element.find('#preferredBranchText')).not.toBeHidden();
        expect(element.find('#confirmDocumentsText')).not.toBeHidden();
        expect(element.find('.happens-next-private-banking-section').length).toBe(0);
    });

    it('offer for non KYC compliant customer', function () {
        scope.selectedChequeCardName = undefined;
        scope.crossSellError = undefined;
        scope.offer.overdraft.selected = false;
        scope.newToBankCustomer = false;
        scope.isCustomerKycCompliant = false;
        scope.$digest();

        expect(element.find('#nonKycCompliantSupportingDocs')).not.toBeHidden();
    });

    it('offer for private banking', function () {
        scope.isPrivateBankingProduct = true;
        scope.$digest();

        expect(element.find('#preferredBranch')).toBeHidden();
        expect(element.find('#preferredBranchText')).toBeHidden();
        expect(element.find('#confirmDocumentsText')).toBeHidden();
        expect(element.find('.happens-next-private-banking-section').length > 0).toBeTruthy();
    });
});