describe('Account Origination - Pre Screening', function () {
    'use strict';

    beforeEach(module('refresh.accountOrigination.currentAccount.screens.preScreening',
        'refresh.test',
        'refresh.dtmanalytics'));

    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('pre screening route', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account/pre-screen'].controller).toEqual('CurrentAccountPrescreeningController');
            });

            it('should use the correct template', function () {
                expect(route.routes['/apply/current-account/pre-screen'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/prescreening/partials/prescreening.html');
            });

            it('should specify the safe return path', function () {
                expect(route.routes['/apply/current-account/pre-screen'].safeReturn).toEqual('/apply');
            });

            describe('path conditions', function () {
                var application;

                beforeEach(function () {
                    application = jasmine.createSpyObj('CurrentAccountApplication', ['isPending', 'isNew']);
                });

                it('should allow pending application', function () {
                    application.isPending.and.returnValue(true);

                    _.forEach(route.routes['/apply/current-account/pre-screen'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeTruthy();
                    });
                });

                it('should allow new application', function () {
                    application.isNew.and.returnValue(true);

                    _.forEach(route.routes['/apply/current-account/pre-screen'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeTruthy();
                    });
                });

                it('should not allow application not in pending or new', function () {
                    application.isNew.and.returnValue(false);
                    application.isPending.and.returnValue(false);

                    _.forEach(route.routes['/apply/current-account/pre-screen'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeFalsy();
                    });
                });
            });
        });

        describe('CurrentAccountPrescreeningController', function () {
            var scope, User, mock, ServiceTest, CustomerInformationLoader, DtmAnalyticsService;

            beforeEach(inject(function ($rootScope, $controller, _User_, _CustomerInformationLoader_, _mock_, _ServiceTest_, _DtmAnalyticsService_) {
                scope = $rootScope.$new();
                User = _User_;
                mock = _mock_;
                ServiceTest = _ServiceTest_;
                CustomerInformationLoader = _CustomerInformationLoader_;
                spyOn(CustomerInformationLoader, 'load').and.returnValue(mock.resolve());
                DtmAnalyticsService = _DtmAnalyticsService_;
                spyOn(DtmAnalyticsService, 'recordFormSubmissionCompletion').and.returnValue(function () {
                });
            }));

            describe('on new application', function () {
                beforeEach(inject(function ($controller, CurrentAccountApplication) {
                    CurrentAccountApplication.start();
                    $controller('CurrentAccountPrescreeningController', {
                        $scope: scope
                    });
                }));

                it('should default pre-screening questions to expected answers for most users', function () {
                    expect(scope.preScreening.debtReview).toBeFalsy();
                    expect(scope.preScreening.insolvent).toBeFalsy();
                    expect(scope.preScreening.sequestration).toBeFalsy();
                });

                it('should show heading for a new application', function () {
                    expect(scope.headingText()).toEqual('Before You Start Your Application');
                });

                it('should be new application', function () {
                    expect(scope.isNewApplication()).toBeTruthy();
                });

                describe('submit with credit and fraud consent', function () {
                    describe('on valid pre-screening questions', function () {
                        beforeEach(function () {
                            scope.preScreening.creditAndFraudCheckConsent = true;
                        });

                        describe('Existing Customers', function () {
                            beforeEach(function () {
                                spyOn(User, 'hasBasicCustomerInformation').and.returnValue(true);
                                scope.submit();
                                ServiceTest.resolvePromise();
                            });

                            it('should initialise CustomerInformationData', function () {
                                expect(CustomerInformationLoader.load).toHaveBeenCalled();
                            });

                            it('should record a form submission for analytics', function () {
                                expect(DtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
                            });

                            it('should not showCannotProceedModal', function () {
                                expect(scope.showCannotProceedModal).toBeFalsy();
                            });

                            it('should complete the pre-screening for the application', inject(function (CurrentAccountApplication) {
                                expect(CurrentAccountApplication.isPreScreeningComplete()).toBeTruthy();
                            }));

                            it('should display customer information', inject(function ($location) {
                                expect($location.path()).toEqual('/apply/current-account/profile');
                            }));
                        });

                        describe('with new capture information toggled off', function () {
                            beforeEach(function () {
                                newCaptureCustomerInformationFeature = false;
                            });

                            it('should go to capture customer basic information when customer is new', inject(function ($location) {
                                spyOn(User, 'hasBasicCustomerInformation').and.returnValue(false);
                                scope.submit();

                                expect($location.path()).toEqual('/apply/current-account/profile/new');
                            }));
                        });
                        describe('with new capture information toggled on', function () {
                            beforeEach(function () {
                                newCaptureCustomerInformationFeature = true;
                            });

                            it('should go to capture customer basic information when customer is new', inject(function ($location) {
                                spyOn(User, 'hasBasicCustomerInformation').and.returnValue(false);
                                scope.submit();

                                expect($location.path()).toEqual('/apply/current-account/profile');
                            }));
                        });


                        it('should allow overdraft if not under debt review', inject(function (CurrentAccountApplication) {
                            scope.preScreening.debtReview = false;
                            scope.submit();

                            expect(CurrentAccountApplication.canApplyForOverdraft()).toBeTruthy();
                        }));

                        it('should not allow overdraft if under debt review', inject(function (CurrentAccountApplication) {
                            scope.preScreening.debtReview = true;
                            scope.submit();

                            expect(CurrentAccountApplication.canApplyForOverdraft()).toBeFalsy();
                        }));
                    });

                    using(['sequestration', 'insolvent'], function (question) {
                        describe('on invalid pre-screening question: ' + question, function () {
                            beforeEach(function () {
                                scope.preScreening[question] = true;
                                scope.submit();
                            });

                            it('should showCannotProceedModal', function () {
                                expect(scope.showCannotProceedModal).toBeTruthy();
                            });

                            it('should not change location', inject(function ($location) {
                                expect($location.path()).toEqual('');
                            }));

                            it('should not complete the pre-screening for the application', inject(function (CurrentAccountApplication) {
                                expect(CurrentAccountApplication.isPreScreeningComplete()).toBeFalsy();
                            }));
                        });
                    });
                });
            });

            describe('on pending application', function () {
                beforeEach(inject(function ($controller, CurrentAccountApplication) {
                    CurrentAccountApplication.continue({applicationNumber: 'application_number'});
                    $controller('CurrentAccountPrescreeningController', {
                        $scope: scope
                    });
                }));

                it('should default pre-screening questions to expected answers for most users', function () {
                    expect(scope.preScreening.debtReview).toBeFalsy();
                });

                it('should show heading to continue an application', function () {
                    expect(scope.headingText()).toEqual('Before You Continue with Your Application');
                });

                it('should not be new application', function () {
                    expect(scope.isNewApplication()).toBeFalsy();
                });

                describe('submit', function () {
                    beforeEach(function () {
                        spyOn(User, 'hasBasicCustomerInformation').and.returnValue(true);
                    });

                    it('should initialise CustomerInformationData', function () {
                        scope.submit();

                        expect(CustomerInformationLoader.load).toHaveBeenCalled();
                    });

                    it('should record a form submission for analytics', function() {
                        scope.submit();

                        expect(DtmAnalyticsService.recordFormSubmissionCompletion).toHaveBeenCalled();
                    });


                    it('should go to the offers page', inject(function ($location) {
                        scope.submit();
                        ServiceTest.resolvePromise();

                        expect($location.path()).toEqual('/apply/current-account/offer');
                    }));

                    it('should complete the pre-screening for the application', inject(function (CurrentAccountApplication) {
                        scope.submit();

                        expect(CurrentAccountApplication.isPreScreeningComplete()).toBeTruthy();
                    }));

                    it('should allow overdraft if not under debt review', inject(function (CurrentAccountApplication) {
                        scope.preScreening.debtReview = false;
                        scope.submit();

                        expect(CurrentAccountApplication.canApplyForOverdraft()).toBeTruthy();
                    }));

                    it('should not allow overdraft if under debt review', inject(function (CurrentAccountApplication) {
                        scope.preScreening.debtReview = true;
                        scope.submit();

                        expect(CurrentAccountApplication.canApplyForOverdraft()).toBeFalsy();
                    }));
                });
            });
        });
    });
});
