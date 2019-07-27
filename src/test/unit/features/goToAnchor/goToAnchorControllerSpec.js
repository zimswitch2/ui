'use strict';

(function () {
    describe('GoToAnchor', function () {
        beforeEach(module('refresh.goToAnchorController'));


        describe('GoToAnchorController', function () {
            var scope, spy;

            beforeEach(inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();

                spy = spyOn(angular.element, ['scrollTo']);


                $controller('GoToAnchorController', {
                    $scope: scope
                });
                scope.goToAnchor('top');
            }));

            it('it should scroll to the top', function () {
                expect(spy).toHaveBeenCalled();

            });
        });
    });
})();

