(function (app) {
    'use strict';

    app.factory('Principal', function () {
        return {
            newInstance: function (systemPrincipalId, systemPrincipalKey) {
                return angular.copy({
                    systemPrincipalIdentifier: {
                        systemPrincipalId: systemPrincipalId,
                        systemPrincipalKey: systemPrincipalKey
                    }
                });
            }
        };
    });

})(angular.module('refresh.principal', []));
