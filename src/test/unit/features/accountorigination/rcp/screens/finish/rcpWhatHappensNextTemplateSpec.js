describe('what happens next template', function () {
    'use strict';

    var test, scope, element;

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        scope = _TemplateTest_.scope;
        scope.debitOrder = {
            account: {}
        };

        element = test.compileTemplateInFile('features/accountorigination/rcp/screens/finish/partials/whatHappensNext.html');
    }));

    describe('Supporting documents', function () {
        it('should hide send supporting documents when user gave consent for income statement to be obtain electronically',
            function () {
                scope.debitOrder.electronicConsent = true;
                scope.$digest();
                expect(element.find('#supportingDocuments')).toBeHidden();
            }
        );

        it('should hide send supporting documents when user a transactional account with standard bank',
            function () {
                scope.debitOrder.account.isStandardBank = true;
                scope.$digest();
                expect(element.find('#supportingDocuments')).toBeHidden();
            }
        );

        it('should show send supporting documents when user has no transactional account and no electronic consent',
            function () {
                scope.debitOrder.account.isStandardBank = false;
                scope.debitOrder.electronicConsent = false;
                scope.$digest();
                expect(element.find('#supportingDocuments')).not.toBeHidden();
            }
        );
    });

    describe('confirming  your application', function () {
        describe('verifying your income', function () {
            it('should show verifying income when user has a transactional account',
                function () {
                    scope.debitOrder.account.isStandardBank = true;
                    scope.$digest();
                    expect(element.find('#verifyingIncome')).not.toBeHidden();
                }
            );

            it('should show verifying income when user gave consent for income statement to be obtain electronically',
                function () {
                    scope.debitOrder.electronicConsent = true;
                    scope.$digest();
                    expect(element.find('#verifyingIncome')).not.toBeHidden();
                }
            );

            it('should not show verifying income when user has no transactional account and no electronic consent',
                function () {
                    scope.debitOrder.account.isStandardBank = false;
                    scope.debitOrder.electronicConsent = false;
                    scope.$digest();
                    expect(element.find('#verifyingIncome')).toBeHidden();
                }
            );

            it('should show when money will be available when user is kyc compliant and income verification successful',
                function () {
                    scope.debitOrder.account.isStandardBank = true;
                    scope.debitOrder.electronicConsent = true;
                    scope.isCustomerKycCompliant = true;
                    scope.$digest();
                    expect(element.find('#verifyingIncomeSuccess')).not.toBeHidden();
                }
            );
        });

        describe('Kyc documents collection', function () {
            it('should show kyc documents collection details when customer is not kyc compliant',
                function () {
                    scope.isCustomerKycCompliant = false;
                    scope.$digest();
                    expect(element.find('#kycNonCompliantConfirmation')).not.toBeHidden();
                }
            );

            it('should  not show kyc documents collection details when customer is kyc compliant',
                function () {
                    scope.isCustomerKycCompliant = true;
                    scope.$digest();
                    expect(element.find('#kycNonCompliantConfirmation')).toBeHidden();
                }
            );
        });

        describe('Successful application communication details', function () {
            it('should show communication and confirmation details when customer is kyc compliant',
                function () {
                    scope.isCustomerKycCompliant = true;
                    scope.$digest();
                    expect(element.find('#kycCompliantConfirmation')).not.toBeHidden();
                }
            );

            it('should  not show kyc documents collection details when customer is kyc compliant',
                function () {
                    scope.isCustomerKycCompliant = false;
                    scope.$digest();
                    expect(element.find('#kycNonCompliantConfirmation')).not.toBeHidden();
                }
            );
        });
    });
});