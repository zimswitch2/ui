describe('beneficiaries table directive', function () {
    'use strict';

    beforeEach(module('refresh.beneficiaries'));

    var element;

    beforeEach(inject(function (_TemplateTest_) {
        element = _TemplateTest_.compileTemplate('<beneficiaries-table />', false);
    }));

    // TODO these tests are doing nothing. need to fix and add coverage
    it('should have a table', function () {
        expect(element.find('table')).toBeDefined();
    });
});
