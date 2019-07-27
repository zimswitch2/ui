(function (app) {
    'use strict';

    app.config(function ($routeProvider, Referrer) {
        var ideaSpaceStageRegEx = /https?:\/\/community\.stage\.standardbank\.co\.za\/t5\/Ideas1?\//,
            ideaSpaceProdRegEx = /https?:\/\/community\.standardbank\.co\.za\/t5\/Ideas1?\//,
            communityStageRegEx = /https?:\/\/community\.stage\.standardbank\.co\.za\//,
            communityProdRegEx = /https?:\/\/community\.standardbank\.co\.za\//;

        if (ideaSpaceStageRegEx.test(Referrer) || ideaSpaceProdRegEx.test(Referrer)) {
            $routeProvider.when('/login',
                {templateUrl: 'common/lithium/partials/ideaSpaceLogin.html', controller: 'LoginController', unauthenticated: true});
        } else if (communityStageRegEx.test(Referrer) || communityProdRegEx.test(Referrer)) {
            $routeProvider.when('/login',
                {templateUrl: 'common/lithium/partials/communityLogin.html', controller: 'LoginController', unauthenticated: true});
        } else {
            $routeProvider.when('/login',
                {templateUrl: 'features/security/partials/login.html', controller: 'LoginController', unauthenticated: true});
        }
    });

})(angular.module('refresh.login',
        [
            'ngRoute',
            'refresh.configuration',
            'refresh.navigation',
            'refresh.parameters',
            'refresh.dropdownMenu',
            'refresh.login.controller',
            'refresh.authenticationService',
            'refresh.userTermsLink',
            'lithium.referrer'
        ])
);
