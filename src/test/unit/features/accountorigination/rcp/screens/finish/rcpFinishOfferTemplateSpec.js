describe('Finish Rcp offer template', function () {
    'use strict';

    var scope, element;

    beforeEach(module('refresh.filters'));

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('features/accountorigination/rcp/screens/finish/partials/whatHappensNext.html');
        TemplateTest.allowTemplate('features/accountorigination/rcp/screens/finish/partials/whatHappensNextForPrivateBanking.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/rcp/screens/finish/partials/rcpFinishOffer.html'));
        element = TemplateTest.compileTemplate(html);
        scope.rcpOfferDetails = {
            approved: true,
            maximumLoanAmount: 100000,
            interestRate: 22.5,
            repaymentFactor: 20.0,
            productName: "REVOLVING CREDIT PLAN LOAN",
            productNumber: 8
        };
        scope.offerConfirmationDetails = {
            timestamp: '2014-08-13T09:08:40.424+02:00',
            accountNumber: 11111,
            maximumDebitOrderRepaymentAmount: 5000.20
        };

        scope.finishApplicationText = 'Finish Application';

        scope.requestedLimit = 50000;

        scope.debitOrder = {repayment: {amount: 5000.20}};

        scope.preferredBranch = 'Sandton';

        scope.goAccountSummary = function () {
        };

        scope.finishApplication = function () {

        };

        scope.$digest();
    }));


    it('should show offer details', function () {
        expect(element.find('#interestRate').text()).toMatch(/Interest rate\s+22.5%/);
        expect(element.find('#accountType').text()).toMatch(/Account type\s+REVOLVING CREDIT PLAN LOAN/);
        expect(element.find('#rcpAmount').text()).toMatch(/RCP amount\s+R 50 000.00/);

    });

    it('should show confirmation details', function () {
        expect(element.find('#accountNumber').text()).toMatch(/Account number\s+11111/);
        expect(element.find('#monthlyRepaymentAmount').text()).toMatch(/Monthly repayment amount\s+R 5 000.20/);
        expect(element.find('#dateAccepted').text()).toMatch(/Date accepted\s+13 August 2014/);
        expect(element.find('#timeAccepted').text()).toMatch(/Time accepted\s+09:08:40/);

    });

    it('should show selected proffered branch', function () {
        expect(element.find('#preferredBranch').text()).toMatch(/Preferred branch\s+Sandton/);
    });

    it('should display email address with correct link', function () {
        expect(element.find('#sendEmail').attr('href')).toContain('subject=Revolving Credit Plan application: Supporting documents for 11111');
        expect(element.find('#sendEmail').attr('href')).toContain('mailto:supportingdocuments@standardbank.co.za');
    });

    describe('finish application button', function () {
        it ('should display correct message', function () {
            expect (element.find('button[name="finishApplication"]').text()).toContain(scope.finishApplicationText);
        });

        it("click should invoke finishApplication()", function () {
            spyOn(scope, ['finishApplication']);
            element.find('button[name="finishApplication"]').click();
            expect(scope.finishApplication).toHaveBeenCalled();
        });
    });

    describe('when electronic consent was provided', function () {
        it("should not show the documents required section", function () {
            scope.debitOrder.electronicConsent = true;
            scope.$digest();
            expect(element.find("#supportingDocuments")).toBeHidden();
        });
    });

    describe('when electronic consent was not provided', function () {

        it("should show the documents required section", function () {
            scope.electronicConsentReceived = undefined;
            scope.$digest();
            expect(element.find("#supportingDocuments")).not.toBeHidden();
        });
    });

    describe('when customer has a standard bank account', function () {

        it("should show private banking section when customer has a private banking account", function () {
            scope.hasPrivateBankingAccount = true;
            scope.$digest();
            expect(element.find('.happens-next-section').length).toBe(0);
            expect(element.find('.happens-next-private-banking-section').length > 0).toBeTruthy();
        });

        it("should not show private banking section when customer has a non-private banking account", function () {
            scope.hasPrivateBankingAccount = false;
            scope.$digest();
            expect(element.find('.happens-next-private-banking-section').length).toBe(0);
            expect(element.find('.happens-next-section').length > 0).toBeTruthy();
        });
    });
});