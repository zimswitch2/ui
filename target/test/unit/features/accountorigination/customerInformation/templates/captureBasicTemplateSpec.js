describe('customer information - capture customer basic information template', function () {
    'use strict';
    var scope, element, templateTestHelper;

    function expectElementIsExisting(elementId) {
        expect(element.find(elementId).length).toEqual(1);
    }

    function expectElementNotExisting(elementId) {
        expect(element.find(elementId).length).toEqual(0);
    }

    beforeEach(module('refresh.filters', 'refresh.mapFilter', 'refresh.accountOrigination.customerInformation.captureBasic',
        'refresh.accountOrigination.customerInformation.edit.contact', 'refresh.sbInput', 'refresh.typeahead', 'refresh.accountOrigination.domain.customer', 'refresh.dtmanalytics'));

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('LookUps', {});
            $provide.value('BankService', {});
        });
    });

    beforeEach(inject(function (TemplateTest, Fixture, LookUps, BankService, mock, CustomerInformationData) {
        function PromiseLookUp(values) {
            return {
                promise: function () {
                    return mock.resolve(values);
                }
            };
        }

        function StaticLookUp(staticValues) {
            return {
                values: function () {
                    return staticValues;
                }
            };
        }

        LookUps.title = new PromiseLookUp([{code: 1, description: 'aaa'}]);
        LookUps.country = new PromiseLookUp([{code: 2, description: 'bbb'}, {code: 'ZA', description: 'South Africa'}]);
        LookUps.maritalStatus = new PromiseLookUp([{code: 4, description: 'ddd'}]);
        LookUps.maritalType = new StaticLookUp([{code: 5, description: 'eee'}]);
        LookUps.permitType = new StaticLookUp([{code: '01', description: 'Some Permit'}]);
        LookUps.contactType = new PromiseLookUp([{code: '01', editCode: '01', description: 'zzz'}]);
        LookUps.language = new StaticLookUp([{code: 11, description: 'yyy'}]);
        LookUps.gender = new StaticLookUp([{code: 1, description: 'Female'}]);
        LookUps.idType = new StaticLookUp([{code: '01', description: 'South African ID'}, {
            code: '06',
            description: 'Passport'
        }]);

        BankService.walkInBranches = function () {
            return mock.resolve([
                {code: '1', name: 'Branch'}
            ]);
        };

        templateTestHelper = TemplateTest;
        scope = templateTestHelper.scope;
        scope.$parent.customerInformationData = CustomerInformationData.initialize({});
        scope.LogoutController = function () {
        };

        templateTestHelper.allowTemplate('common/sbform/partials/rowField.html');
        templateTestHelper.allowTemplate('common/sbform/partials/sbTextInput.html');
        templateTestHelper.allowTemplate('common/typeahead/partials/typeahead.html');
        templateTestHelper.allowTemplate('features/accountorigination/customerInformation/partials/addContact.html');
        templateTestHelper.allowTemplate('features/accountorigination/customerInformation/partials/existingCustomerModal.html');
        templateTestHelper.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
        templateTestHelper.allowTemplate('common/flow/partials/flow.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/captureBasicInformation.html'));
        element = templateTestHelper.compileTemplate(html);
    }));

    describe('use SA ID as default', function () {
        beforeEach(function () {
            scope.$digest();
        });

        it('should not show passport related fields', function () {
            expectElementNotExisting('#capturePassport');
            expectElementNotExisting('#capturePassportCountry');
            expectElementNotExisting('#capturePassportExpiryDate');
            expectElementNotExisting('#capturePermitExpiryDate');

            expectElementIsExisting('#captureIDNumber');
        });
    });

    describe("validation", function () {
        function findErrorMessage(id) {
            return element.find('row-field[label-for="' + id + '"] ng-message').text();
        }

        var invalidNameValidationMessage = "Please enter only alphabetical characters, spaces, apostrophes and hyphens";

        it('should hide error message when name is valid', function () {
            var name = "ABCDEFGhigklmnOPQRSTuvwxyz -------------";
            templateTestHelper.changeInputValueTo(element.find('#captureSurname'), name);
            templateTestHelper.changeInputValueTo(element.find('#captureFirstNames'), name);
            scope.$digest();

            expect(findErrorMessage("captureSurname")).toBeFalsy();
            expect(findErrorMessage("captureFirstNames")).toBeFalsy();
        });

        it('should show error message when name is invalid', function () {
            var name = "ab1";
            templateTestHelper.changeInputValueTo(element.find('#captureSurname'), name);
            templateTestHelper.changeInputValueTo(element.find('#captureFirstNames'), name);
            scope.$digest();

            expect(findErrorMessage("captureSurname")).toBe(invalidNameValidationMessage);
            expect(findErrorMessage("captureFirstNames")).toBe(invalidNameValidationMessage);
        });

        describe("id number validation", function(){
           beforeEach(function(){
               scope.customerInformationData.identityDocuments = [{
                   identityTypeCode: '01'
               }];
           });

            it('should hide error message when South African ID number is valid', function () {
                templateTestHelper.changeInputValueTo(element.find('#captureIDNumber'), "1234567890128");
                scope.$digest();

                expect(findErrorMessage("captureIDNumber")).toBeFalsy();
            });

            it('should show error message when South African ID number is invalid', function () {
                templateTestHelper.changeInputValueTo(element.find('#captureIDNumber'), "123123123123a");
                scope.$digest();

                expect(findErrorMessage("captureIDNumber")).toBe("Please enter a valid 13-digit South African ID number");
            });
        });
    });
});
