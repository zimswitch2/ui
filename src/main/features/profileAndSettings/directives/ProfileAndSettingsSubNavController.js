(function (app) {
    'use strict';

    app.controller('ProfileAndSettingsSubNavController',
        function ($scope, $location, AccountsService, Card, accountLabelFilter) {
            var myProfileMenuItems = [
                {
                    url: '#/dashboards',
                    text: 'My dashboards'
                },
                {
                    url: '#/monthly-payment-limit',
                    text: 'Monthly payment limit'
                }
            ];

            var accountTypesWithPreference = ['CURRENT', 'CREDIT_CARD'];

            var menuItems = {
                accounts: [],
                myProfileMenuItems: myProfileMenuItems
            };

            AccountsService.list(Card.current()).then(function (response) {
                menuItems.accounts = _(response.accounts)
                    .filter(function (account) {
                        return _.contains(accountTypesWithPreference, account.accountType);
                    })
                    .map(function (account) {
                        return {
                            url: "#/account-preferences/" + account.number,
                            text: accountLabelFilter(account),
                            number: account.number,
                            trackKey: 'Profile.Product preference.Formal statement.View'
                        };
                    }).value();
            });

            $scope.isCurrentLocation = function (item) {
                return $location.path() === _.trimLeft(item.url, '#');
            };

            $scope.getItems = function (items) {
                return menuItems[items];
            };
        });
})(angular.module('refresh.profileAndSettings.profileAndSettingsSubNav',
    ['refresh.accordion', 'refresh.accounts', 'refresh.card', 'refresh.filters',
        'refresh.profileAndSettings.profileAndSettingsSubNavDirective']));