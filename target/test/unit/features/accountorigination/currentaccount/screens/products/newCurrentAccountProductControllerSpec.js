describe('Products', function () {
    beforeEach(module('refresh.accountOrigination.currentAccount.screens.products'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when selecting a product', function () {
            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/products/partials/currentAccountProducts.html');
            });

            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account'].controller).toEqual('CurrentAccountProductController');
            });
        });
    });

    describe('CurrentAccountProductController', function () {
        var scope, controller, mock, rootScope, applicationLoader, currentAccountProductFamilyContent;


        function invokeController() {
            controller('CurrentAccountProductController',
                {
                    $scope: scope,
                    ApplicationLoader: applicationLoader,
                    CurrentAccountProductFamilyContent: currentAccountProductFamilyContent
                }
            );
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, _mock_, CurrentAccountProductFamilyContent) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
            controller = $controller;
            applicationLoader = jasmine.createSpyObj('ApplicationLoader', ['loadAll']);
            currentAccountProductFamilyContent = CurrentAccountProductFamilyContent;
            mock = _mock_;
        }));

        it("should assign products to currentAccountProductFamilyContent", function () {
            var applications = {current: {state: "EXISTING"}};
            applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
            invokeController();
            expect(scope.products).toEqual(currentAccountProductFamilyContent.all());

        });

        describe("load application status", function () {

            describe("has current account", function () {
                it("should be true if status is  EXISTING", function () {
                    var applications = {current: {status: "EXISTING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasCurrentAccount()).toBeTruthy();
                });

                it("should be false if status is Not EXISTING", function () {
                    var applications = {current: {status: "NEW"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasCurrentAccount()).toBeFalsy();
                });

            });
            describe("can apply", function () {

                it("should be true if status is  NEW", function () {
                    var applications = {current: {status: "NEW"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.canApply()).toBeTruthy();
                });

                it("should be false if status is Not NEW", function () {
                    var applications = {current: {status: "EXISTING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.canApply()).toBeFalsy();
                });
            });

            describe('not NEW or EXISTING application', function () {
                it('should change location to /apply', inject(function ($location) {
                    var applications = {current: {status: "PENDING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect($location.path()).toEqual('/apply');
                }));
            });
        });
    });
});