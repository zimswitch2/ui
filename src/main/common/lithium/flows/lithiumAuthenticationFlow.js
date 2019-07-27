(function () {
    'use strict';
    var module = angular.module('lithium.lithiumAuthenticationFlow', [
        'flow.flowConstructor',
        'refresh.authenticationService',
        'lithium.lithiumService']);

    module.factory('LithiumAuthenticationFlow',
        function (FlowConstructor, AuthenticationService, LithiumService, LithiumHelper) {
            var _flow = FlowConstructor({
                name: 'LithiumAuthenticationFlow', start: function (username, password) {
                    AuthenticationService.login(username, password).then(function () {
                        LithiumService.authenticate().then(function (token) {
                            _flow.resolve('success', token);
                        });
                    }).catch(function (error) {
                        _flow.resolve('failure', error);
                    });
                }
            });

            _flow.addPromiseResolutionScenarios(['success', 'failure']);
            _flow.success(function (ssUrl) {
                LithiumHelper.redirectToLithium(ssUrl);
            });
            return _flow;
        });
})();