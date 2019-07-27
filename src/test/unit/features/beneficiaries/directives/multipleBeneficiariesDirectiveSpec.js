describe('multiple beneficiaries directive template', function () {
    beforeEach(module('refresh.beneficiaries'));

    var scope, test, element;

    var beneficiaries = [
        {
            recipientId: "1",
            name: "Test",
            accountNumber: "211",
            recipientReference: "Test",
            customerReference: "Test",
            recentPayment: [
                {date: "2014-02-03"}],
            lastPaymentDate: moment("2014-01-21"),
            amountPaid: "100",
            recipientGroupName: 'Group 1',
            recipientGroup: {
                'name': 'Group 1',
                'oldName': null,
                'orderIndex': "1"
            }
        }
    ];
    beforeEach(inject(function (TemplateTest) {
        scope = TemplateTest.scope;
        test = TemplateTest;
        TemplateTest.allowTemplate('features/beneficiaries/partials/multipleBeneficiaries.html');
        TemplateTest.allowTemplate('common/sbform/partials/sbTextInput.html');
        TemplateTest.allowTemplate('features/goToAnchor/partials/scrollOnClick.html');
        TemplateTest.allowTemplate('features/beneficiaries/partials/paymentConfirmation.html');

    }));

    it('should set scope for rendering filter box based on attribute', function () {
        element = test.compileTemplate('<multiple-beneficiaries filterable="true"></multiple-beneficiaries>');
        expect(scope.filterable).toBeTruthy();
    });

    describe('last payment', function () {
        it('should show amount and date when the amount is positive', function () {
            element = test.compileTemplate('<multiple-beneficiaries ></multiple-beneficiaries>');
            scope.beneficiaryList = function () {
                return beneficiaries;
            };
            scope.$digest();
            expect(element.find('#last-payment').text()).toContain('R 100.00 on 21 January 2014');
        });

        it('should hide amount and date when the amount is not positive', function () {
            element = test.compileTemplate('<multiple-beneficiaries ></multiple-beneficiaries>');
            scope.beneficiaryList = function () {
                beneficiaries[0]['amountPaid'] = -100;
                return beneficiaries;
            };
            scope.$digest();
            expect(element.find('#last-payment').hasClass('ng-hide')).toBeTruthy();
        });
    });
});
