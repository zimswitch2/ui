describe('registration template', function () {
    'use strict';

    var scope, element;

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/registration/partials/register.html'));
        element = TemplateTest.compileTemplate(html);
    }));

    describe('cancel button', function () {
        it('should have "Cancel" as its text if no errorMessage', function () {
            scope.$digest();

            expect(element.find('.button').text()).toEqual('Cancel');
        });

        it('should have "Back to sing-in" as its text if errorMessage', function () {
            scope.errorMessage = "Some error";
            scope.$digest();

            expect(element.find('.button').text()).toEqual('Back to sign-in');
        });
    });
});