describe('Main Menu', function () {
    'use strict';

    var menu;

    beforeEach(module('refresh.navigation'));

    beforeEach(inject(function (Menu) {
        menu = Menu;
    }));

    describe("menu", function () {
        it('should add a menu item', function () {
            menu.add({title: 'Home', url: '/'});
            expect(menu.items()).toEqual([
                {title: 'Home', url: '/'}
            ]);
        });

        it('should remove a menu item when found by title', function () {
            menu.add({title: 'Home', url: '/'});
            menu.remove('Home');
            expect(menu.items()).toEqual([]);
        });
        it('should not remove a menu item when not found by title', function () {
            menu.add({title: 'Home', url: '/'});
            menu.remove('Dontremove');
            expect(menu.items()).toEqual([
                {title: 'Home', url: '/'}
            ]);
        });

    });

    describe("MenuController", function () {
        var mockMenu,
            scope,
            location,
            controller,
            profile,
            authenticationService,
            windowSpy,
            card,
            digitalId,
            flow,
            user,
            invitationMenuService,
            applicationParameters;
            invitationMenuService = jasmine.createSpyObj('InvitationMenuService', ['displayMenu','setShowMenu', 'resetShowMenu']);
        function initController() {
            controller('MenuController', {
                    $scope: scope,
                    Menu: mockMenu,
                    $window: windowSpy,
                    Profile: profile,
                    AuthenticationService: authenticationService,
                    Card: card,
                    DigitalId: digitalId,
                    Flow: flow,
                    InvitationMenuService: invitationMenuService,
                    ApplicationParameters:applicationParameters
                }
            );
        }

        beforeEach(inject(function ($rootScope, $controller, $location, User , ApplicationParameters) {
            scope = $rootScope.$new();
            location = $location;
            controller = $controller;
            profile = jasmine.createSpyObj('Profile', ['isAuthenticated', 'current', 'hasCardNumber']);
            card = jasmine.createSpyObj('Card', ['anySelected']);
            digitalId = jasmine.createSpyObj('DigitalId', ['isAuthenticated']);
            authenticationService = jasmine.createSpyObj('AuthenticationService', ['logout']);
            windowSpy = jasmine.createSpyObj('Window', ['open']);
            flow = jasmine.createSpyObj('Flow', ['getHeaderName']);
            user = User;
            applicationParameters = ApplicationParameters;


            mockMenu = jasmine.createSpyObj('menu', ['items']);
            mockMenu.items.and.returnValue([
                {title: 'Home', url: '/'}
            ]);

            initController();
        }));

        it('should hold primary menu items', function () {
            expect(scope.menuItems).toEqual([
                {title: 'Home', url: '/'}
            ]);
        });

        it('should mark the menu item with the current location as url as active', function () {
            location.path('/');
            expect(location.path()).toEqual('/');
            expect(scope.activeClass(scope.menuItems[0])).toEqual('active');
        });

        it('should check the showIf function to see whether the menu item is active', function () {
            location.path('/beneficiaries/list');
            mockMenu.items.and.returnValue([
                {
                    title: 'Home', url: '/', showIf: function () {
                    return true;
                }
                }
            ]);

            controller('MenuController', {
                    $scope: scope,
                    Menu: mockMenu
                }
            );
            expect(scope.activeClass(scope.menuItems[0])).toEqual('active');
        });

        it('should return no class when the menu item is not active', function () {
            mockMenu.items.and.returnValue([
                {title: 'Home', url: '/home'}
            ]);
            location.path('/home');
            expect(location.path()).toEqual('/home');
            expect(scope.activeClass(scope.menuItems[0])).toEqual('');
        });

        it('displayLinkToFullSiteModal should set displayModal to true', function () {
            scope.displayLinkToFullSiteModal();
            expect(scope.displayModal).toBeTruthy();
        });

        it('cancel should set displayModal to false', function () {
            scope.displayModal = true;
            scope.cancel();
            expect(scope.displayModal).toBeFalsy();
        });

        it('confirm should call logout', function () {
            scope.confirm();
            expect(authenticationService.logout).toHaveBeenCalled();
        });

        it('confirm should open https://www.encrypt.standardbank.co.za/ using $window', function () {
            scope.confirm();
            expect(windowSpy.open).toHaveBeenCalledWith('https://www.encrypt.standardbank.co.za/');
        });

        it('shouldDisplayMenu should return true if authenticated', function () {
            digitalId.isAuthenticated.and.returnValue(true);

            expect(scope.shouldDisplayMenu()).toBeTruthy();
        });



        it('shouldDisplayProfileDropdown should return true if authenticated', function () {
            digitalId.isAuthenticated.and.returnValue(true);
            applicationParameters.getVariable('');

            expect(scope.shouldDisplayMenu()).toBeTruthy();
        });

        it('shouldDisplayProfileDropdown should return false if authenticated and acceptInvitationRedirect variable exists', function () {
            applicationParameters.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
            applicationParameters.getVariable('/account-sharing/accept-decline-invitation');
            digitalId.isAuthenticated.and.returnValue(true);

            expect(scope.shouldDisplayMenu()).toBeFalsy();
        });

        it('should set hasCard to false if there is no card', function () {
            card.anySelected.and.returnValue(false);

            expect(scope.hasCard()).toBeFalsy();
        });

        it('shouldDisplayProfileDropdown should return true if authenticated', function () {
            digitalId.isAuthenticated.and.returnValue(true);
            spyOn(applicationParameters, 'getVariable');
            applicationParameters.getVariable.and.returnValue(undefined);

            applicationParameters.pushVariable('acceptInvitationRedirect', '/account-sharing/accept-decline-invitation');
            scope.shouldDisplayProfileDropdown();


            expect(invitationMenuService.resetShowMenu).toHaveBeenCalled();
        });
        it('shouldDisplayProfileDropdown should return true if authenticated', function () {
            digitalId.isAuthenticated.and.returnValue(false);
            scope.shouldDisplayProfileDropdown();


            expect(invitationMenuService.setShowMenu).toHaveBeenCalled();
        });

        it('shouldDisplayProfileDropdown should return false if authenticated and acceptInvitationRedirect variable exists', function () {
            digitalId.isAuthenticated.and.returnValue(true);

            expect(scope.shouldDisplayProfileDropdown()).toBeFalsy();
        });

        it('should set hasCard to false if there is no card', function () {
            card.anySelected.and.returnValue(true);

            expect(scope.hasCard()).toBeTruthy();
        });


        it('set displayMenu to true or false', function () {
            expect(scope.showMenu).toBeFalsy();
            scope.toggleBurgerMenu();
            expect(scope.showMenu).toBeTruthy();
            scope.toggleBurgerMenu();
            expect(scope.showMenu).toBeFalsy();
        });

        it('should hide the burger menu on the $locationChangeStart event', function () {
            scope.showMenu = true;
            scope.$broadcast('$locationChangeStart');
            expect(scope.showMenu).toBeFalsy();
        });

        describe('has multiple dashboards', function () {
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

            describe('Secure Message', function () {
                using([
                        '/secure-message',
                        '/secure-message/detail',
                        '/secure-message/confirm',
                        '/secure-message/results'
                    ], function (path) {
                        it('should make secure message item active if url is ' + path, function () {
                            location.path(path);
                            initController();
                            expect(scope.activeSecureMessageItem()).toBe('active');
                        });
                    }
                );

                it('should make secure message item inactive if the path is not belong to its flow', function () {
                    location.path('/notSecureMessage');
                    initController();
                    expect(scope.activeSecureMessageItem()).toBe('');
                });

                it('should make secure message item active if in its flow and on OPT verify page', function () {
                    flow.getHeaderName.and.returnValue('Secure Message');
                    location.path('/otp/verify');
                    expect(scope.activeSecureMessageItem()).toBe('active');
                });

            });
        });
        describe("for SED profiles", function () {
            it('should show account sharing option', function () {
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
    });

    describe('Menu Directive', function () {
        var element;
        beforeEach(inject(function (_TemplateTest_) {
            element = _TemplateTest_.compileTemplate('<div main-menu></div>', false);
        }));

        it('should create a menu', function () {
            expect(element.find(".main-nav-container")).toBeDefined();
        });
    });
});
