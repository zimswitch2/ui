describe('Confirm offer template', function () {
    'use strict';

    var scope, element;

    beforeEach(module('refresh.filters', 'refresh.accountOrigination.rcp.domain.debitOrder'));

    beforeEach(inject(function (TemplateTest, Fixture, DebitOrder) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/rcp/screens/confirm/partials/rcpConfirmOffer.html'));
        element = TemplateTest.compileTemplate(html);

        scope.offerDetails = {
            approved: true,
            maximumLoanAmount: 100000,
            interestRate: 22.5,
            repaymentFactor: 20.0,
            productName: "REVOLVING CREDIT PLAN LOAN",
            loanTermInMonths: 54,
            productNumber: 8
        };

        scope.requestedLimit = 25000;

        scope.repayment = { amount: 5000 };

        scope.downloadRcpCostOfCreditAgreement = '/sbg-ib/rest/AccountOriginationService/DownloadRcpLoanCostOfCreditAgreement';

        var fromStandardBankAccount = DebitOrder.fromStandardBankAccount({
                number: '123456789',
                formattedNumber: '123-456-789',
                branch: {code: 1155}
            },
            {day: 1, amount: 5000}, true);

        scope.debitOrder = fromStandardBankAccount;

        scope.debitOrderDetails = fromStandardBankAccount.transformToServiceDebitOrder();

        scope.principal = {
            systemPrincipalId: '23444',
            systemPrincipalKey: 'sb siuser'
        };


        scope.applicationNumber = 'SBI 12344';

        scope.backToRevolvingCreditPlan = function () {

        };

        scope.confirm = function () {

        };

        scope.agreed = false;

        scope.$digest();
    }));


    it('should show offer details', function () {
        expect(element.find('#acceptOfferInterestRate').text()).toMatch(/22.5%/);
        expect(element.find('#acceptOfferRcpAmount').text()).toMatch(/R 25 000.00/);
        expect(element.find('#acceptOfferMonthlyRepayment').text()).toMatch(/R 5 000/);
        expect(element.find('#repaymentTerm').text()).toMatch(/54 months/);
    });

    it("should show debit order details", function () {
        expect(element.find('#repaymentAccount').text()).toMatch(/123-456-789/);
        expect(element.find('#repaymentDate').text()).toMatch(/1st day of every month/);
    });

    it("should show product name", function () {
        expect(element.find('#accountType').text()).toMatch(/Revolving Credit Plan Loan/);
    });

    describe("confirm offer button", function () {
        var confirmButton;
        beforeEach(function () {
            confirmButton = element.find('#rcpConfirm');

        });

        it('should call confirm on click', function () {
            spyOn(scope, ['confirm']);
            confirmButton.click();
            expect(scope.confirm).toHaveBeenCalled();
        });

        it('should be disabled when not agreed', function () {
            scope.agreed = false;
            scope.$digest();
            expect(confirmButton.attr('disabled')).toEqual('disabled');
        });

        it('should be enabled when agreed', function () {
            scope.agreed = true;
            scope.$digest();
            expect(confirmButton.attr('disabled')).toBeUndefined();
        });

        it("should record analytics", function () {
            expect(confirmButton.attr('track-click')).toEqual('Apply.RCP.Confirm.Confirm');
            expect(confirmButton.attr('data-dtmid')).toEqual('link_content_Your RCP');
            expect(confirmButton.attr('data-dtmtext')).toEqual('Confirm button click');
        });
    });

    describe("download loan agreement and debit order mandate", function () {
        it("link should record analytics", function () {
            expect(element.find('#downloadAgreement').attr('track-click')).toEqual('Apply.RCP.Confirm.Loan and debit order and disbursement agreement link');
            expect(element.find('#downloadAgreement').attr('data-dtmid')).toEqual('link_content_Your RCP');
            expect(element.find('#downloadAgreement').attr('data-dtmtext')).toEqual('Loan agreement, debit order and disbursement instruction mandates link');
        });

        it("should set input values and keys for query Params", function () {
            expect(element.find('#systemPrincipalIdParam').attr('value')).toEqual('23444');
            expect(element.find('#systemPrincipalIdParam').attr('name')).toEqual('systemPrincipalId');

            expect(element.find('#systemPrincipalKeyParam').attr('value')).toEqual('sb siuser');
            expect(element.find('#systemPrincipalKeyParam').attr('name')).toEqual('systemPrincipalKey');

            expect(element.find('#debitOrderMonthlyRepaymentParam').attr('value')).toEqual('5000');
            expect(element.find('#debitOrderMonthlyRepaymentParam').attr('name')).toEqual('debitOrderMonthlyRepayment');

            expect(element.find('#debitOrderAccountNumberParam').attr('value')).toEqual('123456789');
            expect(element.find('#debitOrderAccountNumberParam').attr('name')).toEqual('debitOrderAccountNumber');

            expect(element.find('#debitOrderIbtNumberParam').attr('value')).toEqual('1155');
            expect(element.find('#debitOrderIbtNumberParam').attr('name')).toEqual('debitOrderIbtNumber');

            expect(element.find('#debitOrderRepaymentCycleParam').attr('value')).toEqual('101');
            expect(element.find('#debitOrderRepaymentCycleParam').attr('name')).toEqual('debitOrderRepaymentCycle');

            expect(element.find('#applicationNumberParam').attr('value')).toEqual('SBI 12344');
            expect(element.find('#applicationNumberParam').attr('name')).toEqual('applicationNumber');

            expect(element.find('#requestedLimitParam').attr('value')).toEqual('25000');
            expect(element.find('#requestedLimitParam').attr('name')).toEqual('requestedLimit');

            expect(element.find('#productNumberParam').attr('value')).toEqual('8');
            expect(element.find('#productNumberParam').attr('name')).toEqual('productNumber');

        });

        it("should set the download url for form submit", function () {
            expect(element.find('#downloadRcpCostOfCredit').attr('action')).toEqual('/sbg-ib/rest/AccountOriginationService/DownloadRcpLoanCostOfCreditAgreement');
            expect(element.find('#downloadRcpCostOfCredit').attr('method')).toEqual('GET');
        });
    });


    it("redirects back to revolving credit plan", function () {
        spyOn(scope, ['backToRevolvingCreditPlan']);
        element.find('#rcpGoToRevolvingCreditPlan').click();
        expect(scope.backToRevolvingCreditPlan).toHaveBeenCalled();
    });

});
