var instantMoneyFeature = false;
var internationalPaymentFeature = false;
var paymentHistoryFeature = false;
var accountSharing = false;

if (feature.instantMoney) {
    instantMoneyFeature = true;
}

if (feature.internationalPayment) {
    internationalPaymentFeature = true;
}
if (feature.paymentHistory){
    paymentHistoryFeature = true;
}

if (feature.accountSharing) {
    accountSharing = true;
}

describe('TransactionDashboard', function () {
    'use strict';

    beforeEach(module('refresh.transactionDashboard', 'refresh.test', 'refresh.configuration', 'refresh.navigation',
        'refresh.fixture'));

    describe('transactTilesPermissions', function () {
        var user, permissionsService;
        beforeEach(inject(function (TransactTilesPermissionsFilter, User, PermissionsService) {
            var principal = {
                systemPrincipalIdentifier: {
                    systemPrincipalId: '12345',
                    systemPrincipalKey: 'SED'
                }
            };
            this.TransactTilesPermissionsFilter = TransactTilesPermissionsFilter;
            spyOn(User, ['principalForCurrentDashboard']);
            spyOn(User, ['isCurrentDashboardCardHolder']);
            spyOn(User, ['isSEDOperator']);
            user = User;
            user.principalForCurrentDashboard.and.returnValue(principal);
            user.isCurrentDashboardCardHolder.and.returnValue(false);
            user.isSEDOperator.and.returnValue(true);

            spyOn(PermissionsService, ['checkPermission']);
            permissionsService = PermissionsService;
            permissionsService.checkPermission.and.callFake(function(param) {
                if(param) {
                    return true;
                }
            });
        }));

        it('should remove sections where no permissions for any tiles', function() {
            var items = [{
                title: 'Statements & Notifications',
                id: 'statementsAndNotifications',
                items: [
                    {
                        title: 'Transaction history',
                        id: 'statements'
                    }
                ]
            }];
            expect(this.TransactTilesPermissionsFilter(items).length).toEqual(0);
        });

        it('should remove all tiles the card holder should not see', function() {
            var items = [{
                title: 'Manage',
                items: [
                    {
                        title: 'View pending transactions',
                        id: 'pending-payments-view',
                        restrictToDashboardType: 'SED',
                        permission: 'view:view-pending-transactions'
                    },
                    {
                        title: 'View rejected transactions',
                        id: 'rejected-payments-view',
                        restrictToDashboardType: 'SED',
                        excludeCardHolder: true
                    }
                ]
            }];

            expect(this.TransactTilesPermissionsFilter(items)[0].items.length).toEqual(1);
        });

        it('should remove all tiles that are not restricted to current dashboard', function() {
            var items = [{
                title: 'Manage',
                items: [
                    {
                        title: 'View pending transactions',
                        id: 'pending-payments-view',
                        restrictToDashboardType: 'SED',
                        permission: 'view:view-pending-transactions'
                    },
                    {
                        title: 'View rejected transactions',
                        id: 'rejected-payments-view',
                        restrictToDashboardType: 'SBSA',
                    }
                ]
            }];

            expect(this.TransactTilesPermissionsFilter(items)[0].items.length).toEqual(1);
        });

    });

    describe('routes', function () {

        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should use the correct template', function () {
            expect(route.routes['/transaction/dashboard'].templateUrl).toEqual('features/transaction/partials/dashboard.html');
        });
    });

    describe('TransactionDashboardController', function () {

        var scope, controller, transferService, mock, accountsService, user, transactTilesPermissionsFilter, permissionsService, onceoffPaymentModel;

        beforeEach(inject(function ($rootScope, $controller, _mock_) {
            scope = $rootScope;
            controller = $controller;
            mock = _mock_;

            accountsService = jasmine.createSpyObj('AccountsService', ['hasFormalStatementAccounts']);
            accountsService.hasFormalStatementAccounts.and.returnValue(mock.resolve(true));

            user = jasmine.createSpyObj('User', ['principalForCurrentDashboard', 'isCurrentDashboardCardHolder', 'isSEDOperator']);
            user.isSEDOperator.and.returnValue(true);

            if(accountSharing) {
                transactTilesPermissionsFilter = jasmine.createSpy();
            }
            permissionsService = jasmine.createSpyObj('PermissionsService', ['checkPermission']);
            onceoffPaymentModel = jasmine.createSpyObj('OnceOffPaymentModel', ['initialise']);
        }));

        function createController(transferPossible) {
            transferService = jasmine.createSpyObj('transferService', ['transferPossible']);
            transferService.transferPossible.and.returnValue(mock.resolve(transferPossible));

            controller('TransactionDashboardController', {
                $scope: scope,
                TransferService: transferService,
                AccountsService: accountsService,
                User: user,
                TransactTilesPermissionsFilter: transactTilesPermissionsFilter,
                PermissionsService: permissionsService,
                OnceOffPaymentModel: onceoffPaymentModel
            });
            scope.$digest();
        }

        describe('transfer link', function () {
            it('should be enabled linking to transfers by default', function () {
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'inter-account-transfer'});
                expect(item.url).toBe('#/transfers');
                expect(item.class).toBeUndefined();
            });

            it('should be disabled linking to dashboard if unable to transfer', function () {
                createController(false);
                var item = _.find(scope.items[0]['items'], {id: 'inter-account-transfer'});
                expect(item.url).toBe('#/transaction/dashboard');
                expect(item.class).toBe('disabled');
            });
        });

        describe('title for transfer between accounts tile', function () {
            it('tile name should be "transfer between accounts" for a capturer', function () {
                user.isSEDOperator.and.returnValue(true);
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'inter-account-transfer'});
                expect(item.title).toBe('Transfer between accounts');
            });

            it('tile name should be "transfer between your accounts" for a non-capturer', function () {
                user.isSEDOperator.and.returnValue(false);
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'inter-account-transfer'});
                expect(item.title).toBe('Transfer between your accounts');
            });
        });

        it('should have change EAP Limit menu item on Transact menu - manage', function () {
            createController(true);
            var item = _.find(scope.items[1]['items'], {id: 'change-eap-limit'});
            expect(item.url).toBe('#/monthly-payment-limit');
            expect(item.title).toBe('Change monthly payment limit');
            expect(item.icon).toBe('change-monthly-limit');
        });

        describe('for instant money feature', function () {
            it('should have create instant money menu item when toggled on', function () {
                instantMoneyFeature = true;
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'create-instant-money'});
                expect(item.url).toEqual('#/instant-money');
                expect(item.title).toEqual('Instant Money');
                expect(item.icon).toEqual('instant-money');
            });

            it('should not have instant money menu item when toggled off', function () {
                instantMoneyFeature = false;
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'create-instant-money'});
                expect(item).toBeUndefined();
            });
        });

        describe('for international payment feature', function () {
            it('should have international payment menu item when toggled on', function () {
                internationalPaymentFeature = true;
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'international-payment'});
                expect(item.url).toEqual('#/international-payment');
                expect(item.title).toEqual('International Payment');
                expect(item.icon).toEqual('international-payment');
            });

            it('should not have international payment menu item when toggled off', function () {
                internationalPaymentFeature = false;
                createController(true);
                var item = _.find(scope.items[0]['items'], {id: 'international-payment'});
                expect(item).toBeUndefined();
            });
        });

        describe('for payment history', function() {
            it('should have payment history menu item when toggled on', function () {
                paymentHistoryFeature = true;
                createController(true);
                var item = _.find(scope.items[2]['items'], {id: 'online-payments-and-transfers'});
                expect(item.url).toEqual('#/payment/history');
                expect(item.title).toEqual('Online payments & transfers');
                expect(item.icon).toEqual('transaction-history');
            });

            it('should not have payment history menu item when toggled off', function () {
                paymentHistoryFeature  = false;
                createController(true);
                var item = _.find(scope.items[2]['items'], {id: 'online-payments-and-transfers'});
                expect(item).toBeUndefined();
            });


        });

        describe('when viewFormalStatementList is toggled on', function () {
            beforeEach(function () {
                viewFormalStatementListFeature = true;
            });

            it('should have formal statement menu item', function () {
                createController(true);
                var item = _.find(scope.items[2]['items'], {id: 'formal-statements'});
                expect(item.url).toEqual('#/formal-statements');
                expect(item.title).toEqual('View formal statements');
                expect(item.icon).toEqual('transaction-history');
            });

            it('should disable the formal statement menu item if the user has no current or home loan accounts', function () {
                accountsService.hasFormalStatementAccounts.and.returnValue(mock.resolve(false));

                createController(true);

                var item = _.find(scope.items[2]['items'], {id: 'formal-statements'});
                expect(item.class).toEqual('disabled');
                expect(item.url).toEqual('#/transaction/dashboard');
            });

            it('should not disable the formal statement menu item if the user has current or home loan accounts', function () {
                accountsService.hasFormalStatementAccounts.and.returnValue(mock.resolve(true));

                createController(true);

                var item = _.find(scope.items[2]['items'], {id: 'formal-statements'});
                expect(item.class).toBeUndefined();
                expect(item.url).toEqual('#/formal-statements');
            });
        });

        describe('when viewFormalStatementList is toggled off', function () {
            it('should not have formal statement menu item', function () {
                viewFormalStatementListFeature = false;
                createController(true);
                var item = _.find(scope.items[2]['items'], {id: 'formal-statements'});
                expect(item).toBeUndefined();
            });
        });

        describe('transactions menu', function () {

            describe('transaction feature toggled off', function () {

                beforeEach(function () {
                    viewTransactionsFeature = false;
                    createController(true);
                });

                it('should configure the statement item properties', function () {
                    
                    var statementItems = _.find(scope.items, {id: 'statementsAndNotifications'})['items'];
                    var statementItem = _.find(statementItems, {id: 'statements'});

                    expect(statementItem.url).toEqual('#/statements/');
                    expect(statementItem.title).toEqual('Transaction history');
                    expect(statementItem.icon).toEqual('transaction-history');
                });

            });

            describe('transaction feature toggled on', function () {

                beforeEach(function () {
                    viewTransactionsFeature = true;
                    createController(true);
                });

                it('should configure the statement item properties', function () {

                    var statementItems = _.find(scope.items, {id: 'statementsAndNotifications'})['items'];
                    var statementItem = _.find(statementItems, {id: 'statements'});

                    expect(statementItem.url).toEqual('#/transactions/');
                    expect(statementItem.title).toEqual('Transactions');
                    expect(statementItem.icon).toEqual('transaction-history');
                });

            });


            describe('for account sharing feature', function () {
                it('should have pending payments menu item when toggled on', function () {
                    accountSharing = true;
                    createController(true);
                    var item = _.find(scope.items[1]['items'], {id: 'pending-payments-view'});
                    expect(item.url).toEqual('#/account-sharing/pendingPayments');
                    expect(item.title).toEqual('View pending transactions');
                });

                it('should NOT have pending payments menu item when toggled off', function () {
                    accountSharing = false;
                    createController(true);
                    var item = _.find(scope.items[1]['items'], {id: 'pending-payments-view'});
                    expect(item).toBeUndefined();
                });

                it('should have rejected payments menu item when toggled on', function () {
                    accountSharing = true;
                    createController(true);
                    var item = _.find(scope.items[1]['items'], {id: 'rejected-payments-view'});
                    expect(item.url).toEqual('#/account-sharing/rejectedPayments');
                    expect(item.title).toEqual('View rejected transactions');
                });

                it('should NOT have rejected payments menu item when toggled off', function () {
                    accountSharing = false;
                    createController(true);
                    var item = _.find(scope.items[1]['items'], {id: 'rejected-payments-view'});
                    expect(item).toBeUndefined();
                });
            });

            describe('before navigate', function(){

                beforeEach(function() {
                    createController(true);
                });

                it('should re-initialise the OnceOffPaymentModel before navigating to once off payment', function(){
                    var onceOffPayment = scope.items[0].items.filter(function(item){
                        return item.title === "Once-off payment";
                    })[0];

                    expect(onceOffPayment).toBeTruthy();
                    expect(onceOffPayment.beforeNavigate).toBeTruthy();

                    onceOffPayment.beforeNavigate();

                    expect(onceoffPaymentModel.initialise).toHaveBeenCalled();
                });
            });
        });
    });
});
