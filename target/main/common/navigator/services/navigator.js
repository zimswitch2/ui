(function () {
    'use strict';
    var module = angular.module('clientSideFramework.navigator', []);
    module.factory('Navigator', function ($window) {
        return {
            redirect: function (url) {
                $window.location.href = url;
            }
        };
    });
})();