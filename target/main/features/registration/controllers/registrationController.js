var newRegisteredPageFeature = false;
{
    newRegisteredPageFeature = true;
}

(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/register',
            {templateUrl: 'features/registration/partials/register.html', controller: 'RegistrationController', unauthenticated: true
            });
    });

    app.controller('RegistrationController',
        function ($rootScope, $scope, $location, RegistrationService, Flow, $route, ApplicationParameters, CardService,
                  AuthenticationService, ErrorMessages, User, $injector) {

            $scope.registrationDetails = {
                username: '',
                password: '',
                confirmPassword: '',
                preferredName: ''
            };
            Flow.create(['Enter details', 'Verify email'], 'Register User');

            if(ApplicationParameters.getVariable('acceptInvitationRedirect')){
                Flow.create(['Enter details', 'Verify email','Accept/decline', 'Enter OTP'], 'Accept/decline invitation');
            }

            $scope.editing = true;

            $scope.errorMessage = ApplicationParameters.getVariable('errorMessage') || "";

            $scope.cancel = function () {
                ApplicationParameters.popVariable('acceptInvitationRedirect');
                Flow.cancel();
            };
            $scope.showHeader = function(){
                if(ApplicationParameters.getVariable('acceptInvitationRedirect')){
                    return true;
                }
            };

            $scope.createDigitalId = function () {
                ApplicationParameters.pushVariable("isRegistering", true);
                $location.$$search = {};

                Flow.next();
                var SingleSignOnFlow = $injector.get('SingleSignOnFlow');
                SingleSignOnFlow.createDigitalId($scope.registrationDetails.username, $scope.registrationDetails.password, $scope.registrationDetails.preferredName).failure(function (error) {
                    if (!newRegisteredPageFeature) {
                        $scope.isSuccessful = false;
                    }
                    $scope.errorMessage = ErrorMessages.messageFor(error);
                    Flow.previous();
                });
            };
        });
})(angular.module('refresh.registration.controller',
    ['refresh.switch-dashboard', 'refresh.configuration', 'refresh.navigation', 'refresh.flow', 'refresh.parameters',
        'refresh.card', 'refresh.registration.service']));