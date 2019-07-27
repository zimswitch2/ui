describe('Employment', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.employment'));

    var scope, location, routeParams, controller, CustomerInformationData;

    describe('routes', function () {
        var route, location;
        beforeEach(inject(function ($route, $location) {
            route = $route;
            location = $location;
        }));

        it('should get the correct employment template', function () {
            expect(route.routes['/apply/:product/employment'].templateUrl).toBe('features/accountorigination/customerInformation/partials/employment.html');
        });

        it('should get the correct employment controller', function () {
            expect(route.routes['/apply/:product/employment'].controller).toBe('EmploymentController');
        });

        describe('on resolving', function () {
            var CustomerInformationData;

            beforeEach(inject(function (_CustomerInformationData_) {
                route.current = { params: {product: 'current-account'} };
                CustomerInformationData = _CustomerInformationData_;
                spyOn(CustomerInformationData, ['stash']);
            }));

            describe('when the customer has no employment details', function () {
                afterEach(function () {
                    customerManagementV4Feature = true;
                });

                it('should redirect to edit employment page', function () {
                    customerManagementV4Feature = false;

                    route.routes['/apply/:product/employment'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(CustomerInformationData.stash).toHaveBeenCalled();
                    expect(location.path()).toEqual('/apply/current-account/employment/edit');
                });

                describe('with customer management v4 toggled on', function () {
                    it('should redirect to edit employment page if customer has no unemployment reason', function () {
                        route.routes['/apply/:product/employment'].resolve.checkRouting(location, route, CustomerInformationData);

                        expect(CustomerInformationData.stash).toHaveBeenCalled();
                        expect(location.path()).toEqual('/apply/current-account/employment/edit');
                    });

                    it('should not redirect to edit employment page if customer has unemployment reason', function () {
                        CustomerInformationData.initialize({unemploymentReason: 'A'});

                        route.routes['/apply/:product/employment'].resolve.checkRouting(location, route, CustomerInformationData);

                        expect(CustomerInformationData.stash).not.toHaveBeenCalled();
                        expect(location.path()).not.toEqual('/apply/current-account/employment/edit');
                    });
                });
            });

            describe('when the customer has employment details', function () {
                it('should not redirect to edit employment page', function () {
                    CustomerInformationData.initialize({
                        employmentDetails: [{
                            startDate: '2014-12-17T00:00:00.000+0000',
                            endDate: '9999-12-30T22:00:00.000+0000',
                            employerName: 'ZYX Restaurant',
                            employmentStatusCode: 1
                        }]
                    });

                    route.routes['/apply/:product/employment'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(location.path()).not.toEqual('/apply/current-account/employment/edit');
                });
            });
        });
    });

    describe('controller', function () {
        function initController() {
            controller('EmploymentController', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams
            });
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, $location, $routeParams, _CustomerInformationData_) {
            scope = $rootScope.$new();
            location = $location;
            routeParams = $routeParams;
            routeParams.product = 'current-account';

            CustomerInformationData = _CustomerInformationData_;
            CustomerInformationData.initialize({});

            controller = $controller;
        }));

        describe('on initialize', function () {
            it('should make $routeParams product available to the scope', function () {
                initController();
                expect(scope.product).toEqual('current-account');
            });
        });

        describe('edit()', function () {
            beforeEach(function () {
                initController();
            });

            it('should stash current customer', function () {
                var stashSpy = spyOn(CustomerInformationData, ['stash']);
                scope.edit();
                expect(stashSpy).toHaveBeenCalled();
            });

            it('should redirect to add employment page when employment action is add', function () {
                scope.edit('add');
                expect(location.path()).toEqual('/apply/' + routeParams.product + '/employment/add');
            });

            it('should redirect to edit employment page when employment action is not add', function () {
                scope.edit('not add');
                expect(location.path()).toEqual('/apply/' + routeParams.product + '/employment/edit');
            });
        });

        describe('gotoIncomePage', function () {
            it('should redirect to income page', function () {
                initController();
                scope.gotoIncomePage();
                expect(location.path()).toEqual('/apply/' + routeParams.product + '/income');
            });
        });
    });
});