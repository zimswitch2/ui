describe('Finish Rcp Offer', function () {
    'use strict';
    beforeEach(module('refresh.accountOrigination.rcp.screens.finishOffer'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when an Rcp offer is confirmed', function () {
            it('should use the correct template', function () {
                expect(route.routes['/apply/rcp/finish'].templateUrl).toEqual('features/accountorigination/rcp/screens/finish/partials/rcpFinishOffer.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/rcp/finish'].controller).toEqual('RcpFinishOfferController');
            });
        });

        describe('path configurations', function () {
            var application;

            beforeEach(function () {
                application = jasmine.createSpyObj('RcpApplication', ['isInProgress']);
            });

            it('should allow an application in progress', function () {
                application.isInProgress.and.returnValue(true);

                _.forEach(route.routes['/apply/rcp/finish'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeTruthy();
                });
            });

            it('should not allow an application in any other state', function () {
                application.isInProgress.and.returnValue(false);

                _.forEach(route.routes['/apply/rcp/finish'].allowedFrom, function (allowedRoute) {
                    expect(allowedRoute.condition(application)).toBeFalsy();
                });
            });
        });
    });

    describe('RcpFinishOfferController', function () {
        var scope, mock, location, controller, rcpApplication, homeService, accountsService, cardService,
            authenticationService, customerInformationData;
        var offer = {
            applicationNumber: "SC725327 20150515170450001",
            rcpOfferDetails: {
                approved: true,
                maximumLoanAmount: 100000,
                interestRate: 22.5,
                repaymentFactor: 20.0,
                productName: "REVOLVING CREDIT PLAN LOAN",
                productNumber: 8
            }
        };

        var confirmationDetails = {
            timestamp: '2014-08-13T09:08:40.424+02:00',
            accountNumber: 0,
            maximumDebitOrderRepaymentAmount: 5000.20
        };

        var productSelection = {
            selectedBranch: {name: 'Bollisa'},
            debitOrder: {
                electronicConsent: true
            },
            requestedLimit: 100000
        };

        function initController() {
            controller('RcpFinishOfferController', {
                $scope: scope,
                $location: location,
                RcpApplication: rcpApplication,
                AccountsService: accountsService,
                Card: cardService,
                AuthenticationService: authenticationService,
                CustomerInformationData: customerInformationData
            });
        }

        beforeEach(inject(function ($rootScope, _mock_, _$location_, RcpApplication, HomeService, $controller, _Card_, _AuthenticationService_) {
                scope = $rootScope.$new();
                mock = _mock_;
                location = _$location_;
                homeService = HomeService;
                spyOn(homeService, ['goHome']);

                authenticationService = _AuthenticationService_;
                spyOn(authenticationService, 'logout');

                rcpApplication = RcpApplication;
                rcpApplication.start();
                rcpApplication.offer(offer);
                rcpApplication.confirm(confirmationDetails);
                rcpApplication.select(productSelection);

                accountsService = jasmine.createSpyObj('AccountsService', ['hasPrivateBankingAccount']);
                accountsService.hasPrivateBankingAccount.and.returnValue(mock.resolve(false));

                customerInformationData = jasmine.createSpyObj('CustomerInformationData', ['current']);
                customerInformationData.current.and.returnValue({
                    isKycCompliant: function () {
                        return true;
                    }
                });

                cardService = _Card_;// jasmine.createSpyObj('Card', ['current, anySelected']);
                spyOn(cardService, 'current');
                spyOn(cardService, 'anySelected');

                cardService.anySelected.and.returnValue(true);

                controller = $controller;

                initController();
            })
        );

        it('should set the scope offer details to the RcpApplication offer details', function () {
            expect(scope.rcpOfferDetails).toEqual(offer.rcpOfferDetails);
        });

        it('should set the scope confirmation offer details to RcpApplication confirmationOfferDetails', function () {
            expect(scope.offerConfirmationDetails).toEqual(confirmationDetails);
        });

        it('should set the scope preferredBranch to RcpApplication selectedBranch name', function () {
            expect(scope.preferredBranch).toEqual('Bollisa');
        });

        it('should set the electronic consent received on scope', function () {
            expect(scope.debitOrder.electronicConsent).toBeTruthy();
        });

        it('should set the requested loan amount on the scope', function () {
            expect(scope.requestedLimit).toEqual(100000);
        });

        describe('finishApplication', function () {

            describe('when customer is new to bank', function () {
                beforeEach(function () {
                    //customer is new to bank
                    cardService.anySelected.and.returnValue(false);
                    initController();
                });

                it('finish application button should prompt user to sign-out', function () {
                    expect(scope.finishApplicationText).toEqual('Sign-out');
                });

                it('should sign the user out', inject(function ($location) {
                    scope.finishApplication();
                    expect(authenticationService.logout).toHaveBeenCalled();
                }));
            });

            describe('when customer is not new to bank', function () {
                it('finish application button should prompt user to return to account summary', function () {
                    expect(scope.finishApplicationText).toEqual('Back');
                });

                it('should redirect to account summary page', inject(function ($location) {
                    scope.finishApplication();
                    expect(homeService.goHome).toHaveBeenCalled();
                }));
            });
        });

        describe('private banking', function () {
            it('should resolve has private banking product to false if user has none', function () {
                expect(scope.hasPrivateBankingAccount).toBeFalsy();
            });

            it('should resolve has private banking product to true if user has one', function () {
                accountsService.hasPrivateBankingAccount.and.returnValue(mock.resolve(true));
                initController();
                scope.$digest();
                expect(scope.hasPrivateBankingAccount).toBeTruthy();
            });
        });
    });
});
