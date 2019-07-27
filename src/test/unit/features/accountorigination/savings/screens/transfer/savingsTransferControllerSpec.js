describe('Savings Transfer', function () {

    'use strict';

    beforeEach(module('refresh.accountOrigination.savings.screens.transfer',
        'refresh.transfers',
        'refresh.accounts',
        'refresh.test',
        'refresh.configuration',
        'refresh.navigation',
        'refresh.fixture',
        'refresh.metadata',
        'refresh.parameters'));

    describe("routes", function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when at Savings transfer page", function () {

            it("should use the correct template", function () {
                expect(route.routes['/apply/:productName/transfer'].templateUrl).toEqual('features/accountorigination/savings/screens/transfer/partials/savingsTransfer.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/:productName/transfer'].controller).toEqual('SavingsTransferController');
            });
        });
    });

    describe('controller', function () {
        var controller, scope, routeParams,Flow, location, card, mock, current,credit, accountsData, accountsService, SavingsAccountApplication;

        var invokeController = function () {
            controller('SavingsTransferController', {
                $scope: scope,
                Flow: Flow,
                $location: location,
                Card: card,
                AccountsService: accountsService
            });
            scope.$digest();
        };

        describe('custom maximum limit hint message on initial deposit amount', function () {

            beforeEach(inject(function ($rootScope, $controller, $routeParams,_$location_, _mock_, _Flow_, Fixture, AccountsService, _SavingsAccountApplication_) {
                scope = $rootScope.$new();
                routeParams = $routeParams;
                controller = $controller;
                Flow = _Flow_;
                location = _$location_;
                mock = _mock_;

                accountsData = JSON.parse(Fixture.load('base/test/unit/fixtures/listAccountsResponse.json'));

                accountsService = AccountsService;

                spyOn(accountsService, 'list');
                spyOn(accountsService, 'availableBalanceFor');
                accountsService.list.and.returnValue(mock.resolve(accountsData));

                SavingsAccountApplication = _SavingsAccountApplication_;
                spyOn(SavingsAccountApplication, 'minimumInitialDeposit').and.returnValue(5000);
                spyOn(SavingsAccountApplication, 'maximumInitialDeposit').and.returnValue(500000);
                spyOn(SavingsAccountApplication, 'maximumInitialDepositExceededMessage').and.returnValue("The maximum amount has been exceeded");
                spyOn(SavingsAccountApplication, 'initialDepositAmountHints').and.returnValue([{
                    amount: 30000,
                    hint: 'Please note that you have specified an amount that is greater than R30000'
                }, {
                    amount: 60000,
                    hint: 'Please note that you have specified an amount that is greater than R60000'
                }]);
                spyOn(SavingsAccountApplication, 'productName').and.returnValue("SavingsProduct");
                spyOn(SavingsAccountApplication, 'transferPageAdditionalInformation').and.returnValue("Additional information below minimum deposit amount");
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: 'ABC123'});

                invokeController();

                var listOfAccounts = scope.transferFromAccounts();
                current = _.where(listOfAccounts, {'accountType': 'CURRENT'})[0];
                credit = _.where(listOfAccounts, {'accountType': 'CREDIT_CARD'})[0];
            }));

            describe('initialize', function() {

                it("should set the product's name on the scope", function () {
                    expect(scope.ProductName).toBe('SavingsProduct');
                });

                it("should set the product's name on the scope", function () {
                    expect(scope.AdditionalInformation).toBe('Additional information below minimum deposit amount');
                });

                it('should fetch a list of accounts', function () {
                    expect(scope.accounts).toEqual(accountsData.accounts);
                });

                it('should add a label function to each account', function () {
                    var firstAccount = scope.accounts[0];
                    expect(firstAccount.label()).toEqual(firstAccount.productName + ' - ' + firstAccount.formattedNumber);
                });

                it('should default transfer amount to R5000', function () {
                    expect(scope.transfer.amount).toEqual(5000);
                });

                it('should default minimum amount to R5000', function () {
                    expect(scope.transfer.minimumAmount).toEqual(5000);
                });

                it('should default maximum amount to R5000', function () {
                    expect(scope.transfer.maximumAmount).toEqual(500000);
                });

                it('should default maximum amount exceeded message to The maximum amount has been exceeded', function () {
                    expect(scope.transfer.maximumAmountExceededMessage).toBe("The maximum amount has been exceeded");
                });

                it('should default errorMessage to undefined', function () {
                    expect(scope.errorMessage).toBeUndefined();
                });

                it('should default errorMessage to undefined', function () {
                    expect(scope.errorMessage).toBeUndefined();
                });

                describe('when transferFromAccount and initialDeposit have already been specified', function () {
                    beforeEach(function () {
                        SavingsAccountApplication.setInitialDeposit({
                            transferFromAccount: accountsData.accounts[1],
                            initialDepositAmount: 9999
                        });
                        invokeController();
                    });

                    it('Should select the account specified previously', function () {
                        expect(scope.transfer.from).toEqual(accountsData.accounts[1]);
                    });

                    it('Should set the initial deposit specified previously', function () {
                        expect(scope.transfer.amount).toEqual(9999);
                    });
                });
            });

            describe('account lists', function () {
                it('should ensure that the transfer.from object is defined ', function () {
                    scope.transfer.from = current;
                    scope.$digest();
                    expect(scope.fromAvailableBalance).toEqual(8756.41);
                });
            });

            describe('deposit limits', function () {
                it('should know when to highlight', function () {
                    scope.transfer.amount = 4000;
                    expect(scope.highlightBalance()).toBeTruthy();
                });

                it('should allow a minimum transfer of R5000', function () {
                    scope.transfer.amount = 4000;
                    expect(scope.enforcer(scope.transfer.amount)).toEqual({
                        error: true,
                        type: 'minimumLimit',
                        message: 'Enter an amount of at least R5000'
                    });
                });

                it('should allow a maximum transfer of R500 000 and display a custom error hint when value is exceeded', function () {
                    scope.transfer.amount = 500000.01;
                    scope.transfer.from = credit;
                    expect(scope.enforcer(scope.transfer.amount)).toEqual({
                        error: true,
                        type: 'maximumLimit',
                        message: 'The maximum amount has been exceeded'
                    });
                });

                it('should display a custom hint when value is passes amount hints', function () {
                    scope.transfer.from = credit;
                    scope.transfer.amount = 30000.01;
                    expect(scope.enforcer(scope.transfer.amount)).toEqual({
                        error: false,
                        type: 'amountHint',
                        message: 'Please note that you have specified an amount that is greater than R30000'
                    });

                    scope.transfer.amount = 60000.01;
                    expect(scope.enforcer(scope.transfer.amount)).toEqual({
                        error: false,
                        type: 'amountHint',
                        message: 'Please note that you have specified an amount that is greater than R60000'
                    });
                });

                it('the amount should not exceed the available balance', function () {
                    scope.transfer.from = current;
                    expect(scope.enforcer(scope.transfer.from.availableBalance.amount + 1)).toEqual({
                        error: true,
                        type: 'availableBalanceExceeded',
                        message: 'The amount exceeds your available balance'
                    });
                });

                it('should know watched elements and scope to hint', function () {
                    expect(scope.hintWatcher().scope).toEqual(scope);
                    expect(scope.hintWatcher().elements).toEqual(['transfer.amount', 'transfer.from']);
                });
            });

            describe('available balance', function () {
                it('should update "From" available balance when selected account changes', function () {
                    scope.transfer.from = current;
                    scope.$digest();
                    expect(scope.fromAvailableBalance).toEqual(8756.41);

                    scope.transfer.from = credit;
                    scope.$digest();
                    expect(scope.fromAvailableBalance).toEqual(99919239.00);

                    scope.transfer.from = undefined;
                    scope.$digest();
                    expect(scope.fromAvailableBalance).toEqual(99919239.00);
                });
            });

            describe('deposit possible', function () {
                it('should give an error when an account with less than R5000 is selected', function(){
                    current.availableBalance.amount = 4000;
                    scope.transfer.from = current;
                    scope.$digest();
                    expect(scope.depositPossible()).toBeFalsy();
                });

                it('should not give an error when an account with more than R5000 is selected', function(){
                    current.availableBalance.amount = 7000;
                    scope.transfer.from = current;
                    scope.$digest();
                    expect(scope.depositPossible()).toBeTruthy();
                });

                it('should allow a minimum transfer of R5000', function () {
                    scope.transfer.amount = 4000;
                    scope.$digest();
                    expect(scope.depositPossible()).toBeFalsy();
                });

                it('should not enable transfer when there are no accounts loaded', function () {
                    spyOn(accountsService, 'validTransferFromAccounts');
                    accountsService.validTransferFromAccounts.and.returnValue([]);
                    expect(scope.depositPossible()).toBeFalsy();
                    scope.$digest();
                });

                it('should not enable transfer when amount format is incorrect', function () {
                    scope.transfer.amount = 'zzz';
                    scope.$digest();
                    expect(scope.enforcer(scope.transfer.amount)).toEqual({
                        error: true,
                        type: 'currencyFormat',
                        message: 'Please enter the amount in a valid format'
                    });
                });
            });

            describe('no transactional accounts', function(){

                beforeEach(function(){
                    spyOn(accountsService, 'validTransferFromAccounts');
                    accountsService.validTransferFromAccounts.and.returnValue([]);
                });

                it('should refer user to branch if they do not have a transactional account', function(){
                    expect(scope.depositPossible()).toBeFalsy();
                    expect(scope.transferFromAccounts().length).toBe(0);
                    expect(scope.errorMessage).toEqual('You need a current account before you can open a savings or investment account. Please visit your nearest branch');
                });
            });

            describe('next button clicked',function(){
                var Flow, locationPath;

                beforeEach(inject(function (_Flow_) {
                    Flow = _Flow_;
                    spyOn(Flow, 'next');
                    locationPath = { replace: function () {} };
                    spyOn(location,'path').and.returnValue(locationPath);
                    spyOn(locationPath, 'replace');
                    spyOn(SavingsAccountApplication, 'setInitialDeposit');
                    routeParams.productName = 'savings-product';
                    scope.proceed();
                }));

                it('should call Flow.next', function () {
                    expect(Flow.next).toHaveBeenCalled();
                });

                it('should go to savings accept page for savings-product', function () {
                    expect(location.path).toHaveBeenCalledWith('/apply/savings-product/accept');
                    expect(locationPath.replace).toHaveBeenCalled();
                });

                it('should call setInitialDeposit on SavingsAccountApplication', function () {
                    expect(SavingsAccountApplication.setInitialDeposit).toHaveBeenCalledWith({
                        transferFromAccount: scope.transfer.from,
                        initialDepositAmount: scope.transfer.amount
                    });
                });
            });
        });

        describe('default maximum limit hint message on initial deposit amount', function () {

            beforeEach(inject(function ($rootScope, $controller, _mock_, _Flow_, _$location_, Fixture, AccountsService, _SavingsAccountApplication_) {
                scope = $rootScope.$new();
                controller = $controller;
                Flow = _Flow_;
                location = _$location_;
                mock = _mock_;

                accountsData = JSON.parse(Fixture.load('base/test/unit/fixtures/listAccountsResponse.json'));

                accountsService = AccountsService;

                spyOn(accountsService, 'list');
                spyOn(accountsService, 'availableBalanceFor');
                accountsService.list.and.returnValue(mock.resolve(accountsData));

                SavingsAccountApplication = _SavingsAccountApplication_;
                spyOn(SavingsAccountApplication, 'minimumInitialDeposit').and.returnValue(5000);
                spyOn(SavingsAccountApplication, 'maximumInitialDeposit').and.returnValue(500000);
                spyOn(SavingsAccountApplication, 'productName').and.returnValue("SavingsProduct");
                spyOn(SavingsAccountApplication, 'transferPageAdditionalInformation').and.returnValue("Additional information below minimum deposit amount");
                card = jasmine.createSpyObj('card', ['current']);
                card.current.and.returnValue({number: 'ABC123'});

                invokeController();

                var listOfAccounts = scope.transferFromAccounts();
                current = _.where(listOfAccounts, {'accountType': 'CURRENT'})[0];
                credit = _.where(listOfAccounts, {'accountType': 'CREDIT_CARD'})[0];
            }));

            describe('deposit limits', function () {
                it('should allow a maximum transfer of R500 000 and display a custom error hint when value is exceeded', function () {
                    scope.transfer.amount = 500000.01;
                    scope.transfer.from = credit;
                    expect(scope.enforcer(scope.transfer.amount)).toEqual({
                        error: true,
                        type: 'maximumLimit',
                        message: 'Enter an amount less than R500000.01'
                    });
                });
            });
        });
    });
});