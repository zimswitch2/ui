(function (app) {
    'use strict';

    app.factory('DigitalId', function ($rootScope, ipCookie) {
        var _digitalId = null;

        return {
            newInstance: function (user, password) {
                return {
                    digitalId: {
                        username: user,
                        password: password,
                        systemPrincipals: []
                    }
                };
            },

            authenticate: function (username, preferredName) {
                _digitalId = {
                    username: username,
                    preferredName: preferredName
                };
                $rootScope.$broadcast('loggedIn');
            },

            isAuthenticated: function () {
                return _digitalId !== null;
            },

            current: function () {
                return _digitalId;
            },

            remove: function () {
                _digitalId = null;
                ipCookie.remove('x-sbg-token');
                $rootScope.$broadcast('loggedOut');
            }
        };
    });
})(angular.module('refresh.digitalId', ['ipCookie']));
