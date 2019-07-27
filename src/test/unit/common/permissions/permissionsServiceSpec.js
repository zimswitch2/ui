describe('Permission Service', function () {

    'use strict';

    beforeEach(module('refresh.permissions'));

    var service,
        perennialCacherFetchSpy,
        principalForCurrentDashboardSpy,
        mock,
        resolvePromises,
        user;

    beforeEach(inject(function (PermissionsService, Cacher, User, _mock_, $rootScope) {
        perennialCacherFetchSpy = spyOn(Cacher.perennial, 'fetch');
        principalForCurrentDashboardSpy = spyOn(User, 'principalForCurrentDashboard');
        service = PermissionsService;
        user = User;
        mock = _mock_;

        spyOn(User, ['isCurrentDashboardCardHolder']);

        resolvePromises = function () {
            $rootScope.$digest();
        };
    }));

    describe('PermissionService', function () {
        beforeEach(function () {
            var currentDashboard = {
                "permissions": [{
                    "accountReference": {
                        "id": "44",
                        "number": "70456321"
                    },
                    "permissionTypes": [{
                        "action": "View",
                        "activity": "Beneficiary List"
                    }, {
                        "action": "Edit",
                        "activity": "Beneficiary"
                    }]
                }, {
                    "accountReference": {
                        "id": "50",
                        "number": "9876543"
                    },
                    "permissionTypes": [{
                        "action": "View",
                        "activity": "Transaction History"
                    }, {
                        "action": "Edit",
                        "activity": "Beneficiary Details"
                    }]
                }]
            };
            user.userProfile.currentDashboard = currentDashboard;
        });

        describe('Load permissions for dashboard', function () {

            describe('for dashboard with SED principal', function () {
                var dashboard = {
                    systemPrincipalId: 1234,
                    systemPrincipalKey: 'SED'
                };

                var userPermissions = {
                    "accountPermissionTypes": [{
                        "accountReference": {
                            "id": "44",
                            "number": "70456321"
                        },
                        "permissionTypes": [{
                            "action": "View",
                            "activity": "Beneficiary List"
                        }]
                    }]
                };

                beforeEach(function () {
                    perennialCacherFetchSpy.and.returnValue(mock.resolve({data: userPermissions}));
                });

                it('should call get operator permissions on perennial cache passing in the system principal', function () {
                    var expectedRequest = {
                        systemPrincipalIdentifier: {
                            systemPrincipalId: 1234,
                            systemPrincipalKey: 'SED'
                        }
                    };

                    var expectedCacheKey = 1234;

                    service.loadPermissionsForDashboard(dashboard);
                    expect(perennialCacherFetchSpy).toHaveBeenCalledWith('getOperatorPermissions', expectedRequest, expectedCacheKey);
                });

                it('should return the permissions from the service', function () {
                    var result = [];
                    service.loadPermissionsForDashboard(dashboard).then(function (permissions) {
                        result = permissions;
                    });

                    resolvePromises();

                    expect(result).toEqual(userPermissions.accountPermissionTypes);
                });
            });

            describe('for dashboard with principal other than SED', function () {
                var dashboard = {
                    systemPrincipalId: 1234,
                    systemPrincipalKey: 'SBSA_Banking'
                };

                it('should not call get operator permissions on perennial cache', function () {
                    service.loadPermissionsForDashboard(dashboard);
                    expect(perennialCacherFetchSpy).not.toHaveBeenCalled();
                });

                it('should return an empty permissions set', function () {
                    var result;
                    service.loadPermissionsForDashboard(dashboard).then(function (permissions) {
                        result = permissions;
                    });

                    resolvePromises();

                    expect(result).toEqual([]);
                });
            });

        });

        describe('Check permissions for operator', function () {


            beforeEach(function () {
                user.isCurrentDashboardCardHolder.and.returnValue(false);
            });

            describe('when calling checkPermission for valid permission', function () {
                it('should return true for view beneficiary list', function () {
                    expect(service.checkPermission('view:beneficiary list')).toBeTruthy();
                });

                it('should return true for view edit beneficiary details', function () {
                    expect(service.checkPermission('edit:beneficiary details')).toBeTruthy();
                });
            });

            describe('when calling check permissions for invalid permission', function () {
                it('should return false', function () {
                    expect(service.checkPermission('abc:123')).toBeFalsy();
                });
            });

            describe('when calling check permissions for undefined permission', function () {
                it('should return false', function () {
                    expect(service.checkPermission()).toBeFalsy();
                });
            });
        });

        describe('when checking permissions for card hold', function () {
            beforeEach(function () {
                user.isCurrentDashboardCardHolder.and.returnValue(true);
            });

            it('should always return true', function () {
                expect(service.checkPermission('abc:123')).toBeTruthy();
            });
        });

    });
});
