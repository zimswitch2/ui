describe('IncomeAndExpenseController', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.customerInformation.incomeAndExpense', 'refresh.accountOrigination.domain.customer'));

    describe('routes', function (){
        var route, location;

        beforeEach(inject(function ($route, $rootScope, $controller, $location) {
            route = $route;
            location = $location;
        }));

        it('should get the correct income and expenses template', function () {
            expect(route.routes['/apply/:product/income'].templateUrl).toBe('features/accountorigination/customerInformation/partials/incomeAndExpenses.html');
        });

        it('should get the correct income and expenses controller', function () {
            expect(route.routes['/apply/:product/income'].controller).toBe('IncomeAndExpenseController');
        });

        describe('on resolving', function () {
            var CustomerInformationData;

            beforeEach(inject(function (_CustomerInformationData_) {
                route.current = { params: {product: 'current-account'} };
                CustomerInformationData = _CustomerInformationData_;
                spyOn(CustomerInformationData, ['stash']);
            }));

            describe('when customer has zero income and expense', function () {
                it('should redirect to edit income page upon stashing customer info', function () {
                    route.routes['/apply/:product/income'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(CustomerInformationData.stash).toHaveBeenCalled();
                    expect(location.path()).toEqual('/apply/current-account/income/edit');
                });
            });

            describe('when customer has at least one income and one expense', function () {
                it('should not redirect to edit income page upon stashing customer info', function () {
                    CustomerInformationData.initialize({
                        incomeExpenseItems: [
                            {itemTypeCode: '99', itemAmount: 1000.0, itemExpenditureIndicator: 'E'},
                            {itemTypeCode: '04', itemAmount: 3600.0, itemExpenditureIndicator: 'I'}
                        ]
                    });
                    route.routes['/apply/:product/income'].resolve.checkRouting(location, route, CustomerInformationData);

                    expect(CustomerInformationData.stash).not.toHaveBeenCalled();
                    expect(location.path()).not.toEqual('/apply/current-account/income/edit');
                });
            });
        });
    });

   describe('controller', function () {
       var controller, scope, CustomerInformationData, location;

       function initController () {
           controller('IncomeAndExpenseController', {
               $scope: scope,
               $location: location,
               $routeParams: {product: 'current-account'},
               CustomerInformationData: CustomerInformationData
           });
           scope.$digest();
       }

       beforeEach(inject(function ($rootScope, $controller, $location, _CustomerInformationData_) {
           controller = $controller;
           location = $location;
           scope = $rootScope.$new();

           CustomerInformationData = _CustomerInformationData_;
           CustomerInformationData.initialize({
               incomeExpenseItems: [
                   {itemTypeCode: '01', itemAmount: 1000.0, itemExpenditureIndicator: 'E'},
                   {itemTypeCode: '04', itemAmount: 3600.0, itemExpenditureIndicator: 'I'}
               ]
           });

           spyOn(CustomerInformationData, 'stash').and.callThrough();

           initController();
           scope.$digest();
       }));

       describe('on initialize', function () {
           it('should get the injected ustomer information data', function () {
               spyOn(CustomerInformationData, ['current']).and.returnValue({});
               expect(scope.customerInformationData).toEqual(jasmine.objectContaining(CustomerInformationData.current()));
               expect(CustomerInformationData.current).toHaveBeenCalled();
           });

           it('should get the product applied for', function () {
               expect(scope.product).toEqual('current-account');
           });
       });

       it("should stash the original version and change to the edit view when you click edit", function () {
           scope.edit('income');
           expect(CustomerInformationData.stash).toHaveBeenCalled();
           expect(location.url()).toBe('/apply/current-account/income/edit');
       });

       it("should navigate to the submit page when you click next", function () {
           scope.next();
           expect(location.url()).toBe('/apply/current-account/submit');
       });
   });
});
