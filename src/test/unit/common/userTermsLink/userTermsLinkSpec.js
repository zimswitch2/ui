describe('Unit Test - User term and condition link', function () {
    'use strict';

    beforeEach(module('refresh.userTermsLink', 'refresh.test'));

    var document;
    beforeEach(inject(function (_TemplateTest_) {
        document = _TemplateTest_.compileTemplate('<div><user-terms-link>something inside</user-terms-link></div>');
    }));

    describe('replace with tag a', function () {
        var a;
        beforeEach(function () {
            a = document.find('.user-terms-link');
        });

        it('should be able to be found by the class user-terms-link', function () {
            expect(a).not.toBeNull();
        });

        it('should has _blank as target', function () {
            expect(a.attr('target')).toBe('_blank');
        });

        it('should has right link as href ', function () {
            expect(a.attr('href')).toBe('https://www.standardbank.co.za/standimg/South%20Africa/Personal/PDFs%28Personal%29/T&C%20Electronic%20Banking%20agreement.pdf');
        });

        it('should tracks click with right token', function () {
            expect(a.attr('track-click')).toBe('View Terms and Conditions.view');
        });

        it('should replaces content with transclude text', function () {
            expect(a.text()).toBe('something inside');
        });
    });
});
