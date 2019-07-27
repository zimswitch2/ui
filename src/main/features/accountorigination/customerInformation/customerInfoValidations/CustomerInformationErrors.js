(function () {
    'use strict';

    var app = angular.module('refresh.accountOrigination.customerInformationErrors', []);

    app.factory('CustomerInformationErrors', function () {

        var errors = {};

        var allDatesValid = function () {
            return errors.dateOfBirth === undefined &&
                errors.passportExpiryDate === undefined &&
                errors.permitExpiryDate === undefined;
        };

        return {
            errors: function () {
                return errors;
            },
            allDatesValid: allDatesValid
    };
    });
})();