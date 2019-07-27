describe('Offers', function () {
    'use strict';
    /*global debitOrderSwitchingFeature:true */

    beforeEach(module('refresh.accountOrigination.currentAccount.screens.finishApplication'));

    afterEach(function () {
        debitOrderSwitchingFeature = true;
    });

    describe('routes with debit order switching enabled', function () {
        var route;

        beforeEach(function () {
            debitOrderSwitchingFeature = true;
        });

        beforeEach(inject(function ($route) {
            route = $route;
        }));

        it('should only allow entry from debit order switching and cheque card pages', function () {
            var allowedPaths = ['/apply/current-account/debit-order-switching', '/apply/current-account/accept/card'];

            _.forEach(route.routes['/apply/current-account/finish'].allowedFrom, function (route) {
                expect(_.includes(allowedPaths, route['path'])).toBeTruthy();
            });
        });

    });

    describe('routes', function () {
        var route;

        beforeEach(function () {
            debitOrderSwitchingFeature = false;
        });
        beforeEach(inject(function ($route) {

            route = $route;
        }));

        describe('when an offer is confirmed', function () {
            it('should use the correct controller ', function () {
                expect(route.routes['/apply/current-account/finish'].controller).toEqual('CurrentAccountFinishApplicationController');
            });

            it('should use the correct template ', function () {
                expect(route.routes['/apply/current-account/finish'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/finish/partials/currentAccountFinishApplication.html');
            });

            it('should only allow entry from accept offer and cheque card pages', function () {
                var expectedPaths = ['/apply/current-account/accept', '/apply/current-account/accept/card'];

                _.forEach(route.routes['/apply/current-account/finish'].allowedFrom, function (route) {
                    expect(_.includes(expectedPaths, route['path'])).toBeTruthy();
                });
            });

            it('should safely redirect any denied entry to account origination page', function () {
                expect(route.routes['/apply/current-account/finish'].safeReturn).toEqual('/apply');
            });
        });

        describe('path configurations', function () {
            var application;

            beforeEach(function () {
                application = jasmine.createSpyObj('CurrentAccountApplication', ['isInProgress']);
            });

            describe('if not debit order switching', function () {

                it('should allow for a current application that is in progress', function () {
                    application.isInProgress.and.returnValue(true);

                    _.forEach(route.routes['/apply/current-account/finish'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeTruthy();
                    });
                });

                it('should not allow for a current application that is not in progress', function () {
                    application.isInProgress.and.returnValue(false);

                    _.forEach(route.routes['/apply/current-account/finish'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeFalsy();
                    });
                });
            });

            describe('if debit order switching', function () {
                beforeEach(function () {
                    debitOrderSwitchingFeature = true;
                });

                it('should allow for a current application that is in progress', function () {
                    application.isInProgress.and.returnValue(true);

                    _.forEach(route.routes['/apply/current-account/finish'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeTruthy();
                    });
                });

                it('should not allow for a current application that is not in progress', function () {
                    application.isInProgress.and.returnValue(false);

                    _.forEach(route.routes['/apply/current-account/finish'].allowedFrom, function (allowedRoute) {
                        expect(allowedRoute.condition(application)).toBeFalsy();
                    });
                });
            });

        });
    });

    describe('CurrentAccountFinishApplicationController', function () {
        var scope, products, currentAccountApplication, selection, currentCustomer;
        var customerLetterData = {
            residentialAddress: {
                line1: 'line1',
                line2: 'line2',
                line3: 'line3',
                line4: 'line4',
                postalCode: 'postalCode'
            },
            displayName: 'Mrs Clopper',
            fullName: 'Sam Yash Clopper'
        };

        beforeEach(inject(function ($rootScope, $controller, mock, CurrentAccountApplication, CustomerInformationData) {
            CustomerInformationData.initialize({});
            currentCustomer = CustomerInformationData.current();
            spyOn(currentCustomer, 'letterData').and.returnValue(mock.resolve(customerLetterData));

            scope = $rootScope.$new();

            products = [
                {name: 'product 1'},
                {name: 'product 2'}
            ];

            selection = {
                product: {name: 'product 1'},
                branch: {
                    code: '2508',
                    name: 'BETHLEHEM'
                }
            };

            var offer = {
                productFamily: {name: 'Private Banking'},
                products: products,
                applicationNumber: 'SATMSYST 20140820141510001',
                overdraft: {
                    amount: 5000,
                    statementsConsent: {
                        selected: true,
                        accountType: 'savings',
                        accountNumber: '32343',
                        branch: 'sandton'
                    }
                }
            };

            var acceptResponse = {
                timestamp: '2014-08-13T09:08:40.424+02:00',
                accountNumber: 32569017000
            };

            spyOn(CurrentAccountApplication, 'offer').and.returnValue(offer);
            spyOn(CurrentAccountApplication, 'acceptOfferResponse').and.returnValue(acceptResponse);
            currentAccountApplication = CurrentAccountApplication;
        }));

        describe('when offer has an overdraft', function () {
            beforeEach(inject(function ($controller) {
                spyOn(currentAccountApplication, 'selection').and.returnValue(selection);
                $controller('CurrentAccountFinishApplicationController', {
                    $scope: scope
                });
                scope.offer.overdraft.selected = true;
            }));

            it('should indicate that an overdraft is selected', function () {
                expect(scope.hasOverdraft()).toBeTruthy();
            });

            it('should indicate that an statements consent is selected', function () {
                expect(scope.statementsConsentSelected()).toBeTruthy();
            });

            it('should indicate that an statements consent is not selected', function () {
                scope.offer.overdraft.statementsConsent = {selected: false};
                expect(scope.statementsConsentSelected()).toBeFalsy();
            });
        });

        describe('when loading the page', function () {
            beforeEach(inject(function ($controller) {
                spyOn(currentAccountApplication, 'selection').and.returnValue(selection);
                currentAccountApplication.chequeCardError(true);
                $controller('CurrentAccountFinishApplicationController', {
                    $scope: scope
                });
                scope.$digest();
            }));

            it('should set the accepted product in the scope', function () {
                expect(scope.product).toEqual(products[0]);
            });

            it('should set the preferred branch in the scope', function () {
                expect(scope.preferredBranchName).toEqual('BETHLEHEM');
            });

            it('should set the account number in the scope', function () {
                expect(scope.accountNumber).toEqual(32569017000);
            });

            it('should set the application number in the scope', function () {
                expect(scope.applicationNumber).toEqual('SATMSYST 20140820141510001');
            });

            it('should set the letter date in the scope', function () {
                expect(scope.letterDate).toEqual('2014-08-13T09:08:40.424+02:00');
            });

            it('should know when the offer is a private banking product', function () {
                expect(scope.isPrivateBankingProduct).toBeTruthy();
            });

            it('should set isCustomerKycCompliant flag in the scope when customer is not compliant', function () {
                expect(scope.isCustomerKycCompliant).toBeDefined();
                expect(scope.isCustomerKycCompliant).toEqual(false);
            });

            it('should set the customer in the scope', function () {
                expect(scope.customer).toEqual(customerLetterData);
            });

            it('should set the selected cheque card as undefined', function () {
                expect(scope.crossSellError).toBeTruthy();
            });

            it('should flag service error on cross sell', function () {
                expect(scope.selectedChequeCardName).toBeUndefined();
            });

            it('should set customer as new to bank', function () {
                expect(scope.newToBankCustomer).toBeTruthy();
            });
        });

        describe('when customer has a card', function () {
            beforeEach(inject(function ($controller, Card) {
                spyOn(currentAccountApplication, 'selection').and.returnValue(_.merge({
                    chequeCard: {
                        number: 4295
                    }
                }, selection));

                Card.setCurrent('number', 'personalFinanceManagementId');

                $controller('CurrentAccountFinishApplicationController', {
                    $scope: scope
                });
            }));

            it('should set customer as not new to bank', function () {
                expect(scope.newToBankCustomer).toBeFalsy();
            });
        });

        describe('when coming from selecting a cheque card', function () {
            beforeEach(inject(function ($controller) {
                spyOn(currentAccountApplication, 'selection').and.returnValue(_.merge({
                    chequeCard: {
                        name: 'STANDARD BANK VISA GOLD CHEQUE',
                        number: 4295
                    }
                }, selection));

                $controller('CurrentAccountFinishApplicationController', {
                    $scope: scope
                });
            }));

            it('should set the selected cheque card in the scope', function () {
                expect(scope.selectedChequeCardName).toEqual('STANDARD BANK VISA GOLD CHEQUE');
            });
        });

        describe('when there is an error accepting a cheque card', function () {
            beforeEach(inject(function ($controller) {
                spyOn(currentAccountApplication, 'selection').and.returnValue(selection);
                currentAccountApplication.chequeCardError(true);

                $controller('CurrentAccountFinishApplicationController', {
                    $scope: scope
                });
            }));

            it('should set the selected cheque card in the scope as undefined', function () {
                expect(scope.selectedChequeCardName).toBeUndefined();
            });

            it('should set the cross sell error in the scope as true', function () {
                expect(scope.crossSellError).toBeTruthy();
            });
        });
    });
});