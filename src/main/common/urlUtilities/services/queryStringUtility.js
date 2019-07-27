(function () {
    'use strict';
    var module = angular.module('clientSideFramework.urlUtilities.queryStringUtilitySpec', []);
    module.factory('QueryStringUtility', function ($window) {
        function getParameters () {
            var query = $window.location.search;
            query = query.split("+").join(" ");

            var params = {}, tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(query)) {
                params[tokens[1]] = tokens[2];
            }

            return params;
        }

        return {
            getParameter : function (paramName) {
                return getParameters()[paramName];
            }
        };
    });
})
();