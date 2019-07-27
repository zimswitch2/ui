describe('Dashboards', function () {
    'use strict';

    beforeEach(module('refresh.profileAndSettings.dashboards', 'refresh.security.user', 'refresh.card', 'refresh.parameters',
        'refresh.switch-dashboard.service'));
    var route, user, scope, card, menuItems, applicationParameters;

    describe('routes', function () {
        var userProfile = {
            dashboards: [
                {
                    "dashboardName": "My Personal Dashboard",
                    "profileId": "43657",
                    "systemPrincipalId": "956",
                    "card": "4451221116405778"
                }
            ]
        };

        beforeEach(inject(function ($controller, $rootScope, $route, User) {
            route = $route;
            scope = $rootScope.$new();
            user = User;
            user.userProfile = userProfile;
            $controller('CardDashboardsController', {$scope: scope, User: user});
        }));

        it('should use the correct controller', function () {
            expect(route.routes['/dashboards'].controller).toEqual('CardDashboardsController');
        });

        it('should use the correct template', function () {
            expect(route.routes['/dashboards'].templateUrl).toEqual('features/profileAndSettings/partials/dashboards.html');
        });
    });

    describe('CardStatus', function () {
        var cardStatus, maskedCardNumber;
        var hotCardedUserProfile = {
            currentDashboard: {
                "dashboardName": "My Current Dashboard",
                "profileId": "43657",
                "systemPrincipalId": "956",
                "card": '4451221116405778'
            },
            dashboards: [
                {
                    "dashboardName": "My Current Dashboard",
                    "profileId": "43657",
                    "systemPrincipalId": "956",
                    "card": '4451221116405778'
                },
                {
                    "dashboardName": "My Other Dashboard",
                    "profileId": "43658",
                    "systemPrincipalId": "956",
                    "cardError": {},
                    "maskedCardNumber": 'xxxx-xxxx-xxxx-xxxx'
                }
            ]
        };

        beforeEach(inject(function ($controller, $rootScope, $route) {
            route = $route;
            scope = $rootScope.$new();
            user = jasmine.createSpyObj('User', ['userProfile']);
            user.userProfile = hotCardedUserProfile;
            $controller('CardDashboardsController', {$scope: scope, User: user});
            scope.$digest();
            cardStatus = scope.cardStatus(_.find(hotCardedUserProfile.dashboards, {profileId: '43658'}));
            maskedCardNumber = _.find(hotCardedUserProfile.dashboards, {profileId: '43658'}).maskedCardNumber;
        }));

        it('should set the menuItems list ', function () {
            expect(scope.menuItems.length > 0).toBeTruthy();
        });

        it('should get a list of dashboards', function () {
            expect(scope.userDashboards).toEqual(hotCardedUserProfile.dashboards);
        });


        it('should return card numbers for profiles that do not have cards', function () {
            expect(maskedCardNumber).toBe('xxxx-xxxx-xxxx-xxxx');
        });


        it('should show blank column when card is not the current dashboard', function () {
            expect(scope.dashboardIndicator(user.userProfile)).toEqual('');
            expect(scope.indicatorClass(user.userProfile)).toEqual('');
            expect(scope.currentDashboard(_.find(hotCardedUserProfile.dashboards, {profileId: '43658'}))).toBe('');
        });


        it('should return error message if no suitable status can be determined', function () {
            var dashboard = new Dashboard({statusCode: 'non-specific error'});
            expect(dashboard.cardStatus()).toBe('There was a problem retrieving this dashboard');
        });

        it('should return active for an active card', function () {
            var dashboard = new Dashboard({});
            dashboard.card = 'Some Card';
            expect(scope.cardStatus(dashboard)).toBe('Active');
        });

        using(['2003', '2004', '7509', '7510', '7513'], function (value) {
            it('should return Blocked when the card error code is ' + value, function () {
                var dashboard = new Dashboard({});
                dashboard.cardError = {code: value};
                expect(scope.cardStatus(dashboard)).toEqual('Blocked');
            });
        });

        using(['7506', '7516', '7501'], function (value) {
            it('should return Activate OTP when the card error code is ' + value, function () {
                var dashboard = new Dashboard({});
                dashboard.cardError = {code: value};
                expect(scope.cardStatus(dashboard)).toBe('Activate OTP');
            });
        });

        it('should return Activate internet banking when the card error code is 7515', function () {
            var dashboard = new Dashboard({});
            dashboard.cardError = {code: '7515'};
            expect(scope.cardStatus(dashboard)).toBe('Activate internet banking');
        });

        it('should return error message if there is no card, status or card error', function () {
            var dashboard = new Dashboard({});
            expect(scope.cardStatus(dashboard)).toBe('There was a problem retrieving this dashboard');
        });
    });

    describe('card status class', function () {
        var scope;
        var dashboard;
        var requiresActivateOTPCodes = ['7506', '7516', '7501'];
        var requiresAmendAccessDirectCodes = ['7515'];
        var canBeActivatedCodes = _.flatten([requiresActivateOTPCodes, requiresAmendAccessDirectCodes]);
        var blockedCodes = ['2003', '2004', '7509', '7510', '7513'];

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            $controller('CardDashboardsController', {$scope: scope});
            dashboard = new Dashboard({});

        }));

        using(blockedCodes, function (code) {

            it('should return an error class for a blocked card', function () {
                dashboard.cardError = {code: code};
                expect(scope.cardStatusClass(dashboard)).toBe('text-notification error');
            });

        });


        it('should return a success class for an active card', function () {
            dashboard.card = 'Some Card';
            expect(scope.cardStatusClass(dashboard)).toBe('text-notification success');
        });

        using(canBeActivatedCodes, function (code) {
            it('should return a activate class for a card that requires Activation', function () {
                dashboard.cardError = {code: code};
                expect(scope.cardStatusClass(dashboard)).toBe('text-notification info');

            });
        });

        it('should return an error class for a blocked card', function () {
            expect(scope.cardStatusClass(dashboard)).toBe(undefined);
        });

    });
    describe('Active cards', function () {
        var cardStatus, maskedCardNumber, masked18DigitCardNumber;
        var userProfile = {
            currentDashboard: {
                "dashboardName": "My Personal Dashboard",
                "profileId": "43657",
                "systemPrincipalId": "956",
                "card": "4451221116405778",
                "cardNumber": "4451221116405778",
                "maskedCardNumber": "4451221116405778"

            },
            dashboards: [
                {
                    "dashboardName": "My Personal Dashboard",
                    "profileId": "43657",
                    "systemPrincipalId": "956",
                    "card": "4451221116405778",
                    "cardNumber": "4451221116405778",
                    "maskedCardNumber": "4451221116405778"
                },
                {
                    "dashboardName": "My Personal Dashboard with 18 digit card",
                    "profileId": "43658",
                    "systemPrincipalId": "956",
                    "card": "445122111",
                    "cardNumber": "445122111",
                    "maskedCardNumber": "******445122111***"
                },
                {
                    "dashboardName": "Additional Linked Card",
                    "profileId": "24658",
                    "systemPrincipalId": "956",
                    "card": "24140301252015",
                    "cardNumber": "24140301252015",
                    "maskedCardNumber": "******241403012***"
                }
            ]
        };

        beforeEach(inject(function ($controller, $rootScope, $route, ApplicationParameters) {
            route = $route;
            scope = $rootScope.$new();
            user = jasmine.createSpyObj('User', ['userProfile']);
            user.userProfile = userProfile;
            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['getVariable', 'popVariable']);
            applicationParameters.getVariable.and.returnValue('24140301252015');
            applicationParameters.popVariable.and.returnValue();
            $controller('CardDashboardsController', {
                $scope: scope,
                User: user,
                ApplicationParameters: applicationParameters
            });
            scope.$digest();
            cardStatus = scope.cardStatus(_.find(userProfile.dashboards, {profileId: '43657'}));
            maskedCardNumber = _.find(userProfile.dashboards, {profileId: '43657'}).maskedCardNumber;
            masked18DigitCardNumber = _.find(userProfile.dashboards, {profileId: '43658'}).maskedCardNumber;
        }));

        it('should return Active status for profiles that have cards', function () {
            expect(cardStatus).toEqual('Active');
        });

        it('should indicate which dashboard the user is currently logged in with', function () {
            expect(scope.dashboardIndicator(userProfile.currentDashboard)).toEqual(' ');
            expect(scope.indicatorClass(userProfile.currentDashboard)).toEqual('text-notification check');
        });

        it('should return card numbers for profiles that have cards', function () {
            expect(maskedCardNumber).toBe('4451221116405778');
        });

        it('should return a masked card number if the server has returned a 9 digit card number, meaning that its actually an 18 digit card number but the server has truncated it', function () {
            expect(masked18DigitCardNumber).toBe('******445122111***');
        });

        it('should return the current active dashboard', function () {
            expect(scope.currentDashboard(userProfile.currentDashboard)).toBe('row-highlight');
        });

        it('should set the additionalLinkedCardNumber scope variable from the application parameter', function () {
            expect(scope.additionalLinkedCardNumber).toEqual('24140301252015');
            expect(applicationParameters.getVariable).toHaveBeenCalledWith('additionalLinkedCardNumber');
            expect(applicationParameters.popVariable).toHaveBeenCalledWith('additionalLinkedCardNumber');
        });

        it('should sort dashboard list when an additional card is linked', function () {
            expect(scope.userDashboards[0]).toEqual(userProfile.dashboards[0]);
            expect(scope.userDashboards[1]).toEqual(userProfile.dashboards[2]);
            expect(scope.userDashboards[2]).toEqual(userProfile.dashboards[1]);
        });

        it('should set highlight class only on the additional linked card row', function () {
            expect(scope.isAdditionalCardLinked(userProfile.dashboards[2])).toEqual('highlight');
            expect(scope.isAdditionalCardLinked(userProfile.dashboards[0])).toEqual('');
        });
    });

    describe('Switch Dashboard', function () {
        var switchDashboardService, scope;

        beforeEach(inject(function ($controller, SwitchDashboardService) {
            switchDashboardService = SwitchDashboardService;
            spyOn(SwitchDashboardService, 'switchToDashboard');
            scope = {};
            $controller('CardDashboardsController', {$scope: scope, SwitchDashboardService: SwitchDashboardService});

        }));

        it('should call switch dashboard', function () {
            var dashboard = {someProperty: 'Some dummy data', isBlocked: function()
            {
                return false;
            }
        };
        scope.switchDashboard(dashboard);

        expect(switchDashboardService.switchToDashboard).toHaveBeenCalledWith(dashboard);
    });

    it('should not call switch dashboard when the dashboard is blocked', function () {
        var dashboard = {
            isBlocked: function () {
                return true;
            }
        };
        scope.switchDashboard(dashboard);
        expect(switchDashboardService.switchToDashboard).not.toHaveBeenCalledWith(dashboard);
    });
});
    describe('Delete Dashboard',function(){
        var ProfileService;
        var dashboard =  {profileId: 'Some Profile Id To Delete', cardNumber: '1234567890123456'};
        var errorCardDashboard =  {profileId: 'Some Profile Id To Delete', cardNumber: '1234567890123456', cardError: { code: '1234' }};
        var mock;
        var User;
        var spyDeleteDashboard;
        var $q;

        beforeEach(inject(function($controller, $rootScope, _ProfileService_, _mock_, _User_,_$q_){
                scope = $rootScope.$new();
                mock = _mock_;
                ProfileService = _ProfileService_;
                User = _User_;
                $q = _$q_;

                $controller('CardDashboardsController',{
                    $scope:scope,
                    ProfileService:ProfileService
                });

                spyDeleteDashboard = spyOn(ProfileService, 'deleteDashboard').and.returnValue(mock.resolve({}));
            }
        ));

        it('should not have a deleted dashboard name to start with', function () {
            expect(scope.lastDeletedDashboardName).not.toBeDefined();
        });

        it('should have a confirmationMessage function on the scope',function(){
            expect(scope.confirmationMessage).toBeDefined();
        });

        it('confirmationMessage function should return \'Delete dashboard? You will no longer be able to use this card for online transactions\'',function(){
            var dashboard = {
                dashboardName: 'My Personal Dashboard'
            };

            expect(scope.confirmationMessage(dashboard)).toEqual('Delete dashboard? You will no longer be able to use this card for online transactions');
        });

        it('should call the service to delete the dashboard with the profileId and card number',function(){
            scope.deleteDashboard(dashboard);

            expect(ProfileService.deleteDashboard).toHaveBeenCalledWith(dashboard.profileId, dashboard.cardNumber, undefined);
        });

        it('should call the service to delete the dashboard with the profileId and card number',function(){
            scope.deleteDashboard(errorCardDashboard);

            expect(ProfileService.deleteDashboard).toHaveBeenCalledWith(errorCardDashboard.profileId, errorCardDashboard.cardNumber, errorCardDashboard.cardError.code);
        });

        it('should have a track message on the scope', function () {
            expect(scope.trackMessage()).toEqual('De-Link Additional Cards from Standard Bank ID.confirm');
        });

        it('should remove the dashboard from the user.profile and the scope, show a success message when the dashboard has been successfully deleted',function(){
            var dashboardToDelete =  {
                profileId: 'Dashboard to delete profile id',
                card: 'some card',
                dashboardName: 'Dashboard to delete',
                isBlocked: function()
                {
                    return false;
                }
            };

            var dashboardToKeep = {
                profileId:'Dashboard to keep profile id',
                card: 'some card 2',
                isBlocked: function()
                {
                    return false;
                }
            };

            User.userProfile = {
                dashboards:[dashboardToDelete,dashboardToKeep],
                currentDashboard: {
                    card: 'some card'
                }
            };

            expect(scope.isSuccessful).toBeFalsy();
            scope.deleteDashboard(dashboardToDelete);
            scope.$digest();
            expect(scope.userDashboards).toEqual(User.userProfile.dashboards);
            expect(scope.userDashboards).toEqual([dashboardToKeep]);
            expect(scope.isSuccessful).toBeTruthy();
            expect(scope.lastDeletedDashboardName).toBe(dashboardToDelete.dashboardName);
        });

        it('a non active dashboard should be deletable',function(){
            expect(scope.deletable({cardError:'Non Active'})).toBeTruthy();
        });

        it('an active dashboard should be deletable when there is more than one active dashboard ',function(){
            scope.userDashboards =  [
                {
                    card:'Some Deletable Active Card'
                },
                {
                    card:'Another Deletable Active Card'
                }
            ];

            expect(scope.deletable(scope.userDashboards[0])).toBeTruthy();
            expect(scope.deletable(scope.userDashboards[1])).toBeTruthy();
        });

        it('should return true when dashboards have more than one cards with Active status', function () {
            scope.userDashboards = [

                {
                    card:'Active Dashboard'
                },
                {
                    cardError:'Non active card'
                }];
            expect(scope.deletable(scope.userDashboards[0])).toBeFalsy();
            expect(scope.deletable(scope.userDashboards[1])).toBeTruthy();
        });

        it('should switch dashboard on deleting the current dashboard',function(){
            spyOn(scope, 'switchDashboard');
            var currentDashboard = {
                card:'Current Active Dashboard',
                profileId: 'some profileId',
                isBlocked: function()
                {
                    return false;
                }
            };
            var dashboardToBeSetToCurrent = {
                profileId: 'another profileId',
                card:'Second Active Dashboard',
                isBlocked: function()
                {
                    return false;
                }
            };
            var controlDashboard = {
                profileId: 'control another profileId',
                card:'Control Active Dashboard',
                isBlocked: function()
                {
                    return false;
                }
            };
            User.userProfile = {
                currentDashboard: currentDashboard,
                dashboards: [
                    currentDashboard,
                    dashboardToBeSetToCurrent,
                    controlDashboard
                ]
            };

            scope.deleteDashboard(currentDashboard);
            scope.$digest();
            expect(scope.switchDashboard).toHaveBeenCalledWith(dashboardToBeSetToCurrent);
        });

        it('should NOT switch dashboards on deleting a dashboard which is not the currently active dashboard',function(){
            spyOn(User, 'switchToDashboard');
            var currentDashboard = {card:'Some Current Dashboard'};
            User.userProfile.currentDashboard = currentDashboard;

            scope.deleteDashboard({card:'Some Non Current Dashboard'});

            scope.$digest();
            expect(User.switchToDashboard).not.toHaveBeenCalled();
        });

        it('should not remove the dashboard from the user.profile when the dashboard has not been successfully deleted',function(){
            spyDeleteDashboard.and.returnValue(mock.reject(''));
            spyOn(User,'deleteCachedDashboard');
            spyOn($q,'reject');
            scope.deleteDashboard(dashboard);
            scope.$digest();

            expect(User.deleteCachedDashboard).not.toHaveBeenCalled();
            expect($q.reject).toHaveBeenCalledWith('Could not delete this dashboard, try again later.');
        });
    });
})
;
