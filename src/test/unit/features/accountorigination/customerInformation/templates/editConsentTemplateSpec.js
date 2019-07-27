describe('customer information - edit consent template', function () {
    'use strict';

    var scope, element;

    function expectElementIsExisting(elementId) {
        expect(element.find(elementId).length).toEqual(1);
    }

    function expectElementToBeInvisible(elementId) {
        expect(element.find(elementId).hasClass('ng-hide')).toBeTruthy();
    }

    beforeEach(module('refresh.accountOrigination.customerInformation.edit.consent', 'refresh.accountOrigination.domain.customer'));

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('LookUps', {});
        });
    });

    beforeEach(inject(function (TemplateTest, Fixture, LookUps, CustomerInformationData) {
        function StaticLookUp(staticValues) {
            return {
                values: function () {
                    return staticValues;
                }
            };
        }

        scope = TemplateTest.scope;
        scope.consents = [{code: '03', description: "Contact you about Standard Bank products, services and special offers."},
            {
                code: '01',
                description: "Contact you about other companies' products, services and special offers. If you agree, you may be contacted by these companies."
            },
            {
                code: '04',
                description: "Share your personal information within the Group for marketing purposes."
            },
            {
                code: '02',
                description: "Contact you for research purposes. Your personal information is confidential under a strict code of conduct."
            }];

        CustomerInformationData.initialize({
            consentClauses: []
        });

        scope.LogoutController = function (){};

        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        TemplateTest.allowTemplate('features/accountorigination/common/directives/partials/cancelConfirmation.html');
        TemplateTest.allowTemplate('features/accountorigination/customerInformation/partials/existingCustomerModal.html');
        TemplateTest.allowTemplate('features/accountorigination/customerInformation/directive/partials/customerInformationNavigation.html');
        TemplateTest.allowTemplate('common/sbform/partials/rowField.html');

        var editConsent = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/customerInformation/partials/editConsent.html'));
        element = TemplateTest.compileTemplate('<form>' + editConsent + '</form>');
    }));

    it('should have all the marketing preferences', function () {
        expectElementIsExisting('#edit-consent-01');
        expectElementIsExisting('#edit-consent-02');
        expectElementIsExisting('#edit-consent-03');
        expectElementIsExisting('#edit-consent-04');
    });
});
