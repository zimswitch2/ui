(function () {
    'use strict';
    var module = angular.module('singleSignOn.singleSignOnFlow', [
        'flow.flowConstructor',
        'lithium',
        'refresh.internetBankingAuthenticationFlow',
        'refresh.internetBankingRegistrationFlow']);

    module.factory('SingleSignOnFlow',
        function (FlowConstructor, $window, LithiumHelper, $document, $injector) {
            var flow = FlowConstructor({name: 'SingleSignOnFlow'});

            function kickOffFlow(genericFlowName, argumentsList) {
                var genericFlow;

                if (LithiumHelper.isFromLithium()) {
                    genericFlow = $injector.get('Lithium' + genericFlowName);
                } else {
                    genericFlow = $injector.get('InternetBanking' + genericFlowName);
                }

                genericFlow.start.apply(null, argumentsList);

                return genericFlow;
            }

            flow.login = function () {
                return kickOffFlow('AuthenticationFlow', arguments);
            };

            flow.createDigitalId = function () {
                return kickOffFlow('RegistrationFlow', arguments);
            };

            return flow;
        });
})();
