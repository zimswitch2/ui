describe('INTEGRATION - Pay Once Off', function () {
    beforeEach(module('refresh.payment', 'refresh.test', 'refresh.fixture', 'refresh.sbForm', 'refresh.accountDropdown',
        'refresh.amount', 'refresh.monthlyPaymentLimits.directives', 'refresh.filters', function ($controllerProvider) {
            $controllerProvider.register('MonthlyPaymentLimitsController', function ($scope) {
                $scope.monthlyEAPLimit = 100;
                $scope.usedEAPLimit = 66;
                $scope.availableEAPLimit = 34;
            });
        }));

    var scope;
    beforeEach(inject(function ($rootScope, $controller, mock,PermissionsService) {
        spyOn(PermissionsService, ['checkPermission']).and.returnValue(true);
        scope = $rootScope.$new();
        var accountsService = jasmine.createSpyObj('accountsService', ['list', 'validFromPaymentAccounts']);
        var paymentService = jasmine.createSpyObj('OnceOffPaymentService', ['payBeneficiary']);
        var card = jasmine.createSpyObj('card', ['current']);
        var beneficiariesFlowService = jasmine.createSpyObj('beneficiariesFlowService',
            ['setBeneficiaryFlowParameter', 'getBeneficiaryFlowParameter']);
        var location = jasmine.createSpyObj('location', ['path']);

        var banks = [
            {
                "name": "Standard Bank",
                "code": "051"
            },
            {
                "name": "ABSA",
                "code": "089"
            }
        ];

        var branches = [
            {
                "code": 20091600,
                "name": "DURBAN CENTRAL FOREX OPS"
            }
        ];

        var bankService = jasmine.createSpyObj('bankService', ['list', 'searchBranches']);
        bankService.list.and.returnValue(mock.resolve(banks));
        bankService.searchBranches.and.returnValue(mock.resolve(branches));

        var cdiService = jasmine.createSpyObj('cdiService', ['list']);
        cdiService.list.and.returnValue(mock.resolve([
            {name: "Name", number: "12345"}
        ]));

        var account = {availableBalance: {"amount": 0, "currency": "ZAR"}};
        var beneficiary = {
            name: 'Someone',
            accountNumber: '12345',
            paymentConfirmation: {confirmationType: 'Email', recipientName: 'Someone', address: 'someone@somewhere.com'}
        };

        scope.account = account;
        accountsService.list.and.returnValue(mock.resolve({
                "accounts": [account],
                "cardProfile": {
                    "monthlyEAPLimit": {"amount": 0, "currency": "ZAR"},
                    "monthlyWithdrawalLimit": {"amount": 0, "currency": "ZAR"},
                    "usedEAPLimit": {"amount": 0, "currency": "ZAR"}
                }
            }
        ));
        accountsService.validFromPaymentAccounts.and.returnValue([account]);
        beneficiariesFlowService.getBeneficiaryFlowParameter.and.returnValue(beneficiary);

        $controller('OnceOffPaymentController', {
            $scope: scope,
            AccountsService: accountsService,
            OnceOffPaymentService: paymentService,
            BeneficiariesState: beneficiariesFlowService,
            $location: location,
            Card: card,
            BankService: bankService,
            CdiService: cdiService
        });
    }));

    describe('amount validation', function () {
        var HIGH_VALUE = 500000000;
        var LOW_VALUE = 10;
        var document, test;
        var messages = {
            "lessThanZero": "Please enter an amount greater than zero",
            "overMaximum": "The amount cannot exceed R 4 999 999.99",
            "overAvailableBalance": "The amount exceeds your available balance",
            "overAvailableMonthlyLimit": "The amount exceeds your remaining monthly payment limit",
            "overMonthlyLimit": "This amount exceeds your monthly limit. Please call 0860 123 000 for assistance."
        };

        function loadPartials() {
            test.allowTemplate('common/amount/partials/amount.html');
            test.allowTemplate('common/monthlyPaymentLimits/partials/noEAPLimitMessage.html');
            test.allowTemplate('common/monthlyPaymentLimits/partials/monthlyPaymentLimits.html');
            test.allowTemplate('common/accountdropdown/partials/accountDropdown.html');
            test.stubTemplate('features/beneficiaries/partials/paymentConfirmation.html', '');
            test.stubTemplate('features/payment/partials/payBeneficiaryOnceOffConfirm.html', '');
            test.allowTemplate('features/payment/partials/beneficiaryAccountValidationDisclaimer.html');
            test.stubTemplate('common/typeahead/partials/typeahead.html', '');
            test.stubTemplate('common/sbform/partials/sbTextInput.html', '');
            test.allowTemplate('common/flow/partials/flow.html');
        }

        beforeEach(inject(function (_TemplateTest_) {
            test = _TemplateTest_;
            _TemplateTest_.scope = scope;
            loadPartials();
            document = _TemplateTest_.compileTemplateInFile('features/payment/partials/payBeneficiaryOnceOff.html');
            document.find('#amount').triggerHandler('blur');
        }));

        function setAmount(value) {
            scope.$digest();
            scope.payPrivateBeneficiaryOnceOffForm.amount.$setViewValue(value);
            scope.$digest();
        }

        function errorMessage() {
            var error = document.find('#amount').siblings('span.form-error');
            return error.text();
        }

        function warningMessage() {
            return document.find('div.text-notification.warning').text();
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
            return {latestTimestampFromServer: '02 July 2014', paymentDate: '02 July 2014'};
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
                    amountValidationExample({
                        desc: 'invalid currency format - current date',
                        amount: '0',
                        date: currentDate(),
                        errorMessage: messages.lessThanZero
                    }),
                    amountValidationExample({
                        desc: 'exceeding bank currency limit - current date',
                        amount: '5000000.01',
                        date: currentDate(),
                        errorMessage: messages.overMaximum
                    }),
                    amountValidationExample({
                        desc: 'exceeding available balance, but less than monthly limit ',
                        amount: '10001',
                        balance: 10000,
                        availableLimit: HIGH_VALUE,
                        invalidBalance: 'From_AccountAvailableBalance',
                        errorMessage: messages.overAvailableBalance
                    }),
                    amountValidationExample({
                        desc: 'exceeding available balance AND exceeding monthly limit',
                        amount: '10001',
                        balance: 10000,
                        availableLimit: LOW_VALUE,
                        invalidBalance: 'From_AccountAvailableBalance',
                        errorMessage: messages.overAvailableBalance
                    }),
                    amountValidationExample({
                        desc: 'exceeding available monthly transfer limit, but less than available balance',
                        amount: '10001',
                        balance: HIGH_VALUE,
                        availableLimit: 1000,
                        invalidBalance: 'availableLimit',
                        errorMessage: messages.overAvailableMonthlyLimit
                    }),
                    amountValidationExample({
                        desc: 'exceeding available monthly transfer limit AND exceeding available balance',
                        amount: '10001',
                        balance: LOW_VALUE,
                        availableLimit: 1000,
                        invalidBalance: 'From_AccountAvailableBalance',
                        errorMessage: messages.overAvailableBalance
                    })
                ],
                function (example) {
                    it('display of message when ' + example.desc, function () {
                        scope.availableEAPLimit = example.availableLimit;
                        scope.account.availableBalance.amount = example.balance;
                        scope.monthlyEAPLimit = example.monthlyLimit;
                        scope.latestTimestampFromServer = example.date.latestTimestampFromServer;
                        scope.paymentDate = example.date.paymentDate;

                        setAmount(example.amount);

                        expect(errorMessage()).toEqual(example.errorMessage);
                        expect(warningMessage()).toEqual(example.warningMessage);
                        expect(invalidBalance()).toEqual(example.invalidBalance);
                        expect(proceedDisabled()).toEqual(example.proceedDisabled);
                    });
                }
            );
        });
    });
});
