describe('header controller', function () {
    'use strict';

    beforeEach(module('refresh.header'));

    var scope, profile, location, digitalId, card, user, invitedUser, applicationParameters;
    var userProfile = {
        currentDashboard: {
            "dashboardName": "My Personal Dashboard",
            "profileId": "43657",
            "systemPrincipalId": "956",
            "card": '4451221116405778'
        },
        dashboards: [
            {
                "dashboardName": "My Personal Dashboard",
                "profileId": "43657",
                "systemPrincipalId": "956",
                "cardError": {}
            },
            {
                "dashboardName": "My Personal Dashboard",
                "profileId": "4365",
                "systemPrincipalId": "956",
                "cardError": {}
            }
        ]
    };

    beforeEach(inject(function ($rootScope, $controller, $location, User, ApplicationParameters) {
        scope = $rootScope.$new();
        location = $location;
        profile = jasmine.createSpyObj('Profile', ['isAuthenticated', 'current', 'hasCardNumber']);
        card = jasmine.createSpyObj('Card', ['anySelected']);
        digitalId = jasmine.createSpyObj('DigitalId', ['current', 'isAuthenticated']);
        user = User;
        invitedUser = jasmine.createSpyObj('InvitationMenuService', ['displayMenu', 'setShowMenu','resetShowMenu']);
        applicationParameters = ApplicationParameters;

        $controller('HeaderController', {
            $scope: scope,
            Profile: profile,
            $location: location,
            DigitalId: digitalId,
            Card: card,
            InvitationMenuService: invitedUser,
            ApplicationParameters: applicationParameters
        });
    }));

    it('preferredName function should return the name from the digital id if authenticated', function () {
        digitalId.isAuthenticated.and.returnValue(true);
        digitalId.current.and.returnValue({
            preferredName: 'somename'
        });

        expect(scope.preferredName()).toBe('somename');
    });

    it('preferredName function should return an empty string if not authenticated', function () {
        digitalId.isAuthenticated.and.returnValue(false);

        expect(scope.preferredName()).toBe('');
    });

    it('shouldDisplayProfileDropdown should return true if authenticated', function () {
        digitalId.isAuthenticated.and.returnValue(true);
        spyOn(applicationParameters, 'getVariable');
        applicationParameters.getVariable.and.returnValue(undefined);

        applicationParameters.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
        scope.shouldDisplayProfileDropdown();


        expect(invitedUser.resetShowMenu).toHaveBeenCalled();
    });
    it('shouldDisplayProfileDropdown should return true if authenticated', function () {
        digitalId.isAuthenticated.and.returnValue(false);
        scope.shouldDisplayProfileDropdown();


        expect(invitedUser.setShowMenu).toHaveBeenCalled();
    });

    it('shouldDisplayProfileDropdown should return false if authenticated and acceptInvitationRedirect variable exists', function () {
        digitalId.isAuthenticated.and.returnValue(true);

        expect(scope.shouldDisplayProfileDropdown()).toBeFalsy();
    });

    it('should set hasCard to false if there is no card', function () {
        card.anySelected.and.returnValue(false);

        expect(scope.hasCard()).toBeFalsy();
    });

    it('should set hasCard to false if there is no card', function () {
        card.anySelected.and.returnValue(true);

        expect(scope.hasCard()).toBeTruthy();
    });
    describe('detect supported platform', function () {
        it('should detect a mac user', function () {
            scope.platform = "Mac";
            expect(scope.supportedPlatform()).toBeTruthy();
        });

        it('should detect a windows user', function () {
            scope.platform = "Win32";
            expect(scope.supportedPlatform()).toBeTruthy();
        });

        it('should detect a non-windows/non-mac user', function () {
            scope.platform = "Linux";
            expect(scope.supportedPlatform()).toBeFalsy();
        });
    });

    describe('dashboards', function () {
        it('should return the dashboard name when you have a card selected', function () {
            card.anySelected.and.returnValue(true);
            user.userProfile = userProfile;
            expect(scope.dashboardName()).toBe(userProfile.currentDashboard.dashboardName);
        });

        it('should not return the dashboard name when there is no card selected', function () {
            var profile = {
                dashboards: [
                    {
                        "dashboardName": "My Personal Dashboard",
                        "profileId": "43657",
                        "systemPrincipalId": "956",
                        "card": "4451221116405778"
                    }
                ]
            };
            card.anySelected.and.returnValue(true);
            user.userProfile = profile;
            expect(scope.dashboardName()).toBe(' ');

        });

        it('should not return undefined when there is no card selected', function () {
            var profile = {
                dashboards: [
                    {
                        "dashboardName": "My Personal Dashboard",
                        "profileId": "43657",
                        "systemPrincipalId": "956",
                        "card": "4451221116405778"
                    }
                ]
            };
            card.anySelected.and.returnValue(false);
            user.userProfile = profile;
            expect(scope.dashboardName()).toBe(undefined);

        });

        it('should have multiple dashboards when there is a card selected', function () {
            card.anySelected.and.returnValue(true);
            user.userProfile = userProfile;
            expect(scope.hasMultipleDashboards()).toBeTruthy();
        });

        it('should not have multiple dashboards when there is no card selected', function () {
            card.anySelected.and.returnValue(false);
            user.userProfile = userProfile;
            expect(scope.hasMultipleDashboards()).toBeFalsy();
        });

        it('should not have multiple dashboards when there is only one dashboard', function () {
            var profile = {
                dashboards: [
                    {
                        "dashboardName": "My Personal Dashboard",
                        "profileId": "43657",
                        "systemPrincipalId": "956",
                        "card": "4451221116405778"
                    }
                ]
            };
            card.anySelected.and.returnValue(true);
            user.userProfile = profile;
            expect(scope.hasMultipleDashboards()).toBeFalsy();
        });

        it('should check if current dashboard is an SED dashboard', function () {
            var userSEDProfile = {
                currentDashboard: {
                    "dashboardName": "My Personal Dashboard",
                    "profileId": "43657",
                    "systemPrincipalId": "123",
                    "card": '4451221116405778',
                    "systemPrincipalKey": 'SED'
                },
                dashboards: [
                    {
                        "dashboardName": "My Personal Dashboard",
                        "profileId": "43657",
                        "systemPrincipalId": "123",
                        "cardError": {}
                    },
                    {
                        "dashboardName": "My Personal Dashboard",
                        "profileId": "4365",
                        "systemPrincipalId": "123",
                        "cardError": {}
                    }
                ]
            };
            card.anySelected.and.returnValue(true);
            user.userProfile = userSEDProfile;
            user.principal().systemPrincipalIdentifier.systemPrincipalKey = 'SED';
            user.isCurrentDashboardSEDPrincipal();
            scope.$digest();

            expect(scope.isBusinessUser()).toEqual(true);
        });
    });

    describe('toggleMenu', function () {
        it('should show the menu by default', function () {
            invitedUser.displayMenu.and.returnValue(true);

            expect(scope.displayMenu()).toBeTruthy();

        });

        it('should not  show the menu when business user trigger the invitation process', function () {
            invitedUser.displayMenu.and.returnValue(false);

            expect(scope.displayMenu()).toBeFalsy();
        });
    });

    describe("change password drop down", function () {

        it(' should show the dropdown when not accepting an invitation', function () {
            digitalId.isAuthenticated.and.returnValue(true);
            applicationParameters.getVariable('');

            expect(scope.shouldShowDropDown()).toBeTruthy();
        });

        it(' should return false if not authenticated and acceptInvitationRedirect variable exists', function () {
            applicationParameters.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
            applicationParameters.getVariable('/account-sharing/accept-decline-invitation');
            digitalId.isAuthenticated.and.returnValue(false);

            expect(scope.shouldShowDropDown()).toBeFalsy();
        });
    });
});