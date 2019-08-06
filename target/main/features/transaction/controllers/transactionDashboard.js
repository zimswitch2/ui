var instantMoneyFeature = false;
var viewFormalStatementListFeature = false;
var internationalPaymentFeature = false;
var viewTransactionsFeature = false;
var paymentHistoryFeature = false;
var accountSharing = false;

{
    instantMoneyFeature = true;
}

{
    viewFormalStatementListFeature = true;
}

{
    internationalPaymentFeature = true;
}

{
    viewTransactionsFeature = true;
}

{
    paymentHistoryFeature = true;
}

{
    accountSharing = true;
}


(function () {
    'use strict';

    var module = angular.module('refresh.transactionDashboard',
        [
            'ngRoute',
            'refresh.configuration',
            'refresh.transfers',
            'refresh.permissions',
            'refresh.onceOffPayment'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/transaction/dashboard', {
            templateUrl: 'features/transaction/partials/dashboard.html',
            controller: 'TransactionDashboardController'
        });
    });

    // Only for account sharing
    module.filter('TransactTilesPermissions', function(User, PermissionsService) {
        var isCurrentDashboardOfType = function (dashboardKey) {

	    console.log("dashboardKey: " + dashboardKey);
	    console.log("systemPrincipalKey: " + User.principalForCurrentDashboard().systemPrincipalIdentifier.systemPrincipalKey);

            return dashboardKey === undefined ||
                User.principalForCurrentDashboard().systemPrincipalIdentifier.systemPrincipalKey === dashboardKey;
        };

        return function (items) {
            var clonedItems = _.cloneDeep(items);
            var filteredItems = _.each(clonedItems, function (section) {
                section.items = _.filter(section.items, function (item) {
	            console.log("item.excludeCardHolder: " + !item.excludeCardHolder);
	            console.log("item: " + JSON.stringify(item));
	            console.log("item.permission: " + item.permission);
		    console.log("permission: " +  PermissionsService.checkPermission(item.permission));
                    return isCurrentDashboardOfType(item.restrictToDashboardType) && !item.excludeCardHolder && PermissionsService.checkPermission(item.permission);
                });
            }).filter(function(section) {
                return section.items && section.items.length > 0;
            });

	    console.log("filteredItems: " + filteredItems);
            return filteredItems;
        };
    });

    module.controller('TransactionDashboardController', function ($scope, TransactTilesPermissionsFilter, TransferService, AccountsService, Card, User, OnceOffPaymentModel) {

        $scope.items = [
	    /*
            {

                title: 'Payments',
                icon: 'pay',
                items: [
                    {
                        icon: 'onceoff',
                        title: 'Pay Beneficiary',
                        url: '#/beneficiaries/list',
                        id: 'manage-beneficiary',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'beneficiary',
                        title: 'Pay Multiple Beneficiaries',
                        url: '#/beneficiaries/pay-multiple',
                        id: 'pay-multiple',
                        permission: 'view:pay-multiple-beneficiaries-tile'
                    },
                    {
                        icon: 'onceoff',
                        title: 'Once Off Payment',
                        url: '#/payment/onceoff',
                        id: 'once-off-payment',
                        permission: 'view:once-off-payment-tile',
                        beforeNavigate: function () {
                            OnceOffPaymentModel.initialise();
                        }
                    },
                    {
                        icon: 'pay-group',
                        title: 'Pay Beneficiary Group',
                        url: '#/beneficiaries/groups/list',
                        id: 'pay-beneficiary-group',
                        permission: 'view:pay-beneficiary-group-tile'
                    },
                    {
                        icon: 'prepaid',
                        title: 'Reports',
                        url: '#/prepaid',
                        id: 'prepaid'
                    },
                    {
                        icon: 'inter',
                        title: User.isSEDOperator() ? 'Transfer' : 'Transfer',
                        url: '#/transfers',
                        id: 'inter-account-transfer',
                        permission: 'view:transfer-between-accounts-tile'
                    }
                ]
	 },
	 */

	 {

                title: 'Payments',
                icon: 'pay',
                items: [
                    {
                        icon: 'beneficiary',
                        title: 'Pay Beneficiary',
                        url: '#/beneficiaries/list',
                        id: 'manage-beneficiary',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'beneficiaries',
                        title: 'Pay multiple beneficiaries',
                        url: '#/beneficiaries/pay-multiple',
                        id: 'pay-multiple',
                        permission: 'view:pay-multiple-beneficiaries-tile'
                    },
                    {
                        icon: 'onceoff',
                        title: 'Once-off payment',
                        url: '#/payment/onceoff',
                        id: 'once-off-payment',
                        permission: 'view:once-off-payment-tile',
                        beforeNavigate: function () {
                            OnceOffPaymentModel.initialise();
                        }
                    },
                    {
                        icon: 'pay-group',
                        title: 'Pay beneficiary group',
                        url: '#/beneficiaries/groups/list',
                        id: 'pay-beneficiary-group',
                        permission: 'view:pay-beneficiary-group-tile'
                    },
                    {
                        icon: 'prepaid',
                        title: 'Prepaid',
                        url: '#/prepaid',
                        id: 'prepaid',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'inter',
                        title: User.isSEDOperator() ? 'Transfer between accounts' : 'Transfer between your accounts',
                        url: '#/transfers',
                        id: 'inter-account-transfer',
                        permission: 'view:transfer-between-accounts-tile'
                    }
                ]
            },
            {
		/*
                title: 'Statements And Notifications',
                icon: 'payment-notifications',
                id: 'statementsAndNotifications',
                items: [
                    {
                        icon: 'transaction-history',
                        title: 'Transaction History',
                        url: '#/statements/',
                        id: 'statements'
                    },
                    {
                        icon: 'payment-notifications',
                        title: 'Pyament History',
                        url: '#/payment-notification/history',
                        id: 'payment-notification-history'
                    },
                    {
                        icon: 'prepaid-history',
                        title: 'Prepaid History',
                        url: '#/messenger/suggestion-box',
                        id: 'prepaid-history'
                    }
                ]
         	*/       
                 title: 'Statements & Notifications',
                 icon: 'payment-notifications',
                 id: 'statementsAndNotifications',
                 items: [
                 {
                 icon: 'transaction-history',
                 title: 'Transaction history',
                 url: '#/statements/',
                 id: 'statements',
                 permission: 'view:pay-beneficiary-tile'
                 },
                 {
                 icon: 'payment-notifications',
                 title: 'Payment notifications',
                 url: '#/payment-notification/history',
                 id: 'payment-notification-history',
                 permission: 'view:pay-beneficiary-tile'
                 }, 
                 {
                 icon: 'prepaid-history',
                 title: 'Prepaid history',
                 url: '#/prepaid/history',
                 id: 'prepaid-history',
                 permission: 'view:pay-beneficiary-tile'
                 }
                 ]
            },
            {
                title: 'Manage',
                icon: 'scheduled',
                items: [
                    {
                        icon: 'add-group',
                        title: 'Beneficiary Group',
                        url: '#/beneficiaries/groups/add',
                        id: 'manager-beneficiary-group-1',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'add-group',
                        title: 'People',
                        url: '#/beneficiaries/groups/add',
                        id: 'manager-beneficiary-group',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'add-group',
                        title: 'Products',
                        url: '#/beneficiaries/groups/add',
                        id: 'manager-beneficiary-group-2',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'add-beneficiary',
                        title: 'Add beneficiary',
                        url: '#/beneficiaries/add',
                        id: 'add-beneficiary',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'add-group',
                        title: 'Add groups',
                        url: '#/beneficiaries/groups/add',
                        id: 'manage-beneficiary-group',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'scheduled',
                        title: 'View scheduled payments',
                        url: '#/payment/scheduled/manage',
                        id: 'manage-scheduled-payments',
                        permission: 'view:pay-beneficiary-tile'
                    },
                    {
                        icon: 'change-monthly-limit',
                        title: 'Change monthly payment limit',
                        url: '#/monthly-payment-limit',
                        id: 'change-eap-limit',
                        permission: 'view:pay-beneficiary-tile'
                    }
                ]
            }
        ];

        if (viewFormalStatementListFeature) {

            var formalStatementItem = {
                icon: 'transaction-history',
                url: '#/formal-statements',
                title: 'View formal statements',
                id: 'formal-statements'
            };

            AccountsService.hasFormalStatementAccounts(Card.current()).then(function (hasFormalStatementAccount) {
                if (!hasFormalStatementAccount) {
                    formalStatementItem.url = '#/transaction/dashboard';
                    formalStatementItem.class = 'disabled';
                }
            });

            $scope.items[2].items.push(formalStatementItem);
        }

        if (viewTransactionsFeature) {
            var statementItems = _.find($scope.items, {id: 'statementsAndNotifications'})['items'];

            var i = statementItems.indexOf(_.find(statementItems, {id: 'statements'}));
            statementItems[i].url = '#/transactions/';
            statementItems[i].title = 'Transactions';
        }

        if (instantMoneyFeature) {
            $scope.items[0].items.push({
                icon: 'instant-money',
                url: '#/instant-money',
                title: 'Instant Money',
                id: 'create-instant-money'
            });
        }

        if (internationalPaymentFeature) {
            $scope.items[0].items.push({
                icon: 'international-payment',
                url: '#/international-payment',
                title: 'International Payment',
                id: 'international-payment'
            });

        }

        if (paymentHistoryFeature){
            $scope.items[2].items.push({
                icon: 'transaction-history',
                title: 'Online payments & transfers',
                url: '#/payment/history',
                id: 'online-payments-and-transfers'
            });
        }

        if(accountSharing) {
            $scope.items[1].items.push({
                icon: 'transaction-history',
                title: 'View pending transactions',
                url: '#/account-sharing/pendingPayments',
                id: 'pending-payments-view',
                restrictToDashboardType: 'SED'
            });
            $scope.items[1].items.push({
                icon: 'transaction-history',
                title: 'View rejected transactions',
                url: '#/account-sharing/rejectedPayments',
                id: 'rejected-payments-view',
                restrictToDashboardType: 'SED',
                excludeCardHolder: User.isCurrentDashboardCardHolder(),
                permission: 'view:view-rejected-transactions-tile'
            });
        }

        TransferService.transferPossible().then(function (transferPossible) {
            if (!transferPossible) {
                var interAccountTransferItem = _.find($scope.items[0]['items'], {id: 'inter-account-transfer'});
                interAccountTransferItem.url = '#/transaction/dashboard';
                interAccountTransferItem.class = 'disabled';
            }
        });

        if(accountSharing) {
            $scope.filteredItems = TransactTilesPermissionsFilter($scope.items);
        }
        if(!accountSharing)  {
            $scope.filteredItems = $scope.items;
        }
    });
}());
