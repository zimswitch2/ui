(function (app) {
    'use strict';

    app.factory('AccountPreferencesService', function(){
        var statementPreference = {};
        var accountNumbersWithPreference = {};
        return {
            addStatementPreference: function(formalStatementPreference) {
                statementPreference = formalStatementPreference;
            },
            getStatementPreference: function() {
                return statementPreference;
            },
            clear: function () {
                statementPreference = {};
            },
            setAccountNumbersWithPreferences: function(accountNumbers) {
                accountNumbersWithPreference = accountNumbers;
            },
            getAccountNumbersWithPreferences: function() {
                return accountNumbersWithPreference;
            }
        };
    });
})(angular.module('refresh.profileAndSettings.preferences.formal', []));