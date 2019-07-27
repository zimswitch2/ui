describe('single beneficiary payment template', function () {
    'use strict';

    beforeEach(module('refresh.textValidation', 'refresh.payment', 'refresh.notifications', 'refresh.amount', 'refresh.formtracker', function($provide) {
        $provide.service('formTrackerService', function() { 
            return {}; 
        });
    }));

    var scope, document, templateTestHelper;

    function loadPartials(test) {
        test.allowTemplate('common/amount/partials/amount.html');
        test.allowTemplate('common/datepicker/partials/datepicker.html');
        test.stubTemplate('common/print/partials/printFooter.html', '');
        test.allowTemplate('common/monthlyPaymentLimits/partials/noEAPLimitMessage.html');
        test.allowTemplate('common/accountdropdown/partials/accountDropdown.html');
        test.stubTemplate('features/beneficiaries/partials/paymentConfirmation.html', '');
        test.allowTemplate('common/flow/partials/flow.html');
        test.allowTemplate('common/sbform/partials/sbTextInput.html');
        test.allowTemplate('features/beneficiaries/partials/printBeneficiaryReceiptHeader.html');
        test.allowTemplate('common/recurringPayments/partials/recurringPayments.html');
        test.allowTemplate('features/payment/partials/beneficiaryAccountValidationDisclaimer.html');
        test.allowTemplate('features/payment/partials/displayPaymentDetails.html');
    }

    beforeEach(inject(function (_TemplateTest_, Fixture, $rootScope, PermissionsService) {
        spyOn(PermissionsService, ['checkPermission']).and.returnValue(true);
        templateTestHelper = _TemplateTest_;
        scope = $rootScope.$new();
        templateTestHelper.scope = scope;
        loadPartials(templateTestHelper);
        document = templateTestHelper.compileTemplateInFile('features/payment/partials/payBeneficiary.html');
        scope.$apply();
    }));

    it('should not display the successMessage by default', function () {
        expect(document.find('div.success').first().hasClass('ng-hide'))
            .toBeTruthy('Success message should be hidden by default');
    });

    it('should display the successMessage from the scope if isSuccessful is true', function () {
        scope.isSuccessful = true;
        scope.successMessage = 'A message about success';
        scope.$apply();

        var successDiv = document.find('div.success').first();
        expect(successDiv.hasClass('ng-hide')).toBeFalsy('Success message should be displayed');
        expect(successDiv.text()).toBe(scope.successMessage);
    });

    describe('on the reviewing/result page', function () {
        beforeEach(function () {
            scope.state = 'reviewing';
        });

        describe('when not making a recurring payment', function () {
            beforeEach(function (){
                scope.isRecurringPayment = false;
            });
            it('should not display last payment date', function () {
                scope.$apply();
                expect(document.find('#lastPaymentDate').first().hasClass('ng-hide'))
                    .toBeTruthy('last payment date should be hidden when not making a recurring payment');
            });
            it('should not display repeat payment description', function () {
                scope.$apply();
                expect(document.find('#repeatPaymentDescription').first().hasClass('ng-hide'))
                    .toBeTruthy('repeat payment description should be hidden when not making a recurring payment');
            });
        });
    });

    describe('when editing references', function () {
        function errorMessageFor(inputName) {
            return document.find("input[name='" + inputName + "'] +ng-messages ng-message.form-error:not(.ng-hide)").text();
        }
        describe('your reference', function () {

            it('should not allow special characters', function () {
                templateTestHelper.changeInputValueTo(document.find('#Your_Reference'), '$');
                scope.$digest();
                expect(errorMessageFor('Your_Reference')).toBe('Please enter a valid reference');
            });

            it('should be required', function () {
                templateTestHelper.changeInputValueTo(document.find('#Your_Reference'), ' ');
                scope.$digest();
                expect(errorMessageFor('Your_Reference')).toBe('Required');
            });

            it('should be shorter than 12 characters', function () {
                templateTestHelper.changeInputValueTo(document.find('#Your_Reference'), '123456789012a');
                scope.$digest();
                expect(errorMessageFor('Your_Reference')).toBe('Cannot be longer than 12 characters');
            });
        });

        describe('beneficiary reference', function () {
            it('should not allow special characters', function () {
                templateTestHelper.changeInputValueTo(document.find('#Beneficiary_Reference'), '$');
                scope.$digest();
                expect(errorMessageFor('Beneficiary_Reference')).toBe('Please enter a valid beneficiary reference');
            });

            it('should be required', function () {
                templateTestHelper.changeInputValueTo(document.find('#Beneficiary_Reference'), ' ');
                scope.$digest();
                expect(errorMessageFor('Beneficiary_Reference')).toBe('Required');
            });

            it('should be shorter than 12 characters', function () {
                templateTestHelper.changeInputValueTo(document.find('#Beneficiary_Reference'), '1234567890123456789012345a');
                scope.$digest();
                expect(errorMessageFor('Beneficiary_Reference')).toBe('Cannot be longer than 25 characters');
            });
        });
    });


});
