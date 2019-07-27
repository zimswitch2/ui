describe('onFocus', function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var scope, timeout, inputElement;

    beforeEach(inject(function (_TemplateTest_, $timeout) {
        scope = _TemplateTest_.scope;
        timeout = $timeout;

        _TemplateTest_.allowTemplate('common/sbform/partials/sbTextInput.html');

        /*jslint browser:true */
        var form = "<form name='theForm'><sb-input ng-model='model' name='myPrecious' focus-on></sb-input></form>";
        var element = _TemplateTest_.compileTemplate(form);
        element.appendTo(document.body);
        inputElement = element.find('#myPrecious');
    }));

    it("should focus the element", function () {
        timeout.flush();
        expect(document.activeElement.id).toBe('myPrecious');
    });

    it('should focus on element when spinner is de-activated', function () {
        scope.$root.$broadcast('spinnerInactive');
        timeout.flush();
        expect(document.activeElement.id).toBe('myPrecious');
    });

});
