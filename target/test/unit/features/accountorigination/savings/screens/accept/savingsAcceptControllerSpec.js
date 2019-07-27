describe('Savings Accept', function () {
    'use strict';
    beforeEach(module('refresh.accountOrigination.savings.screens.accept', 'refresh.flow',
        'refresh.accountOrigination.savings.domain.savingsAccountApplication',
        'refresh.accountOrigination.savings.services.savingsAccountOffersService', 'refresh.accountsService'));

    describe("routes", function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe("when at Savings accept page", function () {

            it("should use the correct template", function () {
                expect(route.routes['/apply/:productName/accept'].templateUrl).toEqual('features/accountorigination/savings/screens/accept/partials/savingsAccept.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/:productName/accept'].controller).toEqual('SavingsAcceptController');
            });
        });
    });

    describe('SavingsAcceptController', function () {
        var scope, Flow, location, locationPath, SavingsAccountApplication, SavingsAccountOffersService, AccountsService, mock, routeParams;

        beforeEach(inject(function ($rootScope, $controller, _$location_, $routeParams, _Flow_, _SavingsAccountApplication_, _SavingsAccountOffersService_, _AccountsService_, _mock_) {
            scope = $rootScope.$new();
            routeParams = $routeParams;
            Flow = _Flow_;
            location = _$location_;
            SavingsAccountApplication = _SavingsAccountApplication_;
            SavingsAccountOffersService = _SavingsAccountOffersService_;
            AccountsService = _AccountsService_;
            mock = _mock_;
            spyOn(SavingsAccountApplication, 'transferFromAccount').and.returnValue({
                "productName": "ELITE",
                "formattedNumber": "12-34-567-890-0"
            });
            spyOn(SavingsAccountApplication, 'initialDepositAmount').and.returnValue(300);
            spyOn(SavingsAccountApplication, 'productName').and.returnValue('SavingsProduct');
            spyOn(SavingsAccountApplication, 'productTermsAndConditionsLink').and.returnValue('http://www.standardbank.co.za/');
            spyOn(AccountsService, 'clear');
            $controller('SavingsAcceptController', {
                $scope: scope,
                $location: location,
                Flow: Flow,
                AccountsService: AccountsService
            });
            locationPath = {
                replace: function () {
                }
            };
            spyOn(location, 'path').and.returnValue(locationPath);
            spyOn(locationPath, 'replace');
        }));

        it("should exist", function () {
            expect(scope).toBeDefined();
        });

        it("should initialise with agreedToTermsAndConditions to false", function () {
            expect(scope.agreedToTermsAndConditions).toBeDefined();
            expect(scope.agreedToTermsAndConditions).toBeFalsy();
        });

        it("should set the product's name on the scope", function () {
            expect(scope.ProductName).toBe('SavingsProduct');
        });

        it("should set the product's terms and conditions link on the scope", function () {
            expect(scope.ProductTermsAndConditionsLink).toBe('http://www.standardbank.co.za/');
        });

        it("should set the offer's account to the account that the initial deposit will be sourced from", function () {
            expect(scope.offerDetails.sourceAccount).toEqual(jasmine.objectContaining({
                "productName": "ELITE",
                "formattedNumber": "12-34-567-890-0"
            }));
        });

        it("should set the offer's initial deposit to the amount that was entered in the transfer step", function () {
            expect(scope.offerDetails.initialDepositAmount).toEqual(300);
        });

        describe('backToTransfer', function () {

            beforeEach(inject(function () {
                spyOn(Flow, 'previous');
                routeParams.productName = 'pure-save';
                scope.backToTransfer();
            }));

            it('should tell Flow to show the previous step', function () {
                expect(Flow.previous).toHaveBeenCalled();
            });

            it('should go to the transfer page in the PureSave account origination process', function () {
                expect(location.path).toHaveBeenCalledWith('/apply/pure-save/transfer');
                expect(locationPath.replace).toHaveBeenCalled();
            });
        });

        describe('proceed', function () {
            beforeEach(function () {
                spyOn(SavingsAccountApplication, 'accountOriginated');
                spyOn(Flow, 'next');
            });

            describe('successfully originates an account', function () {
                var date, newAccount;
                beforeEach(function () {
                    date = new Date().toString();
                    newAccount = {
                        accountNumber: "1234567890",
                        originationDate: date
                    };
                    spyOn(SavingsAccountOffersService, 'originateAccount').and.returnValue(mock.resolve(newAccount));
                    routeParams.productName = 'market-link';
                    scope.proceed();
                    scope.$digest();
                });

                it('should clear the list of accounts in cache', function () {
                    expect(AccountsService.clear).toHaveBeenCalled();
                });

                it('should tell Flow to show the next step', function () {
                    expect(Flow.next).toHaveBeenCalled();
                });

                it('should call originateAccount on SavingsAccountOffersService', function () {
                    expect(SavingsAccountOffersService.originateAccount).toHaveBeenCalled();
                });

                it('should set the date and account number on the Savings account application', function () {
                    expect(SavingsAccountApplication.accountOriginated).toHaveBeenCalledWith(newAccount);
                });

                it('should redirect the user to the application complete page for market-link', function () {
                    expect(location.path).toHaveBeenCalledWith('/apply/market-link/finish');
                    expect(locationPath.replace).toHaveBeenCalled();
                });
            });

            describe('cannot originate an account', function () {
                beforeEach(function () {
                    spyOn(SavingsAccountOffersService, 'originateAccount').and.returnValue(mock.reject());
                    routeParams.productName = 'tax-free-call-account';
                    scope.proceed();
                    scope.$digest();
                });

                it('should tell Flow to show the next step', function () {
                    expect(Flow.next).toHaveBeenCalled();
                });

                it('should call originateAccount on SavingsAccountOffersService', function () {
                    expect(SavingsAccountOffersService.originateAccount).toHaveBeenCalled();
                });

                it('should NOT set the date and account number on the Savings account application', function () {
                    expect(SavingsAccountApplication.accountOriginated).not.toHaveBeenCalled();
                });

                it('should redirect the user to the application complete page for tax-free-call-account', function () {
                    expect(location.path).toHaveBeenCalledWith('/apply/tax-free-call-account/finish');
                    expect(locationPath.replace).toHaveBeenCalled();
                });
            });
        });
    });
});