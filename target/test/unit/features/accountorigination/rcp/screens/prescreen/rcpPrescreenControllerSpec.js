describe('RCP Prescreen', function () {
    'use strict';
    beforeEach(module('refresh.accountOrigination.rcp.screens.preScreen', 'refresh.dtmanalytics'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when rcp Prescreen', function () {
            it('should use the correct template', function () {
                expect(route.routes['/apply/rcp/pre-screen'].templateUrl).toEqual('features/accountorigination/rcp/screens/prescreen/partials/rcpPreScreen.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/rcp/pre-screen'].controller).toEqual('RcpPreScreenController');
            });

            it('should specify the safe return path', function () {
                expect(route.routes['/apply/rcp/pre-screen'].safeReturn).toEqual('/apply');
            });

            describe('path conditions', function () {
                var application;

                beforeEach(function () {
                    application = jasmine.createSpyObj('RcpApplication', ['isInProgress', 'isNew']);
                });

                it('should allow new application', function () {
                    application.isNew.and.returnValue(true);

                    _.forEach(route.routes['/apply/rcp/pre-screen'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeTruthy();
                    });
                });

                it('should not allow application that is not new', function () {
                    application.isNew.and.returnValue(false);

                    _.forEach(route.routes['/apply/rcp/pre-screen'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeFalsy();
                    });
                });
            });
        });
    });

    describe('RcpPrescreenController', function () {
        var scope, location, RcpApplication, mock, controller, CustomerInformationLoader, User, DtmAnalyticsService;

        beforeEach(inject(function ($rootScope, $location, _RcpApplication_, $controller,
                                    _Flow_, _mock_, _CustomerInformationLoader_, _User_) {
            scope = $rootScope.$new();
            RcpApplication = _RcpApplication_;
            CustomerInformationLoader = _CustomerInformationLoader_;
            User = _User_;
            mock = _mock_;
            controller = $controller;
            location = $location;
            DtmAnalyticsService = jasmine.createSpyObj('DtmAnalyticsService', ['recordFormSubmissionCompletion']);

        }));

        function invokeController() {

            controller('RcpPreScreenController',
                {
                    $scope: scope,
                    DtmAnalyticsService: DtmAnalyticsService
                }
            );

            scope.$digest();
        }

        it('should set default prescreen questions to no', function () {
            invokeController();
            expect(scope.preScreen.debtReview).toBeFalsy();
            expect(scope.preScreen.insolvent).toBeFalsy();
            expect(scope.preScreen.sequestration).toBeFalsy();

        });

        describe('Next', function () {

            it('should set showModal to true when debtReview prescreening question is yes', function () {
                invokeController();
                scope.preScreen.debtReview = true;
                scope.next();
                scope.$digest();
                expect(scope.showCannotProceedModal).toBeTruthy();
            });

            it('should set showModal to true when insolvent prescreening question is yes', function () {
                invokeController();
                scope.preScreen.insolvent = true;
                scope.next();
                scope.$digest();
                expect(scope.showCannotProceedModal).toBeTruthy();
            });

            it('should set showModal to true when sequestration prescreening question is yes', function () {
                invokeController();
                scope.preScreen.sequestration = true;
                scope.next();
                scope.$digest();
                expect(scope.showCannotProceedModal).toBeTruthy();
            });

            it('should record a form submission for analytics', function () {
                invokeController();
                scope.next();

                expect(DtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
            });


            describe('new capture customer information feature toggled on', function () {
                beforeEach(function () {
                    newCaptureCustomerInformationFeature = true;
                });
                describe('New Customers', function () {
                    it('should go to capture customer basic information', function () {

                        invokeController();
                        spyOn(User, 'hasBasicCustomerInformation').and.returnValue(false);
                        scope.next();
                        scope.$digest();
                        expect(location.path()).toEqual('/apply/rcp/profile');
                    });
                });
            });
            describe('new capture customer information feature toggled off', function () {
                beforeEach(function () {
                    newCaptureCustomerInformationFeature = false;
                });
                describe('Existing Customers', function () {
                    beforeEach(function () {
                        invokeController();
                        spyOn(User, 'hasBasicCustomerInformation').and.returnValue(true);
                        spyOn(CustomerInformationLoader, 'load').and.returnValue(mock.resolve({}));
                        scope.next();
                        scope.$digest();
                    });


                    it('should initialise CustomerInformationData', function () {
                        expect(CustomerInformationLoader.load).toHaveBeenCalled();
                    });

                    it('should display customer information', function () {
                        expect(location.path()).toEqual('/apply/rcp/profile');
                    });

                    it('should save prescreen complete', function () {
                        expect(RcpApplication.isPreScreeningComplete()).toBeTruthy();
                    });

                });

                it('should go to capture customer basic information when customer is new', function () {
                    invokeController();
                    spyOn(User, 'hasBasicCustomerInformation').and.returnValue(false);
                    scope.next();
                    scope.$digest();
                    expect(location.path()).toEqual('/apply/rcp/profile/new');
                });
            });

        });
    });


})
;
