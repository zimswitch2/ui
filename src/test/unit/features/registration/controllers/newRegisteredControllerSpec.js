var newRegisteredPageFeature = false;

describe('new registered customer', function () {
    'use strict';
    var scope, applicationParameters, digitalId;

    beforeEach(module('refresh.newRegistered'));

    it('should set up the correct route and template url', inject(function ($route) {
        expect($route.routes['/new-registered']).not.toBeUndefined();
        expect($route.routes['/new-registered'].templateUrl).toBe('features/registration/partials/newRegistered.html');
        expect($route.routes['/new-registered'].controller).toBe('NewRegisteredController');
    }));

    describe("with toggle new registered page on", function () {
        beforeEach(inject(function ($rootScope, $controller) {
            this.rootScope = $rootScope;
            scope = $rootScope.$new();

            newRegisteredPageFeature = false;

            $controller('NewRegisteredController', {
                $scope: scope
            });
        }));

        it("should default use old Internet banking site to No", function () {
            expect(scope.useOldInternetBanking).toEqual(false);
        });
    });

    describe("with toggle new registered page off", function () {
        beforeEach(inject(function ($rootScope, $controller, ApplicationParameters, DigitalId) {
            this.rootScope = $rootScope;
            scope = $rootScope.$new();
            applicationParameters = ApplicationParameters;
            digitalId = DigitalId;

            applicationParameters.pushVariable('newRegistered', 'something');
            digitalId.authenticate('username', 'some name');
            newRegisteredPageFeature = true;

            $controller('NewRegisteredController', {
                $scope: scope,
                ApplicationParameters: applicationParameters,
                DigitalId: digitalId
            });
        }));

        it("should set newRegistered from applicationParameters", function () {
            expect(scope.newRegistered).toEqual('something');
        });

        it('should read preferredName from DigitalId', function () {
            expect(scope.preferredName).toEqual('some name');
        });
    });
});
