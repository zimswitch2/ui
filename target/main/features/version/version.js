(function (app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider.when('/version', {
            templateUrl: 'features/version/partials/version.html',
            controller: 'VersionController',
            unauthenticated: true
        });
    });

    app.controller('VersionController', function ($scope, ServiceEndpoint, $http) {
        $scope.gatewayVersion = {};
        $scope.frontEndVersion = {};
        $scope.deploymentVersion = {};

        ServiceEndpoint.version.makeRequest(undefined, {omitServiceErrorNotification: true}).then(function (response) {
            $scope.gatewayVersion.implementationVersion = response.data.implementationVersion;
            $scope.gatewayVersion.scmRevision = response.data.scmRevision;
        }).catch(function (error) {
            $scope.gatewayVersion.error = {
                message: 'Something went wrong retrieving gateway version, maybe details will help',
                details: error.message || error.data
            };
        });

        $http.get('version.json').then(function (response) {
            $scope.frontEndVersion.implementationVersion = response.data.buildVersion;
            $scope.frontEndVersion.scmRevision = response.data.gitRevision;
        }).catch(function () {
            $scope.frontEndVersion.error = 'Cannot retrieve front-end version, this must be a local run';
        });

        $http.get('deployment.json').then(function (response) {
            $scope.deploymentVersion.currentDeployment = response.data.deployment;
            $scope.deploymentVersion.scmRevision = response.data.gitRevision;
        }).catch(function () {
            $scope.deploymentVersion.error = 'Cannot retrieve deployment version, this must be a local run';
        });
    });

})(angular.module('refresh.version', ['refresh.configuration']));
