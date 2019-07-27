describe('preScreening template', function () {
    'use strict';

    var element, scope;

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('common/flow/partials/flow.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/accountorigination/currentaccount/screens/prescreening/partials/prescreening.html'));
        element = TemplateTest.compileTemplate(html);
    }));

    it('should show all questions if new application', function () {
        scope.isNewApplication = function () { return true; };
        scope.$digest();

        expect(element.find('#debtReviewQuestion')).not.toBeHidden();
        expect(element.find('#sequestrationQuestion')).not.toBeHidden();
        expect(element.find('#insolventQuestion')).not.toBeHidden();
        expect(element.find('#creditAndFraudCheckQuestion')).not.toBeHidden();
    });

    it('should show only debt review if pending application', function () {
        scope.isNewApplication = function () { return false; };
        scope.$digest();

        expect(element.find('#debtReviewQuestion')).not.toBeHidden();
        expect(element.find('#sequestrationQuestion')).toBeHidden();
        expect(element.find('#insolventQuestion')).toBeHidden();
        expect(element.find('#creditAndFraudCheckQuestion')).toBeHidden();
    });

    it('should have the correct heading text', function(){
        var testHeading = 'test_heading';
        scope.headingText = function () {
            return testHeading;
        };
        scope.$digest();

        expect(element.find('#prescreen-heading').text()).toEqual(testHeading);
    });

    it('should enable next button on creditAndFraudCheckConsent', function () {
        scope.preScreening = {
            creditAndFraudCheckConsent: true
        };
        scope.$digest();

        expect(element.find('#confirm').attr('disabled')).toBeFalsy();
    });

    it('should disable next button on creditAndFraudCheckConsent set to false', function () {
        scope.preScreening = {
            creditAndFraudCheckConsent: false
        };
        scope.$digest();

        expect(element.find('#confirm').attr('disabled')).toBeTruthy();
    });

    it('should show error details when insolvent', function () {
        scope.preScreening = {
            insolvent: true,
            sequestration: false
        };
        scope.showCannotProceedModal = true;
        scope.$digest();

        expect(element.find('.modal-overlay')).not.toBeHidden();
        expect(element.find('#insolvent-error').text()).toMatch('You are currently insolvent');
        expect(element.find('#insolvent-error')).not.toBeHidden();

        expect(element.find('#sequestration-error')).toBeHidden();
    });

    it('should show error details when under sequestration', function () {
        scope.preScreening = {
            insolvent: false,
            sequestration: true
        };
        scope.showCannotProceedModal = true;
        scope.$digest();

        expect(element.find('.modal-overlay')).not.toBeHidden();
        expect(element.find('#insolvent-error')).toBeHidden();

        expect(element.find('#sequestration-error').text()).toMatch('You are currently under sequestration');
        expect(element.find('#sequestration-error')).not.toBeHidden();
    });

    it('should hide error details when close is clicked', function () {
        scope.preScreening = {
            insolvent: false,
            sequestration: true
        };
        scope.showCannotProceedModal = true;
        scope.$digest();

        element.find('#closeModal').click();

        expect(scope.showCannotProceedModal).toBeFalsy();
        expect(element.find('.modal-overlay')).toBeHidden();
    });
});