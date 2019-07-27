describe('add dashboard name', function () {
    'use strict';

    var homeService;

    beforeEach(module('refresh.addDashboardName.controller', 'refresh.test', 'refresh.flow', 'refresh.security.user', 'refresh.common.homeService'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when about to add dashboard name', function () {
            it('should use the AddDashboardSaveNameController and addDashboardSaveName.html', function () {
                expect(route.routes['/addDashboard/saveName'].controller).toEqual('AddDashboardSaveNameController');
                expect(route.routes['/addDashboard/saveName'].templateUrl).toEqual('features/security/partials/addDashboardSaveName.html');
            });
        });
    });

    describe('controller', function () {

        var scope, flow, viewModel, location, controller, mock, updateDashboardService, homeService, user, applicationParameters;

        var expectedViewModel = {
            "channelProfile": {
                "channelProfile": {
                    "image": "",
                    "imageDate": null,
                    "profileId": "44532",
                    "profileName": "My Personal Dashboard",
                    "profileStyle": "PERSONAL",
                    "systemPrincipalIdentifiers": [
                        {
                            "systemPrincipalId": "246",

                            "systemPrincipalKey": "SBSA_BANKING"
                        }
                    ],
                    "tileViews": [],
                    "card": "123456"
                }
            },
            "cardNumber": "12345678"
        };

        beforeEach(inject(function ($controller, $rootScope, _mock_, Flow, $location, User, HomeService) {
            scope = $rootScope.$new();
            mock = _mock_;
            flow = Flow;
            controller = $controller;
            location = $location;
            viewModel = jasmine.createSpyObj('ViewModel', ['initial', 'current']);
            updateDashboardService = jasmine.createSpyObj('UpdateDashboardService', ['updateDashboardName']);
            user = User;
            applicationParameters = jasmine.createSpyObj('ApplicationParameters', ['getVariable', 'pushVariable']);
            homeService = HomeService;
            spyOn(homeService, ['goHome']);

            user.userProfile.dashboards = [{
                isHotCarded: function () {
                    return false;
                }
            }];
        }));

        var initializeController = function () {
            viewModel.current.and.returnValue(expectedViewModel);

            controller('AddDashboardSaveNameController', {
                $scope: scope,
                Flow: flow,
                ViewModel: viewModel,
                UpdateDashboardService: updateDashboardService,
                User: user,
                ApplicationParameters: applicationParameters
            });
        };

        it('should set viewModel to scope.channelProfile', function () {
            initializeController();
            expect(viewModel.current).toHaveBeenCalled();
            expect(scope.channelProfile).toBe(expectedViewModel.channelProfile);
        });

        it('should set dashboard name', function () {
            expectedViewModel.channelProfile.profileName = 'new dashboard name';
            updateDashboardService.updateDashboardName.and.returnValue(mock.resolve({
                success: true,
                data: expectedViewModel.channelProfile
            }));
            spyOn(user, 'addDashboard');
            applicationParameters.getVariable.and.returnValue('123456709844');

            initializeController();
            scope.dashboardName = 'new dashboard name';
            scope.saveDashboardName();
            scope.$digest();

            expect(updateDashboardService.updateDashboardName).toHaveBeenCalledWith(expectedViewModel.channelProfile);
            expect(scope.channelProfile.channelProfile.card).toBe('12345678');
            expect(user.addDashboard).toHaveBeenCalledWith(expectedViewModel.channelProfile.channelProfile);
            expect(location.path()).toContain('/dashboards');
            expect(applicationParameters.pushVariable).toHaveBeenCalledWith('additionalLinkedCardNumber',
                expectedViewModel.channelProfile.channelProfile.cardNumber);
        });

        it('should set errorMessage', function () {
            expectedViewModel.channelProfile.profileName = 'new dashboard name';
            updateDashboardService.updateDashboardName.and.returnValue(mock.resolve({
                success: false,
                message: 'Oops error occurred.'
            }));
            initializeController();
            scope.dashboardName = 'new dashboard name';
            scope.saveDashboardName();
            scope.$digest();

            expect(updateDashboardService.updateDashboardName).toHaveBeenCalledWith(expectedViewModel.channelProfile);
            expect(scope.errorMessage).toEqual('Oops error occurred.');
        });

        describe('when dashboards have been hotcarded', function () {

            it('should switch to the new dashboard and redirect to account-summary', function () {
                updateDashboardService.updateDashboardName.and.returnValue(mock.resolve({
                    success: true,
                    data: expectedViewModel.channelProfile
                }));
                user.userProfile.dashboards = [{
                    isHotCarded: function () {
                        return true;
                    }
                }, {
                    isHotCarded: function () {
                        return true;
                    }
                }];
                spyOn(user, 'switchToDashboard').and.callThrough();
                spyOn(user, 'checkAllHotCardedCards').and.callThrough();
                spyOn(user, 'addDashboard').and.callThrough();
                initializeController();
                scope.dashboardName = 'new dashboard name';
                scope.saveDashboardName();
                scope.$digest();

                expect(user.checkAllHotCardedCards).toHaveBeenCalled();
                expect(user.addDashboard).toHaveBeenCalledWith(expectedViewModel.channelProfile.channelProfile);
                expect(scope.channelProfile.channelProfile.card).toBe('12345678');
                expect(user.switchToDashboard).toHaveBeenCalledWith(user.userProfile.dashboards[2]);
                expect(homeService.goHome).toHaveBeenCalled();
            });
        });
    });
});
