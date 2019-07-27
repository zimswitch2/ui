(function () {
    'use strict';
    var module = angular.module('lithium.lithiumHelper', [
        'clientSideFramework.urlUtilities.queryStringUtilitySpec',
        'clientSideFramework.navigator',
        'lithium.referrer']);

    module.factory('LithiumHelper', function (QueryStringUtility, Navigator, Referrer) {
        var ideaSpaceStageRegEx = /https?:\/\/community\.stage\.standardbank\.co\.za\/t5\/Ideas1?\//,
            ideaSpaceProdRegEx = /https?:\/\/community\.standardbank\.co\.za\/t5\/Ideas1?\//,
            communityStageRegEx = /https?:\/\/community\.stage\.standardbank\.co\.za\//,
            communityProdRegEx = /https?:\/\/community\.standardbank\.co\.za\//;
        return {
            isFromLithium: function () {
                return ideaSpaceProdRegEx.test(Referrer) || ideaSpaceStageRegEx.test(Referrer) ||
                    communityProdRegEx.test(Referrer) || communityStageRegEx.test(Referrer);
            },
            redirectToLithium: function (url) {
                var referer = QueryStringUtility.getParameter('referer');

                Navigator.redirect(url + '&referer=' + referer);
            }
        };
    });
})();

