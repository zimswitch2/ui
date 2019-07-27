describe('select in ie', function () {
    beforeEach(module('refresh.sbForm', 'refresh.test'));
    var test, timeout;

    beforeEach(inject(function (_TemplateTest_, $timeout) {
        test = _TemplateTest_;
        timeout = $timeout;
    }));

    describe('fixIeSelect directive', function () {
        it("should not change visibility and width", function () {
            var select = '<select fix-ie-select ng-model="model"><option value="1" selected="selected">a</option><option value="2">b</option></select>';
            var element = test.compileTemplate(select);
            var width = element.width();

            element.trigger('change');

            expect(element.css('display')).not.toEqual('none');
            expect(element.width()).toEqual(width);
        });
    });

    describe('configuration.js', function () {
        it("should not change text", function () {
            var select = '<select ng-model="model"><option value="1" selected="selected">a</option><option value="2">b</option></select>';
            var element = test.compileTemplate(select);
            $('body').append(element);
            var text = $('select>option[value=1]').text();

            element.trigger('change');
            test.scope.fixIeDynamicOption();
            timeout.flush();

            expect($('select>option[value=1]').text()).toEqual(text);
        });
    });
});
