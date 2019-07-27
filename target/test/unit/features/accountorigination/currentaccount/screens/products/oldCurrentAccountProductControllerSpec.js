describe('Products', function () {
    /*global rcpEnabled:true */

    beforeEach(function () {
        rcpEnabled = false;
        module('refresh.accountOrigination.currentAccount.screens.products');
    });

    afterEach(function () {
        rcpEnabled = true;
    });


    describe('routes', function () {
        var route;

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when selecting a product', function () {
            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/products/partials/currentAccountProducts.html');
            });

            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account'].controller).toEqual('OldCurrentAccountProductController');
            });
        });
    });

    describe('OldCurrentAccountProductController', function () {
        var scope, controller, mock, rootScope, applicationLoader, currentAccountProductFamilyContent, NotificationService, CurrentAccountOffersService, CurrentAccountApplication, Flow, user, customerService;

        function invokeController() {
            controller('OldCurrentAccountProductController',
                {
                    $scope: scope,
                    ApplicationLoader: applicationLoader,
                    CurrentAccountProductFamilyContent: currentAccountProductFamilyContent,
                    CurrentAccountOffersService: CurrentAccountOffersService,
                    NotificationService: NotificationService,
                    User: user,
                    CustomerService: customerService
                }
            );
            scope.$digest();
        }

        beforeEach(inject(function ($rootScope, $controller, _mock_, CurrentAccountProductFamilyContent,
                                    _Flow_, _CurrentAccountApplication_, $q) {
            scope = $rootScope.$new();
            rootScope = $rootScope;
            controller = $controller;
            applicationLoader = jasmine.createSpyObj('ApplicationLoader', ['loadAll']);
            applicationLoader.loadAll.and.returnValue($q.defer().promise);

            currentAccountProductFamilyContent = CurrentAccountProductFamilyContent;

            CurrentAccountOffersService = jasmine.createSpyObj('CurrentAccountOffersService', ['getQuotationDetails']);
            CurrentAccountApplication = _CurrentAccountApplication_;
            user = jasmine.createSpyObj('user', ['hasBasicCustomerInformation', 'hasDashboards']);
            customerService = jasmine.createSpyObj('customerService', ['getCustomer']);
            customerService.getCustomer.and.returnValue($q.defer().promise);
            NotificationService = jasmine.createSpyObj('NotificationService', ['displayGenericServiceError']);

            Flow = _Flow_;
            mock = _mock_;


        }));

        it("should assign products to currentAccountProductFamilyContent", function () {
            var applications = {current: {state: "EXISTING"}};
            applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
            invokeController();
            expect(scope.products).toEqual(currentAccountProductFamilyContent.all());

        });

        describe("new to bank", function () {
            it("should be false if User has Dashboards", function () {
                user.hasDashboards.and.returnValue(true);
                invokeController();
                scope.$digest();
                expect(scope.newToBankCustomer).toBeFalsy();
            });

            it("should be true if User does not have Dashboards", function () {
                user.hasDashboards.and.returnValue(false);
                invokeController();
                scope.$digest();
                expect(scope.newToBankCustomer).toBeTruthy();
            });

        });

        describe("kycCompliant", function () {

            it('should get customer when user has basic customer information', function () {
                user.hasBasicCustomerInformation.and.returnValue(true);
                invokeController();
                expect(customerService.getCustomer).toHaveBeenCalled();
            });

            it('should not get customer when user does not have basic customer information', function () {
                user.hasBasicCustomerInformation.and.returnValue(false);
                invokeController();
                expect(customerService.getCustomer).not.toHaveBeenCalled();
            });


            it("should be true if customer is kycCompliant", function () {
                user.hasBasicCustomerInformation.and.returnValue(true);
                customerService.getCustomer.and.returnValue(mock.resolve({
                    complianceItems: [{
                        complianceCode: 'Y',
                        complianceType: 'KYC'
                    }]
                }));
                invokeController();
                scope.$digest();
                expect(scope.kycCompliant).toBeTruthy();
            });

            it("should be false if customer is not kycCompliant", function () {
                user.hasBasicCustomerInformation.and.returnValue(true);
                invokeController();
                scope.$digest();
                expect(scope.kycCompliant).toBeFalsy();
            });

        });

        describe("load application status", function () {

            describe("has current account", function () {
                it("should be true if status is  EXISTING", function () {
                    var applications = {current: {status: "EXISTING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasCurrentAccount()).toBeTruthy();
                });

                it("should be false if status is Not EXISTING", function () {
                    var applications = {current: {status: "NEW"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasCurrentAccount()).toBeFalsy();
                });

            });

            describe('page title', function () {

                it('should be Current Account solutions when EXISTING', function () {
                    var applications = {current: {status: "EXISTING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.pageTitle).toBe('Current account solutions');

                });

                it('should be Current Account solutions when NEW', function () {
                    var applications = {current: {status: "NEW"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.pageTitle).toBe('Current account solutions');

                });

                it('should be "Pending offer when PENDING', function () {
                    var applications = {current: {status: "PENDING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.pageTitle).toBe('Pending offer');

                });

                it('should be "Accepted offer when ACCEPTED', function () {
                    var applications = {current: {status: "ACCEPTED", productName: 'ELITE PLUS CURRENT ACCOUNT'}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.pageTitle).toBe('Application in progress');

                });
            });
            describe('has overdraft', function () {
                it("should be true if has overdraft", function () {
                    var applications = {
                        current: {
                            status: "ACCEPTED",
                            limitAmount: 5000,
                            productName: 'ELITE PLUS CURRENT ACCOUNT'
                        }
                    };
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasOverdraft()).toBeTruthy();
                });

                it("should be false if does not have overdraft", function () {
                    var applications = {current: {status: "ACCEPTED", productName: 'ELITE PLUS CURRENT ACCOUNT'}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasOverdraft()).toBeFalsy();
                });
            });
            describe('has pending offer', function () {
                it("should be true if status is  PENDING", function () {
                    var applications = {current: {status: "PENDING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasPendingOffer()).toBeTruthy();
                });

                describe('viewOffer', function () {
                    beforeEach(function () {
                        spyOn(CurrentAccountApplication, 'continue');
                    });
                    var resolvedOffer = {
                        applicationNumber: 'SATMSYST 20140820141510001',
                        offerDetails: {
                            approved: true,
                            productFamily: "STAFF ACHIEVER",
                            overdraft: {
                                limit: 0,
                                interestRate: 22.5
                            }
                        }
                    };

                    describe('successful response', function () {
                        beforeEach(function () {
                            var application = {current: {reference: 'SATMSYST 20140820141510001'}};
                            applicationLoader.loadAll.and.returnValue(mock.resolve(application));
                            invokeController();
                            CurrentAccountOffersService.getQuotationDetails.and.returnValue(mock.resolve(resolvedOffer));
                            scope.viewOffer();
                            scope.$digest();
                        });

                        it('should invoke the CurrentAccountOffersService service with the given application number',
                            function () {
                                expect(CurrentAccountOffersService.getQuotationDetails).toHaveBeenCalledWith('SATMSYST 20140820141510001');
                            });

                        it('should continue the Current Account application with the offer that was returned',
                            function () {
                                expect(CurrentAccountApplication.continue).toHaveBeenCalledWith({
                                    applicationNumber: 'SATMSYST 20140820141510001',
                                    offer: resolvedOffer
                                });
                            });

                        it('should navigate to the current account pre-screen page', inject(function ($location) {
                            expect($location.path()).toEqual('/apply/current-account/pre-screen');
                        }));

                        it('should create the Flow', function () {
                            expect(Flow.steps().map(function (step) {
                                return step.name;
                            })).toEqual(['Details', 'Offer', 'Confirm', 'Finish']);
                        });


                        it('should continue to the next step of flow', function () {
                            expect(Flow.currentStep().name).toEqual('Offer');
                        });
                    });

                    describe('service error', function () {
                        var error = {
                            message: 'FAIL!'
                        };

                        var application = {current: {status: "PENDING"}};

                        beforeEach(function () {
                            applicationLoader.loadAll.and.returnValue(mock.resolve(application));
                            invokeController();
                            CurrentAccountOffersService.getQuotationDetails.and.returnValue(mock.reject(error));
                            scope.viewOffer();
                            scope.$digest();
                        });
                    });

                });

                it("should be false if status is Not PENDING", function () {
                    var applications = {current: {status: "EXISTING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasPendingOffer()).toBeFalsy();
                });
            });
            describe('has accepted offer', function () {
                it("should be true if status is  ACCEPTED", function () {
                    var applications = {current: {status: "ACCEPTED", productName: 'ELITE PLUS CURRENT ACCOUNT'}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasAcceptedOffer()).toBeTruthy();
                });

                describe('modify product name', function () {

                    it('should  remove CURRENT ACCOUNT from productName when accepted offer', function () {
                        var applications = {current: {status: 'ACCEPTED', productName: 'ELITE PLUS CURRENT ACCOUNT'}};
                        applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                        invokeController();
                        scope.$digest();
                        expect(scope.application).toEqual({status: 'ACCEPTED', productName: 'ELITE PLUS'});
                    });

                    it('should set isPrivateBanking on the scope if offer has been accepted', function () {
                        var applications = {
                            current: {
                                status: 'ACCEPTED',
                                productName: 'PRIVATE BANKING PLUS CURRENT ACCOUNT'
                            }
                        };
                        applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                        invokeController();
                        scope.$digest();
                        expect(scope.application).toEqual({status: 'ACCEPTED', productName: 'PRIVATE BANKING'});
                        expect(scope.isPrivateBankingProduct).toBeTruthy();
                    });

                    it('should not set isPrivateBanking on the scope if offer is still pending', function () {

                        var applications = {
                            current: {
                                status: 'PENDING',
                                productName: 'PRIVATE BANKING PLUS CURRENT ACCOUNT'
                            }
                        };
                        applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                        invokeController();
                        scope.$digest();
                        expect(scope.isPrivateBankingProduct).toBeUndefined();
                    });

                });
                it("should be false if status is Not PENDING", function () {
                    var applications = {current: {status: "EXISTING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.hasAcceptedOffer()).toBeFalsy();
                });
            });

            describe("can apply", function () {

                it("should be true if status is  NEW", function () {
                    var applications = {current: {status: "NEW"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.canApply()).toBeTruthy();
                });

                it("should be false if status is Not NEW", function () {
                    var applications = {current: {status: "PENDING"}};
                    applicationLoader.loadAll.and.returnValue(mock.resolve(applications));
                    invokeController();
                    scope.$digest();
                    expect(scope.canApply()).toBeFalsy();
                });
            });

        });
    });
});
