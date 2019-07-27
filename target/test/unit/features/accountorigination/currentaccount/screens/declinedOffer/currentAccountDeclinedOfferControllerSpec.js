describe('Decline Offer', function () {
    var scope, location, URL, User, Card;

    beforeEach(module('refresh.accountOrigination.currentAccount.screens.declinedOffer'));

    describe('routes', function () {
        var route;
        beforeEach(inject(function ($route) {
            route = $route;
        }));

        describe('when an offer is declined', function () {
            it('should use the correct template ', function () {
                expect(route.routes['/apply/:product/declined'].templateUrl).toEqual('features/accountorigination/currentaccount/screens/declinedoffer/partials/declinedOffer.html');
            });

            it('should use the correct controller', function () {
                expect(route.routes['/apply/:product/declined'].controller).toEqual('CurrentAccountDeclinedOfferController');
            });
        });
    });

    describe('CurrentAccountDeclinedOfferController', function () {
        var controller;

        function invokeController (product) {
            product = product || 'current-account';
            controller('CurrentAccountDeclinedOfferController', {
                $scope: scope,
                $location: location,
                $routeParams: {product: product},
                User: User,
                Card: Card
            });
        }

        beforeEach(inject(function ($rootScope, $controller, $location, _URL_, AccountOriginationProvider) {
            controller = $controller;
            scope = $rootScope.$new();
            location = $location;
            URL = _URL_;

            var rejectedOffer = {
                offer: {
                    applicationNumber: 'SATMSYST 12345678901234567',
                    message: 'Your application was rejected'
                }
            };

            AccountOriginationProvider.for('current-account').application.decline(rejectedOffer);

            User = jasmine.createSpyObj('User', ['principal', 'hasBasicCustomerInformation']);
            User.principal.and.returnValue({
                systemPrincipalIdentifier: {
                    systemPrincipalId: '1100',
                    systemPrincipalKey: 'SBSA'
                }
            });
            User.hasBasicCustomerInformation.and.returnValue(true);

            Card = jasmine.createSpyObj('Card', ['anySelected']);
        }));


        it('should have a URL and required parameters for the declined offer letter document in scope', function () {
            invokeController();

            expect(scope.declineLetterDocumentURL).toBe(URL.accountOriginationDeclineLetter);
            expect(scope.applicationNumber).toBe('SATMSYST 12345678901234567');
            expect(scope.systemPrincipalId).toBe('1100');
            expect(scope.systemPrincipalKey).toBe('SBSA');
        });

        it('should not required parameters for the declined offer letter document in scope if user has not been created (hasBasicCustomerInformation)', function () {
            User.hasBasicCustomerInformation.and.returnValue(false);
            invokeController();

            expect(scope.applicationNumber).toBeUndefined();
            expect(scope.systemPrincipalId).toBeUndefined();
            expect(scope.systemPrincipalKey).toBeUndefined();
        });

        describe('when the user has a card', function () {
            it('should set customer as not new to bank', function () {
                Card.anySelected.and.returnValue(true);

                invokeController();

                expect(scope.newToBankCustomer).toBeFalsy();
            });
        });

        describe('when the user does not have a card', function () {
            it('should set customer as new to bank', function () {
                Card.anySelected.and.returnValue(false);

                invokeController();

                expect(scope.newToBankCustomer).toBeTruthy();
            });
        });

        it ('should set existing title when the decline reason is for an existing RCP', inject(function (AccountOriginationProvider) {
            AccountOriginationProvider.for('rcp').application.decline({
                offer: {
                    reason: 'DECLINED',
                    message: "You already have a Revolving Credit Plan (RCP). If you want to increase your RCP limit, please visit your nearest branch. Don't forget that you can borrow again up to your original loan amount as soon as you repay 15% of your loan."
                }
            });

            invokeController('rcp');

            expect(scope.title).toEqual('Application Result');
            expect(scope.declinedMessage).toEqual("You already have a Revolving Credit Plan (RCP). If you want to increase your RCP limit, please visit your nearest branch. Don't forget that you can borrow again up to your original loan amount as soon as you repay 15% of your loan.");
        }));
    });
});
