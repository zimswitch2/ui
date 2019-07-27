describe('customer information - employment template', function () {
    'use strict';

    var scope, element, CustomerInformationData;

    function expectElementToMatch(elementId, match) {
        expect(element.find(elementId).text()).toMatch(match);
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    beforeEach(module('refresh.filters', 'refresh.lookups', 'refresh.mapFilter', 'refresh.accountOrigination.domain.customer'));

    beforeEach(inject(function (TemplateTest, Fixture, ServiceTest, LookUps, _CustomerInformationData_) {
        ServiceTest.spyOnEndpoint('getOccupationIndustries');
        ServiceTest.stubResponse('getOccupationIndustries', 200, {
            'cccupIndustries': [
                {
                    'ocuiIndustyC': '05',
                    'ocuiEngDescX': 'CONSTRUCTION                                 ',
                    'ocuiAfrDescX': 'KONSTRUKSIE                                  '
                }
            ]
        });

        ServiceTest.spyOnEndpoint('getOccupationLevels');
        ServiceTest.stubResponse('getOccupationLevels', 200, {
            'occupLevels': [
                {
                    'oculLevelC': '01',
                    'oculEngDescX': 'DIRECTOR                                     ',
                    'oculAfrDescX': 'DIREKTEUR                                    '
                }
            ]
        });

        ServiceTest.spyOnEndpoint('getOccupationStatuses');
        ServiceTest.stubResponse('getOccupationStatuses', 200, {
            'occupStatus': [
                {
                    'ocusStatusC': '4',
                    'ocusEngDescX': 'CONTRACTOR                                   ',
                    'ocusAfrDescX': 'KONTRAKTEUR                                  '
                }
            ]
        });

        ServiceTest.spyOnEndpoint('getEducationQualifications');
        ServiceTest.stubResponse('getEducationQualifications', 200, {
            'education': [
                {
                    'terqQlfcnCodeN': 310,
                    'terqLevelN': 300,
                    'terqDescEngX': 'BTECH IN INTERNATIONAL COMMUNICATION         ',
                    'terqDescAfrX': 'BTECH IN INTERNASIONALE KOMMUNIKASIE         ',
                    'terqStudyTypeX': 'BTECH     '
                }
            ]
        });

        ServiceTest.spyOnEndpoint('getUnemploymentReasons');
        ServiceTest.stubResponse('getUnemploymentReasons', 200, {
            'occupUnempReasons': [
                {
                    'ocueReasnC': 'A',
                    'ocueEngDescX': 'Retrenched'
                }
            ]
        });

        ['occupationIndustry', 'occupationLevel', 'employmentType', 'levelOfEducation','unemploymentReason'].forEach(function(lookup){
            LookUps[lookup].values();
        });

        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/sbform/partials/rowField.html');
        var employmentTemplate = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/employment.html'));
        element = TemplateTest.compileTemplate(employmentTemplate);
        CustomerInformationData = _CustomerInformationData_;
    }));

    describe('when customer is employed', function () {
        var clock;

        afterEach(function () {
            clock.restore();
        });

        beforeEach(function () {
            clock = sinon.useFakeTimers(moment('2015-03-13').valueOf());

            scope.customerInformationData = CustomerInformationData.initialize({
                employmentDetails: [{
                    startDate: '2012-12-17T00:00:00.000+0000',
                    endDate: '9999-12-30T22:00:00.000+0000',
                    employerName: 'ZYX Restaurant',
                    occupationIndustryCode: '05',
                    occupationLevelCode: '01',
                    employmentStatusCode: '4'
                }],
                addressDetails: []
            });

            scope.$digest();
        });

        it('should show employment information', function () {
            expectElementToBeHidden('#previousEmployer');

            expectElementToMatch('#employer', /ZYX Restaurant/);
            expectElementToMatch('#startDate', /17 December 2012/);
            expectElementToMatch('#occupationIndustry', /Construction/);
            expectElementToMatch('#occupationLevel', /Director/);
            expectElementToMatch('#employmentType', /Contractor/);
        });
    });

    describe('when customer has previous employment details', function () {
        beforeEach(function () {
            scope.customerInformationData = CustomerInformationData.initialize({
                employmentDetails: [
                    {
                        startDate: '2014-12-17T00:00:00.000+0000',
                        endDate: '9999-12-30T22:00:00.000+0000',
                        employmentStatusCode: '4'

                    },
                    {
                        startDate: '2010-12-17T00:00:00.000+0000',
                        endDate: '2014-12-17T00:00:00.000+0000',
                        employerName: 'ABSA',
                        employmentStatusCode: '4'
                    }
                ],
                addressDetails: []
            });

            scope.$digest();
        });

        it('should show previous employer information', function () {
            expectElementToMatch('#previousEmployer', '');
            expectElementToMatch('#previousEmployerName', /ABSA/);
            expectElementToMatch('#startDatePreviousEmployer', /17 December 2010/);
            expectElementToMatch('#endDatePreviousEmployer', /17 December 2014/);
        });
    });

    describe('when customer is not employed', function () {
        it('should show unemployment reason given it is available', function () {
            scope.customerInformationData = CustomerInformationData.initialize({unemploymentReason: 'A'});
            scope.$digest();
            expectElementToMatch('#unemploymentReason', /Retrenched/);
            expectElementToBeHidden('#noEmployment');
        });

        it('should show no employment record if there is no unemployment reason', function () {
            scope.customerInformationData = CustomerInformationData.initialize({});
            scope.$digest();
            expectElementToMatch('#noEmployment', /No employment record/);
            expectElementToBeHidden('#unemploymentReason');
        });
    });

    describe('with qualification info', function () {
        it('should show education level if available', function () {
            scope.customerInformationData = CustomerInformationData.initialize({tertiaryQualificationCode: '310'});
            scope.$digest();
            expectElementToMatch('#levelOfEducation', /Btech in international communication/);
            expectElementToBeHidden('#noLevelOfEducation');
        });

        it('should not show education level if missing', function () {
            scope.customerInformationData = CustomerInformationData.initialize({});
            scope.$digest();
            expectElementToMatch('#noLevelOfEducation', /No details saved yet/);
            expectElementToBeHidden('#levelOfEducation');
        });
    });
});
