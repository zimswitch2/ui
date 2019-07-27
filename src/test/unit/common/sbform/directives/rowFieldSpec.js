describe('rowField directive', function () {
    'use strict';

    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));

    var test;

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        _TemplateTest_.allowTemplate('common/sbform/partials/rowField.html');
    }));

    it('should replace row-field tag with same id', function () {
        var rowField = '<div><row-field id="field-id-x"/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('row-field').length).toEqual(0);
        expect(document.find('li').attr('id')).toEqual('field-id-x');
    });

    it('should not show field-label if label attribute is not present', function () {
        var rowField = '<div><row-field/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.field-label').length).toEqual(0);
    });

    it('should show field-label with label text if label attribute is present', function () {
        var rowField = '<div><row-field label="My label"/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.field-label').length).toEqual(1);
    });

    it('should not show tooltip if tooltip attribute is not present', function () {
        var rowField = '<div><row-field label="My label"/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.sb-tooltip').length).toEqual(0);
    });

    it('should show tooltip if tooltip attribute is present', function () {
        var rowField = '<div><row-field label="My label" tooltip="My tooltip"/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.sb-tooltip').length).toEqual(1);
        expect(document.find('.sb-tooltip').attr('name')).toEqual('My tooltip');
    });

    it('should show label and hide span when label-for attribute is present', function () {
        var rowField = '<div><row-field label="My label" label-for="my-input-id"/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.field-label span')).toBeHidden();
        expect(document.find('.field-label label')).not.toBeHidden();
        expect(document.find('.field-label label').attr('for')).toEqual('my-input-id');
        expect(document.find('.field-label label').text()).toEqual('My label');
    });

    it('should show span and hide label when label-for attribute is not present', function () {
        var rowField = '<div><row-field label="My label"/></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.field-label label')).toBeHidden();
        expect(document.find('.field-label span')).not.toBeHidden();
        expect(document.find('.field-label span').text()).toEqual('My label');
    });

    it('should transclude directive content inside field-value', function () {
        var rowField = '<div><row-field>Content</row-field></div>';
        var document = test.compileTemplate(rowField);

        expect(document.find('.field-value').text()).toMatch('Content');
    });
});
