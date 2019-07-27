(function (app) {
    'use strict';
    app.factory('BaseUrlHelper', function ($location) {
        return {
            getBaseUrl: function () {
                var url = $location.absUrl().split('#')[0].split('?')[0];
                return url.substring(0, url.lastIndexOf('/'));
            }
        };
    });
})(angular.module('refresh.baseUrlHelper', []));
