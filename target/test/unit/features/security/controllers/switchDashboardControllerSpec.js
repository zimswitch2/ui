describe('switchDashboardController', function () {
    'use strict';

    beforeEach(module('refresh.switch-dashboard', 'refresh.common.homeService'));
    var scope, user, switchDashboardService, homeService, location, controller;
    describe('switchDashboard', function () {
        function loadController() {
            controller('SwitchDashboardController', {
                $scope: scope,
                User: user,
                SwitchDashboardService: switchDashboardService
            });
        }

        beforeEach(inject(function ($rootScope, $controller, $location, HomeService) {
            scope = $rootScope.$new();

            location = $location;
            controller = $controller;

            user = {
                userProfile: {dashboards: []},
                defaultDashboard: null,
                hasBlockedCard: null,
                checkAllHotCardedCards: null
            };
            spyOn(user, 'defaultDashboard');
            spyOn(user, 'hasBlockedCard');
            spyOn(user, 'checkAllHotCardedCards');

            switchDashboardService = jasmine.createSpyObj('SwitchDashboardService', ['switchToDashboard']);
            homeService = HomeService;
            spyOn(homeService, ['goHome']);
        }));

        it('should have a list of dashboards to switch to', function () {
            loadController();
            expect(scope.dashboards).toEqual(user.userProfile.dashboards);
        });

        describe('when there is a current dashboard', function () {
            var popVariable;
            beforeEach(inject(function (ApplicationParameters) {
                user.userProfile.currentDashboard = {};
                popVariable = spyOn(ApplicationParameters, 'popVariable');
            }));

            it('should set the info on the scope from the application parameters', function () {
                popVariable.and.returnValue('info');
                loadController();

                expect(popVariable).toHaveBeenCalledWith('hasInfo');
                expect(scope.hasInfo).toEqual('info');
            });

            it('should set the newly linked card number to the scope with a message', function () {
                popVariable.and.returnValue('card number');
                loadController();

                expect(popVariable).toHaveBeenCalledWith('newlyLinkedCardNumber');
                expect(scope.newlyLinkedCardNumber).toEqual('card number');
                expect(scope.infoMessage).toEqual("Card successfully linked. Your card number is card number");
            });
        });

        describe('when there is no current dashboard', function () {
            it('should not set scope values', function () {
                loadController();

                expect(scope.hasInfo).toBeUndefined();
                expect(scope.newlyLinkedCardNumber).toBeUndefined();
                expect(scope.infoMessage).toBeUndefined();
            });
        });

        describe('when there are no dashboards', function () {
            it('should redirect to new-registered page', function () {
                loadController();
                expect(homeService.goHome).toHaveBeenCalled();
            });
        });

        describe('when there is one dashboard', function () {

            beforeEach(function () {
                user.userProfile.dashboards[0] = jasmine.createSpyObj('Dashboard', ['isHotCarded']);
            });

            it('should switch to the default dashboard', function () {
                user.defaultDashboard.and.returnValue(1);
                user.userProfile.dashboards[0].isHotCarded.and.returnValue(false);
                loadController();

                expect(switchDashboardService.switchToDashboard).toHaveBeenCalledWith(1);
            });

            it('should navigate to chose-dashboard when the dashboard is hot carded', function () {
                user.userProfile.dashboards[0].isHotCarded.and.returnValue(true);

                loadController();

                expect(location.path()).toEqual('/choose-dashboard');
            });

        });

        describe('show/hide link card on choose-dashboard', function () {
            it('should set showLinkCard to true', function () {
                user.checkAllHotCardedCards.and.returnValue(true);
                loadController();
                expect(scope.showLinkCard).toEqual(true);
            });

            it('should set showLinkCard to false', function () {
                user.checkAllHotCardedCards.and.returnValue(false);
                loadController();
                expect(scope.showLinkCard).toEqual(false);
            });
        });

        describe('when there are multiple dashboards', function () {
            beforeEach(function () {
                user.userProfile.dashboards = [{}, {}];
            });

            describe('when there is a blocked dashboard', function () {
                it('should redirect to choose dashboard', function () {
                    user.hasBlockedCard.and.returnValue(true);
                    loadController();

                    expect(location.path()).toEqual('/choose-dashboard');
                });
            });

            describe('when there are no blocked cards and no current dashboard', function () {
                it('should switch to the default dashboard', function () {
                    user.defaultDashboard.and.returnValue(1);
                    loadController();

                    expect(switchDashboardService.switchToDashboard).toHaveBeenCalledWith(1);
                });
            });

            describe('when there are no blocked cards and there is a current dashboard', function () {
                it('should not switch to the default dashboard', function () {
                    user.userProfile.currentDashboard = {};
                    loadController();

                    expect(switchDashboardService.switchToDashboard).not.toHaveBeenCalled();
                });
            });
        });

        describe('switchToDashboard', function () {
            var dashboard;
            beforeEach(function () {
                user.userProfile.dashboards = [{}, {}];
                user.userProfile.currentDashboard = {};
                dashboard = jasmine.createSpyObj('Dashboard', ['isBlocked']);
                loadController();
            });

            it('should switch to a non blocked dashboard', function () {
                dashboard.isBlocked.and.returnValue(false);

                scope.switchToDashboard(dashboard);
                expect(switchDashboardService.switchToDashboard).toHaveBeenCalledWith(dashboard);
            });

            it('should not switch to a blocked dashboard', function () {
                dashboard.isBlocked.and.returnValue(true);

                scope.switchToDashboard(dashboard);
                expect(switchDashboardService.switchToDashboard).not.toHaveBeenCalled();
            });
        });
    });
});
