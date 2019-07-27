describe('Beneficiaries', function () {
    describe('PayMultipleBeneficiariesController', function () {
        var scope, location, anchorScroll;

        beforeEach(module('refresh.beneficiaries.pay-multiple','refresh.beneficiaries.beneficiariesListService'));

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            anchorScroll = jasmine.createSpy('$anchorScroll');
            location = jasmine.createSpyObj('$location', ['path', 'hash']);

            $controller('PayMultipleBeneficiariesController', {
                $scope: scope,
                $location: location,
                $anchorScroll: anchorScroll
            });
        }));


        describe('next', function () {
            it('should update the location when called', function () {
                scope.next();
                expect(location.path).toHaveBeenCalledWith('/beneficiaries/pay-multiple/confirm');
            });
        });

        describe('on confirm', function () {
            it('should delegate to confirm method with results path', function () {
                scope.confirmAndRedirectTo = jasmine.createSpy('confirmAndRedirectTo');

                scope.confirm();
                expect(scope.confirmAndRedirectTo).toHaveBeenCalledWith('/beneficiaries/pay-multiple/results');
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
                        beneficiaryType: "COMPANY"
                    }
                ];
            });

            it('should return empty and display no beneficiaries message when beneficiaries is undefined', function () {
                scope.beneficiaries = undefined;
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([]);
                expect(scope.informationMessage).toEqual('There are no beneficiaries linked to your profile.');
            });

            it('should display all beneficiaries when there is no query filter', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = '';
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual(beneficiaries);
                expect(scope.informationMessage).toBe(null);
            });

            it('should filter beneficiaries by query', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = 'Test';
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([beneficiaries[0]]);
                expect(scope.informationMessage).toBe(null);
            });

            it('should filter beneficiaries by query and keep beneficiaries with non-zero amount', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = 'Test';
                scope.amounts = {4: 100, 3: 0};
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([beneficiaries[0], beneficiaries[3]]);
                expect(scope.informationMessage).toBe(null);
            });

            it('should keep beneficiaries with amounts and display no-match message when query does not match', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = 'non existing beneficiary';
                scope.amounts = {4: 100, 3: 20};
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([beneficiaries[2], beneficiaries[3]]);
                expect(scope.informationMessage).toEqual('No matches found.');
            });

            it('should return empty and display a message when there are no matches for search criteria', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = 'invalid search criteria';
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([]);
                expect(scope.informationMessage).toEqual('No matches found.');
            });

            it('should return empty and display a message when there are no beneficiaries linked to a profile', function () {
                scope.beneficiaries = [];
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([]);
                expect(scope.informationMessage).toEqual('There are no beneficiaries linked to your profile.');
            });

            it('should order beneficiaries and place those with amounts at the end of the list', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = 'Person';
                scope.amounts = {3: 20};
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual([beneficiaries[3], beneficiaries[2]]);
            });

            it('should not order beneficiaries when query is empty', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = '';
                scope.amounts = {3: 20};
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual(beneficiaries);
            });

            it('should not order beneficiaries when query is undefined', function () {
                scope.beneficiaries = beneficiaries;
                scope.query = undefined;
                scope.amounts = {3: 20};
                scope.$digest();
                expect(scope.beneficiaryList()).toEqual(beneficiaries);
            });

            it('should not be able to edit the beneficiary reference field for a listed beneficiary', function(){
                scope.beneficiaries = beneficiaries;
                expect(scope.isCompany(beneficiaries[3])).toBeTruthy();
            });
        });
    });
});
