(function () {
    'use strict';
    var module = angular.module('refresh.internetBankingAuthenticationFlow', ['flow.flowConstructor', 'refresh.authenticationService', 'ngRoute', 'refresh.parameters']);
    module.factory('InternetBankingAuthenticationFlow', function (FlowConstructor, AuthenticationService, $location, User, ApplicationParameters) {
        var _flow = FlowConstructor({
            name: 'InternetBankingAuthenticationFlow',
            start: function (username, password) {
                AuthenticationService.login(username, password)
                    .then(function (response) {
                        ApplicationParameters.pushVariable('canDelay', true);
                        ApplicationParameters.pushVariable('hasInfo', true);
                        User.build(response.userProfile)
                            .then(function () {
                                _flow.resolve('success');
                            })
                            .catch(function (error) {
                                _flow.resolve('failure', error);
                            });
                    })
                    .catch(function (error) {
                        _flow.resolve('failure', error);
                    });
            }
        });

        _flow.addPromiseResolutionScenarios(['success', 'failure']);
        _flow.success(function () {
            $location.path('/switchDashboard');
        });
        return _flow;
    });
})();