describe('beneficiaries list directive', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries.directives.beneficiariesList'));

    var element;

    beforeEach(inject(function (_TemplateTest_) {
        element = _TemplateTest_.compileTemplate('<beneficiaries-list />', false);
    }));

    // TODO these tests are doing nothing. need to fix and add coverage
    it('should have a table', function () {
        expect(element.find('table')).toBeDefined();
    });
});
