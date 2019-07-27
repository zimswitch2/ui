(function (app) {
    'use strict';

    app.factory('DateHelper', function (ApplicationParameters) {
        var currentTimeInZa = function () {
            var latestTimestampFromServer = moment(ApplicationParameters.getVariable('latestTimestampFromServer'));
            return latestTimestampFromServer;
        };

        return {
            isDateInTheFuture: function (date) {
                return moment(date).isAfter(currentTimeInZa(), 'day');
            }
        };
    });
})(angular.module('refresh.dateHelper', ['refresh.parameters']));
