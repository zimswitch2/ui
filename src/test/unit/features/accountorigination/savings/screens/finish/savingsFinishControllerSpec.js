describe('Savings Finish', function () {
    'use strict';
    beforeEach(module('refresh.accountOrigination.savings.screens.finish', 'refresh.flow',
        'refresh.accountOrigination.savings.domain.savingsAccountApplication'));

    describe("routes", function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when at Savings finish page", function () {

            it("should use the correct template", function () {
                expect(route.routes['/apply/:productName/finish'].templateUrl).toEqual('features/accountorigination/savings/screens/finish/partials/savingsFinish.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/:productName/finish'].controller).toEqual('SavingsFinishController');
            });
        });
    });

    describe('SavingsFinishController', function () {

        var scope, location, productName, accountNumber, originationDate, SavingsAccountApplication;

        beforeEach(inject(function ($rootScope, $controller, _$location_, _SavingsAccountApplication_) {
            scope = $rootScope.$new();
            location = _$location_;
            productName = "SAVINGSACCOUNT";
            accountNumber = '10-00-035-814-00';
            originationDate = new Date('2015-09-14T10:49:51.000+0000');
            SavingsAccountApplication = _SavingsAccountApplication_;
            spyOn(SavingsAccountApplication, 'productName').and.returnValue(productName);
            spyOn(SavingsAccountApplication, 'accountNumber').and.returnValue(accountNumber);
            spyOn(SavingsAccountApplication, 'originationDate').and.returnValue(originationDate);

            $controller('SavingsFinishController', {
                $scope: scope,
                $location: location,
                SavingsAccountApplication: SavingsAccountApplication
            });
        }));

        it('should set ProductName from SavingsAccountApplication', function () {
            expect(scope.productName).toBe(productName);
        });

        it('should set accountNumber from SavingsAccountApplication', function () {
            expect(scope.accountNumber).toBe(accountNumber);
        });

        it('should set originationDate from SavingsAccountApplication', function () {
            expect(scope.acceptedTimestamp).toBe(originationDate);
        });

        describe('applicationSuccessful', function () {
            it('should return the value from SavingsAccountApplication.applicationSuccessful', function(){
                spyOn(SavingsAccountApplication, 'applicationSuccessful').and.returnValue('Some random Value');
                expect(scope.applicationSuccessful()).toBe('Some random Value');
            });
        });

    });

});
