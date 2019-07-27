var dtmAnalyticsFeature = false;
{
    dtmAnalyticsFeature = true;
}
var dtmAnalyticsBaseURL;
(function (app) {
    'use strict';
    app.factory('AnalyticsContainer', function ($q, $location, BaseUrlHelper) {

        var ownHostedScripts = function () {
            var baseUrl = BaseUrlHelper.getBaseUrl();
            dtmAnalyticsBaseURL = baseUrl;
            return {
                'experience.standardbank.co.za': $q.when(baseUrl + '/assets/js/analytics/analyticsProduction.js'),
                'localhost': $q.reject('analytics off'),
                'ibr-haproxy': $q.reject('analytics off'),
                undefined: $q.when(baseUrl + '/assets/js/analytics/analyticsStaging.js')
            };
        };

        var dtmAnalyticsScripts = function () {
            var baseUrl = BaseUrlHelper.getBaseUrl();
            dtmAnalyticsBaseURL = baseUrl.replace(/http(s)?\:\/\//ig,'');
            return {
                'experience.standardbank.co.za': $q.when(baseUrl + '/assets/js/analytics/dtmproduction/f0fc90c88f0ee2cd4471f2a2a4139c66b636f5d8/satelliteLib-f4e880ba8d2357acd299d59e39458e2b1fee263c.js'),
                'localhost': $q.reject('analytics off'),
                'ibr-haproxy': $q.reject('analytics off'),
                undefined: $q.when(baseUrl + '/assets/js/analytics/dtmstaging/f0fc90c88f0ee2cd4471f2a2a4139c66b636f5d8/satelliteLib-f4e880ba8d2357acd299d59e39458e2b1fee263c-staging.js')
            };
        };

        return {
            containerUrlForHost: function () {

                var containerUrlsForHost = dtmAnalyticsFeature ? dtmAnalyticsScripts() : ownHostedScripts();
                var hostUrl = Object.keys(containerUrlsForHost).filter(function (hostname) {
                    return new RegExp(hostname).test($location.host());
                })[0];
                return containerUrlsForHost[hostUrl];
            }
        };
    });
})(angular.module('refresh.analytics.container', []));
