describe('Account Summary Unit Test', function () {
    beforeEach(angular.mock.module('ngMockE2E'));
    beforeEach(module('refresh.accountSummary', 'refresh.test'));

    describe('AccountSummaryController', function () {
        describe('Account Summary', function () {
            var scope, mock, service, card, applicationParametersService, menu, rootScope, location, controller, digitalId, routeParams, user, entitlementsBeneficiaryPaymentService;

            var invokeController;

            var expectedPendingPayments =
                [
                    {
                        "beneficiaryName": "Alpha",
                        "beneficiaryAccount": "123456",
                        "description": "Plumbing - as per our agreement",
                        "amount": 2000,
                        "currency": "R",
                        "yourReference": "12345",
                        "beneficiaryReference": "67890",
                        "status": "pending"
                    },
                    {
                        "beneficiaryName": "Bravo",
                        "beneficiaryAccount": "123457",
                        "description": "Security",
                        "amount": 1500,
                        "currency": "R",
                        "yourReference": "12346",
                        "beneficiaryReference": "67891",
                        "status": "pending"
                    }
                ];

            beforeEach(inject(function ($rootScope, $controller, $injector, _mock_, ApplicationParameters, Menu, $location, DigitalId, $routeParams) {
                scope = $rootScope.$new();
                rootScope = $rootScope;
                mock = _mock_;
                menu = Menu;
                location = $location;
                applicationParametersService = ApplicationParameters;
                controller = $controller;
                digitalId = DigitalId;
                routeParams = $routeParams;

                service = jasmine.createSpyObj('service', ['list', 'getTransactionalAccountsCashflows', 'accountTypeName']);
                user = jasmine.createSpyObj('User', ['isCurrentDashboardSEDPrincipal', 'isCurrentDashboardCardHolder']);
                card = jasmine.createSpyObj('card', ['current']);
                rootScope.$broadcast('loggedIn');

                service.list.and.returnValue(mock.resolve({accounts: []}));

                entitlementsBeneficiaryPaymentService = jasmine.createSpyObj('entitlementsBeneficiaryPaymentService', ['getPendingPayments']);
                entitlementsBeneficiaryPaymentService.getPendingPayments.and.returnValue(_mock_.resolve(expectedPendingPayments));

                invokeController = function () {
                    $controller('AccountSummaryController',
                        {
                            $scope: scope,
                            Menu: menu,
                            Card: card,
                            AccountsService: service,
                            ApplicationParameters: applicationParametersService,
                            $location: location,
                            User: user,
                            EntitlementsBeneficiaryPaymentService: entitlementsBeneficiaryPaymentService
                        });
                };

                invokeController();
            }));

            describe('show statement', function () {
                it('should redirect user to provisional statement upon clicking on the account if the toggle is off', function () {
                    viewTransactionsFeature = false;
                    scope.showTransactions('12345-0');
                    expect(location.path()).toEqual('/statements/12345-0');
                });
            });

            describe('show transactions', function () {
                it('should redirect the user to the transactions page setting the specified account on the  if the toggle is on',
                    function () {
                        spyOn(applicationParametersService, 'pushVariable');
                        viewTransactionsFeature = true;
                        scope.showTransactions('12345-0');
                        expect(location.path()).toEqual('/transactions');
                        expect(applicationParametersService.pushVariable).toHaveBeenCalledWith('transactionalAccountNumber', '12345-0');
                    });

            });

            describe('menu', function () {
                it('should populate the main menu when user is authenticated', function () {
                    var expected = {'title': 'Account Summary', 'url': '/account-summary'};

                    expect(menu.items().length).toEqual(1);

                    var actual = menu.items()[0];
                    expect(actual.title).toEqual(expected.title);
                    expect(actual.url).toEqual(expected.url);
                });

                it('should not highlight its menu item when it is not active', function () {
                    location.path('/beneficiaries');
                    expect(menu.items()[0].showIf()).toBeFalsy();
                });

                it('should activate the menu if the current page is the account summary page ', function () {
                    location.path('/account-summary');
                    expect(menu.items()[0].showIf()).toBeTruthy();
                });
            });

            describe('greeting', function () {
                it('should have a default welcome greeting', function () {
                    digitalId.authenticate(null, 'Test User');
                    expect(scope.greeting()).toEqual("Welcome, Test User");
                });

                it('should have a newly linked card greeting', function () {
                    applicationParametersService.pushVariable('newlyLinkedCardNumber', '12345678');
                    digitalId.authenticate(null, null, 'Test User');
                    scope.initialize();
                    expect(scope.greeting()).toEqual("Card successfully linked. Your card number is 12345678");
                });

                it('should have a newly linked business greeting', function () {
                    applicationParametersService.pushVariable('newlyLinkedCardNumber', '12345678');
                    applicationParametersService.pushVariable('hasBusinessProfile', true);
                    digitalId.authenticate(null, 'Test User');
                    scope.initialize();
                    expect(scope.greeting()).toEqual("Welcome Test User, your business has been successfully linked to your profile");
                });
            });

            describe('initialize', function () {
                it('should set CashflowChartPropertyMapping to Income when the route\'s CashflowChartPropertyMapping parameters = transactional-cash-in', function () {
                    var spy = spyOn(angular.element, ['scrollTo']);
                    routeParams.CashflowChartPropertyMapping = "transactional-cash-in";

                    scope.initialize();

                    expect(scope.CashflowChartPropertyMapping).toEqual("Income");
                    expect(spy).toHaveBeenCalled();
                });

                it('should set CashflowChartPropertyMapping to Expenses when the route\'s CashflowChartPropertyMapping paramters = transactional-cash-out', function () {
                    var spy = spyOn(angular.element, ['scrollTo']);
                    routeParams.CashflowChartPropertyMapping = "transactional-cash-out";

                    scope.initialize();

                    expect(scope.CashflowChartPropertyMapping).toEqual("Expenses");
                    expect(spy).toHaveBeenCalled();
                });

                it('should not set CashflowChartPropertyMapping when the route\'s CashflowChartPropertyMapping paramters != transactional-cash-out or transactional-cash-out', function () {
                    var spy = spyOn(angular.element, ['scrollTo']);
                    routeParams.showdata = "random-route";

                    scope.initialize();

                    expect(scope.CashflowChartPropertyMapping).not.toBeTruthy();
                    expect(spy).not.toHaveBeenCalled();
                });

                it('Should call availableAccounts', function () {
                    spyOn(scope, 'availableAccounts');

                    scope.initialize();

                    expect(scope.availableAccounts).toHaveBeenCalled();
                });

                it("should redirect when accepting invitations", function () {
                    var popVariable = spyOn(applicationParametersService, 'getVariable');
                    popVariable.and.returnValue('/account-sharing/accept-decline-invitation');
                    scope.initialize();

                    expect(popVariable).toHaveBeenCalledWith('acceptInvitationRedirect');

                });
            });

            describe('available accounts', function () {
                var _accountMapping;

                beforeEach(function () {
                    _accountMapping = {
                        'CURRENT': 'Current Account',
                        'CREDIT_CARD': 'Credit Card',
                        'HOME_LOAN': 'Home Loan',
                        'TERM_LOAN': 'Term Loan',
                        'RCP': 'Revolving Credit Plan',
                        'SAVINGS': 'Savings Account',
                        'NOTICE': 'Investment Account',
                        'FIXED_TERM_INVESTMENT': 'Fixed Term Investment',
                        'BUSINESS_CURRENT_ACCOUNT': 'Business Current Account',
                        'UNKNOWN': ''
                    };

                    service.accountTypeName.and.callFake(function (a) {
                        return _accountMapping[a];
                    });
                });

                it('should list all available accounts', function () {
                    var theCard = {number: '122332'};
                    card.current.and.returnValue(theCard);

                    var transactionAccounts = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "CURRENT",
                            "accountTypeName": "Current Account",
                            "availableBalance": 9000.0
                        }
                    ];

                    var creditCard = [
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "CREDIT_CARD",
                            "accountTypeName": "Credit Card",
                            "availableBalance": -11.0
                        }
                    ];

                    var loans = [
                        {
                            "formattedNumber": "98-76-543-210-0",
                            "accountType": "HOME_LOAN",
                            "accountTypeName": "Home Loan",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "TERM_LOAN",
                            "accountTypeName": "Term Loan",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "RCP",
                            "accountTypeName": "Revolving Credit Plan",
                            "availableBalance": -11.0
                        }
                    ];

                    var investments = [
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "SAVINGS",
                            "accountTypeName": "Savings Account",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "NOTICE",
                            "accountTypeName": "Investment Account",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "FIXED_TERM_INVESTMENT",
                            "accountTypeName": "Fixed Term Investment",
                            "availableBalance": -11.0
                        }
                    ];

                    var unknown = [
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "UNKNOWN",
                            "accountTypeName": "",
                            "availableBalance": -11.0
                        }
                    ];

                    var accounts = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "CURRENT",
                            "accountTypeName": "Current Account",
                            "availableBalance": 9000.0
                        },
                        {
                            "formattedNumber": "98-76-543-210-0",
                            "accountType": "HOME_LOAN",
                            "accountTypeName": "Home Loan",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "CREDIT_CARD",
                            "accountTypeName": "Credit Card",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "TERM_LOAN",
                            "accountTypeName": "Term Loan",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "RCP",
                            "accountTypeName": "Revolving Credit Plan",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "SAVINGS",
                            "accountTypeName": "Savings Account",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "NOTICE",
                            "accountTypeName": "Investment Cccount",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "FIXED_TERM_INVESTMENT",
                            "accountTypeName": "Fixed Term Investment",
                            "availableBalance": -11.0
                        },
                        {
                            "formattedNumber": "11-76-543-210-0",
                            "accountType": "UNKNOWN",
                            "accountTypeName": "",
                            "availableBalance": -11.0
                        }

                    ];

                    service.list.and.returnValue(mock.resolve({
                            "accounts": accounts,
                            "cardProfile": {
                                "monthlyEAPLimit": 10000,
                                "monthlyWithdrawalLimit": 10000,
                                "usedEAPLimit": 2000
                            }
                        }
                    ));

                    scope.availableAccounts();
                    scope.$digest();

                    expect(scope.transactionAccounts).toEqual(transactionAccounts);
                    expect(scope.creditCard).toEqual(creditCard);
                    expect(scope.loans).toEqual(loans);
                    expect(scope.investments).toEqual(investments);
                    expect(scope.unknown).toEqual(unknown);
                    expect(service.list).toHaveBeenCalledWith(theCard);
                });

                it('should list accounts with custom product names', function () {
                    var accounts = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "CURRENT",
                            "accountTypeName": "Current Account",
                            "customName": "Custom current account",
                            "availableBalance": 9000.0
                        },
                        {
                            "formattedNumber": "98-76-543-210-0",
                            "accountType": "HOME_LOAN",
                            "accountTypeName": "Home Loan",
                            "customName": "Custom loan",
                            "availableBalance": -11.0
                        }

                    ];

                    var transactionAccounts = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "CURRENT",
                            "accountTypeName": "Current Account",
                            "productName": "Custom current account",
                            "customName": "Custom current account",
                            "availableBalance": 9000.0
                        }
                    ];


                    var loans = [
                        {
                            "formattedNumber": "98-76-543-210-0",
                            "accountType": "HOME_LOAN",
                            "accountTypeName": "Home Loan",
                            "productName": "Custom loan",
                            "customName": "Custom loan",
                            "availableBalance": -11.0
                        }
                    ];

                    card.current.and.returnValue({number: '123'});
                    service.list.and.returnValue(mock.resolve({"accounts": accounts}));

                    scope.availableAccounts();
                    scope.$digest();

                    expect(scope.transactionAccounts).toEqual(transactionAccounts);
                    expect(scope.loans).toEqual(loans);
                });

                it('should show info message without available account', function () {
                    service.list.and.returnValue(mock.resolve({
                            "accounts": [],
                            "cardProfile": {
                                "monthlyEAPLimit": 10000,
                                "monthlyWithdrawalLimit": 10000,
                                "usedEAPLimit": 2000
                            }
                        }
                    ));

                    scope.availableAccounts();
                    scope.$digest();

                    expect(scope.infoMessage).toEqual('There are currently no accounts linked to your card. Please visit your nearest branch');
                });

                it('should have empty list of accounts when accounts cannot be retrieved', function () {
                    card.current.and.returnValue({number: '123'});
                    service.list.and.returnValue(mock.reject({}));

                    scope.availableAccounts();
                    scope.$digest();

                    expect(scope.transactionAccounts).toEqual([]);
                    expect(scope.creditCard).toEqual([]);
                    expect(scope.loans).toEqual([]);
                    expect(scope.investments).toEqual([]);
                    expect(scope.unknown).toEqual([]);
                });

                it('should display an error when accounts cannot be retrieved', function () {
                    card.current.and.returnValue({number: '123'});
                    service.list.and.returnValue(mock.reject({}));

                    scope.availableAccounts();
                    scope.$digest();

                    expect(scope.errorMessage).toEqual('An error occurred, please try again later');
                });

                it('should have empty list of accounts when service call is successful but no accounts are available', function () {
                    card.current.and.returnValue({number: '123'});

                    service.list.and.returnValue(mock.resolve(
                        {
                            somethingElse: '213231',
                            "cardProfile": {
                                "monthlyEAPLimit": {
                                    "amount": 0.00,
                                    "currency": "ZAR"
                                }
                            }
                        }));

                    scope.availableAccounts();
                    scope.$digest();

                    expect(scope.transactionAccounts).toEqual([]);
                    expect(scope.creditCard).toEqual([]);
                    expect(scope.loans).toEqual([]);
                    expect(scope.investments).toEqual([]);
                    expect(scope.unknown).toEqual([]);
                });
            });

            describe('has info', function () {
                it('should know the information bar can be removed on load of account summary page', function () {
                    scope.transactionAccounts = [];
                    scope.hasAccounts(scope.transactionAccounts);
                    expect(applicationParametersService.getVariable('hasInfo')).toBeFalsy();
                });
            });

            describe('custom message', function () {
                var popVariable;

                beforeEach(function () {
                    popVariable = spyOn(applicationParametersService, 'popVariable');
                    popVariable.and.returnValue('Custom welcome message');

                    invokeController();

                    scope.initialize();
                });

                it('should read custom message from application parameters', function () {
                    expect(popVariable).toHaveBeenCalledWith('customMessage');
                });

                it('should put custom message on scope', function () {
                    expect(scope.customMessage).toEqual('Custom welcome message');
                });
            });

            describe('has accounts', function () {
                it('should know when there are no transaction accounts', function () {
                    scope.transactionAccounts = [];
                    expect(scope.hasAccounts(scope.transactionAccounts)).toBeFalsy();
                });

                it('should know when there are transaction accounts', function () {
                    scope.transactionAccounts = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "CURRENT",
                            "accountTypeName": "Current Account",
                            "availableBalance": 9000.0
                        }
                    ];
                    expect(scope.hasAccounts(scope.transactionAccounts)).toBeTruthy();
                });

                it('should know when there are no credit card accounts', function () {
                    scope.creditCard = [];
                    expect(scope.hasAccounts(scope.creditCard)).toBeFalsy();
                });

                it('should know when there are credit card accounts', function () {
                    scope.creditCard = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountTypeName": "Credit Card",
                            "accountType": "CREDIT_CARD",
                            "availableBalance": 9000.0
                        }
                    ];
                    expect(scope.hasAccounts(scope.creditCard)).toBeTruthy();
                });

                it('should know when there are no loan accounts', function () {
                    scope.loans = [];
                    expect(scope.hasAccounts(scope.loans)).toBeFalsy();
                });

                it('should know when there are loan accounts', function () {
                    scope.loans = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "HOME_LOAN",
                            "availableBalance": 9000.0
                        }
                    ];
                    expect(scope.hasAccounts(scope.loans)).toBeTruthy();
                });

                it('should know when there are no investment accounts', function () {
                    scope.investments = [];
                    expect(scope.hasAccounts(scope.investments)).toBeFalsy();
                });

                it('should know when there are investment accounts', function () {
                    scope.investments = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "NOTICE",
                            "availableBalance": 9000.0
                        }
                    ];
                    expect(scope.hasAccounts(scope.investments)).toBeTruthy();
                });

                it('should know when there are no unknown accounts', function () {
                    scope.unknown = [];
                    expect(scope.hasAccounts(scope.unknown)).toBeFalsy();
                });

                it('should know when there are unknown accounts', function () {
                    scope.unknown = [
                        {
                            "formattedNumber": "12-34-567-890-0",
                            "accountType": "UNKNOWN",
                            "availableBalance": 9000.0
                        }
                    ];
                    expect(scope.hasAccounts(scope.unknown)).toBeTruthy();
                });

                it('should return false when accounts array passed into it is undefined', function () {
                    var undefinedVariable;
                    expect(scope.hasAccounts(undefinedVariable)).toBeFalsy();
                });
            });

            describe('is successful', function () {
                it('should know the password has changed successfully', function () {
                    applicationParametersService.pushVariable('passwordHasChanged', true);

                    controller('AccountSummaryController',
                        {
                            $scope: scope,
                            Menu: menu,
                            Card: card,
                            AccountsService: service,
                            ApplicationParameters: applicationParametersService,
                            $location: location,
                            User: user,
                            EntitlementsBeneficiaryPaymentService: entitlementsBeneficiaryPaymentService
                        });

                    expect(scope.isSuccessful).toBeTruthy();
                    expect(applicationParametersService.getVariable('passwordHasChanged')).toBeUndefined();
                });
            });

            describe('is current dashboard card holder', function () {
                it('should return true when user is the cardholder for the current dashboard', function () {
                    user.isCurrentDashboardCardHolder.and.returnValue(true);

                    expect(scope.isCurrentDashboardCardHolder()).toBeTruthy();
                });

                it('should return false when user is not the cardholder for the current dashboard', function () {
                    user.isCurrentDashboardCardHolder.and.returnValue(false);

                    expect(scope.isCurrentDashboardCardHolder()).toBeFalsy();
                });
            });

            describe('Given a list of accounts and a personal finance management id', function () {

                describe('With personalFinanceManagementToggle on', function () {
                    var accountResponse;
                    var defaultPersonalFinanceManagementFeature = personalFinanceManagementFeature;

                    beforeEach(function () {
                        personalFinanceManagementFeature = true;

                        accountResponse = {accounts: ['Test Account To Be Returned From Service Call']};
                        service.list.and.returnValue(mock.resolve(accountResponse));
                    });

                    it('Should build a menigaProfile with the list of accounts and  personal finance management id', function () {

                        var usersCard = {personalFinanceManagementId: 'Test PFMID', number: 'Test Number'};
                        card.current.and.returnValue(usersCard);

                        scope.availableAccounts();

                        scope.$digest();

                        expect(scope.menigaProfile).toBeDefined();

                        expect(scope.menigaProfile.personalFinanceManagementId).toEqual(usersCard.personalFinanceManagementId);
                        expect(scope.menigaProfile.accounts).toBe(accountResponse.accounts);

                    });

                    it('Should Not build a MenigaProfile when the user has no card', function () {
                        card.current.and.returnValue(null);

                        scope.availableAccounts();
                        scope.$digest();

                        expect(scope.menigaProfile).toBeUndefined();
                    });

                    afterEach(function () {
                        personalFinanceManagementFeature = defaultPersonalFinanceManagementFeature;
                    });
                });

                describe('With personalFinanceManagementToggle off', function () {
                    var accountResponse;
                    var defaultPersonalFinanceManagementFeature = personalFinanceManagementFeature;

                    beforeEach(function () {
                        personalFinanceManagementFeature = false;

                        accountResponse = {accounts: ['Test Account To Be Returned From Service Call']};
                        service.list.and.returnValue(mock.resolve(accountResponse));
                    });

                    it('Should NOT build a menigaProfile with the list of accounts and  personal finance management id', function () {

                        var usersCard = {personalFinanceManagementId: 'Test PFMID', number: 'Test Number'};
                        card.current.and.returnValue(usersCard);

                        scope.availableAccounts();

                        scope.$digest();

                        expect(scope.menigaProfile).toBeUndefined();
                    });

                    afterEach(function () {
                        personalFinanceManagementFeature = defaultPersonalFinanceManagementFeature;
                    });
                });
            });


        });
    });
});
