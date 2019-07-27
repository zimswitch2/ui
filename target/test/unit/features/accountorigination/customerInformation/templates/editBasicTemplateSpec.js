describe('customer information - edit customer basic information template', function () {
    'use strict';

    var scope, element, templateTestHelper;

    function expectElementIsAccessible(elementId) {
        expect(element.find(elementId).length).toBeGreaterThan(0);
        expect(element.find(elementId).attr('disabled')).toBeFalsy();
    }

    function expectElementIsNotExisting(elementId) {
        expect(element.find(elementId).length).toEqual(0);
    }

    function expectElementToMatch(selector, match) {
        expect(element.find(selector).text()).toMatch(match);
        expect(element.find(selector).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(module('refresh.filters', 'refresh.rowField', 'refresh.mapFilter',
        'refresh.accountOrigination.customerInformation.edit.basic', 'refresh.typeahead'));

    beforeEach(function () {
        module('refresh.accountOrigination.domain.customer', function ($provide) {
            $provide.value('LookUps', {});
            $provide.value('BankService', {});
        });
    });

    beforeEach(inject(function (TemplateTest, Fixture, LookUps, BankService, mock, CustomerInformationData) {
        function PromiseLookUp(values) {
            return {
                promise: function () {
                    return mock.resolve(values);
                },
                values: function () {
                    return values;
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

        LookUps.title = new PromiseLookUp([{code: '1', description: 'aaa'}]);
        LookUps.country = new PromiseLookUp([{code: '2', description: 'bbb'}, {
            code: 'ZA',
            description: 'South Africa'
        }]);
        LookUps.maritalStatus = new PromiseLookUp([{code: '2', description: 'ddd'}]);
        LookUps.maritalType = new StaticLookUp([{code: '5', description: 'eee'}]);
        LookUps.gender = new StaticLookUp([{code: '1', description: 'Female'}]);
        LookUps.idType = new StaticLookUp([{code: '01', description: 'South African ID'}, {
            code: '06',
            description: 'Passport'
        }]);
        LookUps.permitType = new StaticLookUp([{code: '01', description: 'Some Permit'}]);
        LookUps.branch = new PromiseLookUp([{code: 1, description: 'BALLITO'}]);

        templateTestHelper = TemplateTest;
        scope = templateTestHelper.scope;
        scope.customerInformationData = CustomerInformationData.initialize({
            gender: '1',
            customerTitleCode: '1',
            maritalStatusCode: '2',
            maritalTypeCode: '5',
            branchCode: 1,
            identityDocuments: [{
                identityTypeCode: '01',
                identityNumber: '5309015231095',
                countryCode: 'ZA'
            }]
        });

        templateTestHelper.allowTemplate('common/sbform/partials/rowField.html');
        templateTestHelper.allowTemplate('common/typeahead/partials/typeahead.html');
        templateTestHelper.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
        templateTestHelper.allowTemplate('common/flow/partials/flow.html');
        var html = templateTestHelper.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/editBasicInformation.html'));
        element = templateTestHelper.compileTemplate('<form>' + html + '</form>');
    }));

    beforeEach(function () {
        scope.$digest();
    });

    it('should map branch code', function () {
        expectElementToMatch('.row-field[label="Your branch"]', /Ballito/);
    });

    describe('for notification message', function () {
        it('should always show notification message', function () {
            expectElementToMatch('#incompleteInfoNotification', /Please enter all the additional required information to complete your profile/);
        });

        it('should show as an error message if customer basic info has been validated', function () {
            scope.getValidationNotification = function () {
                return 'some message';
            };
            scope.$digest();
            expect(element.find('#incompleteInfoNotification').hasClass('error')).toBeTruthy();
            expect(element.find('#incompleteInfoNotification').hasClass('info')).toBeFalsy();
        });

        it('should show as an info message if customer basic info has not been validated yet', function () {
            expect(element.find('#incompleteInfoNotification').hasClass('info')).toBeTruthy();
            expect(element.find('#incompleteInfoNotification').hasClass('error')).toBeFalsy();
        });
    });

    describe('for customer with SA ID', function () {
        beforeEach(function () {
            scope.customerInformationData.identityDocuments = [{
                identityTypeCode: '01',
                identityNumber: '5309015231095',
                countryCode: 'ZA'
            }];
        });

        it('should not have passport-related fields', function () {
            expectElementIsNotExisting('#editPermitType');
            expectElementIsNotExisting('#editPermitNumber');
            expectElementIsNotExisting('#editPermitIssueDate');
            expectElementIsNotExisting('#editPermitExpiryDate');
        });

        it('should have country of birth', function () {
            expectElementIsAccessible('#editBirthCountry');
        });

        it('should have nationality and citizenship for non-SA citizen', function () {
            scope.customerInformationData.identityDocuments[0].identityNumber = '5309015231194';
            scope.$digest();
            expectElementIsAccessible('#editCitizenshipCountry');
            expectElementIsAccessible('#editNationalityCountry');
        });
    });

    describe('for customer with passport', function () {
        if (!feature.addBasicInformationAML) {
            beforeEach(function () {
                scope.customerInformationData.identityDocuments = [{
                    identityTypeCode: '06',
                    identityNumber: 'PASSPORT12',
                    countryCode: '2'
                }];
                scope.$digest();
            });

            it('should have passport-related fields', function () {
                expectElementIsAccessible('#editPermitType');
                expectElementIsAccessible('#editPermitNumber');
                expectElementIsAccessible('#editPermitIssueDate');
                expectElementIsAccessible('#editPermitExpiryDate');
            });

            it('should have nationality and citizenship for non-SA citizen', function () {
                expectElementIsAccessible('#editCitizenshipCountry');
                expectElementIsAccessible('#editNationalityCountry');
            });
        }
    });
});
