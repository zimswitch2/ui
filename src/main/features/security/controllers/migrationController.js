var newRegisteredPageFeature = false;
if (feature.newRegisteredPage) {
    newRegisteredPageFeature = true;
}

(function (app) {
    'use strict';
    app.config(function ($routeProvider) {
        $routeProvider.when('/migrate', {
            templateUrl: 'features/security/partials/migrate.html',
            controller: 'MigrationController'
        });
    });

    app.controller('MigrationController',
        function ($scope, $location, MigrationService, DigitalId, Flow, ApplicationParameters, CardService, User, $window,
                  AuthenticationService) {

            if (!_.isEmpty(User.userProfile.bpIdSystemPrincipalIdentifier)) {
                $location.path('/linkcard').replace();
            }

            var preferredName = DigitalId.current().preferredName;

            var headerName = 'Copy Your Profile';
            if (!newRegisteredPageFeature) {
                $scope.hasAdded = ApplicationParameters.getVariable('hasAdded');
                if ($scope.hasAdded) {
                    $scope.successMessage =
                        "Hello " + preferredName + ". Your Standard Bank ID has been successfully created. Last step: link your card below ";
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
                headerName = 'Link Card';
            }

            Flow.create(['Enter details', 'Enter OTP'], headerName, null, false);

            $scope.errorMessage = ApplicationParameters.popVariable('errorMessage');

            $scope.signOut = function () {
                AuthenticationService.logout();
            };

            $scope.back = function () {
                $window.history.go(-1);
            };

            $scope.migrateExistingUser = function () {
                var userProfile = {
                    defaultProfileId: User.userProfile.defaultProfileId,
                    digitalId: {
                        username: DigitalId.current().username
                    }
                };

                var credentials = {
                    cardNumber: $scope.cardNumber,
                    atmPin: $scope.atmPin,
                    csp: $scope.csp,
                    password: $scope.password
                };

                Flow.next();
                MigrationService.migrateExistingUser(credentials, userProfile)
                    .then(function (response) {
                        ApplicationParameters.pushVariable('newlyLinkedCardNumber', credentials.cardNumber);
                        ApplicationParameters.pushVariable('hasInfo', true);

                        response.data.channelUser.digitalId = {
                            username: DigitalId.current().username
                        };
                        response.data.channelUser.preferredName = DigitalId.current().preferredName;
                        response.data.channelUser.defaultProfileId = DigitalId.current().defaultProfileId;

                        User.build(response.data.channelUser, DigitalId.current().authToken).then(function () {
                            $location.path('/switchDashboard');
                        });
                    }).catch(function (serviceError) {
                        $scope.errorMessage = serviceError.message;
                        if (!newRegisteredPageFeature) {
                            ApplicationParameters.pushVariable('hasAdded', false);
                        }
                        Flow.previous();
                        if ($location.path() !== '/migrate') {
                            ApplicationParameters.pushVariable('errorMessage', serviceError.message);
                            $location.path('/migrate');
                        }
                    });
            };
        });
})(angular.module('refresh.migration.controller', ['refresh.migration', 'refresh.flow', 'refresh.security.user', 'refresh.authenticationService']));
