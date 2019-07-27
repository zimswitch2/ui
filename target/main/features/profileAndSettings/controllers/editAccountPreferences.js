(function () {
    'use strict';

    var app = angular.module('refresh.profileAndSettings.editPreferences',
        [
            'refresh.digitalId',
            'refresh.statements.services',
            'refresh.accordion',
            'refresh.profileAndSettings.preferences.formal',
            'refresh.flow',
            'refresh.parameters',
            'refresh.dtmanalytics'
        ]);

    app.config(function ($routeProvider) {
        $routeProvider.when('/edit-account-preferences/:accountNumber', {
            templateUrl: 'features/profileAndSettings/partials/editAccountPreferences.html',
            controller: 'EditAccountPreferencesController'
        });
    });

    app.controller('EditAccountPreferencesController', function ($scope, $location, $routeParams, StatementService,
                                                                 ProfilesAndSettingsMenu, DigitalId,
                                                                 AccountPreferencesService, Flow, ApplicationParameters, DtmAnalyticsService) {

        var accountNumberForPreferencesToBeModified = $routeParams.accountNumber;
        Flow.create(['Formal Statement Delivery', 'Enter OTP'], 'Formal Statement Delivery', '/account-preferences/' +
            accountNumberForPreferencesToBeModified);

        var isAccountAllowedToBeModified = _.contains(AccountPreferencesService.getAccountNumbersWithPreferences(), accountNumberForPreferencesToBeModified);

        if (!isAccountAllowedToBeModified) {
            return $location.path('/account-preferences/' + accountNumberForPreferencesToBeModified);
        }

        $scope.menuItems = ProfilesAndSettingsMenu.getMenu();
        $scope.statementPreferences = AccountPreferencesService.getStatementPreference();
        $scope.accountDetails = $scope.statementPreferences.accountDetails;
        $scope.deliveryMethod = (_.isEmpty($scope.statementPreferences.emailAddress)) ? 'postal' : 'email';

        if ($scope.deliveryMethod === 'email') {
            $scope.emailDelivery = 'Email address (' + $scope.statementPreferences.emailAddress + ')';
        }

        $scope.isDisabled = function () {
            return $scope.deliveryMethod !== "email";
        };

        $scope.cancel = function () {
            AccountPreferencesService.clear();
            
            DtmAnalyticsService.cancelFormSubmissionRecord();

            $location.path('/account-preferences/' + $scope.statementPreferences.account.number);
        };

        $scope.save = function () {
            Flow.next();
            
            DtmAnalyticsService.recordFormSubmission();

            StatementService.editFormalStatementPreference($scope.statementPreferences).then(function (response) {

                DtmAnalyticsService.recordFormSubmissionCompletion();

                ApplicationParameters.pushVariable('isSuccessful', true);
                $location.path('/account-preferences/' + $scope.statementPreferences.account.number);
            }).catch(function (error) {
                Flow.previous();
                ApplicationParameters.pushVariable('isSuccessful', false);
                ApplicationParameters.pushVariable('errorMessage', error.message);
                $location.path('/account-preferences/' + $scope.statementPreferences.account.number);
                
                DtmAnalyticsService.recordFormSubmissionCompletion();
            });
        };
    });
}());
