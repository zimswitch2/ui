describe('Overview', function () {

    beforeEach(module('refresh.overview.controller', 'refresh.common.homeService'));

    describe('when landing on the overview page', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should use the correct controller ', function () {
            expect(route.routes['/overview'].controller).toEqual('OverviewController');
        });

        it('should use the correct template ', function () {
            expect(route.routes['/overview'].templateUrl).toEqual('features/overview/partials/overview.html');
        });
    });

    describe('Controller', function () {
        var scope, mock, service, card, usersCard, applicationParametersService, rootScope,
            controller, digitalId, accountsValidationService, location, homeService;

        beforeEach(inject(function ($rootScope, $controller, $injector, _mock_, ApplicationParameters, DigitalId,
                                    AccountsValidationService, HomeService) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
            mock = _mock_;
            applicationParametersService = ApplicationParameters;
            controller = $controller;
            digitalId = DigitalId;
            accountsValidationService = AccountsValidationService;
            location = jasmine.createSpyObj('location', ['path']);
            service = jasmine.createSpyObj('service', ['list']);
            card = jasmine.createSpyObj('card', ['current']);
            homeService = HomeService;
            spyOn(homeService, ['goHome']);

            $controller('OverviewController',
                {
                    $scope: scope,
                    DigitalId: digitalId,
                    AccountsService: service,
                    Card: card,
                    ApplicationParameters: applicationParametersService,
                    AccountsValidationService: accountsValidationService,
                    $location: location
                });
            usersCard = {
                number: "1234567890",
                personalFinanceManagementId: 9
            };
            card.current.and.returnValue(usersCard);
        }));

        it('should not automatically load the net income chart', function () {
            expect(scope.ShowNetIncomeChart).toBeFalsy();
        });

        describe('initialize', function () {

            beforeEach(function () {
                service.list.and.returnValue(mock.resolve({
                        "accounts": []
                    }
                ));
            });

            it('should set newly linked card', function () {
                applicationParametersService.pushVariable('hasInfo', true);
                applicationParametersService.pushVariable('newlyLinkedCardNumber', '9090909909');
                scope.initialize();

                expect(scope.hasInfo).toBeTruthy();
                expect(scope.newlyLinkedCardNumber).toBe('9090909909');
            });

            it('should indicate that data displayed includes activity from the 1st of previous month', function () {
                var date = new Date();
                date.setDate(1);
                date.setMonth(date.getMonth() - 1);

                scope.initialize();

                expect(scope.ActivitySince.getYear()).toEqual(date.getYear());
                expect(scope.ActivitySince.getMonth()).toEqual(date.getMonth());
                expect(scope.ActivitySince.getDay()).toEqual(date.getDay());
            });
        });

        describe('greeting', function () {
            beforeEach(function () {
                service.list.and.returnValue(mock.resolve({
                        "accounts": []
                    }
                ));
            });

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
        });

        describe('products family', function () {
            it('should call list on accounts service', function () {
                var theCard = {number: '122332'};
                card.current.and.returnValue(theCard);

                var accounts = [
                    {
                        "formattedNumber": "12-34-567-890-0",
                        "accountType": "CURRENT",
                        "accountTypeName": "Current Account",
                        "availableBalance": {
                            amount: 9000.0
                        }
                    },
                    {
                        "formattedNumber": "98-76-543-210-0",
                        "accountType": "HOME_LOAN",
                        "accountTypeName": "Home Loan",
                        "availableBalance": {
                            amount: -11.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "CREDIT_CARD",
                        "accountTypeName": "Credit Card",
                        "availableBalance": {
                            amount: -11.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "TERM_LOAN",
                        "accountTypeName": "Term Loan",
                        "availableBalance": {
                            amount: -11.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "RCP",
                        "accountTypeName": "Revolving Credit Plan",
                        "availableBalance": {
                            amount: -11.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "SAVINGS",
                        "accountTypeName": "Savings Account",
                        "availableBalance": {
                            amount: 800.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "NOTICE",
                        "accountTypeName": "Investment Cccount",
                        "availableBalance": {
                            amount: 500.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "FIXED_TERM_INVESTMENT",
                        "accountTypeName": "Fixed Term Investment",
                        "availableBalance": {
                            amount: 100.0
                        }
                    },
                    {
                        "formattedNumber": "11-76-543-210-0",
                        "accountType": "UNKNOWN",
                        "accountTypeName": "",
                        "availableBalance": {
                            amount: -11.0
                        }
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

                scope.availableProducts();
                scope.$digest();

                expect(scope.transactionalBalance.amount).toEqual(9000.0);
                expect(scope.transactionalBalance.hasAmount).toBeTruthy();
                expect(scope.creditBalance.amount).toEqual(-11.0);
                expect(scope.creditBalance.hasAmount).toBeTruthy();
                expect(scope.loanBalance.amount).toEqual(-33.0);
                expect(scope.loanBalance.hasAmount).toBeTruthy();
                expect(scope.investmentBalance.amount).toEqual(1400);
                expect(scope.investmentBalance.hasAmount).toBeTruthy();
                expect(service.list).toHaveBeenCalledWith(theCard);
            });

            it('should only aggregate product family available', function () {
                var theCard = {number: '122332'};
                card.current.and.returnValue(theCard);

                var accounts = [
                    {
                        "formattedNumber": "12-34-567-890-0",
                        "accountType": "CURRENT",
                        "accountTypeName": "Current Account",
                        "availableBalance": {
                            amount: 9000.0
                        }
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

                scope.availableProducts();
                scope.$digest();

                expect(scope.transactionalBalance.amount).toEqual(9000.0);
                expect(scope.transactionalBalance.hasAmount).toBeTruthy();
                expect(scope.creditBalance.hasAmount).toBeFalsy();
                expect(scope.loanBalance.hasAmount).toBeFalsy();
                expect(scope.investmentBalance.hasAmount).toBeFalsy();
                expect(service.list).toHaveBeenCalledWith(theCard);
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

                scope.availableProducts();
                scope.$digest();

                expect(scope.infoMessage).toEqual('There are currently no accounts linked to your card. Please visit your nearest branch');
            });

            it('should have zero as balance when accounts cannot be retrieved', function () {
                card.current.and.returnValue({number: '123'});
                service.list.and.returnValue(mock.reject({}));

                scope.availableProducts();
                scope.$digest();

                expect(scope.transactionalBalance).toEqual(0);
            });

            it('should display an error when accounts cannot be retrieved', function () {
                card.current.and.returnValue({number: '123'});
                service.list.and.returnValue(mock.reject({}));

                scope.availableProducts();
                scope.$digest();

                expect(scope.errorMessage).toEqual('An error occurred, please try again later');
            });

            it('should navigate to account summary', function () {
                expect(scope.navigateToAccountSummary).toBeDefined();
                scope.navigateToAccountSummary();
                //expect(location.path).toHaveBeenCalledWith('/account-summary');
                expect(homeService.goHome).toHaveBeenCalled();
            });

            describe('Defining a meniga profile', function () {
                var accounts;
                beforeEach(function () {

                    accounts = [];

                    service.list.and.returnValue(mock.resolve({
                           "accounts": accounts
                        }
                    ));
                    scope.availableProducts();
                    scope.$digest();
                });

                it('should set a scope level meniga profile property', function () {

                    expect(scope.menigaProfile).toBeDefined();
                    expect(scope.menigaProfile).not.toBeNull();
                });

                it('should set the meniga profile personal finance management id to the value in the user\'s card', function () {

                    expect(scope.menigaProfile.personalFinanceManagementId).toEqual(usersCard.personalFinanceManagementId);
                });

                it('should set the meniga profile accounts list to the value returned from accounts service list', function () {

                    expect(scope.menigaProfile.accounts).toBe(accounts);
                });
            });
        });

        describe('Responding to the ShowNetIncomeDoughnutChart event', function() {
            it('Should set ShowNetIncomeChart to true', function () {
                scope.$emit('ShowNetIncomeDoughnutChart');
                scope.$digest();
                expect(scope.ShowNetIncomeChart).toBeTruthy();
            });
        });
    });
});
