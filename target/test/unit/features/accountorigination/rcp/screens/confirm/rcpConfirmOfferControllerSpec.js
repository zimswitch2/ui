describe('Confirm Offer', function () {
    'use strict';
    beforeEach(module('refresh.accountOrigination.rcp.screens.confirmOffer', 'refresh.accountOrigination.rcp.domain.debitOrder'));

    describe("routes", function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when an offer is received", function () {

            it("should use the correct template", function () {
                expect(route.routes['/apply/rcp/confirm'].templateUrl).toEqual('features/accountorigination/rcp/screens/confirm/partials/rcpConfirmOffer.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/rcp/confirm'].controller).toEqual('RcpConfirmOfferController');
            });
        });
        describe('path configuration', function () {
            var application;
            application = jasmine.createSpyObj('RcpApplication', ['isInProgress']);

            it('should allow an application in progress', function () {
                application.isInProgress.and.returnValue(true);

                _.forEach(route.routes['/apply/rcp/confirm'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeTruthy();
                });
            });

            it('should not allow applications in any other state', function () {
                application.isInProgress.and.returnValue(false);

                _.forEach(route.routes['/apply/rcp/confirm'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeFalsy();
                });
            });
        });
    });

    describe("RcpConfirmOfferController", function () {
        var scope, offer, RcpOfferService, Flow, RcpApplication, url, user;

        var expectedDebitOrderDetails;

        var offerConfirmationDetails = {
            timestamp: '2014-08-13T09:08:40.424+02:00',
            accountNumber: 0,
            maximumDebitOrderRepaymentAmount: 5000.20
        };

        beforeEach(inject(function ($rootScope, $controller, DebitOrder, _RcpOfferService_, mock, _Flow_, _RcpApplication_) {
            scope = $rootScope.$new();
            RcpOfferService = _RcpOfferService_;
            RcpApplication = _RcpApplication_;
            Flow = _Flow_;
            url = {downloadRcpCostOfCreditAgreement: "testUrl"};

            Flow.create(['step1', 'step2', 'step3']);

            offer = {
                applicationNumber: 'SC725327 20150515170450001',
                "rcpOfferDetails": {
                    "approved": true,
                    "maximumLoanAmount": 100000,
                    "interestRate": 22.5,
                    "repaymentFactor": 20.0,
                    "productName": "REVOLVING CREDIT PLAN LOAN",
                    "productNumber": 8
                }
            };

            RcpApplication.start(offer);

            expectedDebitOrderDetails = DebitOrder.fromOtherBanksAccount({number: '12345', branch: {code: 1155}, isStandardBank: false},
                {day: 1, amount: 5000}, true);
            var selection = {
                selectedBranch: {
                    code: 5,
                    name: 'Bollisa'
                },
                debitOrder: expectedDebitOrderDetails,
                repaymentAmount: 5000,
                requestedLimit: 25000
            };

            user = jasmine.createSpyObj('User', ['principal']);
            user.principal.and.returnValue({
                systemPrincipalIdentifier: {
                    systemPrincipalId: "1100",
                    systemPrincipalKey: "SBSA"
                }
            });

            RcpApplication.select(selection);

            spyOn(RcpOfferService, ['accept']).and.returnValue(mock.resolve(offerConfirmationDetails));
            spyOn(RcpApplication, ['offer']).and.returnValue(offer);

            $controller('RcpConfirmOfferController', {
                $scope: scope,
                RcpApplication: RcpApplication,
                RcpOfferService: RcpOfferService,
                Flow: Flow,
                URL: url,
                User: user
            });
        }));

        describe("should set default values", function () {
            it('should set the offer on the scope', function () {
                expect(scope.offerDetails).toEqual(offer.rcpOfferDetails);
            });

            it("should set the monthly repayment amount", function () {
                expect(scope.debitOrder.repayment.amount).toEqual(5000);
            });

            it('should put the download rcp debit order mandate URL on the scope', function () {
                expect(scope.downloadRcpCostOfCreditAgreement).toEqual(url.downloadRcpCostOfCreditAgreement);
            });

            it('should put debit order details on the scope', function () {
                expect(scope.debitOrder).toEqual(expectedDebitOrderDetails);
            });

            it('should set system principal on scope', function () {
                expect(scope.principal.systemPrincipalId).toEqual("1100");
                expect(scope.principal.systemPrincipalKey).toEqual("SBSA");
            });

            it("should set application number", function () {
                expect(scope.applicationNumber).toEqual('SC725327 20150515170450001');
            });
        });

        describe("Back", function () {
            it("should redirect to rcp offer page", inject(function ($location) {
                scope.backToRevolvingCreditPlan();
                expect($location.path()).toEqual('/apply/rcp/offer');
            }));

            it('should go to previous flow step by 1', function () {
                Flow.next();
                Flow.next();
                expect(Flow.currentStep().name).toEqual('step3');
                scope.backToRevolvingCreditPlan();
                expect(Flow.currentStep().name).toEqual('step2');
            });
        });

        describe("confirm Rcp offer", function () {
            it('should send the user to the confirm rcp offer page', inject(function ($location) {
                scope.confirm();
                scope.$digest();
                expect($location.path()).toEqual('/apply/rcp/finish');
            }));

            it('should call RcpOfferService with rcp acceptance details', function () {
                scope.confirm();
                expect(RcpOfferService.accept).toHaveBeenCalledWith({
                        productNumber: 8,
                        selectedOffer: 1,
                        applicationNumber: 'SC725327 20150515170450001',
                        preferredBranch: 5,
                        requestedLimit: 25000
                    },
                    {
                        debitOrderRepaymentAmount: 5000,
                        debitOrderAccountNumber: '12345',
                        debitOrderCycleCode: 101,
                        debitOrderElectronicConsentReceived: true,
                        debitOrderAccountIsStandardBank: false,
                        debitOrderIbtNumber: 1155
                    });
            });

            it('should go to next flow step', function () {
                scope.confirm();
                scope.$digest();
                expect(Flow.currentStep().name).toEqual('step2');
            });

            describe("RcpApplication", function () {
                it("should have offerConfirmationDetails", function () {
                    scope.confirm();
                    scope.$digest();
                    expect(RcpApplication.offerConfirmationDetails()).toEqual({
                        timestamp: '2014-08-13T09:08:40.424+02:00',
                        accountNumber: 0,
                        maximumDebitOrderRepaymentAmount: 5000.20
                    });
                });

            });

        });

    });


});