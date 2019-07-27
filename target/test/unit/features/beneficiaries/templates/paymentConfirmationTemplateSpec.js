describe('confirmation preferences', function () {
    'use strict';

    var scope, element, templateTestHelper;

    beforeEach(module('refresh.beneficiaries', 'refresh.sbInput', 'refresh.textValidation'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');
        var confirmationTemplate = Fixture.load('base/main/features/beneficiaries/partials/paymentConfirmation.html');
        var html = templateTestHelper.addRootNodeToDocument('<form>' + confirmationTemplate + '</form>');
        element = templateTestHelper.compileTemplate(html);
        scope.$parent.paymentConfirmation = true;
        scope.$parent.beneficiary = {paymentConfirmation: {confirmationType: 'SMS'}};
        scope.$digest();
    }));

    function errorMessageFor(inputName) {
        return element.find("sb-input[name='" + inputName + "'] .form-error:not(.ng-hide)").text();
    }

    describe('recipient name', function () {
        it('should not allow special characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Name'), '$');
            scope.$digest();
            expect(errorMessageFor('Recipient_Name')).toBe('Please enter a valid recipient name');
        });

        it('should be required', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Name'), ' ');
            scope.$digest();
            expect(errorMessageFor('Recipient_Name')).toBe('Required');
        });

        it('should be shorter than 25 characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Name'), '1234567890123456789012345a');
            scope.$digest();
            expect(errorMessageFor('Recipient_Name')).toBe('Cannot be longer than 25 characters');
        });
    });

    describe('email address', function () {
        beforeEach(function () {
            scope.$parent.beneficiary = {
                paymentConfirmation: {
                    confirmationType: 'Email'
                }
            };
            scope.$digest();
        });

        it('should not allow special characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Email'), '$');
            scope.$digest();
            expect(errorMessageFor('Recipient_Email')).toBe('Please enter a valid email address');
        });

        it('should be required', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Email'), ' ');
            scope.$digest();
            expect(errorMessageFor('Recipient_Email')).toBe('Required');
        });

        it('should be shorter than 40 characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Email'), '123456789012345678901234567890email@c.coA');
            scope.$digest();
            expect(errorMessageFor('Recipient_Email')).toBe('Cannot be longer than 40 characters');
        });
    });

    describe('phone number', function () {
        beforeEach(function () {
            scope.$parent.beneficiary = {
                paymentConfirmation: {
                    confirmationType: 'SMS'
                }
            };
            scope.$digest();
        });

        it('should not allow special characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), '$');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Please enter a 10-digit cell phone number');
        });

        it('should not allow letters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), 'notanumber');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Please enter a 10-digit cell phone number');
        });

        it('should be required', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), ' ');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Required');
        });

        it('should not be shorter than 10 characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), '073456789');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Please enter a 10-digit cell phone number');
        });

        it('should not be longer than 10 characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), '07345678901');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Please enter a 10-digit cell phone number');
        });

        it('should start with a zero', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), '9734567890');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Please enter a 10-digit cell phone number');
        });

        it('should have a second digit in the range 6-8', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), '0334567890');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('Please enter a 10-digit cell phone number');
        });

        it('should recognise a valid cell number', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_SMS'), '0734567890');
            scope.$digest();
            expect(errorMessageFor('Recipient_SMS')).toBe('');
        });
    });

    describe('fax number', function () {
        beforeEach(function () {
            scope.$parent.beneficiary = {
                paymentConfirmation: {
                    confirmationType: 'Fax'
                }
            };
            scope.$digest();
        });

        it('should not allow special characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), 'bob');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('Please enter a valid 10-digit fax number');
        });

        it('should not allow letters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), 'notanumber');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('Please enter a valid 10-digit fax number');
        });

        it('should be required', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), ' ');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('Required');
        });

        it('should not be shorter than 10 characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), '073456789');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('Please enter a valid 10-digit fax number');
        });

        it('should not be longer than 10 characters', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), '01345678901');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('Please enter a valid 10-digit fax number');
        });

        it('should start with a zero', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), '9734567890');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('Please enter a valid 10-digit fax number');
        });

        it('should recognise a valid fax number', function () {
            templateTestHelper.changeInputValueTo(element.find('#Recipient_Fax'), '0114567890');
            scope.$digest();
            expect(errorMessageFor('Recipient_Fax')).toBe('');
        });
    });
});
