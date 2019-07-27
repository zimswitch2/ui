(function (app) {
    'use strict';

    app.factory('ApplicationParameters', function () {
        var globalVariables = {};
        return {
            pushVariable: function (key, value) {
                globalVariables[key] = value;
            },
            getVariable: function (key) {
                return globalVariables[key];
            },
            popVariable: function (key) {
                var value = this.getVariable(key);
                delete globalVariables[key];
                return value;
            }
        };
    });
})(angular.module('refresh.parameters', []));
