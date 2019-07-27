describe('customer information - edit employment template', function () {
    'use strict';

    var scope, element, test, fixture, CustomerInformationData;

    function expectElementToBeHidden(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    function expectElementIsExisting(elementId) {
        expect(element.find(elementId).length).toEqual(1);
    }

    function expectElementIsNotExisting(elementId) {
        expect(element.find(elementId).length).toEqual(0);
    }


    function compileTemplate() {
        test.allowTemplate('common/sbform/partials/rowField.html');
        test.allowTemplate('common/sbform/partials/sbTextInput.html');
        test.allowTemplate('common/flow/partials/flow.html');
        test.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
        test.allowTemplate('features/accountorigination/customerInformation/partials/existingCustomerModal.html');
        test.allowTemplate('features/accountorigination/customerInformation/directive/partials/customerInformationNavigation.html');
        var editEmployment = test.addRootNodeToDocument(fixture.load('base/main/features/accountorigination/customerInformation/partials/editEmployment.html'));
        return test.compileTemplate('<form>' + editEmployment + '</form>');
    }

    var clock;

    afterEach(function () {
        clock.restore();
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('LookUps', {});
        });
        clock = sinon.useFakeTimers(moment('2015-03-13').valueOf());
    });

    beforeEach(module('refresh.filters', 'refresh.mapFilter', 'refresh.accountOrigination.customerInformation.edit.employment',
        'refresh.accountOrigination.domain.customer', 'refresh.rowField', 'refresh.sbInput'));

    beforeEach(inject(function (TemplateTest, Fixture, LookUps, mock, _CustomerInformationData_) {
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

        LookUps.occupationIndustry = new PromiseLookUp([{code: 1, description: 'aaa'}]);
        LookUps.occupationLevel = new PromiseLookUp([{code: 2, description: 'bbb'}]);
        LookUps.employmentType = new PromiseLookUp([{code: 3, description: 'ccc'}]);
        LookUps.unemploymentReason = new PromiseLookUp([{code: 'A', description: 'Retrenched'}]);
        LookUps.levelOfEducation = new PromiseLookUp([
            {code: 4, description: 'ddd', category: 'eee'}
        ]);

        scope = TemplateTest.scope;
        scope.LogoutController = function () {};
        CustomerInformationData = _CustomerInformationData_;
        scope.customerInformationData = CustomerInformationData.initialize({});
        test = TemplateTest;
        fixture = Fixture;
    }));

    describe('when adding employment', function () {
        beforeEach(function () {
            scope.isAdding = true;
            scope.isEmployed = true;
            element = compileTemplate();
        });

        it('should show employment information', function () {
            expectElementToBeHidden("[label='Employed *']");

            expectElementIsExisting('#editQualificationLevel');
            expectElementIsExisting('#editQualificationType');
            expectElementIsExisting('#editEmployerName');
            expectElementIsExisting('#editEmploymentStartDate');
            expectElementIsExisting('#editOccupationIndustry');
            expectElementIsExisting('#editOccupationLevel');
            expectElementIsExisting('#editEmploymentType');

        });

        it('should show previous employment when customer already has employment details', function () {
            scope.needPreviousEmployment = function () {
                return true;
            };
            element = compileTemplate();

            expectElementIsExisting('#editPreviousEmployerName');
            expectElementIsExisting('#editPreviousStartDate');
            expectElementIsExisting('#editPreviousEndDate');
            expectElementIsExisting('#editPreviousOccupationIndustry');
            expectElementIsExisting('#editPreviousOccupationLevel');
            expectElementIsExisting('#editPreviousEmploymentType');
        });
    });

    describe('when modifying current employment', function () {
        it('should only show current employment details when customer is employed', function () {
            scope.isEmployed = true;
            element = compileTemplate();
            expectElementIsExisting('#editEmployerName');
            expectElementIsNotExisting('#editPreviousEmployerName');
            expectElementIsNotExisting('#editPreviousStartDate');
            expectElementIsNotExisting('#editPreviousEndDate');
        });

        it('should show previous employment details when customer is no longer employed', function () {
            scope.isEmployed = false;
            scope.needPreviousEmployment = function () {
                return true;
            };

            element = compileTemplate();

            expectElementIsNotExisting('#editEmployerName');
            expectElementIsExisting('#editPreviousEmployerName');
            expectElementIsExisting('#editPreviousStartDate');
            expectElementIsExisting('#editPreviousEndDate');
        });

        it('should not show employment sections when customer has no employment record', function () {
            scope.customerInformationData = CustomerInformationData.initialize({});
            scope.isEmployed = false;
            element = compileTemplate();

            expectElementIsExisting('#editQualificationLevel');
            expectElementIsExisting('#editQualificationType');

            expectElementIsNotExisting('#editEmployerName');
            expectElementIsNotExisting('#editPreviousEmployerName');
        });
    });
});
