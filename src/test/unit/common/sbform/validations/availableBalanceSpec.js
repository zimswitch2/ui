describe("validate-available-balance", function () {
    beforeEach(module('refresh.sbForm', 'refresh.fixture', 'refresh.test'));
    var form, test, element, inputElement, scope;

    var template = function (availableBalance, monthlyLimit) {
        form =  "<form name='theForm'>" +
            "<input type='text' " +
            "id='amount' " +
            "ng-model='amount' " +
            "name='amount' " +
            "invalid-amount " +
            "available-balance='" + availableBalance + "' " +
            "monthly-limit='" + monthlyLimit + "'/>" +
            "</form>";
        element = test.compileTemplate(form);
        inputElement = element.find('input');
    };

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        scope = _TemplateTest_.scope;
    }));

    it("should display no error value if value in field is zero", function () {
        template(0,100);
        expect(inputElement.val()).toEqual('');
        var requiredError = element.find('.input-confirm-error').not('.ng-hide');
        expect(requiredError.text()).toEqual('');
        expect(inputElement.hasClass('ng-invalid')).toBeFalsy();
    });

    it("should have an error if amount greater than available balance", function () {
        template(100,1000);
        inputElement.val('200.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidBalance).toBeTruthy();
    });

    it("should have a valid amount if amount less than available balance", function () {
        template(100,1000);
        inputElement.val('20.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidBalance).toBeFalsy();
    });

    it("should have an error for monthly transfer if amount greater than monthly transfer limit", function () {
        template(1000,100);
        inputElement.val('200.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidMonthlyTransfer).toBeTruthy();
    });

    it("should have a valid amount for monthly transfer if amount less than monthly transfer limit", function () {
        template(1000,100);
        inputElement.val('20.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidMonthlyTransfer).toBeFalsy();
    });

    it("should have an error for the available transfer if available transfer limit less than available balance", function () {
        template(150,100);
        inputElement.val('200.00');
        inputElement.trigger('input');

        var transferError = inputElement.controller('ngModel').$error.invalidMonthlyTransfer;
        var invalidBalance = inputElement.controller('ngModel').$error.invalidBalance;

        expect(transferError).toBeTruthy();
        expect(invalidBalance).toBeFalsy();
    });

    it("should have an error for the available balance if available transfer limit greater than available balance", function () {
        template(100,150);
        inputElement.val('200.00');
        inputElement.trigger('input');

        var transferError = inputElement.controller('ngModel').$error.invalidMonthlyTransfer;
        var invalidBalance = inputElement.controller('ngModel').$error.invalidBalance;

        expect(transferError).toBeFalsy();
        expect(invalidBalance).toBeTruthy();
    });

    it("should have an error for the available balance if available transfer limit equal to available balance", function () {
        template(150,150);
        inputElement.val('200.00');
        inputElement.trigger('input');

        var transferError = inputElement.controller('ngModel').$error.invalidMonthlyTransfer;
        var invalidBalance = inputElement.controller('ngModel').$error.invalidBalance;

        expect(transferError).toBeFalsy();
        expect(invalidBalance).toBeTruthy();
    });

    it("should reset validation when invalid amount expression is false", function () {
        scope.shouldApplyValidation = true;
        form =  "<form name='theForm'>" +
            "<input type='text' " +
            "id='amount' " +
            "ng-model='amount' " +
            "name='amount' " +
            "invalid-amount='shouldApplyValidation' " +
            "available-balance='150' " +
            "monthly-limit='150'/>" +
            "</form>";
        element = test.compileTemplate(form);
        inputElement = element.find('input');

        inputElement.val('200.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidBalance).toBeTruthy();

        scope.shouldApplyValidation = false;
        scope.$digest();

        expect(inputElement.controller('ngModel').$error.invalidBalance).toBeFalsy();
    });

    it('should trigger validation when available balance changes', function ( ) {
        form =  "<form name='theForm'>" +
            "<input type='text' " +
            "id='amount' " +
            "ng-model='amount' " +
            "name='amount' " +
            "invalid-amount='true'" +
            "available-balance='balance' " +
            "monthly-limit='150'/>" +
            "</form>";
        element = test.compileTemplate(form);
        inputElement = element.find('input');
        scope.balance = 150;

        inputElement.val('200.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidBalance).toBeTruthy();

        scope.balance = 300;
        scope.$digest();
        expect(inputElement.controller('ngModel').$error.invalidBalance).toBeFalsy();
    });

    it('should trigger validation when monthly limit changes', function ( ) {
        form =  "<form name='theForm'>" +
            "<input type='text' " +
            "id='amount' " +
            "ng-model='amount' " +
            "name='amount' " +
            "invalid-amount='true'" +
            "available-balance=200 " +
            "monthly-limit='limit'/>" +
            "</form>";
        element = test.compileTemplate(form);
        inputElement = element.find('input');
        scope.limit = 150;

        inputElement.val('200.00');
        inputElement.trigger('input');

        expect(inputElement.controller('ngModel').$error.invalidMonthlyTransfer).toBeTruthy();

        scope.limit = 300;
        scope.$digest();
        expect(inputElement.controller('ngModel').$error.invalidMonthlyTransfer).toBeFalsy();
    });
});
