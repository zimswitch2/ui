describe('statement template', function () {
    'use strict';

    beforeEach(module('refresh.filters', 'refresh.statements'));

    var scope, statementPage;

    beforeEach(inject(function (TemplateTest, Fixture) {
        scope = TemplateTest.scope;
        TemplateTest.allowTemplate('features/statements/partials/statementPrintHeader.html');
        TemplateTest.allowTemplate('common/print/partials/printFooter.html');
        var html = TemplateTest.addRootNodeToDocument(Fixture.load('base/main/features/statements/partials/statement.html'));
        statementPage = TemplateTest.compileTemplate(html);
    }));

    describe('download statement', function () {

        it('should call the downloadPdf function when the download button is clicked', function () {
            scope.downloadPdf = jasmine.createSpy('downloadPdf');
            statementPage.find('#download').click();
            expect(scope.downloadPdf).toHaveBeenCalled();
        });

        it('should not show the download button on mobile devices', inject(function ($rootScope) {
            $rootScope.isMobileDevice = true;
            scope.$digest();
            expect(statementPage.find('button#download').length).toBe(0);
        }));

        it('should show the download button on desktops', function () {
            expect(statementPage.find('button#download').length).toBe(1);
        });

        it("should track download click", function () {
            expect(statementPage.find('button#download').attr('track-click')).toBe('Statement.PDFformat.download');
        });

        it('should not display update browser module', function () {
            statementPage.find('#download').click();
            expect(scope.isOldIE).toBeFalsy();
        });
    });
});
