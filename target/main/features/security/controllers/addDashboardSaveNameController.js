(function () {
    'use strict';
    var module = angular.module('refresh.addDashboardName.controller',
        [
            'refresh.flow',
            'refresh.updateDashboard.service',
            'refresh.security.user',
            'refresh.common.homeService',
            'refresh.parameters'
        ]);

    module.config(function ($routeProvider) {
        $routeProvider.when('/addDashboard/saveName', {
            templateUrl: 'features/security/partials/addDashboardSaveName.html',
            controller: 'AddDashboardSaveNameController'
        });
    });

    module.controller('AddDashboardSaveNameController', function ($scope, $location, Flow, ViewModel, UpdateDashboardService,
                                                              User, HomeService, ApplicationParameters) {
        $scope.channelProfile = ViewModel.current().channelProfile;

        $scope.saveDashboardName = function () {
            UpdateDashboardService.updateDashboardName($scope.channelProfile)
                .then(function (response) {
                    if (response.success) {
                        $scope.channelProfile.channelProfile.card = ViewModel.current().cardNumber;

                        if (User.checkAllHotCardedCards()) {
                            User.addDashboard($scope.channelProfile.channelProfile);
                            User.switchToDashboard(User.userProfile.dashboards[User.userProfile.dashboards.length - 1]);
                            return HomeService.goHome();
                        }
                        User.addDashboard($scope.channelProfile.channelProfile);
                        $location.path('/dashboards');
                        ApplicationParameters.pushVariable('additionalLinkedCardNumber',
                            User.userProfile.dashboards[User.userProfile.dashboards.length - 1].cardNumber);
                    }
                    else {
                        $scope.errorMessage = response.message;
                    }
                });
        };

    });

}());
