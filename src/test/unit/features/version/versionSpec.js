describe('Version', function () {
    'use strict';

    beforeEach(module('refresh.version'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should use the correct controller ', function () {
            expect(route.routes['/version'].controller).toEqual('VersionController');
        });

        it('should use the correct template ', function () {
            expect(route.routes['/version'].templateUrl).toEqual('features/version/partials/version.html');
        });

        it('should indicate that the route can be accessed without authentication', inject(function ($route) {
            expect($route.routes['/version'].unauthenticated).toBeTruthy();
        }));
    });

    describe('VersionController', function () {
        var scope, httpBackend, controller, test;

        beforeEach(inject(function ($rootScope, $httpBackend, $controller, ServiceTest) {
            scope = $rootScope.$new();
            ServiceTest.spyOnEndpoint('version');

            httpBackend = $httpBackend;
            controller = $controller;
            test = ServiceTest;
        }));

        it('should set the gateway, front end and deployment versions on the scope when successful', function () {
            test.stubResponse('version', 200, {
                'implementationVersion': 'gateway implementation version',
                'scmRevision': 'gateway svn revision'
            });

            httpBackend.expectGET('version.json').respond(200, {
                buildVersion: 4785,
                gitRevision: '6ad2e108b122c9a34524a7a55340206da78053da'
            });

            httpBackend.expectGET('deployment.json').respond(200, {
                deployment: 'green',
                gitRevision: '6ad2e108b122c9a34524a7a55340206da78053db'
            });

            controller('VersionController', {
                $scope: scope
            });

            httpBackend.flush();

            expect(scope.gatewayVersion).toEqual({
                implementationVersion: 'gateway implementation version',
                scmRevision: 'gateway svn revision'
            });

            expect(scope.frontEndVersion).toEqual({
                implementationVersion: 4785,
                scmRevision: '6ad2e108b122c9a34524a7a55340206da78053da'
            });

            expect(scope.deploymentVersion).toEqual({
                currentDeployment: 'green',
                scmRevision: '6ad2e108b122c9a34524a7a55340206da78053db'
            });
        });

        it('should set gateway and front end errors on the scope when unsuccessful', function () {
            test.stubResponse('version', 500, {
                message: 'Something went wrong'
            });

            httpBackend.expectGET('version.json').respond(404);
            httpBackend.expectGET('deployment.json').respond(404);

            controller('VersionController', {
                $scope: scope
            });

            httpBackend.flush();

            expect(scope.gatewayVersion.error.message).toBeDefined();
            expect(scope.gatewayVersion.error.details).toEqual({
                message: 'Something went wrong'
            });

            expect(scope.frontEndVersion.error).toBeDefined();
            expect(scope.deploymentVersion.error).toBeDefined();
        });
    });
});