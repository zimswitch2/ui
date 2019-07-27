(function () {
    'use strict';
    var module = angular.module('refresh.internetBankingRegistrationFlow', ['flow.flowConstructor', 'refresh.parameters']);
    module.factory('InternetBankingRegistrationFlow', function (FlowConstructor, RegistrationService, $location, ApplicationParameters) {
        var _flow = FlowConstructor({
            name: 'InternetBankingRegistrationFlow', start: function (username, password, preferredName) {
                RegistrationService.createDigitalID(username, password, preferredName).then(function () {
                    _flow.resolve('success', arguments);
                }).catch(function (error) {
                    _flow.resolve('failure', error);
                });
            }
        });

        _flow.addPromiseResolutionScenarios(['success', 'failure']);
        _flow.success(function () {
            ApplicationParameters.popVariable('isRegistering');
            if (ApplicationParameters.getVariable('acceptInvitationRedirect')!==undefined){
                $location.path ('/account-sharing/accept-decline-invitation');
            }else {
                ApplicationParameters.pushVariable('newRegistered', true);
                $location.path('/new-registered');
            }
        });

        _flow.failure(function () {
            ApplicationParameters.popVariable('isRegistering');
            $location.path('/register');
        });

        return _flow;
    });
})();
