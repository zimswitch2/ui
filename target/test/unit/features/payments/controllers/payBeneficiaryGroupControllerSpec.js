describe('Beneficiaries', function () {
    describe('PayBeneficiaryGroupController', function () {
        var scope, routeParams, location;

        beforeEach(module('refresh.beneficiaries.pay-multiple','refresh.beneficiaries.beneficiariesListService'));

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            routeParams = {};
            location = jasmine.createSpyObj('$location', ['path', 'hash']);

            $controller('PayBeneficiaryGroupController', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location,
                $anchorScroll: jasmine.createSpy('$anchorScroll')
            });
        }));

        describe('next', function () {
            it('should update the location when called with groupName', function () {
                routeParams.groupName = "test";
                scope.next();

                expect(location.path).toHaveBeenCalledWith('/beneficiaries/pay-group/confirm/test');
            });
        });

        describe('groupOnly', function () {
            it('should be true', function () {
                expect(scope.groupOnly()).toBeTruthy();
            });
        });

        describe('on confirm', function () {
            it('should direct to results page with group name', function () {
                routeParams.groupName = "test";
                scope.confirmAndRedirectTo = jasmine.createSpy('confirmAndRedirectTo');
                scope.confirm();

                expect(scope.confirmAndRedirectTo).toHaveBeenCalledWith('/beneficiaries/pay-group/results/test');
            });
        });

        describe('beneficiary list', function () {
            var beneficiaries;
            beforeEach(function () {
                beneficiaries = [
                    {
                        recipientId: 1,
                        name: "Test",
                        accountNumber: "211",
                        recipientGroupName: "Group A"
                    },
                    {
                        recipientId: 2,
                        name: "Ashould be first",
                        accountNumber: "2124"
                    },
                    {
                        recipientId: 3,
                        name: "Person 3",
                        accountNumber: "2125"
                    },
                    {
                        recipientId: 4,
                        name: "Person 4",
                        accountNumber: "2126",
                        recipientGroupName: "Group B"
                    }
                ];

            });

            it('should call beneficiary filter and return the list of beneficiaries in the group', function () {
                scope.beneficiaries = beneficiaries;
                routeParams.groupName = 'Group A';
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([beneficiaries[0]]);
            });
        });
    });
});
