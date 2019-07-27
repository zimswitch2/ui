describe('add beneficiaries template', function () {
    'use strict';
    var scope, element, templateTestHelper;

    beforeEach(module('refresh.beneficiaries', 'refresh.sbInput', 'refresh.textValidation'));

    beforeEach(inject(function (_TemplateTest_, Fixture) {
        templateTestHelper = _TemplateTest_;
        scope = templateTestHelper.scope;
        templateTestHelper.stubTemplate('common/flow/partials/flow.html', '');
        templateTestHelper.allowTemplate('common/typeahead/partials/typeahead.html');
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');
        templateTestHelper.allowTemplate('features/beneficiaries/partials/paymentConfirmation.html');
        templateTestHelper.allowTemplate('features/payment/partials/beneficiaryAccountValidationDisclaimer.html');
        var html = templateTestHelper.addToForm(Fixture.load('base/main/features/beneficiaries/partials/add.html'));
        element = templateTestHelper.compileTemplate(html);
    }));

    function errorMessageForSbInput(inputName) {
        return element.find("sb-input[name='" + inputName + "'] ng-message").text();
    }

    function errorMessageByIdForInput(id) {
        return element.find("input[id='" + id + "'] ~ .form-error:not(.ng-hide)").text();
    }

    describe('page heading', function () {
        it('should be add beneficiary when adding a beneficiary', function () {
            scope.addBeneficiary = true;
            scope.$digest();
            expect(element.find('h2:not(.ng-hide)').text()).toBe('Add Beneficiary');
        });

        it('should be edit beneficiary when editing a beneficiary', function () {
            scope.editBeneficiary = true;
            scope.$digest();
            expect(element.find('h2:not(.ng-hide)').text()).toBe('Edit Beneficiary');
        });
    });

    describe('when adding listed beneficiaries', function () {
        beforeEach(function () {
            scope.isPrivateBeneficiary = function () {
                return false;
            };
            scope.isListedBeneficiary = function () {
                return true;
            };
            scope.$digest();
        });

        describe('listed beneficiary name', function () {
            beforeEach(function () {
                scope.cdi = [{ number: '12345', name: 'Pretty co.', label: function () { return 'Pretty co.'; }}];
                scope.$digest();
            });

            it('should not allow companies not in the list', function () {
                var inputElement = element.find('#listedBeneficiary-input');
                templateTestHelper.changeInputValueTo(inputElement, 'aaaaaaaaaaaaaaaaaaaaaaaaa');
                inputElement.triggerHandler('keyup');

                scope.$digest();

                expect(errorMessageByIdForInput('listedBeneficiary-input')).toBe('No matches found');
            });

            it('should allow company name to be typed', function () {
                var inputElement = element.find('#listedBeneficiary-input');
                templateTestHelper.changeInputValueTo(inputElement, 'Pretty co.');
                inputElement.triggerHandler('keyup');

                scope.$digest();

                expect(errorMessageByIdForInput('listedBeneficiary-input')).toBe('');
            });
        });
    });

    describe('when adding private beneficiary', function () {
        beforeEach(function () {
            scope.isPrivateBeneficiary = function () {
                return true;
            };
            scope.isListedBeneficiary = function () {
                return false;
            };
            scope.$digest();
        });

        describe('name', function () {
            it('should validate', function () {
                templateTestHelper.changeInputValueTo(element.find('#name'), '$');
                scope.$digest();
                expect(errorMessageForSbInput('name')).toBe('Please enter a valid beneficiary name');

                templateTestHelper.changeInputValueTo(element.find('#name'), ' ');
                scope.$digest();
                expect(errorMessageForSbInput('name')).toBe('Required');

                templateTestHelper.changeInputValueTo(element.find('#name'), '12345678901234567890A');
                scope.$digest();
                expect(errorMessageForSbInput('name')).toBe('Cannot be longer than 20 characters');
            });
        });

        describe('bank', function () {
            beforeEach(function () {
                scope.banks = [{ branch: null, code: '051', label: function () { return 'Standard Bank'; }, name: 'Standard Bank'}];
                scope.$digest();
            });

            it('should validate', function () {
                var inputElement = element.find('#bank-input');
                templateTestHelper.changeInputValueTo(inputElement, 'aaaaaaaaaaaaaaaaaaaaaaaaa');
                inputElement.triggerHandler('keyup');

                scope.$digest();
                var id = "bank-input";
                expect(errorMessageByIdForInput('bank-input')).toBe('No matches found');
                templateTestHelper.changeInputValueTo(inputElement, 'Standard Bank');
                inputElement.triggerHandler('keyup');

                scope.$digest();

                expect(errorMessageByIdForInput('bank-input')).toBe('');
            });
        });

        describe('branch', function () {
            beforeEach(function () {
                scope.banks = [{
                    branch: null, code: '051', label: function () {
                        return 'Standard Bank';
                    }, name: 'Standard Bank'
                }];
                var branches = [{
                    code: '51001', name: 'Main Branch', label: function () {
                        return 'Main Branch';
                    }
                }];
                scope.selectedBankBranches = function () {
                    return branches;
                };
                scope.$digest();

                var bankInput = element.find('#bank-input');
                templateTestHelper.changeInputValueTo(bankInput, 'Standard Bank');
                bankInput.triggerHandler('keyup');
                bankInput.trigger($.Event('keydown', {keyCode: 9}));
            });

            it('should validate', function () {
                var branchInput = element.find('#branch-input');
                templateTestHelper.changeInputValueTo(branchInput, 'bbbbbbbbbbbbbb');
                branchInput.triggerHandler('keyup');

                scope.$digest();

                expect(errorMessageByIdForInput('branch-input')).toBe('No matches found');
                templateTestHelper.changeInputValueTo(branchInput, 'Main Branch');
                branchInput.triggerHandler('keyup');
                branchInput.trigger($.Event('keydown', {keyCode: 9}));

                scope.$digest();

                expect(element.find('sb-typeahead#bank').html()).toContain('ng-valid-not-in-list');

                expect(errorMessageForSbInput('bank-input')).toBe('');
                expect(element.find('#bank-input').val()).toBe('Standard Bank');

                expect(errorMessageForSbInput('branch-input')).toBe('');
            });
        });

        describe('account number', function () {
            it('should validate', function () {
                templateTestHelper.changeInputValueTo(element.find('#accountNumber'), '$');
                scope.$digest();
                expect(errorMessageForSbInput('accountNumber')).toBe('Please enter a number');

                templateTestHelper.changeInputValueTo(element.find('#accountNumber'), 'a');
                scope.$digest();
                expect(errorMessageForSbInput('accountNumber')).toBe('Please enter a number');

                templateTestHelper.changeInputValueTo(element.find('#accountNumber'), ' ');
                scope.$digest();
                expect(errorMessageForSbInput('accountNumber')).toBe('Required');

                templateTestHelper.changeInputValueTo(element.find('#accountNumber'), '12345678901234567');
                scope.$digest();
                expect(errorMessageForSbInput('accountNumber')).toBe('Cannot be longer than 16 characters');
            });
        });

        describe('my reference', function () {
            it('should validate', function () {
                templateTestHelper.changeInputValueTo(element.find('#myReference'), '$');
                scope.$digest();
                expect(errorMessageForSbInput('myReference')).toBe('Please enter a valid reference');

                templateTestHelper.changeInputValueTo(element.find('#myReference'), ' ');
                scope.$digest();
                expect(errorMessageForSbInput('myReference')).toBe('Required');

                templateTestHelper.changeInputValueTo(element.find('#myReference'), '123456789012a');
                scope.$digest();
                expect(errorMessageForSbInput('myReference')).toBe('Cannot be longer than 12 characters');
            });
        });

        describe('beneficiary reference', function () {
            it('should validate', function () {
                templateTestHelper.changeInputValueTo(element.find('#beneficiaryReference'), '$');
                scope.$digest();
                expect(errorMessageForSbInput('beneficiaryReference')).toBe('Please enter a valid beneficiary reference');

                templateTestHelper.changeInputValueTo(element.find('#beneficiaryReference'), ' ');
                scope.$digest();
                expect(errorMessageForSbInput('beneficiaryReference')).toBe('Required');

                templateTestHelper.changeInputValueTo(element.find('#beneficiaryReference'), '1234567890123456789012345a');
                scope.$digest();
                expect(errorMessageForSbInput('beneficiaryReference')).toBe('Cannot be longer than 25 characters');
            });
        });

        it('should include beneficiary known information', function () {
            expect(element.find('#name').length).toBe(1);
            expect(element.find('#bank').hasClass('ng-hide')).toBeFalsy();
            expect(element.find('#branch').hasClass('ng-hide')).toBeFalsy();
            expect(element.find('sb-input[name="accountNumber"]').hasClass('ng-hide')).toBeFalsy();
            expect(element.find('.well-break').hasClass('ng-hide')).toBeFalsy();
        });
    });
});
