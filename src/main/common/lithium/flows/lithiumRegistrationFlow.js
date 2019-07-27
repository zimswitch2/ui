(function () {
    'use strict';
    var module = angular.module('lithium.lithiumRegistrationFlow', [
        'flow.flowConstructor',
        'lithium.lithiumService',
        'refresh.registration.service']);

    module.factory('LithiumRegistrationFlow',
        function (FlowConstructor, RegistrationService, LithiumHelper, LithiumService, $location) {
            var _flow = FlowConstructor({
                name: 'LithiumRegistrationFlow', start: function (username, password, preferredName) {
                    RegistrationService.createDigitalID(username, password, preferredName).then(function () {
                        LithiumService.authenticate().then(function (url) {
                            _flow.resolve('success', url);
                        });
                    }).catch(function (error) {
                        _flow.resolve('failure', error);
                    });
                }
            });

            _flow.addPromiseResolutionScenarios(['success', 'failure']);
            _flow.success(function (url) {
                LithiumHelper.redirectToLithium(url);
            });

            _flow.failure(function () {
                $location.path('/register');
            });

            return _flow;
        });
})();