describe('customer information - consent template', function () {
    'use strict';

    var scope, element;

    function expectElementToBeVisible(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeFalsy();
    }

    beforeEach(module('refresh.accountOrigination.domain.customer'));

    beforeEach(inject(function (TemplateTest, Fixture, _CustomerInformationData_) {
        scope = TemplateTest.scope;
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/consent.html'));
        TemplateTest.allowTemplate('common/sbform/partials/rowField.html');
        element = TemplateTest.compileTemplate(html);

        scope.customerInformationData = _CustomerInformationData_.initialize({
            consentClauses: [
                {consentCode: '01', consentFlag: true}
            ]
        });
        scope.$digest();
    }));

    it('should show the marketing preferences', function () {
        expectElementToBeVisible('#view-consent');
    });

    it('should show "Modify marketing options" button', function () {
        expectElementToBeVisible('#edit-consent-button');
    });

    it('should show get offer buttons', function () {
       expectElementToBeVisible('#submit');
       expectElementToBeVisible('#cancel');
    });
});