describe('AddressController', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.address', 'refresh.accountOrigination.domain.customer'));

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should load the address controller', function () {
            expect(route.routes['/apply/:product/address'].controller).toBe('ViewAddressController');
        });

        it('should load the address template', function () {
            expect(route.routes['/apply/:product/address'].templateUrl).toBe('features/accountorigination/customerInformation/partials/address.html');
        });

        describe('when resolving', function () {
            var CustomerInformationData;
            beforeEach(inject(function (_CustomerInformationData_) {
                route.current = { params: {product: 'current-account'} };
                CustomerInformationData = _CustomerInformationData_;
                spyOn(CustomerInformationData, ['stash']);
            }));

            it('should redirect to edit address page if customer has no residential address', function () {
                spyOn(CustomerInformationData.current(), ['hasCurrentResidentialAddress']).and.returnValue(false);

                route.routes['/apply/:product/address'].resolve.checkRouting(location, route, CustomerInformationData);

                expect(CustomerInformationData.stash).toHaveBeenCalled();
                expect(location.path()).toEqual('/apply/current-account/address/edit');
            });

            it('should not redirect to edit address page if customer has residential address', function () {
                spyOn(CustomerInformationData.current(), ['hasCurrentResidentialAddress']).and.returnValue(true);

                route.routes['/apply/:product/address'].resolve.checkRouting(location, route, CustomerInformationData);

                expect(CustomerInformationData.stash).not.toHaveBeenCalled();
                expect(location.path()).not.toEqual('/apply/current-account/address/edit');
            });
        });
    });

    describe('controller', function () {
        var scope, location, controller, CustomerInformationData;

        function initController() {
            controller('ViewAddressController', {
                $scope: scope,
                $location: location,
                $routeParams: {product: 'current-account'},
                CustomerInformationData: CustomerInformationData
            });
            scope.$digest();
        }

        beforeEach(inject(function ($controller, $rootScope, $location, _CustomerInformationData_) {
            scope = $rootScope.$new();

            location = $location;
            controller = $controller;
            CustomerInformationData = _CustomerInformationData_;
            spyOn(CustomerInformationData, 'stash');
        }));

        it('should not redirect to edit address page if customer has residential address', function () {
            CustomerInformationData.initialize({
                addressDetails: [{
                    addressType: '01',
                    addressUsage: [{
                            usageCode: '05',
                            validFrom: '2014-03-13',
                            validTo: '9999-12-30T22:00:00.000+0000'
                        }]
                }]
            });
            initController();

            expect(location.path()).not.toEqual('/apply/current-account/address/edit');
        });

        it('should stash any changes and navigate to edit when the edit button is clicked', function () {
            initController();
            scope.edit();
            expect(CustomerInformationData.stash).toHaveBeenCalled();
            expect(location.url()).toBe('/apply/current-account/address/edit');
        });

        it('should navigate to employment when next is clicked', function(){
            initController();
            scope.next();
            expect(location.url()).toBe('/apply/current-account/employment');
        });
    });
});