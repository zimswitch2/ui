describe('Transfers', function () {
    beforeEach(module('refresh.transfers', 'refresh.accounts', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a transfer is to be made', function () {
            it('should use the correct controller', function () {
                expect(route.routes['/transfers'].controller).toEqual('TransfersController');
            });
        });
    });

    describe('controller', function () {
        beforeEach(module('refresh.accounts'));
        var rootScope, scope, card, transferService, accountsService, accountsData, mock, flow;
        beforeEach(inject(function ($controller, $rootScope, Fixture, _mock_, Flow, AccountsService) {
            rootScope = $rootScope;
            mock = _mock_;
            scope = $rootScope.$new();
            flow = Flow;

            accountsData = JSON.parse(Fixture.load('base/test/unit/fixtures/listAccountsResponse.json'));

            accountsService = AccountsService;
            spyOn(accountsService, 'list');
            spyOn(accountsService, 'availableBalanceFor');
            accountsService.list.and.returnValue(mock.resolve(accountsData));

            transferService = jasmine.createSpyObj('transferService', ['transfer', 'transferPossible']);
            transferService.transfer.and.returnValue(mock.resolve(function () {
            }));
            transferService.transferPossible.and.returnValue(mock.resolve(true));

            card = jasmine.createSpyObj('card', ['current']);
            card.current.and.returnValue({number: 'ABC123'});

            $controller('TransfersController', {
                $scope: scope,
                Flow: flow,
                AccountsService: accountsService,
                TransferService: transferService,
                Card: card
            });

            rootScope.$broadcast('loggedIn');
            scope.initialize();
            rootScope.$digest();
        }));

        describe('initialize', function () {
            it('should create the flow', function () {
                var steps = flow.steps();
                expect(steps.length).toEqual(2);
                expect(steps[0]).toEqual({name: "Capture details", complete: false, current: true});
                expect(steps[1]).toEqual({name: "Confirm details", complete: false, current: false});
            });

            it('should fetch a list of accounts', function () {
                expect(scope.accounts).toEqual(accountsData.accounts);
            });

            it('should add a label function to each account', function () {
                var firstAccount = scope.accounts[0];
                expect(firstAccount.label()).toEqual(firstAccount.productName + ' - ' + firstAccount.formattedNumber);
            });

            describe('transfer possible', function () {
                it('should set true when service returns true', function () {
                    expect(scope.transferPossible).toBeTruthy();
                });

                it('should set false when service returns false', function () {
                    transferService.transferPossible.and.returnValue(mock.resolve(false));
                    scope.initialize();
                    rootScope.$digest();
                    expect(scope.transferPossible).toBeFalsy();
                });
            });
        });

        describe('limits', function () {
            it('should know when to highlight the available balance', function () {
                scope.transfer.amount = scope.transfer.from.availableBalance.amount + 1;
                expect(scope.highlightBalance()).toBeTruthy();
            });

            it('should know when to enforce the available balance', function () {
                expect(scope.enforcer(scope.transfer.from.availableBalance.amount + 1)).toEqual({
                    error: true,
                    type: 'availableBalanceExceeded',
                    message: 'The amount exceeds your available balance'
                });
            });

            it('should know when to hint for correct transfer amounts', function () {
                expect(scope.hinter(scope.transfer.from, scope.transfer.to)).toBeUndefined();
            });

            it('should know watched elements and scope to hint', function () {
                expect(scope.hintWatcher().scope).toEqual(scope);
                expect(scope.hintWatcher().elements).toEqual(['transfer.amount', 'transfer.from', 'transfer.to']);
            });
        });

        describe('#editing', function () {
            it('should know editing is true when the controller is initialized', function () {
                expect(scope.editing()).toBeTruthy();
            });
        });

        describe('#confirming', function () {
            it('should know confirming is true after proceed', function () {
                scope.proceed();
                expect(scope.confirming()).toBeTruthy();
            });
        });

        describe('#finished', function () {
            it('should know finished is true after transfer', function () {
                scope.proceed();
                scope.transfer();
                scope.$digest();
                expect(scope.finished()).toBeTruthy();
            });
        });

        describe('account lists', function () {
            var currentAccount, savingsAccount;
            beforeEach(function () {
                currentAccount = _.where(accountsData.accounts, {'accountType': 'CURRENT'})[0];
                savingsAccount = _.where(accountsData.accounts, {'accountType': 'SAVINGS'})[0];
                this.fromAccounts = _.where(accountsData.accounts, {
                    'accountFeature': [
                        {feature: 'TRANSFERFROM', value: true}
                    ]
                });
                this.toAccounts = _.where(accountsData.accounts, {
                    'accountFeature': [
                        {feature: 'TRANSFERTO', value: true}
                    ]
                });
            });

            it('should ensure that the transfer.from object is defined ', function () {
                scope.transfer.from = savingsAccount;
                scope.$digest();
                expect(scope.fromAvailableBalance).toEqual(100000.00);
                scope.transfer.to = undefined;
                scope.$digest();
                expect(scope.fromAvailableBalance).toEqual(100000.00);
            });

            it('should ensure that the transfer.to object is defined ', function () {
                scope.transfer.to = currentAccount;
                scope.$digest();
                expect(scope.toAvailableBalance).toEqual(8756.41);
                scope.transfer.from = undefined;
                scope.$digest();
                expect(scope.toAvailableBalance).toEqual(8756.41);
            });

            it('should filter accounts with transferFrom feature', function () {
                scope.transfer.to = savingsAccount;
                scope.transferFromAccounts();
                expect(scope.transferFromAccounts()).toEqual(this.fromAccounts);
            });

            it('should filter accounts with transferTo feature', function () {
                scope.transfer.from = currentAccount;
                scope.transferToAccounts();
                expect(scope.transferToAccounts()).toEqual(this.toAccounts);
            });
        });

        describe('available balance', function () {
            var current, savings;
            beforeEach(function () {
                var listOfAccounts = scope.transferFromAccounts();
                current = _.where(listOfAccounts, {'accountType': 'CURRENT'})[0];
                savings = _.where(listOfAccounts, {'accountType': 'SAVINGS'})[0];

            });
            describe('for capture details', function () {
                it('should change "From" available balance when selected account changes', function () {
                    scope.fromAvailableBalance = current.availableBalance.amount;
                    expect(scope.fromAvailableBalance).toEqual(8756.41);
                    scope.transfer.from = savings;
                    scope.$digest();
                    expect(scope.fromAvailableBalance).toEqual(100000.00);
                });

                it('should change "To" available balance when selected account changes', function () {
                    scope.toAvailableBalance = savings.availableBalance.amount;
                    expect(scope.toAvailableBalance).toEqual(100000.00);
                    scope.transfer.to = current;
                    scope.$digest();
                    expect(scope.toAvailableBalance).toEqual(8756.41);
                });
            });

            describe('for confirm details', function () {
                beforeEach(function () {
                    scope.transfer.amount = 100;
                    scope.transfer.from = current;
                    scope.transfer.to = savings;
                });

                it('should not change "From" available balance when transfer fails', function () {
                    scope.fromAvailableBalance = current.availableBalance.amount;
                    expect(scope.fromAvailableBalance).toEqual(8756.41);
                    scope.isSuccessful = false;
                    scope.$digest();
                    expect(scope.fromAvailableBalance).toEqual(8756.41);
                });

                it('should not change "To" available balance when transfer fails', function () {
                    scope.toAvailableBalance = savings.availableBalance.amount;
                    expect(scope.toAvailableBalance).toEqual(100000.00);
                    scope.isSuccessful = false;
                    scope.$digest();
                    expect(scope.toAvailableBalance).toEqual(100000.00);
                });

                it('should adjust "From" available balance when transfer is successful', function () {
                    var availableBalanceAfterTrasnfer = 123.45;
                    accountsService.availableBalanceFor.and.returnValue(availableBalanceAfterTrasnfer);
                    scope.fromAvailableBalance = current.availableBalance.amount;
                    expect(scope.fromAvailableBalance).toEqual(8756.41);

                    scope.isSuccessful = true;
                    scope.$digest();

                    expect(scope.fromAvailableBalance).toEqual(availableBalanceAfterTrasnfer);
                    expect(accountsService.availableBalanceFor).toHaveBeenCalledWith(accountsData.accounts, scope.transfer.from.number);
                });

                it('should adjust "To" available balance when transfer is successful', function () {
                    var availableBalanceAfterTransfer = 678.90;
                    accountsService.availableBalanceFor.and.returnValue(availableBalanceAfterTransfer);
                    scope.toAvailableBalance = savings.availableBalance.amount;
                    expect(scope.toAvailableBalance).toEqual(100000.00);

                    scope.isSuccessful = true;
                    scope.$digest();

                    expect(scope.toAvailableBalance).toEqual(availableBalanceAfterTransfer);
                    expect(accountsService.availableBalanceFor).toHaveBeenCalledWith(accountsData.accounts, scope.transfer.to.number);
                });
            });
        });

        describe('proceed()', function () {
            it('should navigate to the confirm page', function () {
                scope.proceed();

                var steps = flow.steps();
                expect(steps[0]).toEqual({name: "Capture details", complete: true, current: false});
                expect(steps[1]).toEqual({name: "Confirm details", complete: false, current: true});
            });
            it('should not in edit mode', function () {
                scope.proceed();
                expect(scope.editing()).toBeFalsy();
            });
        });

        describe('modify()', function () {
            it('should enable editing', function () {
                scope.proceed();
                var steps = flow.steps();
                expect(steps[0]).toEqual({name: "Capture details", complete: true, current: false});
                scope.modify();
                steps = flow.steps();
                expect(steps[0]).toEqual({name: "Capture details", complete: false, current: true});
                expect(scope.editing()).toBeTruthy();
            });
        });

        describe('transfer()', function () {
            describe('when successful', function () {
                it('should set flag indicating success', function () {
                    scope.transfer();
                    scope.$digest();
                    expect(scope.isSuccessful).toBeTruthy();
                    expect(scope.errorMessage).toBeFalsy();
                });
            });

            describe('when unsuccessful', function () {
                it('should set the error flag and message when an error occurs', function () {
                    transferService.transfer.and.returnValue(mock.reject({message: 'Foobar'}));
                    scope.transfer();
                    scope.$digest();
                    expect(scope.errorMessage).toEqual('Foobar');
                    expect(scope.isSuccessful).toBeFalsy();
                });
            });
        });
    });
});
