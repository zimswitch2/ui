describe("currency input field", function (amount) {
    var form, element, inputElement, scope, timeout, test;
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));

    beforeEach(inject(function (_TemplateTest_, $timeout) {
        test = _TemplateTest_;
        scope = _TemplateTest_.scope;
        timeout = $timeout;

        _TemplateTest_.allowTemplate('common/sbform/partials/sbTextInput.html');

        form = "<form name='theForm'><input name='amount' ng-model='amount' currency-field /></form>";
        element = test.compileTemplate(form);
        inputElement = element.find('input');
    }));

    it('should allow blank', function () {
        form = "<form name='theForm'><input name='amount' ng-model='amount' currency-field allow-blank/></form>";
        element = test.compileTemplate(form);
        expect(scope.allowBlank).toBeTruthy();
    });

    describe('input prevention', function () {
        var event;

        beforeEach(function () {
            event = $.Event("keydown");

            spyOn(event, ['preventDefault']);
            spyOn(event, ['stopPropagation']);
        });

        describe('with keyCode', function () {
            it('should allow digits and navigation keys', function () {
                event.keyCode = 190;
                inputElement.trigger(event);

                expect(event.preventDefault).not.toHaveBeenCalled();
                expect(event.stopPropagation).not.toHaveBeenCalled();
            });

            it('should not allow characters, special chars etc.', function () {
                event.keyCode = 15;
                inputElement.trigger(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect(event.stopPropagation).toHaveBeenCalled();
            });
        });

        describe('with which', function () {
            it('should allow digits and navigation keys', function () {
                event.which = 190;
                inputElement.trigger(event);

                expect(event.preventDefault).not.toHaveBeenCalled();
                expect(event.stopPropagation).not.toHaveBeenCalled();
            });

            it('should not allow characters, special chars etc.', function () {
                event.which = 15;
                inputElement.trigger(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect(event.stopPropagation).toHaveBeenCalled();
            });
        });

        describe('with no-decimal', function () {
            it('should not allow period when no-decimal attribute has been set on the currency field', function () {
                var input = "<input name='amount' ng-model='amount' currency-field no-decimal/>";
                inputElement = test.compileTemplate(input);

                event.keyCode = 190;
                inputElement.trigger(event);

                expect(event.preventDefault).toHaveBeenCalled();
                expect(event.stopPropagation).toHaveBeenCalled();
            });

            it('should  allow period when no-decimal attribute has not been set on the currency field', function () {
                var input = "<input name='amount' ng-model='amount' currency-field/>";
                inputElement = test.compileTemplate(input);

                event.keyCode = 190;
                inputElement.trigger(event);

                expect(event.preventDefault).not.toHaveBeenCalled();
                expect(event.stopPropagation).not.toHaveBeenCalled();
            });
        });
    });

    it("should set the model to invalid if the value is 0 and dirty", function () {
        inputElement.val('0');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeTruthy();
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
        expect(inputElement.controller('ngModel').$viewValue).toEqual('0');
        expect(inputElement.val()).toEqual('0');
    });

    it("should be valid when pristine", function () {
        expect(inputElement.controller('ngModel').$valid).toBeTruthy();
    });

    it("should handle integers", function () {
        inputElement.val('99');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual("99");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('99');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(99);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeFalsy();
    });

    it("should not allow alphabetic characters", function () {
        inputElement.val('absd33');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeTruthy();
        expect(inputElement.val()).toEqual("absd33");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('absd33');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
    });

    it("should not allow spaces", function () {
        inputElement.val('3 3');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeTruthy();
        expect(inputElement.val()).toEqual("3 3");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('3 3');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
    });

    it('should handle 1 decimal place', function () {
        inputElement.val('9.1');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual("9.1");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('9.1');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(9.1);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeFalsy();
    });

    it('should handle 2 decimal places', function () {
        inputElement.val('1.23');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual("1.23");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('1.23');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(1.23);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeFalsy();
    });

    it('should allow input with only fractional part', function () {
        inputElement.val('.23');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual(".23");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('.23');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0.23);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeFalsy();
    });

    it('should not allow more than 2 decimal places', function () {
        inputElement.val('2.345');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual("2.345");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('2.345');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeTruthy();
    });

    it('should not allow amount greater than 5,000,000.00', function () {
        inputElement.val('5000000.01');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual("5000000.01");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('5000000.01');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(5000000.01);
        expect(inputElement.controller('ngModel').$error.currencyLimit).toBeTruthy();
    });

    it('should not allow amount greater than provided max-limit', function () {
        var input = "<input name='amount' ng-model='amount' currency-field max-limit=\"9999999.99\"/>";
        inputElement = test.compileTemplate(input);

        inputElement.val('10000000');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual("10000000");
        expect(inputElement.controller('ngModel').$viewValue).toEqual('10000000');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(10000000.00);
        expect(inputElement.controller('ngModel').$error.currencyLimit).toBeTruthy();
    });

    it('should not allow empty strings by default', function () {
        inputElement.val('');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual('');
        expect(inputElement.controller('ngModel').$viewValue).toEqual('');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeTruthy();
    });

    it('should allow empty strings by configuration', function () {
        scope.allowBlank = true;
        inputElement.val('');
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual('');
        expect(inputElement.controller('ngModel').$viewValue).toEqual('');
        expect(inputElement.controller('ngModel').$modelValue).toEqual('');
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeFalsy();
    });

    it('should not allow zero by default', function () {
        inputElement.val(0);
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual('0');
        expect(inputElement.controller('ngModel').$viewValue).toEqual('0');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeTruthy();
    });

    it('should allow zero by configuration', function () {
        var input = "<input name='amount' ng-model='amount' currency-field allow-zero/>";
        inputElement = test.compileTemplate(input);

        inputElement.val(0);
        inputElement.trigger('input');

        expect(inputElement.val()).toEqual('0');
        expect(inputElement.controller('ngModel').$viewValue).toEqual('0');
        expect(inputElement.controller('ngModel').$modelValue).toEqual(0);
        expect(inputElement.controller('ngModel').$error.currencyFormat).toBeFalsy();
    });
});
