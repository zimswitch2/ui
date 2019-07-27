(function (app) {
    'use strict';

    app.controller('changePasswordController', function ($scope, AuthenticationService, $location, ViewModel, ApplicationParameters, $timeout, User) {
        $scope.changePasswordModel = {
            oldPassword: '',
            password: '',
            confirmPassword: ''
        };

        $scope.changePassword = function () {
            AuthenticationService.changePassword($scope.changePasswordModel.oldPassword, $scope.changePasswordModel.password)
                .then(function () {
                    ApplicationParameters.pushVariable('passwordHasChanged', true);
                    $scope.errorMessage = "";
                    $scope.goHomePage();
                }, function (serviceError) {
                    $scope.changePasswordModel.oldPassword = '';
                    $scope.errorMessage = serviceError.message;

                    if (serviceError.code === 'accountHasBeenLocked') {
                        $timeout(function () {
                            AuthenticationService.logout();
                        }, 10000);
                    }
                });
        };

        $scope.goHomePage = function () {
            if (_.isUndefined(User.userProfile.currentDashboard)) {
                $location.path('/choose-dashboard');
            } else {
                $location.path('/home');
            }
        };
    });
})(angular.module('refresh.changePasswordController', ['refresh.login', 'refresh.security.user']));
