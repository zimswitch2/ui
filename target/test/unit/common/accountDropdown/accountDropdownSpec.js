describe('sbAccountDropdown', function () {
    'use strict';

    beforeEach(module('refresh.accountDropdown'));
    var test, defaults;

    beforeEach(inject(function (_TemplateTest_) {
        test = _TemplateTest_;
        test.allowTemplate('common/accountdropdown/partials/accountDropdown.html');
        defaults = {
            name: 'name',
            label: 'label',
            model: 'model',
            listData: 'listData',
            autofocus: false,
            noBalance: false,
            currencyCode: 'currencyCode'
        };
    }));

    function render(overrides) {
        var data = _.merge(defaults, overrides);
        var autoFocusString = data.autofocus ? 'autofocus' : '';
        var template = '<sb-account-dropdown name="' + data.name + '" label="' + data.label + '" ng-model="' +
            data.model + '" items="' + data.listData + '" highlight-balance="' + data.highlightBalanceExpression +
            '" ' + autoFocusString + ' no-balance="' + data.noBalance + '" currency-code="' + data.currencyCode +
            '"=></sb-account-dropdown>';
        return test.compileTemplate(template);
    }

    describe('model changed', function () {
        it('should set external binding if selected item is changed', function () {
            var account1 = {name: "Account 1", formattedNumber: '111', availableBalance: {amount: 1}, number: 1};
            var account2 = {name: "Account 2", formattedNumber: '222', availableBalance: {amount: 2}, number: 2};

            test.scope.listData = [account1, account2];
            test.scope.model = account1;

            var element = render();

            expect(element.find('option:selected')[0].value).toEqual('111');
            expect(element.find('#nameAvailableBalance').text()).toEqual("R 1.00");

            element.find('select').val('222').change();

            expect(element.find('option:selected')[0].value).toEqual('222');
            expect(test.scope.model).toEqual(account2);
        });
    });

    describe('disabled', function () {
        it('should not be disabled when items are defined', function () {
            test.scope.listData = [{}, {}];
            var element = render();

            expect(element.find('select').attr('disabled')).toBeUndefined();
        });

        it('should be disabled when items is undefined', function () {
            test.scope.listData = undefined;
            var element = render();

            expect(element.find('select').attr('disabled')).toBeTruthy();
        });

        it('should be disabled when no items are specified', function () {
            test.scope.listData = [];
            var element = render();

            expect(element.find('select').attr('disabled')).toBeTruthy();
        });
    });

    describe('no-balance', function () {
        beforeEach(function () {
            test.scope.listData = [{}];
        });

        it('should show balance by default', function () {
            var element = render();
            expect(element.find('#nameAvailableBalance').parent().hasClass('ng-hide')).toBeFalsy();
        });

        it('should hide balance no-balance is true', function () {
            var element = render({noBalance: true});
            expect(element.find('#nameAvailableBalance').parent().hasClass('ng-hide')).toBeTruthy();
        });


    });

    it('should list accounts as select options', function () {
        test.scope.accounts = [
            {name: "Account 1", productName: "Account 1", formattedNumber: '111', number: 1},
            {name: "Account 2", productName: "Account 2", formattedNumber: '222', number: 2}
        ];

        var element = render({listData: 'accounts'});

        var optionElements = element.find('option');
        expect(optionElements.length).toEqual(3);
        expect(test.elementAt(0, optionElements).text()).toEqual("");
        expect(test.elementAt(1, optionElements).text()).toEqual("Account 1 - 111");
        expect(test.elementAt(1, optionElements).val()).toEqual("111");
        expect(test.elementAt(2, optionElements).text()).toEqual("Account 2 - 222");
        expect(test.elementAt(2, optionElements).val()).toEqual("222");
    });

    it('should select option if model already has a value', function () {
        var selectedAccount = {name: "Account 2", formattedNumber: '222', availableBalance: {amount: 0}, number: 2};
        test.scope.accounts = [
            {name: "Account 1", formattedNumber: '111', number: 1},
            selectedAccount
        ];
        test.scope.account = selectedAccount;

        var element = render({model: 'account', listData: 'accounts'});

        var optionElements = element.find('option');
        expect(optionElements.length).toEqual(2);
        expect(test.elementAt(0, optionElements).attr('selected')).toBeUndefined();
        expect(test.elementAt(1, optionElements).attr('selected')).toEqual("selected");
    });

    it('should display available balance for the selected account', function () {
        var selectedAccount = {availableBalance: {amount: -1334}};
        test.scope.accounts = [selectedAccount];
        test.scope.account = selectedAccount;

        var element = render({name: "transferFrom", model: 'account', listData: 'accounts'});

        var availableBalanceSpan = element.find('#transferFromAvailableBalance');
        expect(availableBalanceSpan.text()).toEqual("- R 1 334.00");
    });

    it('should highlight the available balance as an error when appropriate', function () {
        test.scope.amount = 3;
        test.scope.highlightBalanceTest = function () {
            return test.scope.amount > 5;
        };
        test.scope.listData = [{}];
        var element = render({name: "transferFrom", highlightBalanceExpression: 'highlightBalanceTest()'});

        var availableBalanceDiv = element.find('#transferFromAvailableBalance').parent();

        expect(availableBalanceDiv.hasClass('invalid-balance')).toEqual(false);
        test.scope.amount = 5.1;
        test.scope.$digest();
        expect(availableBalanceDiv.hasClass('invalid-balance')).toEqual(true);
    });

    it('should apply the autofocus attribute to the dropdown if desired', function () {
        test.scope.listData = [{}];
        var element = render({autofocus: false});
        expect(element.find('select').attr('autofocus')).toBeUndefined();

        element = render({autofocus: true});

        expect(element.find('select').attr('autofocus')).toEqual('autofocus');
    });
});
