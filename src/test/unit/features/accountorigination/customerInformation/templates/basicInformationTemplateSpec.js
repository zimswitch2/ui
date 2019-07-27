describe('customer information - basic information template', function () {
    'use strict';

    beforeEach(module('refresh.filters', 'refresh.lookups', 'refresh.mapFilter', 'refresh.rowField', 'refresh.accountOrigination.domain.customer'));

    var scope, element, CustomerInformationData;

    function expectElementToMatch(selector, match) {
        expect(element.find(selector).text()).toMatch(match);
        expect(element.find(selector).hasClass('ng-hide')).toBeFalsy();
    }

    function expectElementToBeHidden(selector) {
        expect(element.find(selector).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementToBeShown(selector) {
        expect(element.find(selector).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(inject(function (TemplateTest, Fixture, ServiceTest, LookUps, _CustomerInformationData_) {
        ServiceTest.spyOnEndpoint('getCountries');
        ServiceTest.stubResponse('getCountries', 200, {
            countries: [
                {cnrySwiftCode: 'ZA', cnryEngX: 'SOUTH AFRICA'}
            ]
        });

        ServiceTest.spyOnEndpoint('getMaritalStatuses');
        ServiceTest.stubResponse('getMaritalStatuses', 200, {
            maritalStatus: [
                {mrtalSttusC: '2', 'mrtalEngDescX': 'MARRIED'}
            ]
        });

        ServiceTest.spyOnEndpoint('getTitles');
        ServiceTest.stubResponse('getTitles', 200, {
            titles: [
                {title: '040', engX: 'MR'}
            ]
        });

        ServiceTest.spyOnEndpoint('getContactTypes');
        ServiceTest.stubResponse('getContactTypes', 200, {
            SapCommunicationType: [
                {ndsTypeCode: '01 ', typeCode: '01', description: 'Telephone'}
            ]
        });

        ServiceTest.spyOnEndpoint('walkInBranches');
        ServiceTest.stubResponse('walkInBranches', 200, {
            branches: [
                {code: '123', name: 'BALLITO'}
            ]
        });

        ['title', 'country', 'maritalStatus', 'contactType', 'branch'].forEach(function(lookup){
            LookUps[lookup].values();
        });

        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/sbform/partials/rowField.html');
        var basicHtml = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/basicInformation.html'));
        var contactHtml = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/contactInformation.html'));
        element = TemplateTest.compileTemplate(basicHtml + contactHtml);
        CustomerInformationData = _CustomerInformationData_;
    }));

    describe('with all fields', function () {
        beforeEach(function () {
            scope.customerInformationData = CustomerInformationData.initialize({
                customerTitleCode: '040',
                customerInitials: 'TV',
                customerFirstName: 'TYLER',
                customerSurname: 'COOK',
                identityDocuments: [
                    {
                        identityTypeCode: '01',
                        identityNumber: '******1088',
                        countryCode: 'ZA'
                    },
                    {
                        identityTypeCode: '06',
                        identityNumber: '******463',
                        countryCode: 'ZA'
                    }
                ],
                residenceCountryCode: 'ZA',
                citizenshipCountryCode: 'ZA',
                dateOfBirth: '1975-10-22T14:29:27.709+0000',
                gender: '1',
                maritalStatusCode: '2',
                maritalTypeCode: 'W',
                methodOfCommunication: '09',
                preferredLanguageCode: 'EN',
                branchCode: 123,
                communicationInformation: [
                    {
                        communicationDetails: '******1124',
                        communicationTypeCode: '01',
                        communicationTypeDescription: 'Telephone'
                    }
                ]
            });
            scope.$digest();
        });

        it('should show all fields', function () {
            expectElementToMatch('.row-field[label="Title"]', /Mr/);
            expectElementToMatch('.row-field[label="Initials"]', /TV/);
            expectElementToMatch('.row-field[label="First names"]', /Tyler/);
            expectElementToMatch('.row-field[label="Surname"]', /Cook/);
            expectElementToMatch('.row-field[label="ID number"]', /\*\*\*\*\*\*1088/);
            expectElementToMatch('.row-field[label="Date of birth"]', /22 October 1975/);
            expectElementToMatch('.row-field[label="Passport"]', /\*\*\*\*\*\*463/);
            expectElementToMatch('.row-field[label="Passport origin"]', /South Africa/);
            expectElementToMatch('.row-field[label="Country of citizenship"]', /South Africa/);
            expectElementToMatch('.row-field[label="Gender"]', /Male/);
            expectElementToMatch('.row-field[label="Marital status"]', /Married/);
            expectElementToMatch('.row-field[label="Marital type"]', /Common law spouse/);
            expectElementToMatch('.row-field[label="Preferred communication language"]', /English/);
            expectElementToMatch('.row-field[label="Your branch"]', /Ballito/);
            expectElementToMatch('.row-field[label="Telephone"]', /\*\*\*\*\*\*1124/);
        });
    });

    describe('with no optional fields', function () {
        beforeEach(function () {
            scope.customerInformationData = CustomerInformationData.initialize({
                customerTitleCode: '040',
                customerInitials: 'TV',
                customerFirstName: 'TYLER',
                customerSurname: 'COOK',
                residenceCountryCode: 'ZA',
                citizenshipCountryCode: 'ZA',
                nationalityCountryCode: 'ZA',
                birthCountryCode: 'AL',
                dateOfBirth: '1975-10-22T14:29:27.709+0000',
                gender: '1',
                maritalStatusCode: '1',
                maritalTypeCode: 'W',
                methodOfCommunication: '09',
                preferredLanguageCode: 'EN',
                branchCode: 1,
                communicationInformation: [
                    {
                        communicationDetails: 'Jag******bank.co',
                        communicationTypeCode: '04',
                        communicationTypeDescription: 'E-mail address'
                    },
                    {
                        communicationDetails: '******541',
                        communicationTypeCode: '01',
                        communicationTypeDescription: 'Voice'
                    },
                    {
                        communicationDetails: '******1124',
                        communicationTypeCode: '02',
                        communicationTypeDescription: 'Sms'
                    }
                ]
            });
            scope.$digest();
        });

        it('should not show optional fields', function () {
            expectElementToBeHidden('.row-field[label="ID number"]');
            expectElementToBeHidden('.row-field[label="Passport"]');
            expectElementToBeHidden('.row-field[label="Passport origin"]');
            expectElementToBeHidden('.row-field[label="Marital type"]');
        });
    });

    describe('when customer information is complete', function () {
        it('should not show modify button', function () {
            expectElementToBeHidden('.editActions');
        });
    });

    describe('when customer information is incomplete', function () {
        beforeEach(function () {
            scope.customerInformationData = CustomerInformationData.initialize({
                customerTitleCode: '040',
                customerInitials: 'TV',
                customerFirstName: 'TYLER',
                customerSurname: 'COOK',
                residenceCountryCode: 'ZA',
                dateOfBirth: '1975-10-22T14:29:27.709+0000',
                gender: '1',
                maritalStatusCode: '1',
                maritalTypeCode: 'W',
                methodOfCommunication: '09',
                preferredLanguageCode: 'EN',
                branchCode: 1,
                communicationInformation: [
                    {
                        communicationDetails: '******541',
                        communicationTypeCode: '01',
                        communicationTypeDescription: 'Voice'
                    }
                ]
            });

            scope.$digest();
        });

        it('should show modify button', function () {
            expectElementToBeShown('.editActions');
        });
    });
});
