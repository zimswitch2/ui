(function (app) {
    'use strict';

    {
        app.config(function ($routeProvider) {
            $routeProvider.when('/account-preferences/:accountNumber', {
                templateUrl: 'features/profileAndSettings/partials/accountPreferences.html',
                controller: 'AccountPreferencesController'
            });
        });

        app.controller('AccountPreferencesController',
            function ($scope, $routeParams, AccountsService, Card, accountLabelFilter, StatementService,
                      ProfilesAndSettingsMenu, $location, AccountPreferencesService, ApplicationParameters) {
                $scope.accountNumber = $routeParams.accountNumber;
                var currentAndChequeAccounts = [];
                var currentAndChequeAccountNumbers = [];

                $scope.isSuccessful = ApplicationParameters.popVariable('isSuccessful');

                $scope.errorMessage = ApplicationParameters.popVariable('errorMessage');

                $scope.menuItems = ProfilesAndSettingsMenu.getMenu();

                var filterAccounts = function (accounts, accountTypes) {
                    currentAndChequeAccounts = accounts.filter(function (account) {
                        return _.contains(accountTypes, account.accountType);
                    });
                };

                AccountsService.list(Card.current()).then(function (response) {
                    var modifiableAccountTypes = ['CURRENT', 'CREDIT_CARD'];
                    filterAccounts(response.accounts, modifiableAccountTypes);

                    var currentAccount = _.find(response.accounts, function (account) {
                        return $scope.accountNumber === account.number;
                    });

                    return $scope.accountDetails = accountLabelFilter(currentAccount);
                }).then(function () {
                    currentAndChequeAccountNumbers = currentAndChequeAccounts.map(function (account) {
                        return account.number;
                    });

                    if (_.contains(currentAndChequeAccountNumbers, $scope.accountNumber)) {
                        StatementService.formalStatementPreference(Card.current(),
                            {number: $scope.accountNumber}).then(function (response) {
                                $scope.statementPreferences =
                                    _.find(response.formalStatementPreferences, function (preference) {
                                        return $scope.accountNumber === preference.account.number;
                                    });

                                if ($scope.statementPreferences) {
                                    $scope.deliveryMethod = (_.isEmpty($scope.statementPreferences.emailAddress)) ? 'Postal Address' :
                                    'Email address (' + $scope.statementPreferences.emailAddress + ')';
                                } else {
                                    $scope.hasInfo = true;
                                }
                            }).catch(function (error) {
                                $scope.errorMessage = error.message;
                            });
                    }
                });

                $scope.modify = function () {
                    $scope.statementPreferences['accountDetails'] = $scope.accountDetails;
                    $scope.statementPreferences['card'] = Card.current();
                    AccountPreferencesService.addStatementPreference($scope.statementPreferences);
                    AccountPreferencesService.setAccountNumbersWithPreferences(currentAndChequeAccountNumbers);
                    $location.path('/edit-account-preferences/' + $scope.accountNumber);
                };

            });
    }
})(angular.module('refresh.profileAndSettings.preferences',
    ['refresh.accounts', 'refresh.card', 'refresh.filters', 'refresh.statements.services', 'refresh.accordion',
        'refresh.profileAndSettings.preferences.formal', 'refresh.parameters']));
