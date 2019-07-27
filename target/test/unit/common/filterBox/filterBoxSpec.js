describe('filterBox', function () {
    'use strict';
    beforeEach(module('refresh.filterBox','refresh.test'));

    var test, scope;

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        scope = test.scope;
        _TemplateTest_.allowTemplate('common/filterbox/partials/filterBox.html');
    }));

    describe('input field', function() {
        function compile(template) {
            var document = test.compileTemplate(template);
            return document.find('input');
        }

        it('should be present', function () {
            var template = "<filter-box ng-model='query'></filter-box>";
            var inputField = compile(template);
            test.changeInputValueTo(inputField, 'blah');

            expect(scope.query).toEqual('blah');
        });

        it('should have placeholder', function () {
            var template = "<filter-box ng-model='query' placeholder='Search'></filter-box>";
            var inputField = compile(template);

            expect(inputField.attr('placeholder')).toEqual('Search');
        });
    });

    describe('search icon', function () {
        it('should be present', function () {
            var template = "<filter-box ng-model='query'></filter-box>";
            var document = test.compileTemplate(template);
            var icon = document.find('.icomoon-search');

            expect(icon.length).toEqual(1);
        });
    });

    describe('close icon', function () {
        function compile(template) {
            var document = test.compileTemplate(template);
            return document.find('.icomoon-close');
        }

        it('should be present', function () {
            var template = "<filter-box ng-model='query'></filter-box>";
            var icon = compile(template);
            expect(icon.length).toEqual(1);
        });

        it('should be shown only when a query is specified', function () {
            var template = "<filter-box ng-model='query'></filter-box>";
            var document = test.compileTemplate(template);
            var icon = document.find('.icomoon-close');

            expect(icon.hasClass('ng-hide')).toEqual(true);

            var inputField = document.find('input');
            test.changeInputValueTo(inputField, 'value');

            expect(icon.hasClass('ng-hide')).toEqual(false);
        });

        it('should reset the filter query to an empty string when clicked', function(){
            scope.query = 'a query';
            var template = "<filter-box ng-model='query'></filter-box>";
            var icon = compile(template);
            icon.click();

            expect(scope.query).toEqual('');
        });
    });

});
