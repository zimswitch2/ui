describe('Rcp prescreen template', function () {
    'use strict';
    var scope, element, templateTest;

    beforeEach(inject(function (TemplateTest) {
        templateTest = TemplateTest;
        scope = TemplateTest.scope;


        element = templateTest.compileTemplateInFile('features/accountorigination/rcp/screens/prescreen/partials/rcpPreScreen.html');

        scope.next = function () {

        };

        scope.$digest();
    }));

    describe('next button', function () {
        var nextButton;
        beforeEach(function () {
            nextButton = element.find('#next');

        });
        it('should be disabled when fraud check is not accepted', function () {
            expect(nextButton.attr('disabled')).toBeTruthy();
        });

        it('should be enabled when fraud check is accepted', function () {
            scope.preScreen = {creditAndFraudCheckConsent: true};
            scope.$digest();
            expect(nextButton.attr('disabled')).toBeFalsy();
        });

        it('should track analytics', function () {
            expect(nextButton.attr('track-click')).toBe('Apply.RCP.Prescreen.Next');
        });

        it('should continue with RCP application if showCannotProceedModal is false', function () {
            scope.showCannotProceedModal = false;
            scope.$digest();
            spyOn(scope, ['next']);
            nextButton.click();
            expect(scope.next).toHaveBeenCalled();
            expect(element.find('.modal-overlay')).toBeHidden();

        });

        it('should pop up with debt review error when answered yes and showCannotProceedModal is true', function () {
            scope.preScreen = {
                debtReview: true
            };

            scope.showCannotProceedModal = true;
            scope.$digest();
            spyOn(scope, ['next']);
            nextButton.click();
            expect(scope.next).toHaveBeenCalled();
            expect(element.find('.modal-content').text()).toContain('You are under debt review');

        });
        it('should pop up with insolvent error when answered yes and showCannotProceedModal is true', function () {
            scope.preScreen = {
                insolvent: true,
                creditAndFraudCheckConsent: true

            };

            scope.showCannotProceedModal = true;
            scope.$digest();
            spyOn(scope, ['next']);
            nextButton.click();
            expect(scope.next).toHaveBeenCalled();
            expect(element.find('.modal-content').text()).toContain('You are currently insolvent');

        });
        it('should pop up with sequestration error when answered yes and showCannotProceedModal is true', function () {
            scope.preScreen = {
                sequestration: true,
                creditAndFraudCheckConsent: true
            };

            scope.showCannotProceedModal = true;
            scope.$digest();
            spyOn(scope, ['next']);
            nextButton.click();
            expect(scope.next).toHaveBeenCalled();
            expect(element.find('.modal-content').text()).toContain('You are under sequestration');

        });


    });

    describe('close button', function () {
        var closeButton;
        beforeEach(function () {
            closeButton = element.find('#closeModal');
        });
        it('should track analytics', function () {
            scope.showCannotProceedModal = true;
            scope.$digest();
            expect(closeButton.attr('track-click')).toBe('Apply.RCP.Prescreen.CannotOfferAnAccount.Close');
        });

        it('should close pop modal on click', function () {
            scope.showCannotProceedModal = true;
            scope.$digest();
            expect(element.find('.modal-overlay')).not.toBeHidden();
            closeButton.click();
            expect(element.find('.modal-overlay')).toBeHidden();
        });
    });
});