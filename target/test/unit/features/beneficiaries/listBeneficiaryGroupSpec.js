describe('Beneficiary Groups', function () {
    beforeEach(module('refresh.beneficiaries.groups', 'refresh.test', 'refresh.configuration', 'refresh.navigation', 'refresh.fixture', 'refresh.metadata', 'refresh.parameters'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when a beneficiary group is to be added', function () {
            it('should use the correct controller to list all groups', function () {
                expect(route.routes['/beneficiaries/groups/list'].controller).toEqual('ListBeneficiaryGroupsController');
            });

            it('should use the correct template to view all groups', function () {
                expect(route.routes['/beneficiaries/groups/list'].templateUrl).toEqual('features/beneficiaries/partials/viewGroups.html');
            });
        });
    });

    describe('view controller', function () {
        var $scope, $location, mock, ApplicationParameters, service;
        beforeEach(inject(function ($rootScope, $controller, _$location_, _mock_, _ApplicationParameters_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            mock = _mock_;
            ApplicationParameters = _ApplicationParameters_;
            var card = jasmine.createSpyObj('card', ['current']);
            service = jasmine.createSpyObj('service', ['listWithMembers', 'deleteGroup']);
            card.current.and.returnValue({number: 'ABC123'});
            service.listWithMembers.and.returnValue(mock.resolve({beneficiaryList: [], beneficiaryGroups: [
                {name: 'Foo'},
                {name: 'Bar'}
            ]}));
            $controller('ListBeneficiaryGroupsController', {$scope: $scope, Card: card, GroupsService: service, $location: $location});
        }));

        describe('go', function() {
            it('should update the location when called', function() {
                $scope.go('/beneficiaries/group/view/', 1);
                $scope.$apply();
                expect($location.path()).toEqual('/beneficiaries/group/view/1');
            });
        });

        describe('confirmDeletion', function () {
            it('should remove the group from the list upon successful deletion', function () {
                service.deleteGroup.and.returnValue(mock.resolve());
                var deletePromise = $scope.delete({name: 'Bar'});
                $scope.$digest();
                expect($scope.beneficiaryGroups).toEqual([
                    {name: 'Foo'}
                ]);

                expect(deletePromise).toBeResolved();
                $scope.$digest(); // this is needed for the expectation above to actually run
            });

            it('should not remove the group from the list when there is a failure', function () {
                service.deleteGroup.and.returnValue(mock.reject());
                var deletePromise = $scope.delete({name: 'Bar'});
                $scope.$digest();
                expect($scope.beneficiaryGroups).toEqual([
                    {name: 'Foo'},
                    {name: 'Bar'}
                ]);
                expect(deletePromise).toBeRejected();
                $scope.$digest(); // this is needed for the expectation above to actually run
            });
        });

        describe('markForDeletion', function () {
            it('should set the deletion flags', function () {
                $scope.markForDeletion({name: 'Foo'});
                expect($scope.beingDeleted).toEqual({name: 'Foo'});
            });
        });

        describe('isBeingDeleted', function () {
            it('should know if a group is marked for deletion', function () {
                $scope.beingDeleted = 'Foo';
                expect($scope.isBeingDeleted({name: 'Foo'})).toBeTruthy();
            });

            it('should know if a group is not marked for deletion', function () {
                $scope.beingDeleted = {name: 'Bar'};
                expect($scope.isBeingDeleted({name: 'Foo'})).toBeFalsy();
            });
        });

        describe("delete groups messages", function () {
            it("should show confirm message", function () {
                var group = {name: 'Bar'};
                expect($scope.confirmDeleteMessage(group)).toBe('Delete Bar? Any beneficiaries in this group will remain in your profile');
            });

            it("should return error message", function () {
                var group = {name: 'Bar'};
                expect($scope.errorDeleteMessage(group)).toBe("Couldn't delete beneficiary Bar. Please try again later.");
            });
        });

        describe('sortArrowClass', function () {
            it('should be active for the current sort', function () {
                expect($scope.sortArrowClass('name')).toContain('active');
            });

            it('should be not be active for other fields', function () {
                expect($scope.sortArrowClass('other field')).not.toContain('active');
            });
        });

        describe('initialize', function () {
            it('should sort by name', function () {
                expect($scope.sort.criteria).toEqual('name');
            });

            it('should place beneficiary groups on the scope', function () {
                $scope.$digest();
                expect($scope.beneficiaryGroups).toEqual([
                    {name: 'Foo'},
                    {name: 'Bar'}
                ]);
            });
        });

        describe('pay beneficiary group', function () {
            it('should redirect to the pay multiple page', function () {
                $scope.payBeneficiaryGroup({name: 'test', beneficiaries: ['foo']});
                expect($location.path()).toEqual('/beneficiaries/pay-group/test');
            });

            it('should not redirect to the pay multiple page if the group is empty', function () {
                $location.path('/foo');
                $scope.payBeneficiaryGroup({name: 'test', beneficiaries: []});
                expect($location.path()).toEqual('/foo');
            });
        });

        describe('#isEmptyGroup', function () {
            it('should know a group may be empty', function () {
                expect($scope.isEmptyGroup({beneficiaries: []})).toBeTruthy();
            });

            it('should know a group may be populated', function () {
                expect($scope.isEmptyGroup({beneficiaries: ['foo']})).toBeFalsy();
            });
        });
    });


});
