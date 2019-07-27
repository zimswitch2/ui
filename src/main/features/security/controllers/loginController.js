(function () {
    'use strict';

    var module = angular.module('refresh.login.controller', [
        'ngRoute',
        'refresh.navigation',
        'refresh.parameters',
        'refresh.dropdownMenu',
        'refresh.card',
        'refresh.errorMessages',
        'singleSignOn.singleSignOnFlow',
        'refresh.parameters'
    ]);

    module.controller('LoginController',
        function ($rootScope, $scope, $location, Menu, ErrorMessages, AuthenticationService, ApplicationParameters,
                  CardService, DigitalId, $document, $injector, DtmAnalyticsService) {
            $scope.isSuccessful = ApplicationParameters.popVariable('passwordHasBeenReset');
            $scope.errorMessage = ApplicationParameters.popVariable('loginError');

            $scope.$on('$locationChangeSuccess', function () {
                ApplicationParameters.popVariable('loginError');
            });

            $scope.login = function (username, password) {
                if (username && password) {
                    $location.$$search = {};

                    var SingleSignOnFlow = $injector.get('SingleSignOnFlow');

                    SingleSignOnFlow.login(username, password).success(function () {
                        DtmAnalyticsService.recordLogin();
                    }).failure(function (error) {
                        $scope.password = "";
                        $scope.isSuccessful = false;
                        $scope.errorMessage = ErrorMessages.messageFor(error);
                    });
                }
            };

            $scope.showTerms = false;

            $scope.showFullTerms = function () {
                $scope.showTerms = true;
            };

            $scope.hideFullTerms = function () {
                $scope.showTerms = false;
            };

            $scope.toggleModal = function () {
                $scope.showModal = !$scope.showModal;
                return $scope.showModal;
            };

            $scope.showWidgets = function () {
                if (ApplicationParameters.getVariable('acceptInvitationExistingCustomer') === 'true') {
                    return false;
                }
                else {
                    return true;
                }
            };

            $scope.validateEmail = function (digitalId) {
                ApplicationParameters.pushVariable('digitalId', digitalId);
            };

            $scope.redirectToSignIn = function () {
                ApplicationParameters.popVariable('acceptInvitationRedirect');
                ApplicationParameters.popVariable('acceptInvitationExistingCustomer');
                $location.path('/login');
            };

        });
}());
