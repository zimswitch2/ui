var newRegisteredPageFeature = false;
if (feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/linkcard',
            {templateUrl: 'features/registration/partials/linkcard.html', controller: 'LinkCardController'});
    });

    app.controller('LinkCardController',
        function ($rootScope, $scope, $location, RegistrationService, Flow, $route, ApplicationParameters, CardService,
                  AuthenticationService, ErrorMessages, DigitalId, User, $window) {

            var linkCardError = function (errorMessage) {
                $scope.errorMessage = errorMessage;

                if (!newRegisteredPageFeature) {
                    $scope.isSuccessful = false;
                    ApplicationParameters.pushVariable('hasAdded', false);
                }

                if ($location.path() !== '/linkcard') {
                    ApplicationParameters.pushVariable('errorMessage', errorMessage);
                    $location.path('/linkcard');
                }
            };

            //initialized for picking ng-model values from ng-include scope
            $scope.cardData = {};

            $scope.noCardLinked = _.isEmpty(User.userProfile.dashboards);

            $scope.title = 'Add Dashboard';
            var cancelUrl = '/dashboards';
            if ($scope.noCardLinked) {
                cancelUrl = null;
                if (!newRegisteredPageFeature) {
                    $scope.title = 'Set Up Profile';
                } else {
                    $scope.title = 'Link Card';
                }
            }

            Flow.create(['Enter details', 'Enter OTP'], $scope.title, cancelUrl, cancelUrl !== null);
            var preferredName = DigitalId.current().preferredName;
            $scope.errorMessage = ApplicationParameters.popVariable('errorMessage');

            $scope.signOut = function () {
                AuthenticationService.logout();
            };

            $scope.back = function () {
                $window.history.go(-1);
            };

            if (!newRegisteredPageFeature) {
                $scope.hasAdded = ApplicationParameters.getVariable('hasAdded');

                if ($scope.hasAdded) {
                    $scope.successMessage = "Hello " + preferredName +
                        ". Your Standard Bank ID has been successfully created. Last step: link your card below ";
                } else {
                    $scope.successMessage = "Hello " + preferredName + ", now let's link your card.";
                }

                $scope.isSuccessful = ApplicationParameters.getVariable('isSuccessful');
                if ($scope.isSuccessful === undefined) {
                    $scope.isSuccessful = true;
                }


                $scope.$watch('isSuccessful', function () {
                    if ($scope.isSuccessful === false) {
                        ApplicationParameters.pushVariable('isSuccessful', false);
                    }
                });
            }

            $scope.linkCardToProfile = function () {
                Flow.next();

                RegistrationService.linkCard($scope.cardData.cardNumber,
                    User.userProfile.defaultProfileId, $scope.cardData.contactDetails,
                    $scope.cardData.atmPIN).then(function (response) {
                        if (response.success) {

                            RegistrationService.processLinkedCard($scope.cardData.cardNumber,
                                response.data, DigitalId.current().defaultProfileId).then(function () {
                                    $location.path('/switchDashboard');
                                });
                        } else {
                            linkCardError(response.message);
                            Flow.previous();
                        }
                    });
            };
        });
})(angular.module('refresh.linkCardController',
    ['refresh.switch-dashboard', 'refresh.configuration', 'refresh.navigation', 'refresh.flow', 'refresh.parameters',
        'refresh.card', 'refresh.registration.service', 'refresh.internationalPhoneNumber', 'refresh.authenticationService']));