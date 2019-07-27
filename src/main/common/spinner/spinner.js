(function (app) {
    'use strict';

    app.controller('spinnerController', function ($rootScope, $scope, ApplicationParameters, Spinner, $timeout) {

        var setSpinnerActive = function (isActive) {
            var state = isActive ? 'active' : 'inactive';
            $scope.spinnerActive = isActive;
            $scope.spinnerClass = 'pace pace-' + state;
        };

        var deactivateSpinner = function () {
            if (ApplicationParameters.getVariable('pendingRequests') === 0) {
                setSpinnerActive(false);
                $rootScope.$broadcast('spinnerInactive');
            }
        };

        $scope.$on('connectivityUnavailable', function () {
            $scope.blockOutPage = true;
            deactivateSpinner();
        });

        $scope.$on('httpRequestStarted', function () {
            var pendingRequests = ApplicationParameters.getVariable('pendingRequests');
            if (pendingRequests > 0 && Spinner.spinnerStyle() !== 'none') {
                $scope.spinnerStyle = Spinner.spinnerStyle();
                setSpinnerActive(true);
            }
        });

        $scope.$on('httpRequestStopped', function () {
            if (ApplicationParameters.getVariable('pendingRequests') === 0) {
                if (ApplicationParameters.getVariable('canDelay')) {
                    ApplicationParameters.pushVariable('canDelay', false);
                    $timeout(deactivateSpinner, 400);
                } else {
                    deactivateSpinner();
                }
            }
        });

        deactivateSpinner();
    });

    app.directive('inlineSpinner', function () {
        return {
            templateUrl: 'common/spinner/partials/inlineSpinner.html',
            restrict: "EA",
            controller: 'spinnerController'
        };
    });

    app.factory('Spinner', function () {
        var currentSpinnerStyle = 'global';

        return {
            spinnerStyle: function (spinnerStyle) {
                if (spinnerStyle) {
                    currentSpinnerStyle = spinnerStyle;
                } else {
                    return currentSpinnerStyle;
                }
            }
        };
    });
})(angular.module('refresh.spinner', ['refresh.parameters']));
