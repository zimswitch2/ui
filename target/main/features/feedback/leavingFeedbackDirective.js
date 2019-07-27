(function () {
    'use strict';
    var app = angular.module('refresh.feedback', ['refresh.configuration', 'refresh.authenticationService']);

    app.directive('leavingFeedback', function (ServiceEndpoint, AuthenticationService, $window, $location, DigitalId, Card) {
        return {
            restrict: 'E',
            templateUrl: 'features/feedback/leavingFeedback.html',
            controller: function ($scope) {
                $scope.reasons = function () {
                    return [
                        "This website is too difficult to use",
                        "I'm not comfortable with the changes yet",
                        Card.anySelected() ? "It's missing some features I need" : "I'm having trouble registering",
                        "Something didn't work",
                        "Something else"
                    ];
                };
                $scope.sendFeedback = function (reason) {
                    ServiceEndpoint.leavingFeedback.makeRequest(
                        {
                            reason: reason,
                            location: $location.absUrl(),
                            digitalId: DigitalId.current() ? DigitalId.current().username : undefined
                        },
                        {
                            omitServiceErrorNotification: true
                        }).finally(function () {
                            AuthenticationService.logout();
                        });
                    $window.open('https://www.encrypt.standardbank.co.za/');
                };
            }
        };
    });
})();
