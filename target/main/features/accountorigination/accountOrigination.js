var rcpFeatureEnabled = false;
{
    rcpFeatureEnabled = true;
}

(function (app) {
    'use strict';

    app.run(function ($rootScope, Menu, $location) {
        var accountOriginationHighlightedItems =
            [
                '/apply/'
            ];
        var accountOriginationMenuItem = {
            title: 'Apply for Account',
            url: rcpFeatureEnabled ? '/apply' : '/apply/current-account',
            position: 4,
            showIf: function () {
                var isShown = false;
                accountOriginationHighlightedItems.forEach(function (item) {
                    if ($location.path().indexOf(item) > -1) {
                        isShown = true;
                    }
                });
                return isShown;
            }
        };
        // Menu.add(accountOriginationMenuItem);
    });
})(angular.module('refresh.accountOrigination', ['refresh.navigation',
    'refresh.accountOrigination.currentAccount.screens.offers',
    'refresh.accountOrigination.rcp.screens.offer',
    'refresh.accountOrigination.currentAccount.screens.products',
    'refresh.accountOrigination.common.screens.availableProducts',
    'refresh.accountOrigination.rcp.screens.products',
    'refresh.accountOrigination.currentAccount.screens.acceptOffer',
    'refresh.accountOrigination.rcp.screens.confirmOffer',
    'refresh.accountOrigination.rcp.screens.preScreen',
    'refresh.accountOrigination.currentAccount.screens.chequeCard',
    'refresh.accountOrigination.currentAccount.screens.debitOrderSwitching',
    'refresh.accountOrigination.currentAccount.screens.declinedOffer',
    'refresh.accountOrigination.currentAccount.screens.finishApplication',
    'refresh.accountOrigination.rcp.screens.finishOffer',
    'refresh.accountOrigination.customerInformationErrors',
    'refresh.accountOrigination.customerInformation.profile',
    'refresh.accountOrigination.customerInformation.edit.basic',
    'refresh.accountOrigination.customerInformation.captureBasic',
    'refresh.accountOrigination.customerInformation.personalDetails',
    'refresh.accountOrigination.customerInformation.edit.contact',
    'refresh.accountOrigination.customerInformation.address',
    'refresh.accountOrigination.customerInformation.edit.address',
    'refresh.accountOrigination.customerInformation.incomeAndExpense',
    'refresh.accountOrigination.customerInformation.edit.incomeAndExpense',
    'refresh.accountOrigination.customerInformation.employment',
    'refresh.accountOrigination.customerInformation.edit.employment',
    'refresh.accountOrigination.customerInformation.consent',
    'refresh.accountOrigination.customerInformation.edit.consent',
    'refresh.accountOrigination.customerService',
    'refresh.accountOrigination.domain.customer',
    'refresh.accountOrigination.currentAccount.screens.preScreening',
    'refresh.accountOrigination.currentAccount.directives.whatHappensNext',
    'refresh.accountOrigination.common.directives.cancelConfirmation',
    'refresh.accountOrigination.common.directives.pendingOffer',
    'refresh.accountOrigination.common.directives.acceptedOffer',
    'refresh.accountOrigination.common.directives.applyForAccount',
    'refresh.accountOrigination.common.directives.productTile',
    'refresh.accountOrigination.savings.directives.savingsPrescreening',
    'refresh.accountOrigination.savings.directives.savingsProductTile',
    'refresh.accountOrigination.savings.screens.products.savingsAndInvestmentsOptions',
    'refresh.accountOrigination.savings.screens.pureSave',
    'refresh.accountOrigination.savings.screens.marketLink',
    'refresh.accountOrigination.savings.screens.taxFreeCallAccount',
    'refresh.accountOrigination.savings.screens.transfer',
    'refresh.accountOrigination.savings.screens.accept',
    'refresh.accountOrigination.savings.screens.finish',
    'refresh.accountOrigination.customerInformationNavigation']));
