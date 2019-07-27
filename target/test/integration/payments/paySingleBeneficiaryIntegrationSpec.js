describe('INTEGRATION - Pay Single Beneficiary', function () {
    'use strict';

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

    beforeEach(module('refresh.payment', 'refresh.test', 'refresh.fixture', 'refresh.monthlyPaymentLimits.directives', 'refresh.formtracker', function ($controllerProvider) {
        $controllerProvider.register('MonthlyPaymentLimitsController', function ($scope) {
            $scope.monthlyEAPLimit = 100;
            $scope.usedEAPLimit = 66;
            $scope.availableEAPLimit = 34;
        });
    }, function($provide) {
        $provide.service('formTrackerService', function() {
            return {};
        });
    }));

    var scope, beneficiaryPayment;

    beforeEach(inject(function ($rootScope, $controller, mock, ApplicationParameters, PermissionsService, User, BeneficiaryPayment) {
        spyOn(PermissionsService, ['checkPermission']).and.returnValue(true);
        spyOn(User, ['isCurrentDashboardCardHolder']).and.returnValue(true);
        spyOn(User, ['isSEDOperator']).and.returnValue(false);

        scope = $rootScope.$new();
        var accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
        var paymentService = jasmine.createSpyObj('BeneficiaryPaymentService', ['payBeneficiary', 'getAllowedRepeatIntervals', 'getDefaultRepeatPaymentOptions', 'getLastPaymentDate']);
        var card = jasmine.createSpyObj('card', ['current']);
        var location = jasmine.createSpyObj('location', ['path']);
        var applicationParameters = ApplicationParameters;
        applicationParameters.pushVariable('latestTimestampFromServer',moment());

        var account = { availableBalance: {"amount": 0, "currency": "ZAR"} };
        var beneficiary = {
            name               : 'Someone',
            accountNumber      : '12345',
            customerReference  : 'test',
            recipientReference : 'test',
            paymentConfirmation: {confirmationType: 'Email', recipientName: 'Someone', address: 'someone@somewhere.com'}};

        scope.account = account;
        accountsService.list.and.returnValue(mock.resolve({
                "accounts"   : [account],
                "cardProfile": {
                    "monthlyEAPLimit"       : {"amount": 0, "currency": "ZAR"},
                    "monthlyWithdrawalLimit": {"amount": 0, "currency": "ZAR"},
                    "usedEAPLimit"          : {"amount": 0, "currency": "ZAR"},
                    "remainingEAP"          : {"amount": 0, "currency": "ZAR"}
                }
            }));
        accountsService.validFromPaymentAccounts.and.returnValue([account]);
        beneficiaryPayment = BeneficiaryPayment;
        beneficiaryPayment.start(beneficiary);

        $controller('BeneficiaryPaymentController', {
            $scope                     : scope,
            AccountsService            : accountsService,
            BeneficiaryPaymentService  : paymentService,
            $location                  : location,
            Card                       : card,
            ApplicationParameters      : applicationParameters
        });
    }));

    afterEach(function () {
        window.moment = realMoment;
    });

    describe('amount validation', function () {
        var HIGH_VALUE = 500000000;
        var LOW_VALUE = 10;
        var document, test;
        var messages = {
            "lessThanZero"             : "Please enter an amount greater than zero",
            "overMaximum"              : "The amount cannot exceed R 4 999 999.99",
            "overAvailableBalance"     : "The amount exceeds your available balance",
            "overAvailableMonthlyLimit": "The amount exceeds your remaining monthly payment limit",
            "overMonthlyLimit"         : "This amount exceeds your monthly limit. Please call 0860 123 000 for assistance"
        };

        function loadPartials() {
            test.allowTemplate('common/amount/partials/amount.html');
            test.allowTemplate('common/monthlyPaymentLimits/partials/noEAPLimitMessage.html');
            test.allowTemplate('common/datepicker/partials/datepicker.html');
            test.allowTemplate('common/monthlyPaymentLimits/partials/monthlyPaymentLimits.html');
            test.allowTemplate('common/accountdropdown/partials/accountDropdown.html');
            test.stubTemplate('features/beneficiaries/partials/paymentConfirmation.html', '');
            test.allowTemplate('common/flow/partials/flow.html');
            test.allowTemplate('common/sbform/partials/sbTextInput.html');
            test.allowTemplate('features/beneficiaries/partials/printBeneficiaryReceiptHeader.html');
            test.allowTemplate('common/recurringPayments/partials/recurringPayments.html');
        }

        beforeEach(inject(function (_TemplateTest_) {
            test = _TemplateTest_;
            _TemplateTest_.scope = scope;
            loadPartials();
            document = _TemplateTest_.compileTemplateInFile('features/payment/partials/payBeneficiary.html');
            document.find('#amount').triggerHandler('blur');
        }));

        function setAmount(value) {
            scope.$digest();
            scope.paySingleBeneficiaryForm.amount.$setViewValue(value);
            scope.$digest();
        }

        function setDateFn(date) {
            return function () {
                scope.paymentDetail.fromDate = date;
            };
        }

        function errorMessage() {
            var error = document.find('#amount').siblings('span.form-error');
            return error.text();
        }

        function warningMessage() {
            var warning = document.find('div.text-notification.warning');
            return warning.text();
        }

        function invalidBalance() {
            return _.map(document.find('.invalid-balance .amount'), function (item) {
                return item.id;
            }).join(', ');
        }

        function proceedDisabled() {
            return document.find('#proceed')[0].disabled;
        }

        function currentDate() {
            return moment('2014-06-28').format('DD MMMM YYYY');
        }

        function tomorrow() {
            return moment('2014-06-28').add(1, 'days').format('DD MMMM YYYY');
        }

        function nextMonth() {
            return moment('2014-06-28').add(1, 'month').format('DD MMMM YYYY');
        }

        function amountValidationExample(data) {
            withDefaultedMessages(data);
            data.invalidBalance = data.invalidBalance || '';
            data.date = data.date || currentDate();
            data.balance = data.balance || LOW_VALUE;
            data.availableLimit = data.availableLimit || LOW_VALUE;
            data.monthlyLimit = data.monthlyLimit || LOW_VALUE;
            return data;
        }

        function withDefaultedMessages(data) {
            data.errorMessage = data.errorMessage || '';
            data.warningMessage = data.warningMessage || '';
            data.proceedDisabled = data.proceedDisabled || !_.isEmpty(data.errorMessage);
            return data;
        }

        describe('display validation messages', function () {
            using([
                    amountValidationExample({desc: 'invalid currency format - current date', amount: '0', date: currentDate(), errorMessage: messages.lessThanZero}),
                    amountValidationExample({desc: 'invalid currency format - future date', amount: '0', date: nextMonth(), errorMessage: messages.lessThanZero}),
                    amountValidationExample({desc: 'exceeding bank currency limit - current date', amount: '5000000.01', date: currentDate(), errorMessage: messages.overMaximum}),
                    amountValidationExample({desc: 'exceeding bank currency limit - future date', amount: '5000000.01', date: nextMonth(), errorMessage: messages.overMaximum}),
                    amountValidationExample({desc: 'exceeding available balance, but less than monthly limit ', amount: '10001', balance: 10000, availableLimit: HIGH_VALUE, invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance}),
                    amountValidationExample({desc: 'exceeding available balance AND exceeding monthly limit', amount: '10001', balance: 10000, availableLimit: LOW_VALUE, invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance}),
                    amountValidationExample({desc: 'exceeding available monthly transfer limit, but less than available balance', amount: '10001', balance: HIGH_VALUE, usedLimit: 1000, invalidBalance: 'availableLimit', errorMessage: messages.overAvailableMonthlyLimit}),
                    amountValidationExample({desc: 'exceeding available monthly transfer limit AND exceeding available balance', amount: '10001', balance: LOW_VALUE, usedLimit: 1000, invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance}),
                    amountValidationExample({desc: 'exceeding monthly transfer limit for future dated payments in the same month', amount: '10001', balance: HIGH_VALUE, usedLimit: 1000, date: tomorrow(), invalidBalance: 'availableLimit', warningMessage: messages.overMonthlyLimit}),
                    amountValidationExample({desc: 'exceeding monthly transfer limit for future dated payments in different month', amount: '10001', balance: HIGH_VALUE, usedLimit: 1000, date: nextMonth(), invalidBalance: 'monthlyLimit', warningMessage: messages.overMonthlyLimit}),
                    amountValidationExample({desc: 'exceeding available transfer limit for future dated payments in the different month', amount: '901', balance: LOW_VALUE, usedLimit: 900, monthlyLimit: 1000, date: nextMonth(), invalidBalance: null, errorMessage: '', warningMessage: ''})
                ],
                function (example) {
                    it('display of message when ' + example.desc, function () {
                        scope.cardProfile.usedEAPLimit.amount = example.usedLimit;
                        scope.account.availableBalance.amount = example.balance;
                        scope.cardProfile.monthlyEAPLimit.amount = example.monthlyLimit;
                        scope.paymentDetail.fromDate = example.date;

                        setAmount(example.amount);

                        expect(errorMessage()).toEqual(example.errorMessage);
                        expect(warningMessage()).toEqual(example.warningMessage);
                        expect(invalidBalance()).toEqual(example.invalidBalance);
                        expect(proceedDisabled()).toEqual(example.proceedDisabled);
                    });
                });

            using([
                    {desc    : 'current date to date in next month - available balance', amount: '1001', balance: 1000,
                        state: [
                            withDefaultedMessages({change: setDateFn(currentDate()), invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance}), withDefaultedMessages({change: setDateFn(nextMonth()), invalidBalance: 'monthlyLimit', warningMessage: messages.overMonthlyLimit})
                        ]},
                    {desc    : 'date in next month to current date - available balance', amount: '1001', balance: 1000,
                        state: [
                            withDefaultedMessages({change: setDateFn(nextMonth()), invalidBalance: 'monthlyLimit', warningMessage: messages.overMonthlyLimit}), withDefaultedMessages({change: setDateFn(currentDate()), invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance})
                        ]},
                    {desc    : 'current date to date in next month - monthly limit', amount: '1001', monthlyLimit: 1000,
                        state: [
                            withDefaultedMessages({change: setDateFn(currentDate()), invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance}), withDefaultedMessages({change: setDateFn(nextMonth()), invalidBalance: 'monthlyLimit', warningMessage: messages.overMonthlyLimit})
                        ]},
                    {desc    : 'date in next month to current date - monthly limit', amount: '1001', monthlyLimit: 1000,
                        state: [
                            withDefaultedMessages({change: setDateFn(nextMonth()), invalidBalance: 'monthlyLimit', warningMessage: messages.overMonthlyLimit}), withDefaultedMessages({change: setDateFn(currentDate()), invalidBalance: 'From_AccountAvailableBalance', errorMessage: messages.overAvailableBalance})
                        ]},
                    {desc    : 'date in same month to date in next month', amount: '901', balance: 1000, monthlyLimit: 1000, availableLimit: 900,
                        state: [
                            withDefaultedMessages({change: setDateFn(nextMonth()), invalidBalance: 'monthlyLimit', warningMessage: messages.overMonthlyLimit}), withDefaultedMessages({change: setDateFn(tomorrow()), invalidBalance: 'availableLimit', warningMessage: messages.overMonthlyLimit})
                        ]},
                    {desc    : 'invalid amount and invalid format', amount: '5000001',
                        state: [
                            withDefaultedMessages({change: setDateFn(tomorrow()), invalidBalance: '', errorMessage: messages.overMaximum}), withDefaultedMessages({change: function () {
                                setAmount('0.00');
                            }, invalidBalance                                                                                                                            : '', errorMessage: messages.lessThanZero})
                        ]}
                ], function (example) {
                    it('should switch validation messages when changing between ' + example.desc, function () {
                        scope.account.availableBalance.amount = example.balance || LOW_VALUE;
                        scope.availableEAPLimit = example.availableLimit || LOW_VALUE;
                        scope.monthlyEAPLimit = example.monthlyLimit || LOW_VALUE;
                        setAmount(example.amount);

                        example.state[0].change();
                        scope.$digest();

                        expect(errorMessage()).toEqual(example.state[0].errorMessage);
                        expect(warningMessage()).toEqual(example.state[0].warningMessage);
                        expect(invalidBalance()).toEqual(example.state[0].invalidBalance);
                        expect(proceedDisabled()).toEqual(example.state[0].proceedDisabled);

                        example.state[1].change();
                        scope.$digest();

                        expect(errorMessage()).toEqual(example.state[1].errorMessage);
                        expect(warningMessage()).toEqual(example.state[1].warningMessage);
                        expect(invalidBalance()).toEqual(example.state[1].invalidBalance);
                        expect(proceedDisabled()).toEqual(example.state[1].proceedDisabled);
                    });
                });
        });
    });
});
