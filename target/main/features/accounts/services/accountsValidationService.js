(function (app) {
    'use strict';

    app.factory('AccountsValidationService', function () {
        return {
            validateInfoMessage: function (accounts) {
                if (accounts === undefined || accounts.length === 0) {
                    return {
                        hasInfo: true,
                        infoMessage: 'There are currently no accounts linked to your card. Please visit your nearest branch'
                    };
                }

                return {hasInfo: false};
            },
            validatePaymentFromMessage: function (accounts) {
                if (accounts === undefined || accounts.length === 0) {
                    return {
                        hasInfo: true,
                        infoMessage: 'You do not have an account linked to your profile from which payment may be made to a third party'
                    };
                }

                return {hasInfo: false};
            }
        };
    });
})(angular.module('refresh.accountsValidationService', []));
