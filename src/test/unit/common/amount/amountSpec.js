describe('sbAmount', function () {
    beforeEach(module('refresh.amount'));
    var test, timeout;

    beforeEach(inject(function (_TemplateTest_, $timeout) {
        test = _TemplateTest_;
        timeout = $timeout;
        test.allowTemplate('common/amount/partials/amount.html');
    }));

    it('should have a placeholder if specified', function () {
        var document = test.compileTemplate('<sb-amount placeholder="4"></sb-amount>');
        expect(document.find('input').attr('placeholder')).toEqual('4');
    });

    it('should have a placeholder even if the specified placeholder is 0', function () {
        var document = test.compileTemplate('<sb-amount placeholder="0"></sb-amount>');
        expect(document.find('input').attr('placeholder')).toEqual('0');
    });

    it('should default the placeholder to 0.00', function () {
        var document = test.compileTemplate('<sb-amount></sb-amount>');
        expect(document.find('input').attr('placeholder')).toEqual('0.00');
    });

    it('should copy attributes to input', function () {
        var document = test.compileTemplate('<sb-amount foo="bar"></sb-amount>');
        expect(document.find('input').attr('foo')).toEqual('bar');
    });

    it('should not copy default attributes to input', function () {
        var document = test.compileTemplate('<sb-amount type="number"></sb-amount>');
        expect(document.find('input').attr('type')).toEqual('tel');
    });

    it('should add label', function () {
        var document = test.compileTemplate('<sb-amount label="foo"></sb-amount>');
        expect(document.find('label').text()).toEqual('foo');
    });

    it('should not add label', function () {
        var document = test.compileTemplate('<sb-amount></sb-amount>');
        expect(document.find('label').length).toEqual(0);
    });

    it('should disable input', function () {
        var document = test.compileTemplate('<sb-amount ng-disabled="true"></sb-amount>');
        expect(document.find('input').attr('disabled')).toEqual('disabled');
    });

    it('should not disable input', function () {
        var document = test.compileTemplate('<sb-amount ng-disabled="false"></sb-amount>');
        expect(document.find('input').attr('disabled')).toBeUndefined();
    });

    it('should invoke timeoutChange onChange', function () {
        var onChangeMethod = jasmine.any(Function);
        var element = test.compileTemplate('<sb-amount ng-model="ngModel" ng-change="onChangeMethod()"></sb-amount>');
        var inputElement = element.find('input');
        var directiveScope = element.isolateScope();

        spyOn(directiveScope, 'timeoutChange').and.callThrough();
        inputElement.val('22');
        inputElement.trigger('input');
        timeout.flush();
        expect(directiveScope.timeoutChange).toHaveBeenCalledWith(onChangeMethod);
    });
});
