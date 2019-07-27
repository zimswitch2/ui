describe('customer information navigation directive', function () {
    'use strict';

    var scope, location, cancelConfirmationService;

    beforeEach(module('refresh.accountOrigination.customerInformationNavigation'));

    describe('controller', function () {
        beforeEach(inject(function ($rootScope, $controller, $location) {
            scope = $rootScope.$new();
            scope.currentPage = 'profile';
            location = $location;

            spyOn(location, 'url').and.callThrough();

            var routeParams = {
                product: 'current-account'
            };

            cancelConfirmationService = jasmine.createSpyObj('CancelConfirmationService', ['cancelEdit']);

            $controller('customerInformationNavigationController', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location,
                CancelConfirmationService: cancelConfirmationService
            });
        }));

        describe('view', function () {
            it('should not navigate away if the the target page is the same as the current', function () {
                scope.navigate('profile');
                expect(location.url).not.toHaveBeenCalled();
            });

            it('should navigate away if the page is in view mode', function () {
                scope.navigate('address');
                expect(location.url).toHaveBeenCalledWith('/apply/current-account/address');
            });
        });

        describe('edit', function () {

            beforeEach(function () {
                scope.editing = true;
            });

            it('should call cancel edit using cancel confirmation service if in edit mode', function () {
                scope.navigate('address');
                expect(cancelConfirmationService.cancelEdit).toHaveBeenCalledWith(jasmine.any(Function));
            });
        });
    });

    describe('directive', function () {
        // TODO: test all of the show/hide scenarios.

        it('should compile the partial correctly', inject(function (_TemplateTest_) {
            _TemplateTest_.allowTemplate('features/accountorigination/customerInformation/directive/partials/customerInformationNavigation.html');
            _TemplateTest_.compileTemplate('<customer-information-navigation></customer-information-navigation>');
        }));
    });
});