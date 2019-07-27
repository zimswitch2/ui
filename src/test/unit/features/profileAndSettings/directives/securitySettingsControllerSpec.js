describe('securitySettingsSubNav', function() {
    'use strict';
    var location, scope;
    beforeEach(module('refresh.profileAndSettings.securitySettings'));

    describe('securitySettingsController', function () {
        var expectedItems;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            location = jasmine.createSpyObj('$location', ['path']);

            $controller('SecuritySettingController', {
                $scope: scope,
                $location: location
            });

            scope.$digest();
        }));


        it('should contain a list of sub navigation items', function () {
            expectedItems = [
                {
                    url: '#/internet-banking',
                    text: 'Internet banking'
                }
            ];

            var items = scope.getItems('securitySettingsMenuItems');
            expect(items.length > 0).toBeTruthy();
        });

        it('should return the current location', function () {

            var currentLocationPath = 'a/path';
            var menuPath = {url: currentLocationPath};

            location.path.and.returnValue(currentLocationPath);
            var result = scope.isCurrentLocation(menuPath);

            expect(location.path).toHaveBeenCalled();
            expect(result).toBeTruthy();

            currentLocationPath = 'another/path';

            location.path.and.returnValue(currentLocationPath);
            result = scope.isCurrentLocation(menuPath);
            expect(location.path).toHaveBeenCalled();
            expect(result).toBeFalsy();

        });
    });
});