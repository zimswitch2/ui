describe('INTEGRATION - Prepaid Recharge Beneficiary with Mobile', function () {
    var realMoment;
    beforeEach(function () {
        realMoment = moment;
        window.moment = function (date) {
            if (date && !realMoment.isMoment(date)) {
                return realMoment(date);
            }
            return realMoment('2014-06-28');
        };
        moment.isMoment = realMoment.isMoment;
    });

    beforeEach(module('refresh.prepaid.recharge.controllers', 'refresh.test', 'refresh.fixture', 'refresh.sbForm',
        'refresh.accountDropdown', 'refresh.amount', 'refresh.validators.limits'));

    var scope;
    var range = {max: 1000, min: 10};

    beforeEach(inject(function ($rootScope, $controller, mock, RechargeService) {
        scope = $rootScope.$new();
        var accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
        var card = jasmine.createSpyObj('card', ['current']);
        var rechargeService = RechargeService;

        spyOn(rechargeService, 'listProviders');

        var location = jasmine.createSpyObj('location', ['path']);
        var account = { availableBalance: {"amount": 0, "currency": "ZAR"} };

        scope.account = account;

        rechargeService.listProviders.and.returnValue(mock.resolve([{
            type: 'mobile',
            id: 'mtn',
            name: 'mtn',
            products: [{
                type: 'Airtime',
                name: 'Airtime',
                range: {
                    max: 1000,
                    min: 10
                },
                bundles: undefined
            }],
            range: range
        }]));

        accountsService.list.and.returnValue(mock.resolve({
                "accounts": [account],
                "cardProfile": {
                    "dailyWithdrawalLimit": {"amount": 0, "currency": "ZAR"}
                }
            }
        ));
        accountsService.validFromPaymentAccounts.and.returnValue([account]);

        $controller('RechargeDetailsController', {
            $scope: scope,
            AccountsService: accountsService,
            RechargeService: rechargeService,
            $location: location,
            Card: card,
            $routeParams: {providerId: 'mtn'}
        });

        scope.$digest();
    }));

    afterEach(function () {
        window.moment = realMoment;
    });

    describe('amount validation', function () {
        var HIGH_VALUE = 500000000;
        var LOW_VALUE = 10;
        var document, test;
        var messages = {
            'currencyFormat': 'Please enter the amount in rands only',
            "invalidAmount": "Please enter the amount in a valid format",
            "lessThanZero": "Please enter an amount greater than zero",
            "overMaximum": "The amount cannot exceed R 5 000 000",
            "overAvailableBalance": "The amount exceeds your available balance",
            "overAvailableDailyLimit": "The amount exceeds your daily withdrawal limit",
            "invalidRechargeAmount": "Please enter an amount within the specified range",
            "notificationText": "Enter an amount from R "+range.min+" to R "+range.max
        };

        function loadPartials() {
            test.allowTemplate('common/amount/partials/amount.html');
            test.allowTemplate('features/prepaid/partials/input/mobile.html');
            test.allowTemplate('features/prepaid/partials/input/electricity.html');
            test.allowTemplate('features/prepaid/partials/rechargeBalances.html');
            test.allowTemplate('common/accountdropdown/partials/accountDropdown.html');
            test.allowTemplate('common/flow/partials/flow.html');
            test.allowTemplate('common/sbform/partials/sbTextInput.html');
        }

        beforeEach(inject(function (_TemplateTest_) {
            test = _TemplateTest_;
            _TemplateTest_.scope = scope;
            loadPartials();
            document = _TemplateTest_.compileTemplateInFile('features/prepaid/partials/recharge.html');
            document.find('#amount').triggerHandler('blur');
        }));

        function setAmount(value) {
            scope.$digest();
            scope.rechargePrepaidForm.amount.$setViewValue(value);
            scope.$digest();
        }

        function errorMessage() {
            var error = document.find('#amount').siblings('span.form-error');
            return error.text();
        }

        function warningMessage() {
            var warning = document.find('.text-notification.warning');
            return warning.text();
        }

        function notificationMessage () {
            var notification = document.find('.text-notification');
            return notification.text();
        }

        function invalidBalance() {
            return _.map(document.find('.invalid-balance .amount'), function (item) {
                return item.id;
            }).join(', ');
        }

        function proceedDisabled() {
            return document.find('#proceed')[0].disabled;
        }

        function amountValidationExample(data) {
            withDefaultedMessages(data);
            data.balance = data.balance || '';
            data.availableBalance = data.availableBalance || LOW_VALUE;
            data.availableLimit = data.availableLimit || LOW_VALUE;
            return data;
        }

        function withDefaultedMessages(data) {
            data.errorMessage = data.errorMessage || '';
            data.warningMessage = data.warningMessage || '';
            data.invalidBalance = data.invalidBalance || '';
            data.proceedDisabled = data.proceedDisabled || !_.isEmpty(data.errorMessage);
            data.notificationText =  "Enter an amount from R "+range.min+" to R "+range.max;
            return data;
        }

        describe('display validation messages', function () {
            using([
                    amountValidationExample({desc: 'invalid format', amount: '10.0', errorMessage: messages.currencyFormat}),
                    amountValidationExample({desc: 'amount of zero', amount: '0', errorMessage: messages.lessThanZero}),
                    amountValidationExample({desc: 'invalid amount', amount: '-1', errorMessage: messages.lessThanZero}),
                    amountValidationExample({desc: '< minimum prepaid purchase limit', amount: '9', errorMessage: messages.invalidRechargeAmount}),
                    amountValidationExample({desc: '> prepaid purchase limit, > available withdrawal limit, > available balance,', amount: '1001', balance: 800, availableLimit: LOW_VALUE, errorMessage: messages.invalidRechargeAmount}),
                    amountValidationExample({desc: '> prepaid purchase limit, > available withdrawal limit, < available balance,', amount: '1001', balance: HIGH_VALUE, availableLimit: LOW_VALUE, errorMessage: messages.invalidRechargeAmount}),
                    amountValidationExample({desc: '> prepaid purchase limit, < available withdrawal limit, > available balance,', amount: '1001', balance: 800, availableLimit: HIGH_VALUE, errorMessage: messages.invalidRechargeAmount}),
                    amountValidationExample({desc: '> prepaid purchase limit, < available withdrawal limit, < available balance,', amount: '1001', balance: HIGH_VALUE, availableLimit: HIGH_VALUE, errorMessage: messages.invalidRechargeAmount}),
                    amountValidationExample({desc: '< prepaid purchase limit, > available withdrawal limit, > available balance,', amount: '900', balance: 800, availableLimit: LOW_VALUE, invalidBalance: 'availableDailyLimit', errorMessage: messages.overAvailableDailyLimit}),
                    amountValidationExample({desc: '< prepaid purchase limit, > available withdrawal limit, < available balance,', amount: '900', balance: HIGH_VALUE, availableLimit: LOW_VALUE, invalidBalance: 'availableDailyLimit', errorMessage: messages.overAvailableDailyLimit}),
                    amountValidationExample({desc: '< prepaid purchase limit, < available withdrawal limit, > available balance,', amount: '900', balance: 800, availableLimit: HIGH_VALUE, invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance})
                ],
                function (example) {
                    it('display of message when ' + example.desc, function () {
                        scope.recharge.dailyWithdrawalLimit = example.availableLimit;
                        scope.recharge.account.availableBalance.amount = example.balance;

                        setAmount(example.amount);

                        expect(errorMessage()).toEqual(example.errorMessage);
                        expect(warningMessage()).toEqual(example.warningMessage);
                        expect(invalidBalance()).toEqual(example.invalidBalance);
                        expect(notificationMessage()).toEqual(example.notificationText);
                        expect(proceedDisabled()).toEqual(example.proceedDisabled);
                    });
                });
        });
    });
});