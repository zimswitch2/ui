var viewOverviewPageFeature;

describe('SwitchDashboardService', function () {
    'use strict';

    var switchDashboardService,
        user,
        location,
        dashboard,
        applicationParameters,
        activateOtpService,
        homeService,
        mock,
        permissionsService,
        resolvePromises;
    beforeEach(module('refresh.switch-dashboard.service'));

    beforeEach(module(function ($provide) {
        activateOtpService = jasmine.createSpyObj('ActivateOtpService', ['amendAccessDirect']);
        $provide.value('ActivateOtpService', activateOtpService);

        applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['pushVariable']);
        $provide.value('ApplicationParameters', applicationParameters);

        user = {
            userProfile: {},
            switchToDashboard: null
        };
        spyOn(user, 'switchToDashboard');
        $provide.value('User', user);
    }));

    beforeEach(inject(function ($location, $rootScope, SwitchDashboardService, HomeService, PermissionsService, _mock_) {
        switchDashboardService = SwitchDashboardService;
        location = $location;
        homeService = HomeService;
        permissionsService = PermissionsService;
        mock = _mock_;

        spyOn(homeService, ['goHome']);
        spyOn(permissionsService, ['loadPermissionsForDashboard']);

        permissionsService.loadPermissionsForDashboard.and.returnValue(mock.resolve([]));

        resolvePromises = function () {
            $rootScope.$digest();
        };
    }));

    describe('card without error', function () {
        beforeEach(function () {
            dashboard = {};
        });

        it('should switch to the given dashboard', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(user.switchToDashboard).toHaveBeenCalledWith(dashboard);
        });

        it('should call goHome', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(homeService.goHome).toHaveBeenCalled();
        });
    });

    describe('switch to dashboard with SED principal', function () {
        var permissions;

        beforeEach(function () {
            dashboard = {
                systemPrincipalKey: 'SED',
                systemPrincipalId: 1234
            };

            permissions = [{
                "accountReference": {
                    "id": "44",
                    "number": "70456321"
                },
                "permissionTypes": [{
                    "action": "Capture",
                    "activity": "Once-off Payment"
                }]
            }];

            permissionsService.loadPermissionsForDashboard.and.returnValue(mock.resolve(permissions));
        });

        it('should check permissions for SED dashboard', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(permissionsService.loadPermissionsForDashboard).toHaveBeenCalledWith(dashboard);
        });

        it('should not switch to the given dashboard if load permissions has not resolve', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(user.switchToDashboard).not.toHaveBeenCalled();
        });

        it('should not call goHome if load permissions has not resolved', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(homeService.goHome).not.toHaveBeenCalled();
        });

        it('should switch to the given dashboard after load permissions has resolved', function () {
            switchDashboardService.switchToDashboard(dashboard);
            resolvePromises();
            expect(user.switchToDashboard).toHaveBeenCalledWith(dashboard);
        });

        it('should call goHome after load permissions has resolved', function () {
            switchDashboardService.switchToDashboard(dashboard);
            resolvePromises();
            expect(homeService.goHome).toHaveBeenCalled();
        });

        it('it should add the permissions to the dashboard', function () {
            switchDashboardService.switchToDashboard(dashboard);
            resolvePromises();
            expect(dashboard.permissions).toEqual(permissions);
        });
    });

    describe('login error', function () {
        beforeEach(function () {
            dashboard = {
                cardError: {
                    code: 'login error',
                    message: 'error message'
                },
                requiresActivateOTP: function () {
                    return false;
                },
                requiresAmendAccessDirect: function () {
                    return false;
                }
            };
        });

        it('should push login error to application parameters', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(applicationParameters.pushVariable).toHaveBeenCalledWith('loginError', 'error message');
        });

        it('should remove the current digitalId', inject(function (DigitalId) {
            DigitalId.authenticate('token');
            switchDashboardService.switchToDashboard(dashboard);
            expect(DigitalId.isAuthenticated()).toBeFalsy();
        }));

        it('should redirect to login page', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(location.path()).toEqual('/login');
        });
    });

    describe('when activate otp is required', function () {
        beforeEach(function () {
            dashboard = {
                profileId: 'profile id',
                cardError: {},
                requiresActivateOTP: function () {
                    return true;
                }
            };
        });

        it('should redirect to activate otp page', function () {
            switchDashboardService.switchToDashboard(dashboard);
            expect(location.path()).toEqual('/otp/activate/profile id');
        });
    });

    describe('when amend access direct is required', function () {
        var flowCreate;
        beforeEach(inject(function (Flow) {
            dashboard = {
                profileId: 'profile id',
                cardError: '7515',
                requiresActivateOTP: function () {
                    return false;
                },
                requiresAmendAccessDirect: function () {
                    return true;
                }
            };

            flowCreate = spyOn(Flow, 'create');
        }));

        it('should create the amend access direct flow', function () {
            activateOtpService.amendAccessDirect.and.returnValue(mock.reject());
            switchDashboardService.switchToDashboard(dashboard);
            expect(flowCreate).toHaveBeenCalledWith([''], 'Activate your internet banking', '', false);
        });

        it('should reject after unsuccessful amend', function () {
            activateOtpService.amendAccessDirect.and.returnValue(mock.reject());
            expect(switchDashboardService.switchToDashboard(dashboard)).toBeRejected();
        });

        it('should redirect to account summary after successful amend and recursive switch dashboard flow', inject(function ($rootScope) {
            viewOverviewPageFeature = false;
            activateOtpService.amendAccessDirect.and.callFake(function () {
                delete dashboard.cardError;
                return mock.resolve();
            });

            switchDashboardService.switchToDashboard(dashboard);
            $rootScope.$digest();
            expect(homeService.goHome).toHaveBeenCalled();
        }));
    });
});
